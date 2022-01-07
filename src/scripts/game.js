import { initPhysics, addBox, updatePhysics, bodies } from './physics';
import { initThreeJs, addBoxMesh, updateRenderer } from './render';
import { EVENT_BUS, startListening } from './event-bus';

const SPEED = 0.0002;
const MOVEMENT_IMPULSES = {
    'forward': { x:SPEED , y: 0.0, z: 0 },
    'back': { x: -SPEED, y: 0.0, z: 0 },
    'left': { x: 0, y: 0.0, z: -SPEED },
    'right': { x: 0, y: 0.0, z: SPEED },
    'jump': { x: 0, y: 0.002, z: 0 }
}

let playerBody;

function createBox(size, pos, move = false) {
    const body = addBox(size, pos, move);
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
            movePlayer(MOVEMENT_IMPULSES[eventName])
        });
    });
}
export function start() {
    initPhysics();
    initThreeJs();

    const groundSize = [0.7, 0.05, 0.7], groundPos = [0, 0, 0];
    createBox(groundSize, groundPos);

    const testCubeSize = [0.1, 0.1, 0.1], testCubePos = [0, 0.3, 0];
    playerBody = createBox(testCubeSize, testCubePos, true);

    // start animation loop
    function update() {
        requestAnimationFrame(update);
        updatePhysics();
        updateRenderer(bodies);
    }
    initControls()
    update();
}