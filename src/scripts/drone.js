import { Vec3 } from 'oimo';
import controller from './controller';
import { startListening } from './event-bus';
import { flags } from './physics';
export const MAX_ROTATION_SPEED = 2;
export const MAX_THROTTLE = 1 / 6000;
export const MAX_FORWARD_FORCE = 1 / 20000;
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

    moveUpAndDown() {
        this.upforce = {
            x: 0, y: MAX_THROTTLE * (1 + controller.throttle / 2), z: 0
        };
        this.body.applyImpulse(this.body.getPosition(), this.upforce);
    }

    rotate() {
        this.body.angularVelocity.y = MAX_ROTATION_SPEED * controller.yaw;
    }

    moveForward() {
        // rotate obj
        // relative force
        const rollVector = new Vec3(0, 0, MAX_FORWARD_FORCE * -controller.roll);
        // make it global
        rollVector.applyQuaternion(this.body.getQuaternion());
        this.body.applyImpulse(this.body.getPosition(), rollVector);
        this.body.angularVelocity.z = SPEED * -controller.roll;
    }

    moveSideways() {
        this.body.angularVelocity.x = SPEED * controller.pitch; // this.body.applyImpulse(this.body.getPosition(), this.rollForce);
    }

    // called every frame
    update() {
        if (!controller.armed) {
            return;
        }
        this.moveUpAndDown()
        this.pitchForce = { x: SPEED * controller.pitch, y: 0, z: 0 }
        if (!flags.isPlayerOnTheGround) {
            this.rotate()
            this.moveForward();
            this.moveSideways()
        }
    }
}