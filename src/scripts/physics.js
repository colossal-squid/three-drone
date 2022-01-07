import { World } from 'oimo';

let info = document.getElementById('debug')
let world;

export const bodies = [];

export function initPhysics() {
    world = new World({
        timestep: 1 / 60,
        iterations: 8,
        broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
        worldscale: 1, // scale full world 
        random: true,  // randomize sample
        info: true,   // calculate statistic or not
        gravity: [0, -9.8, 0]
    });
    return world;
}

export function addBox(size, pos, move) {
    const body = world.add({ size, pos, move, density: 1 });
    bodies.push(body);
    return body;
}

export function updatePhysics () {
    world.step();
    info.innerHTML = world.getInfo();
}