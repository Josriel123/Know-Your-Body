document.getElementById('burgerMenu').addEventListener('click', function() {
    var navMenu = document.getElementById('navMenu');
    if (navMenu.style.display === 'block') {
        navMenu.style.display = 'none';
    } else {
        naveMenu.style.display = 'block';
    }
});