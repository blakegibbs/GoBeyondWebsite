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

const holidaySliders = document.querySelectorAll('.holiday-slider');

holidaySliders.forEach(slider => {
    const container = slider.querySelector('.holiday-container');
    const nxtBtn = slider.querySelector('.nxt-btn');
    const preBtn = slider.querySelector('.pre-btn');

    // Check if elements exist
    if (!container || !nxtBtn || !preBtn) {
        console.warn("Slider missing container or buttons:", slider);
        return;
    }

    let cardWidth = 0; // Calculated in setupSlider
    let numOriginals = 0; // Calculated in setupSlider
    let isScrolling = false; // Flag to prevent rapid clicks during animation
    let clonesPrepended = 0;
    let clonesAppended = 0;

    const setupSlider = () => {
        isScrolling = false;
        container.style.scrollBehavior = 'auto'; // Disable smooth scroll during setup

        // --- 1. Cloning ---
        // Clear previous clones and state
        const clones = container.querySelectorAll('.clone');
        clones.forEach(clone => clone.remove());
        const originalCards = Array.from(container.children).filter(el => !el.classList.contains('clone')); // Ensure we only get originals
        numOriginals = originalCards.length;

        if (numOriginals === 0) {
            console.warn("No holiday cards found in container:", container);
            if (nxtBtn) nxtBtn.style.display = 'none';
            if (preBtn) preBtn.style.display = 'none';
            return;
        }

        // Determine number of clones needed (enough to fill viewport + buffer)
        // This is more complex if card widths vary, assume fixed for now
        const firstCardForWidth = originalCards[0];
        const cardStyle = window.getComputedStyle(firstCardForWidth);
        const marginLeft = parseFloat(cardStyle.marginLeft);
        const marginRight = parseFloat(cardStyle.marginRight);
        // Use getBoundingClientRect for potentially more accuracy with transforms/box-sizing
        cardWidth = firstCardForWidth.getBoundingClientRect().width + marginLeft + marginRight;

        if (cardWidth <= 0) {
            console.error("Card width is zero or negative. Cannot setup slider:", slider);
            // Try offsetWidth as fallback
            cardWidth = firstCardForWidth.offsetWidth + marginLeft + marginRight;
            if (cardWidth <= 0) {
                console.error("Fallback card width also zero. Aborting.");
                if (nxtBtn) nxtBtn.style.display = 'none';
                if (preBtn) preBtn.style.display = 'none';
                return;
            }
        }


        const containerWidth = container.clientWidth;
        // Calculate how many clones are needed to safely cover the wrap-around
        // At least enough to fill the visible area. Add 1-2 for buffer.
        clonesNeeded = Math.ceil(containerWidth / cardWidth) + 2; // Need this many on each side
        clonesNeeded = Math.min(clonesNeeded, numOriginals); // Don't need more clones than originals

        // Clone from ends
        const cardsToPrepend = originalCards.slice(-clonesNeeded).map(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone', 'clone-prepended');
            return clone;
        });
        const cardsToAppend = originalCards.slice(0, clonesNeeded).map(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('clone', 'clone-appended');
            return clone;
        });

        container.prepend(...cardsToPrepend);
        container.append(...cardsToAppend);

        clonesPrepended = cardsToPrepend.length;
        clonesAppended = cardsToAppend.length; // Should be same as clonesNeeded

        // --- 2. Initial Position ---
        // Scroll instantly to the start of the *original* content area
        const initialScroll = cardWidth * clonesPrepended;
        console.log(`Initial Setup: numOriginals=${numOriginals}, cardWidth=${cardWidth.toFixed(2)}, clonesPrepended=${clonesPrepended}, initialScroll=${initialScroll.toFixed(2)}`);
        container.scrollTo({
            left: initialScroll,
            behavior: 'auto' // INSTANT
        });

        // --- 3. Check Scrollability ---
        const totalWidth = container.scrollWidth;
        const isScrollable = totalWidth > container.clientWidth + 5; // Add tolerance
        console.log(`Total width: ${totalWidth.toFixed(2)}, Client width: ${container.clientWidth.toFixed(2)}, Is Scrollable: ${isScrollable}`);
        if (nxtBtn) nxtBtn.style.display = isScrollable ? 'block' : 'none';
        if (preBtn) preBtn.style.display = isScrollable ? 'block' : 'none';

        // Re-enable smooth scroll for user interaction AFTER setup jump
        // Use a tiny timeout to ensure the instant scroll finishes processing
        setTimeout(() => {
            container.style.scrollBehavior = 'smooth';
        }, 0);

    };


    const handleScrollEnd = () => {
        if (!isScrolling) return; // Only handle jumps after programmatic scroll

        // Define the boundaries (scrollLeft values)
        const firstOriginalStart = cardWidth * clonesPrepended;
        // Start of the appended clones (position AFTER the last original card)
        const firstAppendedStart = cardWidth * (clonesPrepended + numOriginals);
        // Use a tolerance around the boundaries
        const tolerance = cardWidth * 0.5; // Allow landing halfway into the boundary card

        console.log(`ScrollEnd: scrollLeft=${container.scrollLeft.toFixed(2)}`);
        console.log(`Boundaries: firstOriginalStart=${firstOriginalStart.toFixed(2)}, firstAppendedStart=${firstAppendedStart.toFixed(2)}`);

        let jumped = false;
        // Check if we landed in the appended clones area
        if (container.scrollLeft >= firstAppendedStart - tolerance) {
            const newScrollLeft = container.scrollLeft - (numOriginals * cardWidth);
            console.log(`Wrap Forward Detected: Jumping from ${container.scrollLeft.toFixed(2)} to ${newScrollLeft.toFixed(2)}`);
            container.style.scrollBehavior = 'auto'; // Disable smooth for the jump
            container.scrollTo({ left: newScrollLeft, behavior: 'auto' });
            jumped = true;
        }
        // Check if we landed in the prepended clones area
        else if (container.scrollLeft < firstOriginalStart - tolerance) {
            const newScrollLeft = container.scrollLeft + (numOriginals * cardWidth);
            console.log(`Wrap Backward Detected: Jumping from ${container.scrollLeft.toFixed(2)} to ${newScrollLeft.toFixed(2)}`);
            container.style.scrollBehavior = 'auto'; // Disable smooth for the jump
            container.scrollTo({ left: newScrollLeft, behavior: 'auto' });
            jumped = true;
        }

        // Re-enable smooth scrolling if we jumped, using a timeout
        if (jumped) {
            setTimeout(() => {
                container.style.scrollBehavior = 'smooth';
                isScrolling = false; // Allow next click AFTER jump settles
            }, 0); // Small delay needed for browser to process the instant jump
        } else {
            isScrolling = false; // Allow next click if no jump occurred
        }
    }

    // Use 'scrollend' if available, otherwise fallback needed (more complex)
    if ('onscrollend' in window) {
        container.addEventListener('scrollend', handleScrollEnd);
    } else {
        console.warn("Browser does not support 'scrollend'. Infinite loop jump might be noticeable or slightly delayed (fallback needed).");
        // Basic timeout fallback (less reliable than scrollend)
        let scrollTimeout;
        container.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScrollEnd, 150); // Adjust delay as needed
        }, { passive: true });
    }


    nxtBtn.addEventListener('click', () => {
        if (isScrolling || cardWidth <= 0) return;
        isScrolling = true;
        console.log("Next Clicked");
        // Scroll by one card width
        container.scrollBy({
            left: cardWidth,
            // behavior: 'smooth' // Smooth is now set via CSS/style property
        });
    });

    preBtn.addEventListener('click', () => {
        if (isScrolling || cardWidth <= 0) return;
        isScrolling = true;
        console.log("Prev Clicked");
        // Scroll by one card width
        container.scrollBy({
            left: -cardWidth,
            // behavior: 'smooth' // Smooth is now set via CSS/style property
        });
    });

    // --- Initial Setup & Resize ---
    // Use requestAnimationFrame or setTimeout to ensure layout is ready
    const init = () => {
        // Needs robust cardWidth calculation, maybe wait for images?
        // Simplest is timeout
        setTimeout(setupSlider, 100); // Increased delay slightly
    }
    init();


    // Re-run setup on resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Temporarily disable smooth scroll during resize adjustments
        // container.style.scrollBehavior = 'auto';
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log("Resizing slider...");
            setupSlider(); // This recalculates widths, clones, and resets position
        }, 250);
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////