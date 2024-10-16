# Project 32: Exploring Thermal Haptic Feedback to Convey Emotion in Film Scores

> Benson Cho & Rishi Shukla

Welcome to the repository for Part 4 Project #32, "Exploring Thermal Haptic Feedback to Convey Emotion in Film Scores." This project aims to enhance the emotional depth of film scores through the use of **Control Unit Modulator for Temperature (CUM-T)** that delivers thermal feedback synchronized with music. This repository contains all the source code, hardware designs, and data analysis tools used in our research.

## Prerequisites

- install the dependecies from the `requirements.txt` file
- Raspberry Pico Pi W (used for firmware)
- Peltiers

## Installation

1. Clone the repository:
   `git clone https://github.com/bcho892/CUM-T.git`
2. Navigate into the project folder:
   `cd CUM-T`
3. Install the necessary dependencies:
   `pip install -r requirements.txt`

### Folder Overview:

- `src/firmware/`: Contains the code for controlling the haptic sleeve’s hardware components (e.g., Peltier modules).
- `src/hardware/`: Hardware design files, schematics, and documentation.
- `src/music/`: Music files and their annotations used in the experiments.
- `src/python/`: Jupyter notebooks for data analysis and AI models.
- `src/react/`: Contains the web interface built using React for user interaction.

```
project
│   README.md
└─── src
│   └─── firmware
|   |       README.md
│   └─── hardware
|   |       README.md
│   └─── hardwarev2
|   |       README.md
│   └─── music
|   |       README.md
│   │       song_name_annotations.json
│   │       song_name.mp3
│   └─── notebooks
|   |       README.md
│   └─── python
|   |       README.md
│   |   └─── scripts
│   └─── react
|           README.md

```
