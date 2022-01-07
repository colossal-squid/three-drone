import { initPhysics, addBox, updatePhysics, bodies } from './physics';
import { initThreeJs, addBoxMesh, updateRenderer } from './render';
import { EVENT_BUS, startListening } from './event-bus';

const JUMP_FORCE = { x: 0, y: 0.002, z: 0 };
let playerBody;

function createBox(size, pos, move = false) {
    const body = addBox(size, pos, move);
    addBoxMesh(size, pos);
    return body;
}

function initControls() {
    startListening();
    EVENT_BUS.on('jump', () => {
        const center = playerBody.getPosition();
        playerBody.applyImpulse(center, JUMP_FORCE)
    })
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