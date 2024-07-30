document.getElementById('startButton').addEventListener('click', function() {
    var generalSection = document.getElementById('generalSection');
    generalSection.style.display = 'flex';
    generalSection.scrollIntoView({ behavior: 'smooth' });

    // Lock scrolling
    lockScrollToSection(generalSection);
});

function lockScrollToSection(section) {
    var sectionTop = section.offsetTop;

    window.addEventListener('scroll', function() {
        if (window.scrollY < sectionTop) {
            window.scrollTo(0, sectionTop);
        }
    });
}