import { initPhysics, addBox, updatePhysics, bodies } from './physics';
import { initThreeJs, addBoxMesh, updateRenderer, addPlayer } from './render';
import { Drone } from './drone';
import { initOverlay } from './overlay';
import controller from './controller';
import { WORLD_SIZE } from './constants';

let drone;

function createBox(size, pos, name, move = false, rot = [0, 0, 0]) {
    const body = addBox(size, pos, name, move, rot);
    addBoxMesh(size, pos, name, rot);
    return body;
}

function createLevel() {
    const groundSize = [0.7, 0.05, 0.7], groundPos = [-1, 0, 0];
    createBox(groundSize, groundPos, 'ground');

    const groundPos2 = [1, 0.2, 0];
    createBox(groundSize, groundPos2, 'ground');

    createBox([WORLD_SIZE, 0.05, WORLD_SIZE], [0, -0.2, 0], 'water');
}

async function createPlayer() {
    const testCubeSize = [0.1, 0.1, 0.1], testCubePos = [-1, 0.3, 0];
    const playerBody = addBox(testCubeSize, testCubePos, 'player', true, [-90, 270, 0]);
    addPlayer(testCubeSize, testCubePos, [-90, 270, 0]);
    drone = new Drone(playerBody);
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
    }
    update();
}