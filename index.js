const TempAndHumidity = require("./TempAndHumidity");

/* const { Gpio, HIGH, LOW } = require("onoff");

async function main() {
  const relay = new Gpio(4, "out");
  relay.write(1);
} */

const sensor = new TempAndHumidity(1000);

sensor.onData = ({ relativeHumidity, celsius }) =>
  console.log(relativeHumidity, celsius);
