# %%
import numpy as np
import matplotlib.pyplot as plt
from IPython.display import Audio

import librosa

import librosa.display

y, sr = librosa.load('..\\..\\assets\\Gonna_Fly_Now.mp3', sr=44100)

# And compute the spectrogram magnitude and phase
S_full, phase = librosa.magphase(librosa.stft(y))

# Play back a 5-second excerpt with vocals
Audio(data=y, rate=sr)

# %%

fig, ax = plt.subplots()
librosa.display.specshow(librosa.amplitude_to_db(S_full, ref=np.max),
                         y_axis="log", x_axis='time', ax=ax, sr=sr)

# %%
# Seperate the harmonic and percussive components
y_harmonics, y_precussive = librosa.effects.hpss(y, margin=(1.0,5.0))

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


S_harmonic_highs[:600, :] = 0.
S_harmonic_mediums[600:,:] = 0.
S_harmonic_mediums[:300,:] = 0.
S_harmonic_lows[300:, :] = 0.

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
