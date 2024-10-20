import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Raycaster, Vector2 } from 'three';

// Declare variables outside the function to maintain state
let scene, camera, renderer, controls, model, cameraLight;
let raycaster = new Raycaster();
let mouse = new Vector2();
let partsSelected = [];

function LeftContainer() {
    let leftContainer = document.getElementById('leftContainer');
    leftContainer.style.paddingLeft = '5%';
    leftContainer.style.paddingRight = '0';
    leftContainer.style.marginRight = "0";
    leftContainer.style.width = '25vw';
    leftContainer.style.backgroundColor = "#111111";
    leftContainer.style.color = "white";


}

// Function to update the left container's content dynamically
function LeftContainerHTML(string) {
    let leftContainer = document.getElementById('leftContainer');
    leftContainer.innerHTML = string;

    // Now that the button is in the DOM, attach the event listener
    let doneButton = document.getElementById('doneButton');
    if (doneButton) {
        doneButton.addEventListener('click', function() {
            LeftContainerHTML
            (
                `
                    <h1>Questionnaire</h1>
                    <p>1. Do you feel pain in the selected area?</p>
                `
            );
        });
    }

    doneButton.style.marginTop = "50%";
    doneButton.style.width = "90%";
    doneButton.style.height = "20%";
    doneButton.style.fontSize = "50px";
    doneButton.style.borderRadius = "7%";
}





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
    loader.load('/Models/EnglishModel.gltf', function(gltf) {
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
        model.scale.set(26, 26, 26);
        model.position.set(0, -2.77, 0);

        // Render loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        
            // Correct position offset for cameraLight to follow the camera
            const lightOffset = new THREE.Vector3(0, 1, 0).normalize().multiplyScalar(4.5); // Adjust these values as needed
            cameraLight.position.copy(camera.position).add(lightOffset);
            
            // Ensure light targets where the camera is looking
            cameraLight.target.position.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(11));
            cameraLight.target.updateMatrixWorld(); // Important to update the target matrix
        }
        
        animate();
    }, undefined, function(error) {
        loadingSpinner.style.display = 'none';
        console.error('Error loading model:', error);
    });

    // Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);

    // Disable panning and zooming
    controls.enablePan = false;
    controls.enableZoom = false;

    // Set rotation limits (optional)
    controls.minPolarAngle = Math.PI / 20; // Limit vertical rotation
    controls.maxPolarAngle = Math.PI; // Limit vertical rotation
    controls.enableDamping = true; // Enable smooth rotation
    controls.dampingFactor = 0.05; // Damping factor for smooth rotation

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

function onMouseClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    
    // Convert the mouse position to normalized device coordinates
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate the intersects with the model's children (meshes)
    const intersects = raycaster.intersectObjects(model.children, true);


    if (intersects.length > 0) {
        const selectedPart = intersects[0].object; // The first intersected object

        
        if (selectedPart.isMesh) {

            // Change the color of the selected part
            if (selectedPart.material.color.getHexString() === '1a8bb9'){
                selectedPart.material.color.set('#a6a6a6');
                let name = selectedPart.name.replace(/_/g, " ")
                partsSelected = partsSelected.filter(i => i !== name)
                console.log('Unselected part:', name);
            }  
            else {
                // Clone the material if it's shared with other parts
                selectedPart.material = selectedPart.material.clone();
                selectedPart.material.color.set('#1a8bb9');
                let name = selectedPart.name.replace(/_/g, " ")
                partsSelected.push(name);
                console.log('Selected part:', name);

            }
            LeftContainerHTML
            (
                `
                    <h1 class='instructions'>Select the part(s) of the body where you feel pain</h1>
                    <p> Body parts selected: ${partsSelected.join(", ")}</p>
                    <button class="done-button" id="doneButton">Done</button>
                `
            );
        }
    }
}


// Menu Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(function(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');

        toggle.addEventListener('click', function(event) {
            event.preventDefault();
            dropdown.classList.toggle('active');
        });
    });

    // Close the dropdown when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            dropdowns.forEach(function(dropdown) {
                dropdown.classList.remove('active');
            });
        }
    });
});

document.getElementById('startButton').addEventListener('click', function() {
    
    LeftContainerHTML
    (
        `
            <h1 class='instructions'>Select the part(s) of the body where you feel pain</h1>
            <p> Body parts selected: ${partsSelected}</p>
            <button class="done-button" id="doneButton">Done</button>
        `
    );
    LeftContainer();

    var rightContainer = document.getElementById('rightContainer');
    rightContainer.innerHTML = "<div id='threejs-container'><div id='loadingSpinner'></div></div>";
    rightContainer.style.marginLeft = "0";

    // Initialize Three.js scene if it hasn't been initialized yet
    if (!scene) {
        var container = document.getElementById('threejs-container');
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ alpha: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Add lights
        var ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        var topLight = new THREE.DirectionalLight("#e6d9c6", 1.3);
        topLight.position.set(0, 10, 0);
        topLight.castShadow = true;
        topLight.shadow.mapSize.width = 4096;
        topLight.shadow.mapSize.height = 4096;
        topLight.shadow.camera.left = -10;
        topLight.shadow.camera.right = 10;
        topLight.shadow.camera.top = 10;
        topLight.shadow.camera.bottom = -10;
        topLight.shadow.camera.near = 1;
        topLight.shadow.camera.far = 20;
        topLight.shadow.bias = -0.001; // Adjust this value to reduce shadow artifacts
        scene.add(topLight);

        cameraLight = new THREE.DirectionalLight(0xadd8e6, 1.2);
        camera.position.set(0, 2.5, 5); // Positioned above and looking down at the model
        camera.lookAt(0, 0, 0); // Ensure the camera is looking at the center of the scene or model
        cameraLight.castShadow = true;
        cameraLight.shadow.mapSize.width = 4096;
        cameraLight.shadow.mapSize.height = 4096;
        cameraLight.shadow.camera.left = -10;
        cameraLight.shadow.camera.right = 10;
        cameraLight.shadow.camera.top = 10;
        cameraLight.shadow.camera.bottom = -10;
        cameraLight.shadow.camera.near = 1;
        cameraLight.shadow.camera.far = 20;
        cameraLight.shadow.bias = -0.001; // Adjust this as needed
        scene.add(cameraLight);


        // Load the 3D Model
        loadModel(cameraLight);
        onWindowResize();


        // Add event listener for mouse clicks
        renderer.domElement.addEventListener('click', onMouseClick, false);
    } else {
        // Update the renderer size
        onWindowResize();
        // Load the 3D Model
        loadModel(cameraLight);
        renderer.domElement.addEventListener('click', onMouseClick, false);
    }

    // Update controls
    if (controls) {
        controls.update(); // Required for controls to work properly
    }
});



// Google Translate

// Initialize Google Translate
// Initialize Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');

    // Call the function to style the dropdown after Google Translate loads
    setTimeout(function() {
        styleGoogleTranslateDropdown();
    }, 1000); // Allow time for Google Translate to load
}

// Function to style the Google Translate dropdown
function styleGoogleTranslateDropdown() {
    var translateDropdown = document.querySelector('.goog-te-combo');

    if (translateDropdown) {
        // Set the max width of the dropdown
        translateDropdown.style.maxWidth = '200px';
        translateDropdown.style.overflow = 'hidden';
        translateDropdown.style.fontSize = '14px'; // Adjust font size as needed

        // Add a scrollbar to the options list (in case there are too many languages)
        translateDropdown.style.height = 'auto';
        translateDropdown.style.maxHeight = '150px'; // Adjust height for scrolling
        translateDropdown.style.overflowY = 'scroll'; // Enable vertical scroll
    }
}

// Load Google Translate API
(function() {
    var googleTranslateScript = document.createElement('script');
    googleTranslateScript.type = 'text/javascript';
    googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.getElementsByTagName('head')[0].appendChild(googleTranslateScript);
})();


