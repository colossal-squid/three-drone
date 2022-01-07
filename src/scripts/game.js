import { initPhysics, addBox, updatePhysics, bodies } from './physics';
import { initThreeJs, addBoxMesh, updateRenderer} from './render';

function createBox(size, pos, move = false) {
    addBox(size, pos, move);
    addBoxMesh(size, pos);
}

export function start () {
    initPhysics();
    initThreeJs();

    const groundSize = [0.7, 0.05, 0.7], groundPos = [0, 0, 0];
    createBox(groundSize, groundPos);

    const testCubeSize = [0.1, 0.1, 0.1], testCubePos = [0, 0.3, 0];
    createBox(testCubeSize, testCubePos, true);

    // start animation loop
    function update() {
        requestAnimationFrame( update );
        updatePhysics();
        updateRenderer(bodies);
    }
    update();
}