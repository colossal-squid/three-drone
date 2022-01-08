import { EVENT_BUS, startListening } from './event-bus';
import { flags } from './physics';
const ROTATION_SPEED = 0.3;
const THROTTLE = { x: 0, y: 1 / 6000, z: 0 };
const STOP = { x: 0, y: 0, z: 0 };
const SPEED = 0.0005, JUMP = 0.003;
const MOVEMENT_IMPULSES = {
    'forward': { x: SPEED, y: 0.0, z: 0 },
    'back': { x: -SPEED, y: 0.0, z: 0 },
    'left': { x: 0, y: 0.0, z: -SPEED },
    'right': { x: 0, y: 0.0, z: SPEED },
    'jump': { x: 0, y: JUMP, z: 0 }
}

export class Drone {

    constructor(body) {
        this.body = body;
        this.upforce = STOP;
        this.initControls();
    }

    initControls() {
        startListening();
        Object.keys(MOVEMENT_IMPULSES).forEach((eventName) => {
            EVENT_BUS.on(eventName, () => {
                if (eventName === 'jump' && !flags.isPlayerOnTheGround) {
                    // only jump on the ground
                    return;
                } else if (eventName !== 'jump' && flags.isPlayerOnTheGround) {
                    // only move while in air
                    return;
                }
                this.movePlayer(MOVEMENT_IMPULSES[eventName])
            });
            EVENT_BUS.on('throttleUp', () => {
                this.upforce = THROTTLE;
            })
            EVENT_BUS.on('throttleDown', () => {
                this.upforce = STOP;
            })
            EVENT_BUS.on('yawLeft', () => {
                this.body.angularVelocity.add({x: 0, z:0, y: ROTATION_SPEED})
            })
            EVENT_BUS.on('yawRight', () => {
                this.body.angularVelocity.add({x: 0, z:0, y: -ROTATION_SPEED})
            })
        });

    }

    movePlayer(impulse) {
        this.body.applyImpulse(this.body.getPosition(), impulse)
    }

    getPosition() {
        return this.body.getPosition();
    }

    getQuaternion() {
        return this.body.getQuaternion();
    }

    // called every frame
    update() {
        this.body.applyImpulse(this.body.getPosition(), this.upforce);
    }
}