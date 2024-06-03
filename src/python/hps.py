import librosa
import matplotlib.pyplot as plt
import numpy as np
from IPython.display import Audio

y, sr = librosa.load('assets\\Oogway_Ascends.mp3')

y_harmonic, y_percussive = librosa.effects.hpss(y, margin=(1.0,5.0))

S_percussive, phase = librosa.magphase(librosa.stft(y=y_percussive))
S_harmonic, phase = librosa.magphase(librosa.stft(y=y_harmonic))

layout = [list(".AAAA"), list(".BBBB")]
fig, ax = plt.subplot_mosaic(layout, constrained_layout=True)
ax['A'].set(title='Extracted Harmonic Element')
librosa.display.specshow(librosa.amplitude_to_db(S_harmonic, ref=np.max),
                         y_axis='log', x_axis='time', ax=ax['A'])

ax['B'].set(title='Extracted Percussive Element')
librosa.display.specshow(librosa.amplitude_to_db(S_percussive, ref=np.max),
                         y_axis='log', x_axis='time', ax=ax['B'])

Audio(data=y_percussive, rate=sr)

