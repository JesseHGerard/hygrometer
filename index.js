/* const Gpio = require("onoff").Gpio; // Gpio class
const led = new Gpio(17, "out"); // Export GPIO17 as an output

console.log(led.write(1));
 */
const { inspect } = require("util");
const { openPromisified } = require("i2c-bus");

const address = 0x44;
const softReset = 0x30a2 || 0xfe;
const measureHighRepeatability = [0x24, 00];
const measure = Buffer.from(measureHighRepeatability);
const readLength = 6;
const measurement = Buffer.alloc(readLength);

const humidity = 0xe5;
const temperature = 0xfe;

async function main() {
  try {
    const bus = await openPromisified(1);

    setInterval(async () => {
      try {
        const write = await bus.i2cWrite(address, measure.length, measure);
      } catch (error) {
        console.log("write, error");
      }

      setTimeout(async () => {
        try {
          const read = await bus.i2cRead(
            address,
            measurement.length,
            measurement
          );
          const rawHumidity = read.buffer.readInt16BE(0);
          const rawTemperature = read.buffer.readInt16BE(3);

          const relativeHumidity = 100 * (rawHumidity / (2 ** 16 - 1));
          const fahrenheit = 49 + 315 * (rawTemperature / (2 ** 16 - 1));
          const celsius = 45 + 175 * (rawTemperature / (2 ** 16 - 1));

          console.log("READ", relativeHumidity, fahrenheit, celsius, "\n");
        } catch (error) {
          console.log("read error");
        }
      }, 200);
    }, 1000);
  } catch (error) {
    throw error;
  }
}

/* const { Gpio, HIGH, LOW } = require("onoff");

async function main() {
  const relay = new Gpio(4, "out");
  relay.write(1);
} */

main();
