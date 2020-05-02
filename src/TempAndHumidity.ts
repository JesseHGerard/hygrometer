import { openPromisified } from "i2c-bus";

const address = 0x44;
const measureHighRepeatability = [0x24, 0o0];
const measure = Buffer.from(measureHighRepeatability);
const readLength = 6;
const measurement = Buffer.alloc(readLength);

/* min safe interval to read after writing to i2c, tested on RP4. units are ms */
const MIN_GAP = 20;

type Celsius = number;
type Humidity = number;

interface OnChange {
  ({}: { celsius: Celsius; humidity: number }): any;
}
interface OnChangeCelsius {
  (nextCelsius: Celsius): any;
}
interface OnChangeHumidity {
  (humidity: Humidity): any;
}
interface OnRead {
  ({ humidity, celsius }: { humidity: Humidity; celsius: Celsius }): any;
}

export class TempAndHumidity {
  celsius: Celsius;
  changeThreshold: number;
  historyLength: number;
  humidity: Humidity;
  interval: number;
  onChange: OnChange;
  onChangeCelsius: OnChangeCelsius;
  onChangeHumidity: OnChangeHumidity;
  onRead: OnRead;

  setCelsius = (nextCelsius: Celsius) => {
    this.celsius = nextCelsius;

    if (typeof this.onChangeCelsius === "function") {
      this.onChangeCelsius(nextCelsius);
    }
    if (typeof this.onChange === "function") {
      this.onChange({ celsius: this.celsius, humidity: this.humidity });
    }
  };
  celsiusHistory: Celsius[] = [];

  setHumidity = (nextHumidity: Humidity) => {
    this.humidity = nextHumidity;

    if (typeof this.onChangeHumidity === "function") {
      this.onChangeHumidity(nextHumidity);
    }
    if (typeof this.onChange === "function") {
      this.onChange({ celsius: this.celsius, humidity: this.humidity });
    }
  };
  humidityHistory: Humidity[] = [];

  constructor({
    interval = 1000,
    historyLength = 10,
    changeThreshold = 0.25,
  }: {
    interval?: number;
    historyLength?: number;
    changeThreshold?: number;
  } = {}) {
    this.historyLength = historyLength;
    this.changeThreshold = changeThreshold;
    this.interval = interval >= 2 * MIN_GAP ? interval : 2 * MIN_GAP;

    openPromisified(1).then(async (bus) => {
      setInterval(async () => {
        try {
          await bus.i2cWrite(address, measure.length, measure);
        } catch (error) {
          console.error("[TempAndHumidity] I2C write error", error);
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

            this.checkForCelsiusChange(celsius);
            this.checkForHumidityChange(humidity);

            if (typeof this.onRead === "function") {
              this.onRead({ humidity, celsius });
            }
          } catch (error) {
            console.error("[TempAndHumidity] I2C read error", error);
          }
        }, MIN_GAP);
      }, this.interval);
    });
  }

  checkForCelsiusChange = (celsius: Celsius) => {
    if (this.celsiusHistory.length >= this.historyLength) {
      this.celsiusHistory.shift();
    }
    this.celsiusHistory.push(celsius);

    const averageCelsius = calculateAverage(this.celsiusHistory);

    if (
      Math.abs(this.celsius - averageCelsius) >= this.changeThreshold ||
      this.celsius === undefined
    ) {
      this.setCelsius(averageCelsius);
    }
  };

  checkForHumidityChange = (humidity: Humidity) => {
    if (this.humidityHistory.length >= this.historyLength) {
      this.humidityHistory.shift();
    }
    this.humidityHistory.push(humidity);

    const averageHumidity = calculateAverage(this.humidityHistory);

    if (
      Math.abs(this.humidity - averageHumidity) >= this.changeThreshold ||
      this.humidity === undefined
    ) {
      this.setHumidity(averageHumidity);
    }
  };
}

function calculateAverage(historyArray: number[]) {
  return (
    historyArray.reduce((accumulator, data) => accumulator + data, 0) /
    historyArray.length
  );
}
