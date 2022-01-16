import { Vec3 } from 'oimo';
import { GRAVITY, KEYBOARD_CONTROLS, WEIGHT_KG } from './constants';
import controller from './controller';
import { startListening } from './event-bus';
import { flags } from './physics';
export const MAX_ROTATION_SPEED = 2;
// the force on my drone is F = mg, = GRAVITY * WEIGHT_KG
export const MAX_THROTTLE = GRAVITY * WEIGHT_KG;
export const MAX_FORWARD_FORCE = 1 / 50;
export const MAX_PITCH_FORCE = 1 / 50;
const STOP = { x: 0, y: 0, z: 0 };
const RIGHT_STICK_ANGLE_SPEED = 5;

export class Drone {

    constructor(body) {
        this.body = body;
        this.upforce = STOP;
        startListening();
    }

    getBody() {
        return this.body;
    }

    getPosition() {
        return this.body.getPosition();
    }

    getQuaternion() {
        return this.body.getQuaternion();
    }

    moveUpAndDown() {
        const upforceRel = new Vec3(0, MAX_THROTTLE * Math.exp(controller.throttle), 0);
        upforceRel.applyQuaternion(this.body.getQuaternion());
        this.body.linearVelocity.y = -(GRAVITY * WEIGHT_KG) + upforceRel.y;
        // console.log( upforceRel.y + ' - ' + upforce.y)
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
        // this.body.angularVelocity.z = RIGHT_STICK_ANGLE_SPEED * controller.roll;
    }

    moveSideways() {
        const pitchVector = new Vec3(MAX_PITCH_FORCE * controller.pitch, 0, 0);
        // make it global
        pitchVector.applyQuaternion(this.body.getQuaternion());
        this.body.applyImpulse(this.body.getPosition(), pitchVector);
        // this.body.angularVelocity.x = RIGHT_STICK_ANGLE_SPEED * -controller.pitch; // this.body.applyImpulse(this.body.getPosition(), this.rollForce);
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