# Music Folder: Exploring Thermal Haptic Feedback to Convey Emotion in Film Scores

This folder contains the music files and their respective annotation files used for the thermal haptic feedback experiments. Each song used in the experiments is accompanied by a JSON file containing annotations relevant to the study.

## File Structure

- **`song_name.mp3`**: This is the audio file for the song used in the experiment.
- **`song_name_annotations.json`**: This file contains annotations for the corresponding song. The annotations include timestamped segments of the song that correspond to emotional events or key moments that were used to generate the thermal feedback.

## Annotations Format

The annotations are stored in JSON format, and each file typically follows this structure:

```
  [
  {
    "value": 0,
    "time": 0
  },
  {
    "value": 3,
    "time": 1
  }
  ...
  ]
```
