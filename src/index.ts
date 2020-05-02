import { TempAndHumidity } from "./TempAndHumidity";
import { Relay } from "./Relay";
import { celsiusToFahrenheit } from "./celsiusToFahrenheit";

const MIN_HUMIDITY = 37;
const MAX_HUMIDITY = 42;

const sensor = new TempAndHumidity();
const relay = new Relay({ pin: 4 });

sensor.onRead = ({ celsius, humidity }) => {
  console.log(
    "\n",
    `Temperature: ${Math.round(celsius * 10) / 10} C, ${Math.round(
      celsiusToFahrenheit(celsius) * 10
    ) / 10} F \n`,
    `Humidity: ${Math.round(humidity * 10) / 10}% \n`
  );
  sensor.onRead = undefined;
};

sensor.onChangeHumidity = humidity => {
  console.log("HUMIDITY CHANGE", humidity, "\n");
  if (humidity < MIN_HUMIDITY && !relay.isOn) {
    relay.on();

    console.log("**RELAY ON**");
  } else if (humidity > MAX_HUMIDITY && relay.isOn) {
    relay.off();

    console.log("**RELAY OFF**");
  }
};
