import { EVENT_BUS } from "./event-bus";

const THROTTLE_PER_FRAME = 0.05;
const YAW_PER_FRAME = 0.1;


class Controller {

    constructor() {
        this.armed = false;
        this.throttle = -1;
        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;

        EVENT_BUS.on('throttleUp', () => {
            let nextThrottle = this.throttle + THROTTLE_PER_FRAME;
            this.throttle = Math.min(1, nextThrottle);
        })

        EVENT_BUS.on('throttleDown', () => {
            let nextThrottle = this.throttle - THROTTLE_PER_FRAME;
            this.throttle = Math.max(nextThrottle, -1);
        });

        EVENT_BUS.on('yawLeft', () => {
            const nextYaw = this.yaw - YAW_PER_FRAME;
            this.yaw = Math.max(-1, nextYaw);
        });

        EVENT_BUS.on('yawRight', () => {
            const nextYaw = this.yaw + YAW_PER_FRAME;
            this.yaw = Math.min(1, nextYaw);
        });

        EVENT_BUS.on('yawCenter', () => {
            this.yaw = 0;
        });

        EVENT_BUS.on('arm', () => {
            this.armed = !this.armed;
        })
        window.addEventListener("gamepadconnected",  (e) =>{
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);
        });
        window.addEventListener("gamepaddisconnected",  (e) => {
            console.log("Gamepad disconnected from index %d: %s",
                e.gamepad.index, e.gamepad.id);
        });

        // this.debug = document.querySelector('#debug');
    }

    get name() {
        const gp = (navigator.getGamepads()||[{}])[0]
        return (gp.id || '').substring(0, 18)+'...';
    }
    update() {
        const gp = (navigator.getGamepads()||[])[0];
        if (gp) {
            this.throttle = gp.axes[1];
            this.yaw = gp.axes[0];
            this.roll = -gp.axes[3];
            this.pitch = gp.axes[2];
            // this.debug.innerHTML = gp.axes.map(v => `<p>${v}</p>`).join('')
        }

    }

}

export default new Controller();