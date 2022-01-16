import { initPhysics, addBox, updatePhysics, bodies } from './physics';
import { initThreeJs, addBoxMesh, updateRenderer, addPlayer } from './render';
import { Drone } from './drone';
import { initOverlay } from './overlay';
import controller from './controller';
import { WORLD_SIZE } from './constants';
import { updateAudio } from './audio';
import { updateDebug } from './debug';

let drone;

function createBox(size, pos, name, move = false, rot = [0, 0, 0]) {
    const body = addBox(size, pos, name, move, rot);
    addBoxMesh(size, pos, name, rot);
    return body;
}

function createLevel() {
    const groundSize = [2, 1, 2], 
    groundPos = [-2, 0, 0];
    createBox(groundSize, groundPos, 'ground');

    const groundPos2 = [2, 0, 0];
    createBox(groundSize, groundPos2, 'ground');

    createBox([WORLD_SIZE, 0.05, WORLD_SIZE], [0, -0.2, 0], 'water');
}

async function createPlayer() {
    const testCubeSize = [0.2, 0.1, 0.2], 
    testCubePos = [-2, 4, 0];
    const playerBody = addBox(testCubeSize, testCubePos, 'player', true, [0, 0, 0], 60);
    playerBody.allowSleep = false;
    const mesh = await addPlayer(testCubeSize, testCubePos, [0, 0, 0]);
    drone = new Drone(playerBody, mesh);
}


export async function start() {
    initPhysics();
    initThreeJs();

    createLevel();
    await createPlayer();
    initOverlay();
    // start animation loop
    function update() {
        requestAnimationFrame(update);
        controller.update();
        drone.update();
        updatePhysics();
        updateRenderer(bodies, drone);
        // updateAudio();
        updateDebug(drone);
    }
    update();
}