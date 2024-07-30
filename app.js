document.getElementById('startButton').addEventListener('click', function() {
    // Hide all content except the general-section
    document.getElementById('header').classList.add('hidden');
    document.getElementById('sloganContainer').classList.add('hidden');
    document.querySelector('.start').classList.add('hidden');
    
    var generalSection = document.getElementById('generalSection');
    generalSection.style.display = 'flex'; // Show the general-section
    generalSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to the general-section
});