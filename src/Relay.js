const { Gpio } = require("onoff");

class Relay {
  onVoltage = 1;
  offVoltage = 0;

  isOn = false;

  on = () => {
    this.isOn = true;
    this.relay.write(this.onVoltage);
  };
  off = () => {
    this.isOn = false;
    this.relay.write(this.offVoltage);
  };

  remove = () => this.relay.unexport();

  constructor({ pin, normallyOpen = false, initiallyOn = false }) {
    if (typeof pin !== "number") {
      console.error(`[Relay] Pin number must be provided, received: ${pin}`);
    }
    this.pin = pin;

    if (normallyOpen) {
      this.onVoltage = 0;
      this.offVoltage = 1;
    }

    this.relay = new Gpio(pin, "out");

    if (initiallyOn) {
      this.on();
    } else {
      this.off();
    }
  }
}

module.exports = Relay;
