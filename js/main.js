function TopBarRespond() {
    toggleMenu();
}

//select DOM items
const closeMenuBtn = document.querySelector('.close-menu-btn');
const menu = document.querySelector('.side-menu');
const menuNav = document.querySelector('.menu');
const navItems = document.querySelectorAll('.nav-item');
const contact = document.querySelector('.contact');

let showMenu = false;

//toggle the menu visibility
function toggleMenu() {
    if (!showMenu) {
        menu.classList.add('show');
        menuNav.classList.add('show');
        navItems.forEach(item => item.classList.add('show'));
        contact.classList.add('show');
        showMenu = true;
    } else {
        menu.classList.remove('show');
        menuNav.classList.remove('show');
        navItems.forEach(item => item.classList.remove('show'));
        contact.classList.remove('show');
        showMenu = false;
    }
}

//event listener for screen resizing
window.addEventListener('resize', function () {
    if (window.innerWidth > 1400) {
        // Remove 'show' class when screen size exceeds 1400px
        menu.classList.remove('show');
        menuNav.classList.remove('show');
        navItems.forEach(item => item.classList.remove('show'));
        contact.classList.remove('show');
        showMenu = false; // Update menu state
    }
});

//for the close button

if (showMenu) {
    closeMenuBtn.addEventListener('click', TopBarRespond);

}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////

var dropdownButtons = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdownButtons.length; i++) {
    var dropdownContainer = dropdownButtons[i].nextElementSibling; //get the dropdown container

    dropdownButtons[i].addEventListener("click", function (e) {
        e.stopPropagation();

        //find the dropdown container and toggle the show class
        var dropdownContainer = this.nextElementSibling;
        dropdownContainer.classList.toggle("show");
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
