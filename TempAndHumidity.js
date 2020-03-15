const { openPromisified } = require("i2c-bus");

const address = 0x44;
const measureHighRepeatability = [0x24, 00];
const measure = Buffer.from(measureHighRepeatability);
const readLength = 6;
const measurement = Buffer.alloc(readLength);

/* min safe gap after read, tested on RP4. units are ms */
const MIN_GAP = 20;

class TempAndHumidity {
  celsius;
  celsiusHistory = [];

  humidity;
  humidityHistory = [];

  constructor({
    interval = 1000,
    historyLength = 10,
    changeThreshold = 0.25
  } = {}) {
    this.historyLength = historyLength;
    this.changeThreshold = changeThreshold;
    this.interval = interval >= 2 * MIN_GAP ? interval : 2 * MIN_GAP;

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

            const humidity = 100 * (rawHumidity / (2 ** 16 - 1));
            const celsius = -45 + 175 * (rawTemperature / (2 ** 16 - 1));
            // const fahrenheit = -49 + 315 * (rawTemperature / (2 ** 16 - 1));

            if (this.celsiusHistory.length >= historyLength) {
              this.celsiusHistory.shift();
            }
            this.celsiusHistory.push(celsius);

            if (typeof this.onRead === "function") {
              this.onRead({ humidity, celsius });
            }
          } catch (error) {
            console.log("read error", error);
          }
        }, MIN_GAP);
      }, this.interval);
    });
  }
  checkForCelsiusChange = () => {
    const averageCelsius = calculateAverage(this.celsiusHistory);

    if (this.celsius === undefined) {
      this.celsius = averageCelsius;
    } else if (
      Math.abs(this.celsius - averageCelsius) >= this.changeThreshold
    ) {
      this.celsius = celsius;
      console.log(this.celsius);
      if (typeof this.onChange === "function") {
        this.onChange({ humidity, celsius });
      }
      if (typeof this.onChangeCelsius === "function") {
        this.onChangeCelsius(celsius);
      }
    }
  };
}

function calculateAverage(historyArray) {
  return (
    historyArray.reduce((accumulator, data) => accumulator + data, 0) /
    historyArray.length
  );
}
module.exports = TempAndHumidity;
