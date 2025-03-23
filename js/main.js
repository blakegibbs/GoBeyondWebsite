function TopBarRespond() {
    var x = document.getElementById("topNavBar");
    if (x.className === "topnav") {
        x.className += "responsive";
    } else {
        x.className = "topnav"
    }
}

//select DOM items
const menuButton = document.querySelector('.topnav a.icon')
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
const navItems = document.querySelectorAll('.nav-item');

//set initial state of the menu
let showMenu = false;

//enable the menu
function ToggleMenu() {
    if (!showMenu) {
        //show the menu
        menuButton.classList.add('close');
        menu.classList.add('show');
        menuNav.classList.add('show');
        navItems.forEach(item => item.classList.add('show'));

        //set the menu state
        showMenu = true;
    } else {
        //close the menu
        menuButton.classList.add('show');
        menu.classList.add('close');
        menuNav.classList.add('close');
        navItems.forEach(item => item.classList.add('close'));

        //set the menu state
        showMenu = false;
    }
}