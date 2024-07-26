document.getElementById('burgerMenu').addEventListener('click', function() {
    var navMenu = document.getElementById('navMenu');
    if (navMenu.style.left === '0px') {
        navMenu.style.left = '-30%'; //Hide the menu
    } else {
        navMenu.style.left = '0px'; // Showw the menu
    }
});