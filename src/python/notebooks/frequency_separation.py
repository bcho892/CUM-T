# %%
import numpy as np
import matplotlib.pyplot as plt
from IPython.display import Audio

import librosa

import librosa.display

y, sr = librosa.load('..\\..\\assets\\Gonna_Fly_Now.mp3', sr=44100)

start_time_s = 0
end_time_s = 15

# And compute the spectrogram magnitude and phase
S_full, phase = librosa.magphase(librosa.stft(y[start_time_s*sr:end_time_s*sr]))

# Play back a 5-second excerpt with vocals
Audio(data=y, rate=sr)

# %%

fig, ax = plt.subplots()
librosa.display.specshow(librosa.amplitude_to_db(S_full, ref=np.max),
                         y_axis="log", x_axis='time', ax=ax, sr=sr)

# %%
# Seperate the harmonic and percussive components
y_harmonics, y_precussive = librosa.effects.hpss(y[start_time_s*sr:end_time_s*sr], margin=(1.0,5.0))

# %%
S_percussive, phase = librosa.magphase(librosa.stft(y=y_harmonics))
S_harmonic, phase = librosa.magphase(librosa.stft(y=y_precussive))

# %%
layout = [list(".AAAA"), list(".BBBB")]
fig, ax = plt.subplot_mosaic(layout, constrained_layout=True)
ax['A'].set(title='Extracted Harmonic Element')
librosa.display.specshow(librosa.amplitude_to_db(S_harmonic, ref=np.max),
                         y_axis='log', x_axis='time', ax=ax['A'])

ax['B'].set(title='Extracted Percussive Element')
librosa.display.specshow(librosa.amplitude_to_db(S_percussive, ref=np.max),
                         y_axis='log', x_axis='time', ax=ax['B'])
# %%
Audio(data=y_precussive, rate=sr)

# %%
Audio(data=y_harmonics, rate=sr)

# %%

S_harmonic_highs = np.copy(S_harmonic)
S_harmonic_mediums = np.copy(S_harmonic)
S_harmonic_lows = np.copy(S_harmonic)

upper_band = 300
lower_band = 100

S_harmonic_highs[:upper_band, :] = 0.
S_harmonic_mediums[upper_band:,:] = 0.
S_harmonic_mediums[:lower_band,:] = 0.
S_harmonic_lows[lower_band:, :] = 0.

layout = [list(".AAAA"), list(".BBBB"), list(".CCCC")]
fig, ax = plt.subplot_mosaic(layout, constrained_layout=True)
ax['A'].set(title='Highs')
librosa.display.specshow(librosa.amplitude_to_db(S_harmonic_highs, ref=np.max),
                         y_axis='fft', x_axis='time', ax=ax['A'], sr=sr)

ax['B'].set(title='Mediums')
librosa.display.specshow(librosa.amplitude_to_db(S_harmonic_mediums, ref=np.max),
                         y_axis='fft', x_axis='time', ax=ax['B'],sr=sr)

ax['C'].set(title='Lows')
librosa.display.specshow(librosa.amplitude_to_db(S_harmonic_lows, ref=np.max),
                         y_axis='fft', x_axis='time', ax=ax['C'], sr=sr)
# %%
y_highs = librosa.istft(S_harmonic_highs * phase)
y_mediums = librosa.istft(S_harmonic_mediums * phase)
y_lows = librosa.istft(S_harmonic_lows * phase)
# %%
Audio(y_highs, rate=sr)

# %%
Audio(y_mediums, rate=sr)

# %%
Audio(y_lows, rate=sr)

# %%
cent_high = librosa.feature.spectral_centroid(y=y_highs, sr=sr)
cent_medium = librosa.feature.spectral_centroid(S=S_harmonic_mediums, sr=sr)
cent_low = librosa.feature.spectral_centroid(S=S_harmonic_lows, sr=sr)

onset_medium =  librosa.onset.onset_strength(y=y_mediums, sr=sr)
onset_low =  librosa.onset.onset_strength(y=y_lows , sr=sr)

# %%
times_high = librosa.times_like(cent_high, sr=sr)
fig, ax = plt.subplots()

ax.plot(times_high, cent_high.T, label='Spectral centroid', color='b')
ax.legend(loc='upper right')
ax.set(title='Spectral centroid for highs')

times_medium = librosa.times_like(cent_medium, sr=sr)
fig, ax = plt.subplots(2)

ax[0].plot(times_medium, cent_medium.T, label='Spectral centroid', color='b')
ax[0].legend(loc='upper right')
ax[0].set(title='Spectral centroid for mediums')

ax[1].plot(times_medium, onset_medium.T, label='Attack', color='b')
ax[1].legend(loc='upper right')
ax[1].set(title='Attack for mediums')

times_low = librosa.times_like(cent_low, sr=sr)
fig, ax = plt.subplots(2)

ax[0].plot(times_low, cent_low.T, label='Spectral centroid', color='b')
ax[0].legend(loc='upper right')
ax[0].set(title='Spectral centroid for lows')
ax[1].plot(times_low, onset_low.T, label='Attack', color='b')
ax[1].legend(loc='upper right')
ax[1].set(title='Attack for lows')

# %%
# Transform features into time series that can be interpreteded as haptics
reference_max = 2**16 - 1
reference_min = 0

def normalise(signal, ref_max = reference_max, ref_min = reference_min):
    max = np.max(signal)
    min = np.min(signal)
    difference = max - min
    reference_diff = ref_max - ref_min
    return reference_diff * ((signal - min) / (difference)) + ref_min

normalised_cent_low = normalise(cent_low)
normalised_onset_low = normalise(onset_low, 1, 0)
normalised_onset_medium = normalise(onset_medium)
normalised_cent_high = normalise(cent_high[cent_high != 0])

    
binary_masked_onset_low = (normalised_onset_low > 0.5).astype(int)
def shift(arr, amount):

    new_arr = np.roll(arr, amount)

    if(amount < 0):
        new_arr[(len(arr) -  1 + amount):] = 0
    else: 
        new_arr[:amount] = 0

    return new_arr
    
shifted_binary_masked_onset_low = shift(binary_masked_onset_low, -50)

shifted_binary_masked_onset_medium = shift(normalised_onset_medium, -100)
fig, ax = plt.subplots(1,1)
ax.plot(times_medium, shifted_binary_masked_onset_medium.T, label='Onset normalised', color='b')
ax.legend(loc='upper right')
ax.set(title='Normalised onset for mediums')

fig, ax = plt.subplots(4)
ax[0].plot(times_low, normalised_cent_low.T, label='Spectral centroid normalised', color='b')
ax[0].legend(loc='upper right')
ax[0].set(title='Normalised spectral centroid for lows')
ax[1].plot(times_low, normalised_onset_low.T, label='Attack', color='b')
ax[1].legend(loc='upper right')
ax[1].set(title='Attack for lows')
ax[2].plot(times_low, binary_masked_onset_low.T, label='Attack', color='b')
ax[2].legend(loc='upper right')
ax[2].set(title='binary Attack for lows')
ax[3].plot(times_low, shifted_binary_masked_onset_low.T, label='Attack', color='b')
ax[3].legend(loc='upper right')
ax[3].set(title='shifted binary Attack for lows')

fig, ax = plt.subplots(1,1)

ax.plot(times_high, normalised_cent_high.T, label='Centroid normalised', color='b')
ax.legend(loc='upper right')
ax.set(title='Normalised onset for highs')

# %%
# Decide on cold/warm depending on intended interpretation

def write_array_to_file(file_name, normalised_array):
    with open(file_name, 'w') as file:
        normalised_array.tofile(file, sep=',', format='%i')
    print(f"Array written to {file_name}")

# Specify the file name
centroid_low_file_name = '../../outputs/centroid_low.txt'
write_array_to_file(centroid_low_file_name, normalised_cent_low)


onset_medium_file_name = "../../outputs/onset_med.txt"
write_array_to_file(onset_medium_file_name, normalised_onset_medium)


centroid_high_file_name = "../../outputs/centroid_high.txt"
write_array_to_file(centroid_high_file_name, normalised_cent_high)


# %%
y, sr = librosa.load('/Users/rishishukla/projects/P4P-Timbre/src/music/Main TitleJohn WilliamsJaws (From The Jaws Soundtrack).mp3', sr=44100)

# And compute the spectrogram magnitude and phase
S_full, phase = librosa.magphase(librosa.stft(y))

layout = [list(".AAAA"), list(".BBBB")]
fig, ax = plt.subplot_mosaic(layout, constrained_layout=True)
ax['A'].set(title='Extracted Harmonic Element')
librosa.display.specshow(librosa.amplitude_to_db(S_full, ref=np.max),
                         y_axis='log', x_axis='time', ax=ax['A'])
# %%

import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt

# Load the audio file and extract features
audio_file = '/Users/rishishukla/projects/P4P-Timbre/src/music/can-you-hear-the-music.mp3'
y, sr = librosa.load(audio_file, sr=None)

# Extract features
tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
rms_energy = librosa.feature.rms(y=y)[0]
times = librosa.times_like(rms_energy, sr=sr)

# Function to calculate the average values in 1-second intervals
def average_per_second(times, feature, sr):
    seconds = np.floor(times)  # Convert time to whole seconds
    unique_seconds = np.unique(seconds)  # Get unique seconds
    avg_feature_per_second = []
    
    # Average the feature values for each second
    for sec in unique_seconds:
        idx = np.where(seconds == sec)[0]  # Get indices for the current second
        avg_feature_per_second.append(np.mean(feature[idx]))  # Average for that second
    
    return unique_seconds, np.array(avg_feature_per_second)

# Average the features per second
centroid_seconds, avg_spectral_centroid = average_per_second(times, spectral_centroid, sr)
rms_seconds, avg_rms_energy = average_per_second(times, rms_energy, sr)
contrast_seconds, avg_spectral_contrast = average_per_second(times, np.mean(spectral_contrast, axis=0), sr)

# Plotting
plt.figure(figsize=(14, 10))

# Plot averaged Spectral Centroid (Brightness)
plt.subplot(3, 1, 1)
plt.step(centroid_seconds, avg_spectral_centroid, color='r', where='mid')
plt.title('Averaged Spectral Centroid Over Time (Brightness)')
plt.ylabel('Spectral Centroid (Hz)')
plt.grid(True)

# Plot averaged RMS Energy (Loudness/Intensity)
plt.subplot(3, 1, 2)
plt.step(rms_seconds, avg_rms_energy, color='g', where='mid')
plt.title('Averaged RMS Energy Over Time (Intensity)')
plt.ylabel('RMS Energy')
plt.grid(True)

# Plot averaged Spectral Contrast
plt.subplot(3, 1, 3)
plt.step(contrast_seconds, avg_spectral_contrast, color='b', where='mid')
plt.title('Averaged Spectral Contrast Over Time')
plt.ylabel('Spectral Contrast')
plt.xlabel('Time (s)')
plt.grid(True)

plt.tight_layout()
plt.show()

print("Tempo:", tempo)

# %%
