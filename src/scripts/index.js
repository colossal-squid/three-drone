import '../styles/index.scss';
import { initPhysics, addBox, updatePhysics, bodies } from './physics';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}
import {
  PerspectiveCamera, Scene, BoxGeometry,
  BufferGeometry, MeshBasicMaterial,
  MeshNormalMaterial, Mesh, WebGLRenderer
} from 'three';

let camera, scene, renderer;
let controls, meshes = [];

const ToRad = 0.0174532925199432957, 
MATERIAL =  new MeshNormalMaterial();

function updateMeshPositions() {
  let i = bodies.length;
        while (i--){
            const body = bodies[i];
            const mesh = meshes[i];

            if(!body.sleeping){
                mesh.position.copy(body.getPosition());
                mesh.quaternion.copy(body.getQuaternion());
            }
        }
}
function init() {

  camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
  camera.position.z = 1;

  scene = new Scene();

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  document.body.appendChild(renderer.domElement);
  controls = new OrbitControls( camera, renderer.domElement );
  controls.update();

}

function animation(time) {
  updatePhysics();
  updateMeshPositions();
  controls.update();
  renderer.render(scene, camera);
}

function addBoxMesh(size, position, rotation = [0, 0, 0]) {
  
  const geometry = new BoxGeometry( ...size );
	const mesh = new Mesh( geometry, MATERIAL );

  mesh.position.set(position[0], position[1], position[2]);
  // mesh.rotation.set(rotation[0] * ToRad, rotation[1] * ToRad, rotation[2] * ToRad);
	scene.add( mesh );
  meshes.push( mesh );
}

function createBox(size, pos, move = false) {
  addBox(size, pos, move);
  addBoxMesh(size, pos);
}

initPhysics();
init();

const groundSize = [0.2, 0.1, 0.2], groundPos = [0, 0, 0];
createBox(groundSize, groundPos);

const testCubeSize = [ 0.1, 0.1, 0.1 ], testCubePos = [0, 0.3, 0];
createBox(testCubeSize, testCubePos, true);