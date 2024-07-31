document.getElementById('startButton').addEventListener('click', function() {
    var generalSection = document.getElementById('generalSection');
    generalSection.style.display = 'flex';

    // Add A-Frame scene dynamically
    generalSection.innerHTML = `
        <a-scene>
            <a-assets>
                <a-asset-item id="human-model" src="Human 3D Models/scene.gltf"></a-asset-item>
            </a-assets>
            <a-camera position="0 1.6 2" orbit-controls="target: #human-model"></a-camera>
            <a-entity id="human-model" gltf-model="#human-model" position="0 0 -5" rotation="0 45 0"></a-entity>
            <a-sky color="#ECECEC"></a-sky>
        </a-scene>
    `;
    
    generalSection.scrollIntoView({ behavior: 'smooth' });
});