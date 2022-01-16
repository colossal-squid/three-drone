import {
    PerspectiveCamera, Scene, BoxGeometry,
    MeshNormalMaterial, MeshBasicMaterial, Mesh,
    WebGLRenderer, TextureLoader, LoadingManager,
    BackSide, AmbientLight, Vector3, Box3, Object3D, Group, ArrowHelper
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EVENT_BUS } from './event-bus';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { WORLD_SIZE } from './constants';
import controller from './controller';

const waterTexture = new TextureLoader().load('public/water.png');
const groundTexture = new TextureLoader().load('public/ground.jpeg');
const ToRad = 0.0174532925199432957,
    MODE_FPV = 'fpv',
    MODE_THIRD_PERSON = 'third',
    MODE_STATIC = 'static',
    MATERIAL = new MeshNormalMaterial(),
    PLAYER_MATERIAL = MATERIAL,//new MeshBasicMaterial({ color: 0xFF0000 }),
    GROUND_MATERIAL = new MeshBasicMaterial({ map: groundTexture }),
    WATER_MATERIAL = new MeshBasicMaterial({ map: waterTexture }),
    DEBUG = true

let camera, scene, renderer, debugArrows;
let controls, meshes = [];
let cameraMode = MODE_THIRD_PERSON, props = [];

function loadPlayerModel() {
    const PATH = 'public/';
    return new Promise((resolve) => {
        const loadingManager = new LoadingManager();
        new MTLLoader(loadingManager)
            .setPath(PATH)
            .load('drone.mtl', (materials) => {
                materials.preload();
                new OBJLoader(loadingManager)
                    .setMaterials(materials)
                    .setPath(PATH)
                    .load('drone.obj', function (mesh) {
                        mesh.children
                            .filter(p => p.name.includes('Prope'))
                            .forEach((prop, i) => {
                                const positions = [
                                    [2, 0, 2],
                                    [-2, 0, -2],
                                    [-2, 0, 2],
                                    [2, 0, -2],
                                ];
                                prop.material = PLAYER_MATERIAL;
                                prop.geometry.center();
                                const pivot = new Object3D();
                                mesh.add(pivot)
                                prop.removeFromParent();
                                prop.scale.set(2, 2, 2)
                                pivot.add(prop);
                                pivot.position.set(...positions[i])
                                prop.position.set(0, 0, 0)
                                props.push(prop);
                            })
                        resolve(mesh)
                    });
            })


    })
}

function createSkybox() {
    const bk = new TextureLoader().load("public/skybox/xpos.png");
    const ft = new TextureLoader().load("public/skybox/xneg.png");
    const dn = new TextureLoader().load("public/skybox/zneg.png");
    const up = new TextureLoader().load("public/skybox/zpos.png");
    const lf = new TextureLoader().load("public/skybox/ypos.png");
    const rt = new TextureLoader().load("public/skybox/yneg.png");
    const materialArray = [up, dn, lf, rt, ft, bk].map(texture => {
        const material = new MeshBasicMaterial({ map: texture, side: BackSide });
        return material;
    });
    const skyboxGeo = new BoxGeometry(WORLD_SIZE, WORLD_SIZE, WORLD_SIZE);
    const skybox = new Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
}

function initDebugArrows(drone) {
    debugArrows = {};
    window.debugArrows = debugArrows;
    const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFF00FF];

    ['FL', 'BL', 'FR', 'BR'].forEach((key, idx) => {
        const dir = new Vector3(0, 0, 0);
        //normalize the direction vector (convert to vector of length 1)
        dir.normalize();
        const origin =  drone.mesh.position.clone();
        if (idx == 0 || idx == 3) 
            origin.x += 4;
            if (idx == 2 || idx == 0) 
            origin.z += 6;
        const length = 0.2;
        const hex = colors[idx];
        const arrowHelper = new ArrowHelper(dir, origin, length, hex);
        drone.mesh.add(arrowHelper);
        debugArrows[`upforce${key}`] = arrowHelper;
    });
}

function updateDebugArrows(drone) {
    drone.motorVectors.forEach(({ key, position, impulse }, idx) => {
        debugArrows[`upforce${key}`].setDirection(
            drone.getBody().linearVelocity
        );
        debugArrows[`upforce${key}`].setLength(
            drone.getBody().linearVelocity.length()
        );
    })

}

export function initThreeJs() {
    camera = new PerspectiveCamera(
        80,
        window.innerWidth / window.innerHeight,
        0.01, 10000);
    camera.position.set(-0.3, 3, 1.5);
    camera.rotation.set(1, -0.1, -0.2);
    window.camera = camera;
    scene = new Scene();

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);

    const light = new AmbientLight(0x404040); // soft white light
    scene.add(light);

    createSkybox()
    EVENT_BUS.on('cameraToggle', toggleCameraMode);
}

function toggleCameraMode() {
    if (cameraMode === MODE_FPV) {
        cameraMode = MODE_THIRD_PERSON;
    } else if (cameraMode === MODE_THIRD_PERSON) {
        cameraMode = MODE_STATIC;
    } else if (cameraMode === MODE_STATIC) {
        cameraMode = MODE_FPV;
    }
    console.log('cameraMode:', cameraMode)
}

export function updateMeshPositions(bodies) {
    let i = bodies.length;
    while (i--) {
        const body = bodies[i];
        const mesh = meshes[i];

        if (!body.sleeping && mesh) {
            mesh.position.copy(body.getPosition());
            mesh.quaternion.copy(body.getQuaternion());
        }
    }
}

export function updateRenderer(bodies, drone) {
    updateMeshPositions(bodies)
    if (cameraMode === MODE_FPV || cameraMode === MODE_THIRD_PERSON) {
        updateCamera(drone);
    } else {
        controls.update();
    }

    if (controller.armed) {
        // rotate props
        props.forEach(p => {
            p.rotateOnAxis(p.up, 0.7 * ((controller.throttle + 1) / 2));
        })
    }
    if (DEBUG) {
        if (!debugArrows) {
            initDebugArrows(drone);
        }
        updateDebugArrows(drone);
    }
    renderer.render(scene, camera);

}

function updateCamera(drone) {
    const { x, y, z } = drone.getPosition();
    const v = new Vector3(x, y, z);
    if (cameraMode === MODE_THIRD_PERSON) {
        const THIRD_PERSON_MODE_OFFSET = new Vector3(0, 0.15, 0.35);
        THIRD_PERSON_MODE_OFFSET.applyQuaternion(drone.getQuaternion());
        v.add(THIRD_PERSON_MODE_OFFSET);
    }
    camera.position.copy(v);
    camera.quaternion.copy(drone.getQuaternion());
    camera.updateProjectionMatrix();
}

export async function addPlayer(size, position, rotation) {
    const mesh = await loadPlayerModel();
    mesh.scale.set(...size.map(s => s / 10))
    mesh.position.set(
        position[0],
        position[1],
        position[2]
    );
    mesh.rotation.set(rotation[0] * ToRad, rotation[1] * ToRad, rotation[2] * ToRad);

    scene.add(mesh);
    meshes.push(mesh);
    return mesh;
}

export function addBoxMesh(size, position, name, rotation = [0, 0, 0]) {
    let geometry = new BoxGeometry(...size);

    let material = MATERIAL;
    switch (name) {
        case 'player': material = PLAYER_MATERIAL;
            break;
        case 'ground': material = GROUND_MATERIAL;
            break;
        case 'water': material = WATER_MATERIAL;
            break;
    }
    const mesh = new Mesh(geometry, material);
    mesh.position.set(
        position[0],
        position[1],
        position[2]
    );
    mesh.rotation.set(rotation[0] * ToRad, rotation[1] * ToRad, rotation[2] * ToRad);
    scene.add(mesh);
    meshes.push(mesh);
}
