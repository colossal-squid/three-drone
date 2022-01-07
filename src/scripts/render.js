import {
    PerspectiveCamera, Scene, BoxGeometry,
    MeshNormalMaterial, Mesh, WebGLRenderer
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera, scene, renderer;
let controls, meshes = [];


const ToRad = 0.0174532925199432957,
    MATERIAL = new MeshNormalMaterial();

export function initThreeJs() {

    camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.set(-0.5, 0.5, 0.5);
    camera.rotation.set(-1, -0.5, -0.5);
    window.camera = camera;
    scene = new Scene();

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
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

export function updateRenderer(bodies) {
    updateMeshPositions(bodies)
    controls.update();
    renderer.render(scene, camera);
}

export function addBoxMesh(size, position, rotation = [0, 0, 0]) {
    const geometry = new BoxGeometry(...size);
    const mesh = new Mesh(geometry, MATERIAL);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0] * ToRad, rotation[1] * ToRad, rotation[2] * ToRad);
    scene.add(mesh);
    meshes.push(mesh);
}
