import {
    PerspectiveCamera, Scene, BoxGeometry,
    MeshNormalMaterial, MeshBasicMaterial, Mesh,
    WebGLRenderer, TextureLoader,
    BackSide
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EVENT_BUS } from './event-bus';

const waterTexture = new TextureLoader().load('public/water.png');
const groundTexture = new TextureLoader().load('public/ground.jpeg');
const ToRad = 0.0174532925199432957,
    MODE_FPV = 'fpv', MODE_THIRD_PERSON = 'third',
    MATERIAL = new MeshNormalMaterial(),
    PLAYER_MATERIAL = MATERIAL,//new MeshBasicMaterial({ color: 0xFF0000 }),
    GROUND_MATERIAL = new MeshBasicMaterial({ map: groundTexture }),
    WATER_MATERIAL = new MeshBasicMaterial({ map: waterTexture })

let camera, scene, renderer;
let controls, meshes = [];
let cameraMode = MODE_FPV;

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
    const skyboxGeo = new BoxGeometry(10, 10, 10);
    const skybox = new Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
}
export function initThreeJs() {
    camera = new PerspectiveCamera(
        120,
        window.innerWidth / window.innerHeight,
        0.01, 20);
    camera.position.set(-1, 0.6, 1.2);
    camera.rotation.set(-0.5, -0.6, -0.3);
    window.camera = camera;
    scene = new Scene();

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    createSkybox()
    EVENT_BUS.on('cameraToggle', toggleCameraMode);
}

function toggleCameraMode() {
    if (cameraMode === MODE_FPV) {
        cameraMode = MODE_THIRD_PERSON;
    } else {
        cameraMode = MODE_FPV;
    }
}
export function updateMeshPositions(bodies) {
    let i = bodies.length;
    while (i--) {
        const body = bodies[i];
        const mesh = meshes[i];

        if (!body.sleeping) {
            mesh.position.copy(body.getPosition());
            mesh.quaternion.copy(body.getQuaternion());
        }
    }
}

export function updateRenderer(bodies, drone) {
    updateMeshPositions(bodies)
    if (cameraMode === MODE_FPV) {
        updateCamera(drone);
    } else {
        controls.update();
    }
    renderer.render(scene, camera);
}

function updateCamera(drone) {
    camera.position.copy(drone.getPosition());
    camera.quaternion.copy(drone.getQuaternion());
    camera.updateProjectionMatrix();
}

export function addBoxMesh(size, position, name, rotation = [0, 0, 0]) {
    const geometry = new BoxGeometry(...size);
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
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0] * ToRad, rotation[1] * ToRad, rotation[2] * ToRad);
    scene.add(mesh);
    meshes.push(mesh);
}
