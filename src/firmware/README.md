# Haptic Sleeve MicroPython Firmware

The Haptic Sleeve hosts a server on the [Pico Pi W](https://projects.raspberrypi.org/en/projects/get-started-pico-w) attached to the control board. This uses an [implementation of websockets](https://github.com/AdrianCX/crawlspacebot) which can be accessed via connecting to the access point from a Wi-Fi compatiable device.

You are **highly recommended** to install the [MicroPico](https://marketplace.visualstudio.com/items?itemName=paulober.pico-w-go) extension for VS-Code.

Also follow the instructions to [load micropython onto the Pico Pi W](https://micropython.org/download/RPI_PICO_W/)

## Setup

> [!IMPORTANT]
> Before you get started connect to your `MicroPython` loaded Pico Pi W.
> Open the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) and select `MicroPico: Connect`

1. Upload all required files to the board with Command Palette and `MicroPico: Upload Project to Pico`
2. Open the `main.py` file and use the command palette command `MicroPico: Run Current File on Pico`
3. Now you should have an exposed access point where you can connect and send messages to from the control interface (the details can be configured in `config.py`).
