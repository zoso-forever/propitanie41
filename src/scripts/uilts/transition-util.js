export let transitionEndEvent = 'transitionend';

/* eslint-disable-next-line */
if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined)  {
    transitionEndEvent = 'WebkitTransitionEnd';
}

const raf = window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout;

export function nextFrame (fn) {
    raf(() => {
        raf(fn);
    });
}

export function onTransitionEnd (el) {
    return new Promise((resolve) => {
        const end = () => {
            el.removeEventListener(transitionEndEvent, onEnd);
            resolve(el);
        };

        const onEnd = e => {
            if (e.target === el) {
                end();
            }
        };

        el.addEventListener(transitionEndEvent, onEnd);
    });
}
