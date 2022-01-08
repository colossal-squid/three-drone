import { initPhysics, addBox, updatePhysics, bodies } from './physics';
import { initThreeJs, addBoxMesh, updateRenderer } from './render';
import { Drone } from './drone';


let drone;

function createBox(size, pos, name, move = false, rot = [0,0,0]) {
    const body = addBox(size, pos, name, move, rot);
    addBoxMesh(size, pos, name, rot);
    return body;
}

function createLevel() {
    const groundSize = [0.7, 0.05, 0.7], groundPos = [-1, 0, 0];
    createBox(groundSize, groundPos, 'ground');

    const groundPos2 = [1, 0.2, 0];
    createBox(groundSize, groundPos2, 'ground');

    createBox([3,0.05,3], [0,-0.2,0], 'water');
}

function createPlayer() {
    const testCubeSize = [0.1, 0.1, 0.1], testCubePos = [-1, 0.3, 0];
    const playerBody = createBox(testCubeSize, testCubePos, 'player', true, [-90, 270, 0]);
    drone = new Drone(playerBody);
}


export function start() {
    initPhysics();
    initThreeJs();

    createLevel();
    createPlayer();

    // start animation loop
    function update() {
        requestAnimationFrame(update);
        drone.update();
        updatePhysics();
        updateRenderer(bodies, drone);
    }
    update();
}