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

document.querySelectorAll('.slider-nav a').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default anchor behavior

        const slideIndex = this.getAttribute('data-slide'); // Get the target slide index
        const targetSlide = document.getElementById(`slide-${slideIndex}`); // Find the target slide image

        // Scroll the slider to the target image
        targetSlide.scrollIntoView({
            behavior: 'smooth', // Smooth scroll
            block: 'nearest',   // Scroll to the nearest side of the element
            inline: 'start'     // Align to the start of the container
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slider img');
    const navLinks = document.querySelectorAll('.slider-nav a'); //select all nav links
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoScrollInterval = 7000; // Time until next slide (ms)
    let autoScrollTimer;

    //scroll to the next slide
    function scrollToNextSlide() {
        if (currentIndex === slideCount - 1) {
            currentIndex = 0;  //if at last slide, return to start
        } else {
            currentIndex = currentIndex + 1;  //else continue to the next slide
        }
        const targetSlide = slides[currentIndex];

        targetSlide.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
    }

    //set to auto scroll every x seconds
    function startAutoScroll() {
        clearInterval(autoScrollTimer); //clear any existing timer
        autoScrollTimer = setInterval(scrollToNextSlide, autoScrollInterval); //start a new timer
    }

    //clicking a navigation link
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); //prevent the default link behavior
            currentIndex = index;  //set currentIndex to the clicked link index
            const targetSlide = slides[currentIndex];

            targetSlide.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });

            startAutoScroll(); //reset the auto scroll timer after manual navigation
        });
    });

    startAutoScroll(); //start auto scroll when the page loads
});
