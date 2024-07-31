document.getElementById('startButton').addEventListener('click', function() {
    var generalSection = document.getElementById('generalSection');
    generalSection.style.display = 'flex';

    // Add A-Frame scene dynamically
    generalSection.innerHTML = `
        <a-scene>
            <a-assets>
                <a-asset-item id="humanModel" src="Human 3D Models/scene.gltf"></a-asset-item>
            </a-assets>
            <a-camera position="0 1.6 3" orbit-controls="target: #humanModel"></a-camera>
            <a-entity id="humanModel" gltf-model="#humanModel" position="0 0 -3" rotation="0 45 0" scale="1 1 1"></a-entity>
            <a-sky color="#ECECEC"></a-sky>
        </a-scene>
    `;

    generalSection.scrollIntoView({ behavior: 'smooth' });
});