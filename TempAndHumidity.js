const { openPromisified } = require("i2c-bus");

const address = 0x44;
const measureHighRepeatability = [0x24, 00];
const measure = Buffer.from(measureHighRepeatability);
const readLength = 6;
const measurement = Buffer.alloc(readLength);

class TempAndHumidity {
  constructor(interval = 1000) {
    this.interval = interval >= 40 ? interval : 40;

    openPromisified(1).then(async bus => {
      setInterval(async () => {
        try {
          await bus.i2cWrite(address, measure.length, measure);
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
            const rawHumidity = read.buffer.readUInt16BE(0);
            const rawTemperature = read.buffer.readUInt16BE(3);

            const relativeHumidity = 100 * (rawHumidity / (2 ** 16 - 1));
            const celsius = -45 + 175 * (rawTemperature / (2 ** 16 - 1));
            const fahrenheit = -49 + 315 * (rawTemperature / (2 ** 16 - 1));

            if (typeof this.onData === "function") {
              this.onData({ relativeHumidity, celsius, fahrenheit });
            }
          } catch (error) {
            console.log("read error");
          }
        }, 20);
      }, this.interval);
    });
  }
}

module.exports = TempAndHumidity;
