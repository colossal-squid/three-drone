import controller from './controller';
import { startListening } from './event-bus';
import { flags } from './physics';
export const MAX_ROTATION_SPEED = 2;
export const MAX_THROTTLE = 1 / 6000;
const STOP = { x: 0, y: 0, z: 0 };
const SPEED = 1 / 1000;

export class Drone {

    constructor(body) {
        this.body = body;
        this.upforce = STOP;
        startListening();
    }

    getPosition() {
        return this.body.getPosition();
    }

    getQuaternion() {
        return this.body.getQuaternion();
    }

    // called every frame
    update() {
        if (!controller.armed) {
            return;
        }
        this.upforce = {
            x: 0, y: MAX_THROTTLE * (1 + controller.throttle / 2), z: 0
        };
        this.pitchForce = { x: 0, y: 0.0, z: SPEED * controller.pitch }
        this.body.applyImpulse(this.body.getPosition(), this.upforce);
        if (!flags.isPlayerOnTheGround) {
            this.body.angularVelocity.y = MAX_ROTATION_SPEED * controller.yaw;
            this.body.angularVelocity.z = SPEED * controller.roll; // this.body.applyImpulse(this.body.getPosition(), this.rollForce);
            this.body.angularVelocity.x = SPEED * controller.pitch; // this.body.applyImpulse(this.body.getPosition(), this.rollForce);
            this.body.applyImpulse(this.body.getPosition(), this.pitchForce);
        }
    }
}