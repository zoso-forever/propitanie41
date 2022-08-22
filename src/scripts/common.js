import svg4everybody from 'svg4everybody';
import SmoothScroll from 'smooth-scroll';
import throttle from 'lodash/throttle';
import passiveSupport from './uilts/passive-support';
import { nextFrame } from './uilts/transition-util';
import CitySelect from './modules/city-select';

window.SmoothScroll = SmoothScroll;

let lastScrollTop = 0;
let headerElement = null;

document.addEventListener('DOMContentLoaded', () => {
    headerElement = document.querySelector('.js-header');
    const guideToggleButton = document.querySelector('.js-guide-toggle');
    const guideCloseButton = document.querySelector('.js-guide-close');
    const guideElement = document.querySelector('.js-guide');

    guideCloseButton.addEventListener('click', () => {
        guideElement.classList.remove('guide--open');
    });

    guideToggleButton.addEventListener('click', () => {
        guideElement.classList.toggle('guide--open');
    });

    document.addEventListener('scrollStart', () => {
        guideElement.classList.remove('guide--open');
    }, false);

    nextFrame(onWindowResize);
    svg4everybody();

    document.addEventListener('scroll', throttle(handleScroll, 25), passiveSupport());
    window.addEventListener('resize', throttle(onWindowResize, 300), false);
    document.body.classList.add('is-loaded');

    const cityOptions = [
        {
            value: 'Петропавловск-Камчатский',
            label: 'Петропавловск-Камчатский'
        },
        {
            value: 'Елизово',
            label: 'Елизово'
        },
        {
            value: 'Завойко',
            label: 'Завойко'
        }
    ];

    const citySelectElements = document.querySelectorAll('.city-select');

    /* eslint-disable-next-line */
    const citySelects = Array.from(citySelectElements).map(element => {
        return new CitySelect(element, cityOptions).init();
    });

    const BASE_SCROLL_OFFSET = 40;
    /* eslint-disable-next-line */
    new SmoothScroll('a[href*="#"]', {
        header: null,
        speed: 500,
        speedAsDuration: true,
        offset (section) {
            const { top } = section.getBoundingClientRect();
            if (top < 0) {
                return headerElement.clientHeight + BASE_SCROLL_OFFSET;
            }
            return BASE_SCROLL_OFFSET;
        }
    });
});

function handleScroll () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const movesDown = scrollTop >= lastScrollTop;
    const isFixed = headerElement.classList.contains('header--is-fixed');
    const isVisible = headerElement.classList.contains('header--is-visible');
    const winHeight = window.innerHeight;

    if (scrollTop === lastScrollTop) {
        return;
    }

    if (scrollTop > winHeight / 2 && !isFixed) {
        headerElement.classList.add('header--is-fixed');
    } else if (scrollTop < winHeight / 2 && isFixed) {
        headerElement.classList.remove('header--is-fixed');
    }

    if ((scrollTop < winHeight || movesDown) && isVisible) {
        headerElement.classList.remove('header--is-visible');
    } else if (scrollTop > winHeight && !movesDown && !isVisible) {
        headerElement.classList.add('header--is-visible');
    }

    lastScrollTop = scrollTop;
}

function onWindowResize () {
    handleScroll();
}
