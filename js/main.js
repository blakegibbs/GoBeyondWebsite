
function TopBarRespond() {
    toggleMenu();
}

//select DOM items
const closeMenuBtn = document.querySelector('.close-menu-btn');
const menu = document.querySelector('.side-menu');
const menuBranding = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-branding');
const navItems = document.querySelectorAll('.nav-item');

//set initial state of menu
let showMenu = false;

//menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
    if (!showMenu) {
        //closeMenuBtn.classList.add('show');
        menu.classList.add('show');
        menuNav.classList.add('show');
        menuBranding.classList.add('show');
        navItems.forEach(item => item.classList.add('show'));

        //set menu state
        showMenu = true;
    } else {
        //menuBtn.classList.remove('close');
        menu.classList.remove('show');
        menuNav.classList.remove('show');
        menuBranding.classList.remove('show');
        navItems.forEach(item => item.classList.remove('show'));

        //set menu state
        showMenu = false;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slider img');
    const navLinks = document.querySelectorAll('.slider-nav a'); //select all navigation links
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoScrollInterval = 7000; //time until next slide (ms)
    let autoScrollTimer; //variable to hold the timer

    //scroll to the next slide
    function scrollToNextSlide() {
        if (currentIndex === slideCount - 1) {
            currentIndex = 0; //if at last slide, return to start
        } else {
            currentIndex = currentIndex + 1; //else continue to the next slide
        }

        const targetSlide = slides[currentIndex];
        const targetPosition = targetSlide.offsetLeft; //get the left offset of the target slide

        // Set the scroll position of the slider container to target the next image
        slider.scrollTo({
            left: targetPosition,
            behavior: 'smooth'
        });

        updateActiveNav(); //update the active navigation link
    }

    //set to auto scroll every x seconds
    function startAutoScroll() {
        clearInterval(autoScrollTimer); //clear timer
        autoScrollTimer = setInterval(scrollToNextSlide, autoScrollInterval); //start a new timer
    }

    //update the active navigation link
    function updateActiveNav() {
        navLinks.forEach(link => link.classList.remove('active')); //remove active class from all
        navLinks[currentIndex].classList.add('active'); //add active class to the current link
    }

    //clicking navigation link
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); //prevent the default link behavior
            currentIndex = index; //set currentIndex to the clicked link index
            const targetSlide = slides[currentIndex];
            const targetPosition = targetSlide.offsetLeft; // Get the left offset of the target slide

            // Set the scroll position of the slider container to target the clicked image
            slider.scrollTo({
                left: targetPosition,
                behavior: 'smooth'
            });

            updateActiveNav(); //update the active navigation link
            startAutoScroll(); //reset the auto scroll timer after manual navigation
        });
    });

    updateActiveNav(); //set the first active navigation link
    startAutoScroll(); //start auto scroll when the page loads
});
