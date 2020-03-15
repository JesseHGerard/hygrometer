const TempAndHumidity = require("./TempAndHumidity");

/* const { Gpio, HIGH, LOW } = require("onoff");

async function main() {
  const relay = new Gpio(4, "out");
  relay.write(1);
} */

const sensor = new TempAndHumidity();

sensor.onRead = ({ humidity, celsius }) => console.log(humidity, celsius);
sensor.onChangeCelsius = celsius => console.log("Celsius change", celsius);
