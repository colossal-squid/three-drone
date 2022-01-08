import { EVENT_BUS } from "./event-bus";

const THROTTLE_PER_FRAME = 0.05;
const YAW_PER_FRAME = 0.05;

class Controller {

    constructor() {
        this.armed = false;
        this.throttle = -1;
        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;

        EVENT_BUS.on('throttleUp', ()=> {
            let nextThrottle = this.throttle + THROTTLE_PER_FRAME;
            this.throttle = Math.min(1, nextThrottle);
        })

        EVENT_BUS.on('throttleDown', ()=> {
            let nextThrottle = this.throttle - THROTTLE_PER_FRAME;
            this.throttle = Math.max(nextThrottle, -1);
        });

        EVENT_BUS.on('yawLeft', ()=> {
            const nextYaw = this.yaw - YAW_PER_FRAME;
            this.yaw = Math.max(-1, nextYaw);
        });

        EVENT_BUS.on('yawRight', ()=> {
            const nextYaw = this.yaw + YAW_PER_FRAME;
            this.yaw = Math.min(1, nextYaw);
        });
    }



}

export default new Controller();