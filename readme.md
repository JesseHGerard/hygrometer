# IOT Hygrometer / Thermometer

## A Raspberry Pi Application

## Hardware

1. Raspberry Pi - tested with:
    Raspberry Pi Zero W - (OS) [Raspbian Buster Lite](https://www.raspberrypi.org/downloads/raspbian/) 
    Raspberry Pi 4 - (OS) [Ubuntu Server 20](https://ubuntu.com/download/raspberry-pi)
2. [Adafruit Sensirion SHT31-D - Temperature & Humidity Sensor](https://www.adafruit.com/product/2857) 


## How to run in production

In a terminal on a Raspberry Pi:

1. Install `nvm` (used to manage node versions) [more instructions](https://github.com/nvm-sh/nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

2. Clone this repo

```bash
https://github.com/JesseHGerard/hygrometer.git
```

3. Install dependencies
```bash
npm run install:prod
```

4. Run
```bash
npm run start:prod
```