import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Raycaster, Vector2 } from 'three';

// Declare variables outside the function to maintain state
let scene, camera, renderer, controls, model, cameraLight;
let raycaster = new Raycaster();
let mouse = new Vector2();

// State to track selected parts and symptoms
const state = {
    partsSelected: [],
    symptoms: {},
    currentNode: "start"
};

// Example pathologies with symptoms and affected parts
const pathologies = [
    /*
    ALGUNAS DE LAS PATOLOGIAS ESTAN MAL
    {
        name: "Carpal Tunnel Syndrome",
        symptoms: ["loss of sensation", "pain"],
        parts: ["Wrist", "Thumb", "Index Finger", "Middle Finger"]
    },
    {
        name: "De Quervain's Tenosynovitis",
        symptoms: ["pain", "swelling"],
        parts: ["Thumb", "Wrist"]
    },
    {
        name: "Trigger Finger",
        symptoms: ["strength", "sensation"],
        parts: ["Thumb", "Index Finger", "Middle Finger", "Ring Finger", "Pinky"]
    },
    {
        name: "Colles Fracture",
        symptoms: ["pain", "swelling", "loss of strength", "loss of sensation"],
        parts: ["Wrist"]
    },
    {
        name: "Smith Fracture",
        symptoms: ["pain", "swelling", "loss of strength", "loss of sensation"],
        parts: ["Wrist"]
    },
    {
        name: "Distal Radius Fracture",
        symptoms: ["pain", "swelling", "loss of strength", "loss of sensation"],
        parts: ["Wrist"]
    },
    {
        name: "Scaphoid Fracture",
        symptoms: ["pain", "swelling", "loss of strength", "loss of sensation"],
        parts: ["Wrist"]
    },
    {
        name: "Phalangeal Fracture",
        symptoms: ["pain", "swelling", "loss of strength", "loss of sensation"],
        parts: ["Fingers"]
    },
    {
        name: "Contracture",
        symptoms: ["stiffness", "pain", "swelling"],
        parts: ["Fingers", "Wrist"]
    },
    {
        name: "Tendinitis",
        symptoms: ["pain", "swelling"],
        parts: ["Wrist", "Hand"]
    },
    {
        name: "Sprain",
        symptoms: ["pain", "swelling", "reduced movement"],
        parts: ["Wrist", "Fingers"]
    },
    {
        name: "Dislocation",
        symptoms: ["pain", "swelling", "visible deformity"],
        parts: ["Fingers", "Wrist"]
    },
    {
        name: "Osteoarthritis",
        symptoms: ["pain", "stiffness", "swelling"],
        parts: ["Fingers", "Wrist"]
    },
    {
        name: "Rheumatoid Arthritis",
        symptoms: ["pain", "stiffness", "swelling"],
        parts: ["Fingers", "Wrist"]
    },
    {
        name: "Radial Nerve Injury",
        symptoms: ["sensation loss", "pain", "weakness"],
        parts: ["Wrist", "Hand"]
    },
    {
        name: "Trigger Finger (Stenosing Tenosynovitis)",
        symptoms: ["pain", "swelling", "locking", "snapping sensation"],
        parts: ["Thumb", "Fingers"]
    },
    {
        name: "Distension",
        symptoms: ["pain", "swelling", "weakness", "reduced mobility"],
        parts: ["Fingers", "Hand"]
    },
    {
        name: "Arthrosis",
        symptoms: ["pain", "stiffness", "swelling", "weakness"],
        parts: ["Fingers", "Wrist"]
    },
    {
        name: "Radial Nerve Lesion",
        symptoms: ["sensation loss", "pain", "weakness"],
        parts: ["Wrist", "Hand"]
    }

    */
];


const questionsTree = {
    start: {
        question: "Which of these symptoms is/are more compatible with your condition? (Select all that apply)",
        options: [
            { text: "Pain", symptom: "pain" },
            { text: "Swelling", symptom: "swelling" },
            { text: "Loss of Sensation", symptom: "sensation" },
            { text: "Loss of Strength", symptom: "strength" }
        ],
        multiSelect: true, // Allows multiple selections
        next: "follow_up"
    },
    follow_up: {
        question: "Which area corresponds to your symptoms? (Select one)",
        options: [
            { text: "Area 1", symptom: "area1" },
            { text: "Area 2", symptom: "area2" },
            { text: "Area 3", symptom: "area3" }
        ],
        multiSelect: false // Enforces single selection
    },
    loss_sensibility: {
        question: "How would you describe the loss of sensibility?",
        options: [
            { text: "Pins-and-needles sensation", symptom: "pins_and_needles" },
            { text: "Tingling or Numbness", symptom: "numbness" },
            { text: "Inability to feel moderate blows", symptom: "blows" },
            { text: "Complete inability to feel", symptom: "noSensation" }
        ],
        multiSelect: false
    },
    loss_strength: {
        question: "How would you describe the loss of strength?",
        options: [
            { text: "Morning stiffness that reduces during the day", symptom: "morningStiffness" },
            { text: "Non-temporary weakness", symptom: "nonTemporaryWeakness" },
            { text: "Inability to grip objects", symptom: "noGripStrength" },
            { text: "Inability to move the hand", symptom: "noHandMovement" }
        ],
        multiSelect: false
    }
};



function renderQuestion(questionNode, containerId, callback) {
    const container = document.getElementById(containerId);
    let html = `<h2>${questionNode.question}</h2>`;

    questionNode.options.forEach((option, index) => {
        html += `<button id="${containerId}-option${index}" class="question-button">${option.text}</button>`;
    });

    // Add the "Next" button
    html += `<p></p><button id="${containerId}-nextButton" class="next-button">Next</button>`;

    container.innerHTML = html;

    questionNode.options.forEach((option, index) => {
        const button = document.getElementById(`${containerId}-option${index}`);
        button.onclick = () => {
            if (questionNode.multiSelect) {
                state.symptoms[option.symptom] = !state.symptoms[option.symptom];
                if (state.symptoms[option.symptom]) {
                    button.style.backgroundColor = "#4CAF50";
                    button.style.color = "white";
                } else {
                    button.style.backgroundColor = "";
                    button.style.color = "";
                }
            } else {
                questionNode.options.forEach((opt, i) => {
                    const otherButton = document.getElementById(`${containerId}-option${i}`);
                    state.symptoms[opt.symptom] = false;
                    otherButton.style.backgroundColor = "";
                    otherButton.style.color = "";
                });
                state.symptoms[option.symptom] = true;
                button.style.backgroundColor = "#4CAF50";
                button.style.color = "white";
            }
        };
    });

    const nextButton = document.getElementById(`${containerId}-nextButton`);
    nextButton.onclick = () => {
        if (callback) callback();
    };
}

function renderFollowUpQuestions() {
    const selectedSymptoms = Object.keys(state.symptoms).filter(symptom => state.symptoms[symptom]);

    const followUpNodes = [];

    // if (selectedSymptoms.includes("sensation") || selectedSymptoms.includes("strength")) {
    //     followUpNodes.push(questionsTree.follow_up);
    // }

    selectedSymptoms.forEach(symptom => {
        if (symptom === "sensation") followUpNodes.push(questionsTree.loss_sensibility);
        if (symptom === "strength") followUpNodes.push(questionsTree.loss_strength);
    });

    if (followUpNodes.length > 0) {
        let currentIndex = 0;

        function showNextFollowUp() {
            if (currentIndex < followUpNodes.length) {
                renderQuestion(followUpNodes[currentIndex], "leftContainer", () => {
                    currentIndex++;
                    showNextFollowUp();
                });
            } else {
                transitionToDiagnosis(); // Diagnose after follow-ups
            }
        }

        showNextFollowUp();
    } else {
        transitionToDiagnosis(); // Diagnose directly if no follow-ups
    }
}


// Function to diagnose the most likely pathology
function diagnosePathology() {
    const userSymptoms = Object.keys(state.symptoms).filter(symptom => state.symptoms[symptom]); // Extract selected symptoms
    const partsSelected = state.partsSelected; // Use partsSelected from the state

    let candidates = [];
    let fallbackCandidates = [];

    pathologies.forEach(pathology => {
        let symptomScore = 0;
        let partScore = 0;

        // Calculate symptom score (percentage of matching symptoms)
        pathology.symptoms.forEach(symptom => {
            if (userSymptoms.includes(symptom)) {
                symptomScore++;
            }
        });

        const symptomPercentage = (symptomScore / pathology.symptoms.length) * 100;

        // Calculate part score (percentage of matching parts)
        pathology.parts.forEach(part => {
            if (partsSelected.includes(part)) {
                partScore++;
            }
        });

        const partPercentage = (partScore / pathology.parts.length) * 100;

        // Prioritize pathologies matching at least one selected part
        if (partScore > 0) {
            candidates.push({
                pathology: pathology.name,
                symptomPercentage: symptomPercentage.toFixed(2),
                partPercentage: partPercentage.toFixed(2),
                overallPercentage: ((symptomPercentage + partPercentage) / 2).toFixed(2),
                matchesParts: true
            });
        } else {
            // Fallback: Include pathologies with no matching parts only if no others match
            fallbackCandidates.push({
                pathology: pathology.name,
                symptomPercentage: symptomPercentage.toFixed(2),
                partPercentage: 0,
                overallPercentage: symptomPercentage.toFixed(2),
                matchesParts: false
            });
        }
    });

    // Sort candidates by overall percentage in descending order
    candidates.sort((a, b) => b.overallPercentage - a.overallPercentage);

    // If no candidates match selected parts, consider fallback candidates
    if (candidates.length === 0) {
        fallbackCandidates.sort((a, b) => b.overallPercentage - a.overallPercentage);
        return {
            message: "No pathologies match the selected parts. Based on symptoms, the best match is:",
            details: fallbackCandidates[0]
        };
    }

    // Return the best match from candidates
    return {
        message: `The most likely diagnosis is ${candidates[0].pathology}.`,
        details: candidates[0]
    };
}

// Integrate with transitionToDiagnosis
function transitionToDiagnosis() {
    const diagnosis = diagnosePathology(); // Run the diagnosis algorithm
    const leftContainer = document.getElementById("leftContainer");

    // Display the diagnosis results
    leftContainer.innerHTML = `
        <h1 style="font-size: 60px;">Preliminary Diagnosis</h1>
        <p style="font-size: 18px">${diagnosis.message}</p>
        ${
            diagnosis.details
                ? `
        <h2 style="font-size: 32px;">Details:</h2>
        <ul style="font-size: 18px">
            <li><strong>Pathology:</strong> ${diagnosis.details.pathology}</li>
            <li><strong>Symptom Match:</strong> ${diagnosis.details.symptomPercentage}%</li>
            <li><strong>Part Match:</strong> ${diagnosis.details.partPercentage}%</li>
            <li><strong>Overall Match:</strong> ${diagnosis.details.overallPercentage}%</li>
        </ul>
        `
                : ""
        }
        <p>This tool provides general information based on user-inputted data and is not a substitute for professional medical advice.
        \nPlease consult a qualified healthcare professional for an accurate diagnosis and treatment.</p>
    `;
}


// Function to start the questionnaire
function startQuestionnaire() {
    if (state.partsSelected.length >= 1)
    {
        const questionNode = questionsTree.start;
        renderQuestion(questionNode, "leftContainer", () => {
            // Proceed to follow-up questions when "Next" is clicked
            renderFollowUpQuestions();
        });
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
            startQuestionnaire();
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
                state.partsSelected = state.partsSelected.filter(i => i !== name);
                console.log('Unselected part:', name);
            } else {
                selectedPart.material = selectedPart.material.clone();
                selectedPart.material.color.set('#1a8bb9');
                let name = selectedPart.name.replace(/_/g, " ");
                state.partsSelected.push(name);
                console.log('Selected part:', name);
            }
            LeftContainerHTML(`
                <h1 class='instructions'>Select the part(s) of the body where you feel pain</h1>
                <p style="font-size: 20px"> Body parts selected: ${state.partsSelected.join(", ")}</p>
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
        <p style="font-size: 20px"> Body parts selected: ${state.partsSelected}</p>
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



