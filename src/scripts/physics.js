import { World } from 'oimo';

let info = document.getElementById('debug')
let world;

export const bodies = [];
export const flags = {
    isPlayerOnTheGround: false
}

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

export function addBox(size, pos, name, move, [x, y, z]) {
    const body = world.add({ size, pos, move, name, density: 1 });
    body.setRotation({ x, y, z });
    bodies.push(body);
    return body;
}

export function updatePhysics() {
    world.step();
    flags.isPlayerOnTheGround = !!world.checkContact('player', 'ground');
    // info.innerHTML = `<p>${JSON.stringify(flags, null, 2)} </p>` + world.getInfo();
}