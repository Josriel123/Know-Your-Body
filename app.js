document.getElementById('startButton').addEventListener('click', function() {
    var generalSection = document.getElementById('generalSection');
    generalSection.style.display = 'flex';
    generalSection.scrollIntoView({ behavior: 'smooth' });
    
    // Adding interaction for the model parts
    document.querySelectorAll('[id^="body-part"]').forEach(function(part) {
        part.addEventListener('click', function() {
            part.setAttribute('scale', '2 2 2'); // Example: expand the part
        });
    });
});