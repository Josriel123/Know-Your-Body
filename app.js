document.getElementById('startButton').addEventListener('click', function() {
    var generalSection = document.getElementById('generalSection');
    generalSection.style.display = 'flex';
    generalSection.scrollIntoView({ behavior: 'smooth' });
});