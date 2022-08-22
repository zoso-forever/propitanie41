import passiveSupport from '../uilts/passive-support';
import getGeometry from '../uilts/get-geometry';
import throttle from 'lodash/throttle';

const ACTIVE_CLASS = 'appear-animation--is-visible';

function getElementGeometry (el) {
    const rect = getGeometry(el);
    return { el, rect };
}

document.addEventListener('DOMContentLoaded', () => {
    const elements = Array.from(document.querySelectorAll('.appear-animation'));
    let viewportHeight = window.innerHeight;
    let viewportOffset = viewportHeight / 7;
    let elementsGeometry = elements.map(getElementGeometry);

    function handleScroll () {
        elementsGeometry.forEach((entry, index) => {
            const inView = isInView(entry);

            if (inView) {
                entry.el.classList.add(ACTIVE_CLASS);
                elements.splice(index, 1);
                elementsGeometry.splice(index, 1);
            }
        });
    }

    function isInView ({ el, rect }) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elemTop = rect.top;
        const elemBottom = rect.bottom;

        const threshold = scrollTop + viewportHeight;
        const onTop = threshold < elemTop + rect.height / 2;

        const topVisible = onTop && threshold >= elemTop + viewportOffset;
        const bottomVisible = !onTop && threshold <= elemBottom + viewportHeight - viewportOffset;
        const hasClass = el.classList.contains(ACTIVE_CLASS);

        return !hasClass && (topVisible || bottomVisible);
    }

    function onResize () {
        viewportHeight = window.innerHeight;
        viewportOffset = viewportHeight / 7;
        elementsGeometry = elements.map(getElementGeometry);
        handleScroll();
    }

    document.addEventListener(
        'scroll',
        handleScroll,
        passiveSupport()
    );

    window.addEventListener('resize', throttle(onResize, 300), false);
    setTimeout(handleScroll, 100);
});
