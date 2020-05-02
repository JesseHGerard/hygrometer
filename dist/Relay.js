"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onoff_1 = require("onoff");
class Relay {
    constructor({ pin, normallyOpen = false, initiallyOn = false, }) {
        this.onVoltage = 1;
        this.offVoltage = 0;
        this.isOn = false;
        this.on = () => {
            this.isOn = true;
            this.relay.write(this.onVoltage);
        };
        this.off = () => {
            this.isOn = false;
            this.relay.write(this.offVoltage);
        };
        this.remove = () => this.relay.unexport();
        if (typeof pin !== "number") {
            console.error(`[Relay] Pin number must be provided, received: ${pin}`);
        }
        this.pin = pin;
        if (normallyOpen) {
            this.onVoltage = 0;
            this.offVoltage = 1;
        }
        this.relay = new onoff_1.Gpio(pin, "out");
        if (initiallyOn) {
            this.on();
        }
        else {
            this.off();
        }
    }
}
exports.Relay = Relay;
exports.default = Relay;
