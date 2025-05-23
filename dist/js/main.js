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


let showAnswer = false;

const faqButtons = document.querySelectorAll('.faq-question');

function toggleAnswer(event) {
    const faqButton = event.target; //get the specific clicked button
    const answer = faqButton.nextElementSibling;

    //toggle the 'active' class on the clicked faqButton
    faqButton.classList.toggle('active');

    //toggle the visibility of the answer
    if (faqButton.classList.contains('active')) {
        answer.style.display = 'block'; //show the answer
    } else {
        answer.style.display = 'none'; //hide the answer
    }
}

//add event listeners to each FAQ question button
faqButtons.forEach(faqButton => {
    faqButton.addEventListener('click', toggleAnswer);
});


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
            const targetPosition = targetSlide.offsetLeft; //get the left offset of the target slide

            //set the scroll position of the slider container to target the clicked image
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

    if (!container || !nxtBtn || !preBtn) {
        console.warn("Slider missing container or buttons:", slider);
        return;
    }

    let cardWidth = 0; //calculated in setupSlider
    let numOriginals = 0; //calculated in setupSlider
    let isScrolling = false; //flag to prevent rapid clicks during animation
    let clonesPrepended = 0;
    let clonesAppended = 0;

    const setupSlider = () => {
        isScrolling = false;
        container.style.scrollBehavior = 'auto'; //disable smooth scroll during setup

        //clear previous clones and state
        const clones = container.querySelectorAll('.clone');
        clones.forEach(clone => clone.remove());
        const originalCards = Array.from(container.children).filter(el => !el.classList.contains('clone')); //ensure only originals
        numOriginals = originalCards.length;

        if (numOriginals === 0) {
            console.warn("No holiday cards found in container:", container);
            if (nxtBtn) nxtBtn.style.display = 'none';
            if (preBtn) preBtn.style.display = 'none';
            return;
        }

        //get number of clones needed (enough to fill viewport + buffer)
        //this is more complex if card widths vary, assume fixed for now
        const firstCardForWidth = originalCards[0];
        const cardStyle = window.getComputedStyle(firstCardForWidth);
        const marginLeft = parseFloat(cardStyle.marginLeft);
        const marginRight = parseFloat(cardStyle.marginRight);
        //use getBoundingClientRect for potentially more accuracy with transforms/box-sizing
        cardWidth = firstCardForWidth.getBoundingClientRect().width + marginLeft + marginRight;

        if (cardWidth <= 0) {
            console.error("Card width is zero or negative. Cannot setup slider:", slider);
            //try offsetWidth as fallback
            cardWidth = firstCardForWidth.offsetWidth + marginLeft + marginRight;
            if (cardWidth <= 0) {
                console.error("Fallback card width also zero. Aborting.");
                if (nxtBtn) nxtBtn.style.display = 'none';
                if (preBtn) preBtn.style.display = 'none';
                return;
            }
        }


        const containerWidth = container.clientWidth;
        //calculate how many clones are needed to safely cover the wrap-around
        //at least enough to fill the visible area. Add 1-2 for buffer.
        clonesNeeded = Math.ceil(containerWidth / cardWidth) + 2; //need this many on each side
        clonesNeeded = Math.min(clonesNeeded, numOriginals); //dont need more clones than originals

        //clone from ends
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
        clonesAppended = cardsToAppend.length; //should be same as clonesNeeded

        //scroll instantly to the start of the *original* content area
        const initialScroll = cardWidth * clonesPrepended;
        console.log(`Initial Setup: numOriginals=${numOriginals}, cardWidth=${cardWidth.toFixed(2)}, clonesPrepended=${clonesPrepended}, initialScroll=${initialScroll.toFixed(2)}`);
        container.scrollTo({
            left: initialScroll,
            behavior: 'auto' //INSTANT
        });

        const totalWidth = container.scrollWidth;
        const isScrollable = totalWidth > container.clientWidth + 5; //add tolerance
        console.log(`Total width: ${totalWidth.toFixed(2)}, Client width: ${container.clientWidth.toFixed(2)}, Is Scrollable: ${isScrollable}`);
        if (nxtBtn) nxtBtn.style.display = isScrollable ? 'block' : 'none';
        if (preBtn) preBtn.style.display = isScrollable ? 'block' : 'none';

        //re-enable smooth scroll for user interaction AFTER setup jump
        //use a tiny timeout to ensure the instant scroll finishes processing
        setTimeout(() => {
            container.style.scrollBehavior = 'smooth';
        }, 0);

    };


    const handleScrollEnd = () => {
        if (!isScrolling) return; //only handle jumps after programmatic scroll

        //define the boundaries (scrollLeft values)
        const firstOriginalStart = cardWidth * clonesPrepended;
        //start of the appended clones (position AFTER the last original card)
        const firstAppendedStart = cardWidth * (clonesPrepended + numOriginals);
        //use a tolerance around the boundaries
        const tolerance = cardWidth * 0.5; //allow landing halfway into the boundary card

        console.log(`ScrollEnd: scrollLeft=${container.scrollLeft.toFixed(2)}`);
        console.log(`Boundaries: firstOriginalStart=${firstOriginalStart.toFixed(2)}, firstAppendedStart=${firstAppendedStart.toFixed(2)}`);

        let jumped = false;
        //check if we landed in the appended clones area
        if (container.scrollLeft >= firstAppendedStart - tolerance) {
            const newScrollLeft = container.scrollLeft - (numOriginals * cardWidth);
            console.log(`Wrap Forward Detected: Jumping from ${container.scrollLeft.toFixed(2)} to ${newScrollLeft.toFixed(2)}`);
            container.style.scrollBehavior = 'auto'; //disable smooth for the jump
            container.scrollTo({ left: newScrollLeft, behavior: 'auto' });
            jumped = true;
        }
        //check if we landed in the prepended clones area
        else if (container.scrollLeft < firstOriginalStart - tolerance) {
            const newScrollLeft = container.scrollLeft + (numOriginals * cardWidth);
            console.log(`Wrap Backward Detected: Jumping from ${container.scrollLeft.toFixed(2)} to ${newScrollLeft.toFixed(2)}`);
            container.style.scrollBehavior = 'auto'; //disable smooth for the jump
            container.scrollTo({ left: newScrollLeft, behavior: 'auto' });
            jumped = true;
        }

        //re-enable smooth scrolling if we jumped, using a timeout
        if (jumped) {
            setTimeout(() => {
                container.style.scrollBehavior = 'smooth';
                isScrolling = false; //allow next click AFTER jump settles
            }, 0); //small delay needed for browser to process the instant jump
        } else {
            isScrolling = false; //allow next click if no jump occurred
        }
    }

    //use 'scrollend' if available, otherwise fallback needed (more complex)
    if ('onscrollend' in window) {
        container.addEventListener('scrollend', handleScrollEnd);
    } else {
        console.warn("Browser does not support 'scrollend'. Infinite loop jump might be noticeable or slightly delayed (fallback needed).");
        //basic timeout fallback (less reliable than scrollend)
        let scrollTimeout;
        container.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScrollEnd, 150); //adjust delay as needed
        }, { passive: true });
    }


    nxtBtn.addEventListener('click', () => {
        if (isScrolling || cardWidth <= 0) return;
        isScrolling = true;
        console.log("Next Clicked");
        //scroll by one card width
        container.scrollBy({
            left: cardWidth,
            //behavior: 'smooth' // Smooth is now set via CSS/style property
        });
    });

    preBtn.addEventListener('click', () => {
        if (isScrolling || cardWidth <= 0) return;
        isScrolling = true;
        console.log("Prev Clicked");
        //scroll by one card width
        container.scrollBy({
            left: -cardWidth,
            //behavior: 'smooth' // Smooth is now set via CSS/style property
        });
    });

    //use requestAnimationFrame or setTimeout to ensure layout is ready
    const init = () => {
        //needs robust cardWidth calculation, maybe wait for images?
        //simplest is timeout
        setTimeout(setupSlider, 100); //increased delay slightly
    }
    init();


    //re-run setup on resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        //temporarily disable smooth scroll during resize adjustments
        //container.style.scrollBehavior = 'auto';
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log("Resizing slider...");
            setupSlider(); //this recalculates widths, clones, and resets position
        }, 250);
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const memberSliders = document.querySelectorAll('.member-slider');

memberSliders.forEach(slider => {
    const container = slider.querySelector('.member-container');
    const nxtBtn = slider.querySelector('.nxt-btn');
    const preBtn = slider.querySelector('.pre-btn');

    if (!container || !nxtBtn || !preBtn) {
        console.warn("Slider missing container or buttons:", slider);
        return;
    }

    let cardWidth = 0;
    let numOriginals = 0;
    let isScrolling = false;
    let clonesPrepended = 0;
    let clonesAppended = 0;

    const setupSlider = () => {
        isScrolling = false;
        container.style.scrollBehavior = 'auto';


        const clones = container.querySelectorAll('.clone');
        clones.forEach(clone => clone.remove());
        const originalCards = Array.from(container.children).filter(el => !el.classList.contains('clone'));
        numOriginals = originalCards.length;

        if (numOriginals === 0) {
            console.warn("No member cards found in container:", container);
            if (nxtBtn) nxtBtn.style.display = 'none';
            if (preBtn) preBtn.style.display = 'none';
            return;
        }

        const firstCardForWidth = originalCards[0];
        const cardStyle = window.getComputedStyle(firstCardForWidth);
        const marginLeft = parseFloat(cardStyle.marginLeft);
        const marginRight = parseFloat(cardStyle.marginRight);
        cardWidth = firstCardForWidth.getBoundingClientRect().width + marginLeft + marginRight;

        if (cardWidth <= 0) {
            console.error("Card width is zero or negative. Cannot setup slider:", slider);
            cardWidth = firstCardForWidth.offsetWidth + marginLeft + marginRight;
            if (cardWidth <= 0) {
                console.error("Fallback card width also zero. Aborting.");
                if (nxtBtn) nxtBtn.style.display = 'none';
                if (preBtn) preBtn.style.display = 'none';
                return;
            }
        }

        const containerWidth = container.clientWidth;
        let clonesNeeded = Math.ceil(containerWidth / cardWidth) + 2;
        clonesNeeded = Math.min(clonesNeeded, numOriginals);

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
        clonesAppended = cardsToAppend.length;

        const initialScroll = cardWidth * clonesPrepended;
        console.log(`Initial Setup: numOriginals=${numOriginals}, cardWidth=${cardWidth.toFixed(2)}, clonesPrepended=${clonesPrepended}, initialScroll=${initialScroll.toFixed(2)}`);
        container.scrollTo({
            left: initialScroll,
            behavior: 'auto'
        });

        const totalWidth = container.scrollWidth;
        const isScrollable = totalWidth > container.clientWidth + 5;
        console.log(`Total width: ${totalWidth.toFixed(2)}, Client width: ${container.clientWidth.toFixed(2)}, Is Scrollable: ${isScrollable}`);
        if (nxtBtn) nxtBtn.style.display = isScrollable ? 'block' : 'none';
        if (preBtn) preBtn.style.display = isScrollable ? 'block' : 'none';

        setTimeout(() => {
            container.style.scrollBehavior = 'smooth';
        }, 0);
    };

    const handleScrollEnd = () => {
        if (!isScrolling) return;

        const firstOriginalStart = cardWidth * clonesPrepended;
        const firstAppendedStart = cardWidth * (clonesPrepended + numOriginals);
        const tolerance = cardWidth * 0.5;

        console.log(`ScrollEnd: scrollLeft=${container.scrollLeft.toFixed(2)}`);
        console.log(`Boundaries: firstOriginalStart=${firstOriginalStart.toFixed(2)}, firstAppendedStart=${firstAppendedStart.toFixed(2)}`);

        let jumped = false;
        if (container.scrollLeft >= firstAppendedStart - tolerance) {
            const newScrollLeft = container.scrollLeft - (numOriginals * cardWidth);
            console.log(`Wrap Forward Detected: Jumping from ${container.scrollLeft.toFixed(2)} to ${newScrollLeft.toFixed(2)}`);
            container.style.scrollBehavior = 'auto';
            container.scrollTo({ left: newScrollLeft, behavior: 'auto' });
            jumped = true;
        } else if (container.scrollLeft < firstOriginalStart - tolerance) {
            const newScrollLeft = container.scrollLeft + (numOriginals * cardWidth);
            console.log(`Wrap Backward Detected: Jumping from ${container.scrollLeft.toFixed(2)} to ${newScrollLeft.toFixed(2)}`);
            container.style.scrollBehavior = 'auto';
            container.scrollTo({ left: newScrollLeft, behavior: 'auto' });
            jumped = true;
        }

        if (jumped) {
            setTimeout(() => {
                container.style.scrollBehavior = 'smooth';
                isScrolling = false;
            }, 0);
        } else {
            isScrolling = false;
        }
    };

    if ('onscrollend' in window) {
        container.addEventListener('scrollend', handleScrollEnd);
    } else {
        console.warn("Browser does not support 'scrollend'.");
        let scrollTimeout;
        container.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScrollEnd, 150);
        }, { passive: true });
    }

    nxtBtn.addEventListener('click', () => {
        if (isScrolling || cardWidth <= 0) return;
        isScrolling = true;
        console.log("Next Clicked");
        container.scrollBy({
            left: cardWidth,
        });
    });

    preBtn.addEventListener('click', () => {
        if (isScrolling || cardWidth <= 0) return;
        isScrolling = true;
        console.log("Prev Clicked");
        container.scrollBy({
            left: -cardWidth,
        });
    });

    const init = () => {
        setTimeout(setupSlider, 100);
    };
    init();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log("Resizing slider...");
            setupSlider();
        }, 250);
    });
});

/////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');

    //function to open the lightbox
    const openLightbox = (imageUrl) => {
        lightboxImage.src = imageUrl;
        lightboxOverlay.classList.add('active');
    };

    //function to close the lightbox
    const closeLightbox = () => {
        lightboxOverlay.classList.remove('active');
        lightboxImage.src = ""; //clear the src to stop loading if closing quickly
    };

    //add click listener to each gallery image
    galleryItems.forEach(item => {
        item.addEventListener('click', (event) => {
            //use the data attribute for the full-size image URL
            const fullsizeUrl = event.target.dataset.fullsizeSrc;
            if (fullsizeUrl) {
                openLightbox(fullsizeUrl);
            } else {
                console.error('Data attribute data-fullsize-src not found on image:', item);
            }
        });

        //add keypress listener for Enter/Space for accessibility
        item.parentElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); //prevent default space scroll
                const fullsizeUrl = item.dataset.fullsizeSrc;
                if (fullsizeUrl) {
                    openLightbox(fullsizeUrl);
                }
            }
        });
        //make parent focusable if img itself isn't naturally
        item.parentElement.setAttribute('tabindex', '0');

    });

    //add click listener to the close button
    lightboxClose.addEventListener('click', closeLightbox);

    //add click listener to the overlay (to close when clicking outside the image)
    lightboxOverlay.addEventListener('click', (event) => {
        //check if the click was directly on the overlay, not the container/image/button
        if (event.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    //add keyboard listener for the Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
            closeLightbox();
        }
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // IMPORTANT: Prevent default form submission

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            //show sending status
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formStatus.textContent = ''; //clear previous status
            formStatus.style.color = 'inherit';

            const formData = new FormData(contactForm);
            const formProps = Object.fromEntries(formData); //convert FormData to plain object

            try {
                const response = await fetch(contactForm.action, { //use form's action URL
                    method: 'POST',
                    body: JSON.stringify(formProps), //send data as JSON
                    headers: {
                        'Accept': 'application/json', // IMPORTANT: Tell Formspree to reply with JSON
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    //formspree successful response (usually {ok: true})
                    formStatus.textContent = "Thank you! Your message has been sent successfully.";
                    formStatus.style.color = 'green';
                    contactForm.reset(); //clear the form fields
                } else {
                    //attempt to get error details from Formspree response
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            //display validation errors from Formspree if any
                            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.textContent = 'Oops! There was a problem submitting your form.';
                        }
                        formStatus.style.color = 'red';
                    }).catch(error => {
                        //handle cases where response is not valid JSON
                        formStatus.textContent = 'Oops! There was a problem submitting your form. Server error.';
                        formStatus.style.color = 'red';
                        console.error("Non-JSON error response:", error);
                    });
                }
            } catch (error) {
                //network error or other fetch issue
                console.error('Submission error:', error);
                formStatus.textContent = 'Network error. Please check your connection and try again.';
                formStatus.style.color = 'red';
            } finally {
                //restore button state regardless of success/error
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});