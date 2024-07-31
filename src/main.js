import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Declare variables outside the function to maintain state
let scene, camera, renderer, controls, model;

// Function to load the 3D Model with all its lightiing and interactivity.
function loadModel(cameraLight1) {
    var cameraLight = cameraLight1
    var loader = new GLTFLoader();
        loader.load('/Models/scene.gltf', function(gltf) {
            console.log('Model loaded successfully'); // Debug log
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
            model.scale.set(3, 3, 3);
            model.position.set(0, -2.7, 0);

            // Render loop
            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
                cameraLight.position.copy(camera.position);
                cameraLight.target.position.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()));
            }
            animate();
        }, undefined, function(error) {
            console.error('Error loading model:', error);
        });

        // Camera position
        camera.position.z = 5;

        // Add OrbitControls
        controls = new OrbitControls(camera, renderer.domElement);

        // Handle window resize
        window.addEventListener('resize', function() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
}
document.getElementById('startButton').addEventListener('click', function() {
    var generalSection = document.getElementById('generalSection');
    generalSection.style.display = 'flex';
    generalSection.scrollIntoView({ behavior: 'smooth' });

    // Check if Three.js setup already exists
    if (!scene) {
        // Initialize Three.js scene
        var container = document.getElementById('threejs-container');
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Add a light
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        var topLight = new THREE.DirectionalLight("#e6d9c6", 1.5);
        topLight.position.set(0, 500, 0);
        topLight.castShadow = true;
        topLight.shadow.mapSize.width = 1024;
        topLight.shadow.mapSize.height = 1024;
        topLight.shadow.camera.near = 0.5;
        topLight.shadow.camera.far = 50;
        scene.add(topLight);

        var cameraLight = new THREE.DirectionalLight(0xadd8e6, 1);
        cameraLight.position.set(0, 500, 0);
        cameraLight.castShadow = true;
        cameraLight.shadow.mapSize.width = 1024;
        cameraLight.shadow.mapSize.height = 1024;
        cameraLight.shadow.camera.near = 0.5;
        cameraLight.shadow.camera.far = 50;
        scene.add(cameraLight)

        // Loads the 3D Model
        loadModel(cameraLight);
    } else {
        //Loads the 3D Model
        loadModel(cameraLight);
    }

    // Update controls
    if (controls) {
        controls.update(); // Required for controls to work properly
    }
});
