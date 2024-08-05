import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Declare variables outside the function to maintain state
let scene, camera, renderer, controls, model, cameraLight;

// Function to load the 3D Model with all its lighting and interactivity.
function loadModel(cameraLight1) {

    // Loading Spinner setup
    var loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    // 3D Model Loader setup
    var loader = new GLTFLoader();
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    loader.load('/Models/scene.gltf', function(gltf) {
        console.log("Model Loaded");
        loadingSpinner.style.display = 'none'; // Hide spinner once the model is loaded
        if (model) {
            scene.remove(model); // Remove previous model if it exists
        }
        model = gltf.scene;
        model.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true; // Enable shadows for the model
                child.receiveShadow = true; // Enable shadows to be received by the model
            }
        });
        scene.add(model);

        // Adjust model scale and position if needed
        model.scale.set(3.2, 3.2, 3.2);
        model.position.set(0, -3, 0);

        // Render loop
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            cameraLight.position.copy(camera.position);
            cameraLight.target.position.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()));
        }
        animate();
    }, undefined, function(error) {
        loadingSpinner.style.display = 'none';
        console.error('Error loading model:', error);
    });

    // Camera position
    camera.position.z = 5;

    // Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    var container = document.getElementById('threejs-container');
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    console.log(container.clientWidth, container.clientHeight);
    camera.updateProjectionMatrix();
}

document.getElementById('startButton').addEventListener('click', function() {
    var leftContainer = document.getElementById('leftContainer');
    leftContainer.innerHTML = "<h1 class='instructions'>Select a part of the body</h1>";
    leftContainer.style.paddingLeft = '7%';
    leftContainer.style.width = '25vw';
    leftContainer.style.backgroundColor = "white";
    leftContainer.style.color = "black";

    var rightContainer = document.getElementById('rightContainer');
    rightContainer.innerHTML = "<div id='threejs-container'><div id='loadingSpinner'></div></div>";

    // Initialize Three.js scene if it hasn't been initialized yet
    if (!scene) {
        var container = document.getElementById('threejs-container');
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Add lights
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        var topLight = new THREE.DirectionalLight("#e6d9c6", 1.5);
        topLight.position.set(0, 100, 0);
        topLight.castShadow = true;
        topLight.shadow.mapSize.width = 1024;
        topLight.shadow.mapSize.height = 1024;
        topLight.shadow.camera.near = 0.5;
        topLight.shadow.camera.far = 50;
        scene.add(topLight);

        cameraLight = new THREE.DirectionalLight(0xadd8e6, 1);
        cameraLight.position.set(0, 100000, 0);
        cameraLight.castShadow = true;
        cameraLight.shadow.mapSize.width = 1024;
        cameraLight.shadow.mapSize.height = 1024;
        cameraLight.shadow.camera.near = 0.5;
        cameraLight.shadow.camera.far = 11;
        scene.add(cameraLight);

        // Load the 3D Model
        loadModel(cameraLight);
    } else {
        // Update the renderer size
        onWindowResize();
        // Load the 3D Model
        loadModel(cameraLight);
    }

    // Update controls
    if (controls) {
        controls.update(); // Required for controls to work properly
    }
});
