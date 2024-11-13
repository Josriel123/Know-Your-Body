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
let symptoms = {
    next: false,
    pain: false,
    swelling: false,
    sensation: false,
    strength: false,
    pins_and_needles: false,
    numbness: false,
    blows: false,
    noSensation: false

};
let num = 1;

function firstQuestion(parts) {
    LeftContainerHTML(`
        <h1>Questionnaire</h1>
        <p>${num}. Which of these symptoms is/are more compatible with your condition?</p>
        <button class="pain-button" id="painButton">Pain</button>
        <button class="swelling-button" id="swellingButton">Swelling</button>
        <button class="sensation-button" id="sensationButton">Loss of Sensation</button>
        <button class="strength-button" id="strengthButton">Loss of Strength</button>
        <p></p>
        <button class="next-button" id="nextButton">Next</button>
    `);

    // Attach event listeners to symptom buttons
    document.getElementById("painButton").onclick = () => toggleSymptom("pain", "painButton");
    document.getElementById("swellingButton").onclick = () => toggleSymptom("swelling", "swellingButton");
    document.getElementById("sensationButton").onclick = () => toggleSymptom("sensation", "sensationButton");
    document.getElementById("strengthButton").onclick = () => toggleSymptom("strength", "strengthButton");

    // Attach event listener to Next button
    document.getElementById("nextButton").onclick = () => {
        symptoms["next"] = true;
        num++;
        Questionnaire(parts); // Ensure `parts` is passed here
    };
}

function toggleSymptom(symptom, buttonId) {
    symptoms[symptom] = !symptoms[symptom]; // Toggle the symptom state

    // Change the button's appearance based on its selection state
    const button = document.getElementById(buttonId);
    if (symptoms[symptom]) {
        button.style.backgroundColor = "#4CAF50"; // Example color for selected
        button.style.color = "white";
    } else {
        button.style.backgroundColor = ""; // Revert to default
        button.style.color = "";
    }
}

function lossSensibilityQuestion(parts) {
    LeftContainerHTML(`
        <h1>Questionnaire</h1>
        <p>${num}. How would you describe the loss of sensibility?</p>
        <button class="pins-and-needles-button" id="pins-and-needlesButton">A pins-and-needles sensation that disappears when shaking the ${parts}</button>
        <button class="numbness-button" id="numbnessButton">Tingling or Numbness</button>
        <button class="blows-button" id="blowsButton">Inability to feel moderate blows to the ${parts}</button>
        <button class="no_sensation-button" id="noSensationButton">Complete inability to feel the ${parts} even when moving it</button>
        <p></p>
        <button class="next-button" id="nextButton">Next</button>
    `);

        // Attach event listeners to symptom buttons
        document.getElementById("pins-and-needlesButton").onclick = () => toggleSymptom("pins_and_needles", "pins-and-needlesButton");
        document.getElementById("numbnessButton").onclick = () => toggleSymptom("numbness", "numbnessButton");
        document.getElementById("blowsButton").onclick = () => toggleSymptom("blows", "blowsButton");
        document.getElementById("noSensationButton").onclick = () => toggleSymptom("noSensation", "noSensationButton");
    
        // Attach event listener to Next button
        document.getElementById("nextButton").onclick = () => {
            symptoms["next"] = true;
            num++;
            Questionnaire(parts); // Ensure `parts` is passed here
        }
}

function Questionnaire(parts) {
    if (parts && parts.length === 1) { // Add check to ensure `parts` is defined and not empty
        for (let i = 0; i < parts.length; i++) {
            if (["Index Finger", "Middle Finger", "Thumb", "Wrist and Hand"].includes(parts[i])) {
                // Ask the first question

                if (num == 1) {
                    firstQuestion(parts); // Pass `parts` to firstQuestion
                } else {
                    if (symptoms["sensation"]) { // Check if sensation was selected
                        lossSensibilityQuestion(parts); // Pass `parts` to lossSensibilityQuestion
                        num++;
                    }
                }
            }
        }
    } else {
        console.error("No parts selected or parts is undefined.");
    }
}

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
    const leftContainer = document.getElementById('leftContainer');
    if (!leftContainer) {
        console.error("leftContainer not found");
        return;
    }

    console.log("Updating leftContainer content");
    leftContainer.innerHTML = string; // Update content

    const doneButton = document.getElementById('doneButton');
    if (doneButton) {
        doneButton.addEventListener('click', function() {
            Questionnaire(partsSelected);
        });

        // Style the done button
        doneButton.style.marginTop = "50%";
        doneButton.style.width = "90%";
        doneButton.style.height = "20%";
        doneButton.style.fontSize = "50px";
        doneButton.style.borderRadius = "7%";
    }
}


// Function to load the 3D Model with all its lighting and interactivity.
function loadModel(cameraLight1) {
    var loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    var loader = new GLTFLoader();
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    loader.load('/Models/EnglishModel.gltf', function(gltf) {
        loadingSpinner.style.display = 'none';
        if (model) {
            scene.remove(model);
        }
        model = gltf.scene;
        model.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(model);

        model.scale.set(26, 26, 26);
        model.position.set(0, -2.763, 0);

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
            const lightOffset = new THREE.Vector3(0, 1, 0).normalize().multiplyScalar(4.5);
            cameraLight.position.copy(camera.position).add(lightOffset);
            cameraLight.target.position.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(11));
            cameraLight.target.updateMatrixWorld();
        }
        
        animate();
    }, undefined, function(error) {
        loadingSpinner.style.display = 'none';
        console.error('Error loading model:', error);
    });

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 20;
    controls.maxPolarAngle = Math.PI;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

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
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(model.children, true);

    if (intersects.length > 0) {
        const selectedPart = intersects[0].object;
        
        if (selectedPart.isMesh) {
            if (selectedPart.material.color.getHexString() === '1a8bb9') {
                selectedPart.material.color.set('#a6a6a6');
                let name = selectedPart.name.replace(/_/g, " ");
                partsSelected = partsSelected.filter(i => i !== name);
                console.log('Unselected part:', name);
            } else {
                selectedPart.material = selectedPart.material.clone();
                selectedPart.material.color.set('#1a8bb9');
                let name = selectedPart.name.replace(/_/g, " ");
                partsSelected.push(name);
                console.log('Selected part:', name);
            }
            LeftContainerHTML(`
                <h1 class='instructions'>Select the part(s) of the body where you feel pain</h1>
                <p> Body parts selected: ${partsSelected.join(", ")}</p>
                <button class="done-button" id="doneButton">Done</button>
            `);
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

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            dropdowns.forEach(function(dropdown) {
                dropdown.classList.remove('active');
            });
        }
    });
});

document.getElementById('startButton').addEventListener('click', function() {
    LeftContainerHTML(`
        <h1 class='instructions'>Select the part(s) of the body where you feel pain</h1>
        <p> Body parts selected: ${partsSelected}</p>
        <button class="done-button" id="doneButton">Done</button>
    `);
    LeftContainer();

    var rightContainer = document.getElementById('rightContainer');
    rightContainer.innerHTML = "<div id='threejs-container'><div id='loadingSpinner'></div></div>";
    rightContainer.style.marginLeft = "0";

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
        topLight.shadow.bias = -0.001;
        scene.add(topLight);

        cameraLight = new THREE.DirectionalLight(0xadd8e6, 1.2);
        camera.position.set(0, 2.5, 5);
        camera.lookAt(0, 0, 0);
        cameraLight.castShadow = true;
        cameraLight.shadow.mapSize.width = 4096;
        cameraLight.shadow.mapSize.height = 4096;
        cameraLight.shadow.camera.left = -10;
        cameraLight.shadow.camera.right = 10;
        cameraLight.shadow.camera.top = 10;
        cameraLight.shadow.camera.bottom = -10;
        cameraLight.shadow.camera.near = 1;
        cameraLight.shadow.camera.far = 20;
        cameraLight.shadow.bias = -0.001;
        scene.add(cameraLight);

        loadModel(cameraLight);
        onWindowResize();

        renderer.domElement.addEventListener('click', onMouseClick, false);
    } else {
        onWindowResize();
        loadModel(cameraLight);
        renderer.domElement.addEventListener('click', onMouseClick, false);
    }

    if (controls) {
        controls.update();
    }
});

// Initialize Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');

    setTimeout(function() {
        styleGoogleTranslateDropdown();
    }, 1000);
}
