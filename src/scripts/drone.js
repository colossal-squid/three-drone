import { Vec3 } from 'oimo';
import { GRAVITY, KEYBOARD_CONTROLS, WEIGHT_KG } from './constants';
import controller from './controller';
import { startListening } from './event-bus';
import { flags } from './physics';
export const MAX_ROTATION_SPEED = 2;
// the force on my drone is F = mg, = GRAVITY * WEIGHT_KG
export const MAX_THROTTLE = GRAVITY * WEIGHT_KG / 138;
export const MAX_FORWARD_FORCE = 1 / 50;
export const MAX_PITCH_FORCE = 1 / 50;
const STOP = { x: 0, y: 0, z: 0 };
const RIGHT_STICK_ANGLE_SPEED = 5;
const DRONE_SIZE = 1;
const MOTOR_OFFSET = {
    'FL': { x: -DRONE_SIZE, z: DRONE_SIZE, y: 0 },
    'BL': { x: -DRONE_SIZE, z: -DRONE_SIZE, y: 0 },
    'FR': { x: DRONE_SIZE, z: DRONE_SIZE, y: 0 },
    'BR': { x: DRONE_SIZE, z: -DRONE_SIZE, y: 0 }
}
export class Drone {

    constructor(body, mesh) {
        this.body = body;
        this.mesh = mesh;
        this.upforce = STOP;
        this.motorVectors = [];
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
        this.motorVectors = [];
        ['FL', 'BL', 'FR', 'BR'].forEach((key) => {
            const center = this.body.getPosition().clone();
            center.add(MOTOR_OFFSET[key])
            this.motorVectors.push(
                { key, position: center, impulse: upforceRel }
            );
            this.body.applyImpulse(center, upforceRel);
        });
        // console.log( upforceRel.y + ' - ' + upforce.y)
    }

    rotate() {
        this.nextFrameRotation =  {...this.nextFrameRotation, z : 20 * controller.yaw };
        this.body.angularVelocity.y = controller.yaw * MAX_ROTATION_SPEED;
    }

    moveForward() {
        // rotate obj
        // relative force
        const rollVector = new Vec3(0, 0, MAX_FORWARD_FORCE * -controller.roll);
        // make it global
        rollVector.applyQuaternion(this.body.getQuaternion());
        this.body.applyImpulse(this.body.getPosition(), rollVector);
        this.nextFrameRotation = {... this.nextFrameRotation, x: -30 * controller.roll};
    }

    moveSideways() {
        const pitchVector = new Vec3(MAX_PITCH_FORCE * controller.pitch, 0, 0);
        // make it global
        pitchVector.applyQuaternion(this.body.getQuaternion());
        this.body.applyImpulse(this.body.getPosition(), pitchVector);
        this.nextFrameRotation =  {...this.nextFrameRotation, y : 20 * -controller.pitch };
    }

    // called every frame
    update() {
        if (!controller.armed) {
            return;
        }
        this.moveUpAndDown()
        if (!flags.isPlayerOnTheGround) {
            this.nextFrameRotation = {... this.body.newRotation };
            this.rotate()
            this.moveForward();
            this.moveSideways()
            if (this.nextFrameRotation !== this.body.newRotation) {
                this.body.controlRot = true;
                this.body.setRotation(this.nextFrameRotation);
                this.body.controlRot = false;
                // this.body.resetRotation();
                this.body.controlRot = false;
            }
        }
    }
}