# %%
import numpy as np
import matplotlib.pyplot as plt
from IPython.display import Audio

import librosa

import librosa.display

start_time_s = 0
end_time_s = 30

y_drums, sr = librosa.load('..\\..\\assets\\Gonna_Fly_Now_Drums.mp3', sr=44100)
y_drums = y_drums[start_time_s*sr:end_time_s*sr]

S_drums_full, phase = librosa.magphase(librosa.stft(y_drums[start_time_s*sr:end_time_s*sr]))

Audio(data=y_drums[start_time_s*sr:end_time_s*sr],rate=sr)

# %%
fig, ax = plt.subplots()
librosa.display.specshow(librosa.amplitude_to_db(S_drums_full, ref=np.max),
                         y_axis="log", x_axis='time', ax=ax, sr=sr)

fig, ax = plt.subplots(nrows=1, sharex=True, sharey=True)
librosa.display.waveshow(y_drums, sr=sr, ax=ax)
ax.set(title='Intensity of percussion')
ax.label_outer()


onset_percussion = librosa.onset.onset_strength(y=y_drums , sr=sr)
centroid_percussion = librosa.feature.spectral_centroid(y=y_drums, sr=sr)
times_percussion = librosa.times_like(onset_percussion, sr=sr)

fig, ax = plt.subplots(2)

ax[0].plot(times_percussion, onset_percussion.T, label='Percussion Attack', color='b')
ax[0].legend(loc='upper right')
ax[0].set(title='Onset graph for percussion')

ax[1].plot(times_percussion, centroid_percussion.T, label='Percussion Centroid', color='b')
ax[1].legend(loc='upper right')
ax[1].set(title='Centroid graph for percussion')

reference_max = 2**16 - 1
reference_min = 0

def normalise(signal, ref_max = reference_max, ref_min = reference_min):
    max = np.max(signal)
    min = np.min(signal)
    difference = max - min
    reference_diff = ref_max - ref_min
    return reference_diff * ((signal - min) / (difference)) + ref_min


fig, ax = plt.subplots()

normalised_onset_percussion = normalise(onset_percussion, 1, 0)

def replace_next_n(arr, n):
    i = 0
    while i < len(arr):
        if arr[i] == 1:
            for j in range(1, n+1):
                if i+j < len(arr):
                    arr[i+j] = 1
            i += n + 1  # Skip the next 'n' elements
        else:
            i += 1
    return arr

binary_masked_onset_percussion = (normalised_onset_percussion > 0.55).astype(int)

binary_masked_onset_percussion = replace_next_n(binary_masked_onset_percussion, 15)

normalised_intensity_percussion = normalise(librosa.resample(y_drums[start_time_s*sr:end_time_s*sr], target_sr=170, orig_sr=44100))

ax.plot(times_percussion, binary_masked_onset_percussion.T, label='Spectral centroid', color='b')
ax.legend(loc='upper right')
ax.set(title='Binary onset')

# %%
def write_array_to_file(file_name, normalised_array):
    with open(file_name, 'w') as file:
        normalised_array.tofile(file, sep=',', format='%i')
    print(f"Array written to {file_name}")

onset_percussion_file_path = '../../outputs/percussive_onset.txt'

write_array_to_file(onset_percussion_file_path, normalise(binary_masked_onset_percussion))

# %%
