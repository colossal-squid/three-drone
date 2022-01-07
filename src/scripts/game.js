import { initPhysics, addBox, updatePhysics, bodies, flags } from './physics';
import { initThreeJs, addBoxMesh, updateRenderer } from './render';
import { EVENT_BUS, startListening } from './event-bus';

const SPEED = 0.0005, JUMP = 0.003;
const MOVEMENT_IMPULSES = {
    'forward': { x: SPEED, y: 0.0, z: 0 },
    'back': { x: -SPEED, y: 0.0, z: 0 },
    'left': { x: 0, y: 0.0, z: -SPEED },
    'right': { x: 0, y: 0.0, z: SPEED },
    'jump': { x: 0, y: JUMP, z: 0 }
}

let playerBody;

function createBox(size, pos, name, move = false) {
    const body = addBox(size, pos, name, move);
    addBoxMesh(size, pos);
    return body;
}

function movePlayer(impulse) {
    playerBody.applyImpulse(playerBody.getPosition(), impulse)
}

function initControls() {
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
            movePlayer(MOVEMENT_IMPULSES[eventName])
        });
    });
}
export function start() {
    initPhysics();
    initThreeJs();

    const groundSize = [0.7, 0.05, 0.7], groundPos = [0, 0, 0];
    createBox(groundSize, groundPos, 'ground');

    const groundPos2 = [0.5, 0.2, 0];
    createBox(groundSize, groundPos2, 'ground');

    const testCubeSize = [0.1, 0.1, 0.1], testCubePos = [0, 0.3, 0];
    playerBody = createBox(testCubeSize, testCubePos, 'player', true);

    // start animation loop
    function update() {
        requestAnimationFrame(update);
        updatePhysics();
        updateRenderer(bodies);
    }

    initControls()
    update();
}