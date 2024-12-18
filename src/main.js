import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Raycaster, Vector2 } from 'three';

// Declare variables outside the function to maintain state
let scene, camera, renderer, controls, model, cameraLight;
let raycaster = new Raycaster();
let mouse = new Vector2();
const partsSelected = [];

// Function to load the 3D Model with all its lighting and interactivity.
function loadModel(cameraLight1) {
    var loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    var loader = new GLTFLoader();
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    loader.load('/Models/model.gltf', function(gltf) {
        loadingSpinner.style.display = 'none';
        if (model) {
            scene.remove(model); // Remove previous model if it exists
        }
        model = gltf.scene;
        model.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(model);

        model.scale.set(24, 24, 24);
        model.position.set(0, -2.5, 0);

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
    camera.updateProjectionMatrix();
}

function onMouseClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(model.children, true);

    if (intersects.length > 0) {
        const selectedPart = intersects[0].object; // The first intersected object
        
        if (selectedPart.isMesh) {
            if (selectedPart.material.color.getHexString() === '1a8bb9') {
                selectedPart.material.color.set('#a6a6a6');
                const index = partsSelected.indexOf(selectedPart);
                if (index > -1) {
                    partsSelected.splice(index, 1);
                }
                console.log('Unselected part:', selectedPart.name);
            } else {
                selectedPart.material = selectedPart.material.clone();
                selectedPart.material.color.set('#1a8bb9');
                partsSelected.push(selectedPart);
                console.log('Selected part:', selectedPart.name);
            }
        }
    }
}

// Create the "That's all" button and the questionnaire dynamically
function createUI() {
    const body = document.body;

    // "That's all" button
    const thatsAllButton = document.createElement('button');
    thatsAllButton.id = 'thatsAllButton';
    thatsAllButton.innerText = "That's all";
    thatsAllButton.style.display = 'none';
    body.appendChild(thatsAllButton);

    // Questionnaire
    const questionnaire = document.createElement('div');
    questionnaire.id = 'questionnaire';
    questionnaire.style.display = 'none';
    questionnaire.innerHTML = `
        <h2>Answer these questions to determine the type of pain</h2>
        <p>Where do you feel the pain?</p>
        <input type="text" id="painLocation" placeholder="Enter location of pain">
        <p>How intense is the pain?</p>
        <input type="number" id="painIntensity" min="1" max="10" placeholder="Enter intensity from 1 to 10">
        <button id="submitAnswers">Submit</button>
    `;
    body.appendChild(questionnaire);
}

// Handle the "That's all" button click
document.addEventListener('DOMContentLoaded', function() {
    createUI();

    const thatsAllButton = document.getElementById('thatsAllButton');
    const questionnaire = document.getElementById('questionnaire');

    thatsAllButton.addEventListener('click', function() {
        if (partsSelected.length > 0) {
            questionnaire.style.display = 'block';
            thatsAllButton.style.display = 'none';
        } else {
            alert("Please select at least one part of the body before proceeding.");
        }
    });

    document.getElementById('submitAnswers').addEventListener('click', function() {
        const painLocation = document.getElementById('painLocation').value;
        const painIntensity = document.getElementById('painIntensity').value;

        if (!painLocation || !painIntensity) {
            alert("Please answer all the questions.");
        } else {
            console.log("Pain location:", painLocation);
            console.log("Pain intensity:", painIntensity);
            alert("Thank you for your answers!");

            questionnaire.style.display = 'none';
            partsSelected.length = 0;
        }
    });
});

// Handle the start button to initialize the scene
document.getElementById('startButton').addEventListener('click', function() {
    var leftContainer = document.getElementById('leftContainer');
    leftContainer.innerHTML = "<h1 class='instructions'>Select the part(s) of the body where you feel pain</h1>";
    leftContainer.style.paddingLeft = '7%';
    leftContainer.style.width = '25vw';
    leftContainer.style.backgroundColor = "black";
    leftContainer.style.color = "white";

    var rightContainer = document.getElementById('rightContainer');
    rightContainer.innerHTML = "<div id='threejs-container'><div id='loadingSpinner'></div></div>";

    document.getElementById('thatsAllButton').style.display = 'block';

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

document.addEventListener("DOMContentLoaded", function () {
    const openChatbot = document.getElementById("open-chatbot");
    const chatbotWindow = document.getElementById("chatbot-window");
    const closeChatbot = document.getElementById("close-chatbot");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const chatbotInput = document.getElementById("chatbot-input");
    const sendChatbot = document.getElementById("send-chatbot");

    openChatbot.addEventListener("click", () => {
        chatbotWindow.style.display = "flex";
    });

    closeChatbot.addEventListener("click", () => {
        chatbotWindow.style.display = "none";
    });

    sendChatbot.addEventListener("click", () => {
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            addMessage("You", userMessage);
            chatbotInput.value = "";

            // Mock response for now, replace with API call later
            setTimeout(() => {
                const botResponse = generateResponse(userMessage);
                addMessage("Bot", botResponse);
            }, 1000);
        }
    });

    function addMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.textContent = `${sender}: ${message}`;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function generateResponse(userMessage) {
        // Replace this with actual backend logic or API integration
        if (userMessage.toLowerCase().includes("symptom checker")) {
            return "The 3D Symptom Checker helps you identify areas of discomfort visually. Check it out in the 'What We Do' section.";
        } else if (userMessage.toLowerCase().includes("recommendation")) {
            return "Our Personalized Recommendations provide tailored advice based on your symptoms and medical history.";
        } else {
            return "I'm here to assist you! Ask me about any tool or service in 'Know Your Body.'";
        }
    }
});
