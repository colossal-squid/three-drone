import { Vec3 } from 'oimo';
import controller from './controller';
import { startListening } from './event-bus';
import { flags } from './physics';
export const MAX_ROTATION_SPEED = 2;
export const MAX_THROTTLE = 1 / 1600;
export const MAX_FORWARD_FORCE = 1 / 20000;
export const MAX_PITCH_FORCE = 1 / 3000;
const STOP = { x: 0, y: 0, z: 0 };
const RIGHT_STICK_ANGLE_SPEED = 0.5;

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
        const upforce = {
            x: 0, y: MAX_THROTTLE * (1 + controller.throttle / 2), z: 0
        };
        const upforceRel = new Vec3(0,  MAX_THROTTLE * (1 + controller.throttle / 2) ,0);
        // debugger;
        upforceRel.applyQuaternion(this.body.getQuaternion());
        this.body.applyImpulse(this.body.getPosition(), upforceRel );
        // console.log( upforceRel.y + ' - ' + upforce.y)
    }

    rotate() {
        this.body.angularVelocity.y = MAX_ROTATION_SPEED * controller.yaw;
    }

    moveForward() {
        // rotate obj
        // relative force
        // const rollVector = new Vec3(0, MAX_FORWARD_FORCE * -controller.roll ,0);
        // make it global
        // rollVector.applyQuaternion(this.body.getQuaternion());
        // this.body.applyImpulse(this.body.getPosition(), rollVector);
        this.body.angularVelocity.z = RIGHT_STICK_ANGLE_SPEED * controller.roll;
    }

    moveSideways() {
        // const pitchVector = new Vec3(MAX_PITCH_FORCE * controller.roll, 0, 0);
        // make it global
        // pitchVector.applyQuaternion(this.body.getQuaternion());
        // this.body.applyImpulse(this.body.getPosition(), pitchVector);
        this.body.angularVelocity.x = RIGHT_STICK_ANGLE_SPEED * controller.pitch; // this.body.applyImpulse(this.body.getPosition(), this.rollForce);
    }

    // called every frame
    update() {
        if (!controller.armed) {
            return;
        }
        this.moveUpAndDown()
        if (!flags.isPlayerOnTheGround) {
            this.rotate()
            this.moveForward();
            this.moveSideways()
        }
    }
}