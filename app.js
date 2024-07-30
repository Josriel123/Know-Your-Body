document.getElementById('startButton').addEventListener('click', function() {
    // Create the general section dynamically
    var generalSection = document.createElement('div');
    generalSection.className = 'general-section';
    generalSection.innerHTML = '<p>Here will be the 3D model so the user can interact with it</p>';
    
    // Append the section to the body
    document.body.appendChild(generalSection);
    
    // Display the section and scroll into view
    generalSection.style.display = 'flex';
    generalSection.scrollIntoView({ behavior: 'smooth' });
});