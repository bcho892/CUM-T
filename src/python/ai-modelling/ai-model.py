# %%
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from keras.models import Model
from keras.layers import Input, LSTM, Dense, TimeDistributed, RepeatVector, Concatenate, Activation, Dot
import matplotlib.pyplot as plt
import numpy as np

#%%
#Import dataset here using  http://cvml.unige.ch/databases/emoMusic/dataset_manual.pdf
annotation_filepath = datadir + "/annotations"
clips_filepath = datadir + "/clips_45seconds"

#%%
#load song information
def load_song_info(csv_path):
    df = pd.read_csv(csv_path)
    return df

song_info_path = annotation_filepath + '/songs_info.csv'
song_info_df = load_song_info(song_info_path)
print(song_info_df.head())

#%%
# feature to split the development and evaluation song ids
def filter_annotated_songs(song_info_df):
    evaluation_songs = song_info_df[song_info_df['Mediaeval 2013 set'] == 'evaluation']
    development_songs = song_info_df[song_info_df['Mediaeval 2013 set'] == 'development']
    return evaluation_songs, development_songs

#filter which songs are development and evaluation
evaluation_songs, development_songs = filter_annotated_songs(song_info_df)
print("Evaluation songs:", evaluation_songs.shape)
print("Development songs:", development_songs.shape)

#%%
# Extract features from an audio file.  Since the annotations are between 15 to 45 seconds, the features are only taken from this context.
def extract_features(score_path, frame_duration=0.5, start_time=15, end_time=45):
    # Load the audio file
    y, sr = librosa.load(score_path, sr=44100, offset=start_time, duration=end_time - start_time)

    # Number of samples per frame
    frame_length = int(frame_duration * sr)

     # Split into non-overlapping frames of frame_length samples each
    frames = librosa.util.frame(y, frame_length=frame_length, hop_length=frame_length).T

    # Extract features for each frame
    features_list = []
    for frame in frames:
        n_fft = min(1024, len(frame))

        chroma_stft = librosa.feature.chroma_stft(y=frame, sr=sr, n_fft = n_fft).mean(axis=1)
        chroma_cens = librosa.feature.chroma_cens(y=frame, sr=sr).mean(axis=1)
        mfcc = librosa.feature.mfcc(y=frame, sr=sr, n_mfcc=20, n_fft=n_fft).mean(axis=1)
        rms = librosa.feature.rms(y=frame).mean(axis=1)
        mel_spec = librosa.feature.melspectrogram(y=frame, sr=sr, n_mels=128, n_fft = n_fft).mean(axis=1)
        spec_centroid = librosa.feature.spectral_centroid(y=frame, sr=sr, n_fft = n_fft).mean(axis=1)
        spec_bandwidth = librosa.feature.spectral_bandwidth(y=frame, sr=sr, n_fft = n_fft).mean(axis=1)
        spec_contrast = librosa.feature.spectral_contrast(y=frame, sr=sr, n_fft = n_fft).mean(axis=1)
        spec_flatness = librosa.feature.spectral_flatness(y=frame, n_fft = n_fft).mean(axis=1)
        spec_rolloff = librosa.feature.spectral_rolloff(y=frame, sr=sr, n_fft = n_fft).mean(axis=1)
        zero_crossing_rate = librosa.feature.zero_crossing_rate(y=frame).mean(axis=1)


     # Concatenate all features for this frame
        frame_features = np.concatenate([
            chroma_stft, chroma_cens, mfcc, rms, mel_spec, spec_centroid, spec_bandwidth,
            spec_contrast, spec_flatness, spec_rolloff, zero_crossing_rate
        ])

        features_list.append(frame_features)

    return np.array(features_list)

def extract_features_from_songs(song_df, audio_dir):
    features_list = []
    ids = []

    for index, row in song_df.iterrows():
        audio_path = f"{audio_dir}/{row['song_id']}.mp3"
        features = extract_features(audio_path)
        features_list.append(features)
        ids.append(row['song_id'])

    return np.array(features_list), ids

# Example usage
audio_dir = clips_filepath
eval_features, eval_ids = extract_features_from_songs(evaluation_songs, audio_dir)
dev_features, dev_ids = extract_features_from_songs(development_songs, audio_dir)

#%%
def get_clipped_arousal_values(df, song_id):
    """
    Get the clipped arousal values for a specific song.

    :param df: DataFrame containing the arousal data.
    :param song_id: ID of the song to retrieve arousal values for.
    :return: List of clipped arousal levels for the song.
    """
    # Extract the row corresponding to the specific song_id
    song_row = df[df['song_id'] == song_id]

    # Check if song_id is valid and present in the data
    if song_row.empty:
        raise ValueError(f"Song ID {song_id} not found in the data.")

    # Extract arousal levels between 15s and 45s
    arousal_levels = song_row.iloc[0, 1:].values.astype(float)  # Skip the first column (song_id)

    # Clip the arousal levels
    clipped_arousal_levels = clip_arousal_levels(arousal_levels)

    return clipped_arousal_levels

# Example usage
song_id = 731 # Change this to the specific song ID you want to process
clipped_values = get_clipped_arousal_values(arousal_data, song_id)
print(clipped_values)

#%%
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load the CSV file
csv_path = annotation_filepath + '/arousal_cont_average.csv'
arousal_data = pd.read_csv(csv_path)

def clip_arousal_levels(arousal_levels):
    """
    Clip the arousal levels to a range of -0.8 to 0.8.

    :param arousal_levels: List of arousal levels to be clipped.
    :return: Clipped arousal levels.
    """
    clipped_levels = np.clip(arousal_levels, -0.8, 0.8)
    return clipped_levels

def plot_arousal_levels(df, song_id):
    """
    Plot the clipped arousal levels for a specific song.

    :param df: DataFrame containing the arousal data.
    :param song_id: ID of the song to plot.
    """
    # Extract the row corresponding to the specific song_id
    song_row = df[df['song_id'] == song_id]

    # Check if song_id is valid and present in the data
    if song_row.empty:
        raise ValueError(f"Song ID {song_id} not found in the data.")

    # Extract arousal levels between 15s and 45s
    columns = [col for col in df.columns if col.startswith('sample_')]
    arousal_levels = song_row.iloc[0, 1:].values.astype(float)  # Skip the first column (song_id)

    # Clip the arousal levels
    clipped_arousal_levels = clip_arousal_levels(arousal_levels)

    # Convert time intervals from milliseconds to seconds
    time_intervals = [int(col.split('_')[1].replace('ms', '')) / 1000.0 for col in columns]

    # Plotting
    plt.figure(figsize=(12, 6))
    plt.plot(time_intervals, clipped_arousal_levels, marker='o', linestyle='-', color='b')
    plt.title(f'Clipped Arousal Levels for Song ID: {song_id}')
    plt.xlabel('Time (seconds)')
    plt.ylabel('Arousal Level (capped between -0.8 and 0.8)')
    plt.grid(True)
    plt.ylim([-0.8, 0.8])  # Set limits to visualize clipping clearly
    plt.xticks(range(15, 46, 1))  # Show ticks from 15s to 45s
    plt.show()

# Example usage
song_id = 691  # Change this to the specific song ID you want to process
plot_arousal_levels(arousal_data, song_id)

#%%
#Load annotations for songs
def clip_arousal_levels(arousal_levels):
    """
    Clip the arousal levels to a range of -0.8 to 0.8.

    :param arousal_levels: List of arousal levels to be clipped.
    :return: Clipped arousal levels.
    """
    clipped_levels = np.clip(arousal_levels, -0.8, 0.8)
    return clipped_levels

def load_annotations_for_songs(song_ids, df):
    annotations_list = []

    for song_id in song_ids:
        song_row = df[df['song_id'] == song_id]
        columns = [col for col in df.columns if col.startswith('sample_')]
        arousal_levels = song_row.iloc[0, 1:].values.astype(float)  # Skip the first column (song_id)
        # Clip the arousal levels
        arousal_levels_processed = clip_arousal_levels(arousal_levels)
        # Convert time intervals from milliseconds to seconds
        time_intervals = [int(col.split('_')[1].replace('ms', '')) / 1000.0 for col in columns]
        annotations_list.append(arousal_levels_processed)

    return np.array(annotations_list)

csv_path = annotation_filepath + '/arousal_cont_average.csv'
arousal_data = pd.read_csv(csv_path)
eval_annotations = load_annotations_for_songs(eval_ids, arousal_data)
dev_annotations = load_annotations_for_songs(dev_ids, arousal_data)

#%%
# Normalize features
scaler = MinMaxScaler(feature_range=(0, 1))
eval_features_flattened = eval_features.reshape(-1, eval_features.shape[-1])
dev_features_flattened = dev_features.reshape(-1, dev_features.shape[-1])
eval_features_normalized = scaler.fit_transform(eval_features_flattened).reshape(eval_features.shape)
dev_features_normalized = scaler.transform(dev_features_flattened).reshape(dev_features.shape)

#%%
X_eval = eval_features_normalized
y_eval = eval_annotations
X_dev = dev_features_normalized
y_dev = dev_annotations

#%%
#AI Model:

# Encoder
class Encoder(Model):
  def __init__(self, latent_dim):
    super(Encoder, self).__init__()
    self.lstm = LSTM(latent_dim, return_sequences=True, return_state=True)

  def call(self, inputs):
    outputs, state_h, state_c = self.lstm(inputs)
    return outputs, state_h, state_c
# Decoder
class Decoder(Model):
  def __init__(self, latent_dim, output_dim):
    super(Decoder, self).__init__()
    self.lstm = LSTM(latent_dim, return_sequences=True, return_state=True)
    self.attention = Attention(latent_dim)
    self.concat = Concatenate()
    self.fc = TimeDistributed(Dense(output_dim, activation='tanh'))
  def call(self, inputs, encoder_outputs, decoder_hidden_state):
    context_vector, attention_weights = self.attention(encoder_outputs, decoder_hidden_state)
    lstm_input = self.concat([context_vector, inputs])
    outputs, state_h, state_c = self.lstm(lstm_input, initial_state=decoder_hidden_state)
    outputs = self.fc(outputs)
    return outputs, state_h, state_c, attention_weights

# Attention Layers
class Attention(Model):
    def __init__(self, latent_dim):
        super(Attention, self).__init__()
        self.Wa = Dense(latent_dim)
        self.Ua = Dense(latent_dim)
        self.Va = Dense(1)

    def call(self, encoder_outputs, decoder_hidden_state):
        score = self.Va(Activation('tanh')(self.Wa(encoder_outputs) + self.Ua(decoder_hidden_state)))
        attention_weights = Activation('softmax')(score)
        context_vector = Dot(axes=1)([attention_weights, encoder_outputs])
        return context_vector, attention_weights

#%%
# Define the model
class EncoderDecoderAttention(Model):
    def __init__(self, latent_dim, output_dim):
        super(EncoderDecoderAttention, self).__init__()
        self.encoder = Encoder(latent_dim)
        self.decoder = Decoder(latent_dim, output_dim)

    def call(self, encoder_inputs, decoder_inputs):
        encoder_outputs, state_h, state_c = self.encoder(encoder_inputs)
        decoder_outputs, _, _, attention_weights = self.decoder(decoder_inputs, encoder_outputs, [state_h, state_c])
        return decoder_outputs, attention_weights

# Hyperparameters
latent_dim = 64
output_dim = 1
batch_size = 32
epochs = 10

# Instantiate and compile the model
model = EncoderDecoderAttention(latent_dim, output_dim)
model.compile(optimizer='adam', loss='mse', metrics=['mae'])

# Create decoder input sequences
def create_decoder_inputs(y, start_token=0.0):
    decoder_inputs = np.zeros_like(y)
    decoder_inputs[:, 1:] = y[:, :-1]
    decoder_inputs[:, 0] = start_token
    return decoder_inputs

decoder_train_inputs = create_decoder_inputs(y_train)
decoder_val_inputs = create_decoder_inputs(y_val)
decoder_test_inputs = create_decoder_inputs(y_test)

# Train the model
history = model.fit(
    [X_train, decoder_train_inputs],
    y_train,
    batch_size=batch_size,
    epochs=epochs,
    validation_data=([X_val, decoder_val_inputs], y_val)
)

# Evaluate the model
test_loss, test_mae = model.evaluate([X_test, decoder_test_inputs], y_test)
print(f"Test Loss: {test_loss:.4f}")
print(f"Test MAE: {test_mae:.4f}")

# Visualize Attention Weights
def plot_attention_weights(attention_weights, song_index=0):
    plt.imshow(attention_weights[song_index], cmap='viridis', aspect='auto')
    plt.title("Attention Weights")
    plt.xlabel("Decoder Time Step")
    plt.ylabel("Encoder Time Step")
    plt.colorbar()
    plt.show()

_, attention_weights = model.predict([X_test, decoder_test_inputs])
plot_attention_weights(attention_weights, song_index=0)