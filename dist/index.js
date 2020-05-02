"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TempAndHumidity_1 = require("./TempAndHumidity");
const Relay_1 = require("./Relay");
const celsiusToFahrenheit_1 = require("./celsiusToFahrenheit");
const MIN_HUMIDITY = 37;
const MAX_HUMIDITY = 42;
const sensor = new TempAndHumidity_1.TempAndHumidity();
const relay = new Relay_1.Relay({ pin: 4 });
sensor.onRead = ({ celsius, humidity }) => {
    console.log("\n", `Temperature: ${Math.round(celsius * 10) / 10} C, ${Math.round(celsiusToFahrenheit_1.celsiusToFahrenheit(celsius) * 10) / 10} F \n`, `Humidity: ${Math.round(humidity * 10) / 10}% \n`);
    sensor.onRead = undefined;
};
sensor.onChangeHumidity = humidity => {
    console.log("HUMIDITY CHANGE", humidity, "\n");
    if (humidity < MIN_HUMIDITY && !relay.isOn) {
        relay.on();
        console.log("**RELAY ON**");
    }
    else if (humidity > MAX_HUMIDITY && relay.isOn) {
        relay.off();
        console.log("**RELAY OFF**");
    }
};
