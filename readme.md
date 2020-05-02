# IOT Humidity Regulator

## Hygrometer / Thermometer / Smart-outlet

Control a humidifier: Keep the humidity in a room in a specified range while logging temperature and humidity to a server. This project is the first step in building an automated home climate control system. Next step is to build the main server/db that will coordinate systems throughout the home.

### Goals

* Demonstrate working with low level byte data from hardware over I2C serial connection.

* Develop a workflow for running a Javascript/Typescript applications on a low-powered headless device with minimal steps and dependencies.

## Hardware

1. Raspberry Pi - tested with:
   - Raspberry Pi Zero W - (OS) [Raspbian Buster Lite](https://www.raspberrypi.org/downloads/raspbian/) 
   - Raspberry Pi 4 - (OS) [Ubuntu Server 20](https://ubuntu.com/download/raspberry-pi)
2. [Adafruit Sensirion SHT31-D - Temperature & Humidity Sensor](https://www.adafruit.com/product/2857) 
3. [Generic relay](https://www.amazon.com/gp/product/B0798CZDR9/ref=ppx_yo_dt_b_asin_title_o03_s01?ie=UTF8&psc=1) (5v controller to mains voltage)
4. Generic Humidifier (must activate when power is switched on)

## How to run in production

In a terminal on a Raspberry Pi:

1. Install `nvm` (used to manage node versions) [more instructions](https://github.com/nvm-sh/nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

2. Clone _this_ repo

```bash
git clone https://github.com/JesseHGerard/hygrometer.git
cd ./hygrometer
```

3. Install dependencies
```bash
npm run install:prod
```

4. Run
```bash
npm run start:prod
```
