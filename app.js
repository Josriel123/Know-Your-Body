// Declare variables outside the function to maintain state
let scene, camera, renderer, model;

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
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaOutput = true;
        container.appendChild(renderer.domElement);

        // Add a light
        var light = new THREE.AmbientLight("#85b2cd");
        var directionalLight = new THREE.DirectionalLight("#c1582d", 1);
        directionalLight.position.set(0, -70, 100).normalize();
        scene.add(light);
        scene.add(directionalLight);

        // Load the model
        var loader = new THREE.GLTFLoader();
        loader.load('Human 3D Models/scene.gltf', function(gltf) {
            console.log('Model loaded successfully'); // Debug log
            if (model) {
                scene.remove(model); // Remove previous model if it exists
            }
            model = gltf.scene;
            scene.add(model);

            // Adjust model scale and position if needed
            model.scale.set(2, 2, 2);
            model.position.set(0, -2, 0);

            // Render loop
            function animate() {
                requestAnimationFrame(animate);
                model.rotation.y += 0.01; // Rotate model
                renderer.render(scene, camera);
            }
            animate();
        }, undefined, function(error) {
            console.error('Error loading model:', error);
        });

        // Camera position
        camera.position.z = 5;

        // Handle window resize
        window.addEventListener('resize', function() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    } else {
        // Scene already exists, just update if necessary
        if (model) {
            scene.remove(model); // Remove previous model
        }
        // Load and add a new model
        var loader = new THREE.GLTFLoader();
        loader.load('Human 3D Models/scene.gltf', function(gltf) {
            console.log('Model loaded successfully'); // Debug log
            model = gltf.scene;
            scene.add(model);

            // Adjust model scale and position if needed
            model.scale.set(2, 2, 2);
            model.position.set(0, -2, 0);

            // Render loop
            function animate() {
                requestAnimationFrame(animate);
                model.rotation.y += 0.01; // Rotate model
                renderer.render(scene, camera);
            }
            animate();
        }, undefined, function(error) {
            console.error('Error loading model:', error);
        });
    }
});
