import Glide, { Breakpoints, Controls, Swipe } from '@glidejs/glide/dist/glide.modular.esm';
import TabsManager from './modules/tabs-manager';
import Collapsible from './modules/collapsible';
import Spinner from './modules/spinner';
import SubscribeManager from './modules/subscribe-manager';
import './modules/appear-animation';
import { getStorageRecord } from './uilts/local-storage';
import throttle from 'lodash/throttle';

const subscribeManager = new SubscribeManager();
subscribeManager.init();

const heroCarousel = new Glide('.hero__carousel', {
    type: 'slider',
    gap: 0,
    animationDuration: 850,
    animationTimingFunc: 'cubic-bezier(.48, 0, .12, 1)',
    breakpoints: {
        999: {
            animationDuration: 550
        }
    }
}).mount({ Breakpoints, Swipe });

const heroCarouseleElement = document.querySelector('.js-hero-carousel');
const carouselPagination = Array.from(
    heroCarouseleElement.querySelectorAll('.hero__pagination-step')
);
const heroSlides = Array.from(
    heroCarouseleElement.querySelectorAll('.hero__slide')
);

heroCarousel.on('run', () => {
    const { index } = heroCarousel;
    const step = carouselPagination[index];
    const slide = heroSlides[index];

    carouselPagination.forEach(el => {
        el.classList.remove('hero__pagination-step--is-active');
    });
    heroSlides.forEach(el => {
        el.classList.remove('hero__slide--appear');
    });

    setTimeout(() => {
        slide.classList.add('hero__slide--appear');
        step.classList.add('hero__pagination-step--is-active');
    }, 300);
});

carouselPagination.forEach((element, index) => {
    element.addEventListener('click', () => {
        if (index !== heroCarousel.index) {
            heroCarousel.go(`=${index}`);
        }
    });
});

new Glide('.reviews__carousel', {
    type: 'slider',
    gap: 10,
    perView: 4,
    bound: true,
    breakpoints: {
        999: {
            perView: 1,
            gap: 25
        }
    },
    classes: {
        nav: {
            active: 'reviews__pagination-step--is-active'
        }
    }
}).mount({ Breakpoints, Controls, Swipe });

document.addEventListener('DOMContentLoaded', () => {
    const faqTabs = new TabsManager('.js-faq-tabs');
    faqTabs.init();

    const faqCollapsible = Array.from(document.querySelectorAll('.collapsible'));

    for (const collapsibleElement of faqCollapsible) {
        const collapsible = new Collapsible(collapsibleElement);
        collapsible.init();
    }

    const heroCarouselElement = document.querySelector('.js-hero-carousel');
    const scrollDownButton = heroCarouselElement.querySelector('.js-scroll-down');
    const smoothScroll = new window.SmoothScroll(null, {
        speed: 900,
        speedAsDuration: true
    });

    scrollDownButton.addEventListener('click', () => {
        smoothScroll.animateScroll(heroCarouselElement.clientHeight);
    });
});

const weekMenuTabs = new TabsManager('.js-week-menu-tabs');
weekMenuTabs.init();

const panelClasses = Array.from({ length: 5 }, (_, i) => `.js-menu-carousel-${i + 1}`);

const menuCarouselSettings = {
    type: 'slider',
    gap: 30,
    perView: 3,
    bound: true,
    dragThreshold: false,
    animationDuration: 600,
    peek: 15,
    breakpoints: {
        1599: {
            gap: 10,
            peek: 10
        },
        999: {
            animationDuration: 400,
            perView: 1,
            gap: 16
        }
    },
    classes: {
        nav: {
            active: 'menu-carousel__pagination-step--is-active'
        }
    }
};

function createMenuCarousel (selector) {
    return new Glide(`${selector} .glide`, menuCarouselSettings).mount({
        Breakpoints,
        Controls,
        Swipe
    });
}

const menuCarouselElements = panelClasses.map((selector, index) => {
    const carousel = index === 0 ? createMenuCarousel(selector) : null;
    return { selector, carousel };
});

weekMenuTabs.afterChange((newIndex, oldIndex) => {
    menuCarouselElements[oldIndex].carousel.destroy();
    const { selector } = menuCarouselElements[newIndex];
    menuCarouselElements[newIndex].carousel = createMenuCarousel(selector);
});

const cartButton = document.querySelector('.cart-button');
const cartAmount = cartButton.querySelector('.cart-button__amount');
const dietCards = Array.from(document.querySelectorAll('.diet-card'));

const getStorageCart = () => getStorageRecord('cart', []);

updateCartButton(getStorageCart());

function updateCartButton (cart = []) {
    const amount = cart.length;
    cartAmount.textContent = String(amount);
    const containsEmptyClass = cartButton.classList.contains('cart-button--empty');

    if (containsEmptyClass && amount !== 0) {
        cartButton.classList.remove('cart-button--empty');
    } else if (!containsEmptyClass && amount === 0) {
        cartButton.classList.add('cart-button--empty');
    }
}

dietCards.forEach(card => {
    try {
        const dietData = JSON.parse(card.dataset.diet);
        const spinnerElement = card.querySelector('.spinner');
        const addToCartElement = card.querySelector('.js-add-to-cart');
        const amountSpinner = new Spinner({ el: spinnerElement, min: 1 });

        addToCartElement.addEventListener('click', () => {
            subscribeManager.stopTimeout();
            const cart = getStorageCart();
            const diet = cart.find(({ name }) => name === dietData.name);
            const currentAmount = diet ? diet.amount : 0;
            const newAmount = currentAmount + amountSpinner.getValue;

            if (!diet) {
                cart.push({ ...dietData, amount: newAmount });
            } else {
                diet.amount = newAmount;
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            amountSpinner.setValue(1);

            updateCartButton(cart);
        });
    } catch (error) {
        /* eslint-disable-next-line */
        console.error('An error has occured while parsing diet data attribute', error);
    }
});

const dietCardHeaders = Array.from(document.querySelectorAll('.diet-card__header'));

window.addEventListener('resize', throttle(udpateDietCardsHeaderHeight, 300), false);

udpateDietCardsHeaderHeight();

function udpateDietCardsHeaderHeight () {
    dietCardHeaders.forEach(header => {
        header.style.minHeight = 'auto';
    });
    const highestHeader = dietCardHeaders.reduce((acc, header) => {
        if (header.clientHeight > acc) {
            return header.clientHeight;
        }
        return acc;
    }, 0);
    dietCardHeaders.forEach(header => {
        header.style.minHeight = `${highestHeader}px`;
    });
}

const subscribeForms = Array.from(
    document.querySelectorAll('.js-subscribe-form')
);

function toggleDisableState (elements, state) {
    Array.from(elements).forEach(element => {
        element.disabled = state;
    });
}

async function handleSubscribeSubmit (e) {
    e.preventDefault();
    const subscribeForm = e.target;
    const { elements } = subscribeForm;
    const emailField = elements.email;
    toggleDisableState(elements, true);

    try {
        await subscribeManager.subscribe(emailField.value);
        subscribeForm.reset();
    } catch (error) {
        /* eslint-disable-next-line no-console */
        console.error(error);
    } finally {
        toggleDisableState(elements, false);
    }
}

subscribeForms.forEach(form => {
    form.addEventListener('submit', handleSubscribeSubmit);
});
