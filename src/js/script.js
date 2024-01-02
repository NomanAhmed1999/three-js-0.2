import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from '../../node_modules/dat.gui/build/dat.gui.module.js'
// import { GUI } from '../../node_modules/dat.gui/build/dat.gui.module.js';
// import { OrbitControls } from "../../node_modules/three/addons/controls/OrbitControls.js";
import stars from '../assets/stars.jpg';



const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


const orbit = new OrbitControls(camera, renderer.domElement)


const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
camera.position.set(0, 2, 5);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF});

const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
box.castShadow = true


const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0XFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const spherGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterail = new THREE.MeshStandardMaterial({
    color: 0X0000FE,
    wireframe: false
});
const sphere = new THREE.Mesh(spherGeometry, sphereMaterail);
scene.add(sphere);

sphere.position.set(-10, 10, 0);
sphere.castShadow = true

const ambientLight = new THREE.AmbientLight(0X333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0XFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-50, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);


// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0XFFFFFF);
scene.add(spotLight);

// spotLight.position.set(-50, 50, 0);
spotLight.castShadow = true;
// spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0XFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0XFFFFFF, 0.01);


// renderer.setClearColor(0XFFEA00);
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('https://images.unsplash.com/photo-1608473029371-e731ca14611f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2t5JTIwZnVsbCUyMG9mJTIwc3RhcnN8ZW58MHx8MHx8fDA%3D');

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    'https://cdn.spacetelescope.org/archives/images/screen/heic1310a.jpg',
    'https://cdn.spacetelescope.org/archives/images/screen/heic1310a.jpg',
    'https://cdn.spacetelescope.org/archives/images/screen/heic1310a.jpg',
    'https://cdn.spacetelescope.org/archives/images/screen/heic1310a.jpg',
    'https://cdn.spacetelescope.org/archives/images/screen/heic1310a.jpg',
    'https://cdn.spacetelescope.org/archives/images/screen/heic1310a.jpg'
]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
    // color: 0X00FF00,
    map: textureLoader.load(stars)
});
const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(0, 15, 10);



const gui = new dat.GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
}

gui.addColor(options, 'sphereColor').onChange(function (e) {
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function (e) {
    sphere.material.wireframe = e
});

gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

let step = 0;

function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));


    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update()

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, this.window.innerHeight)
});