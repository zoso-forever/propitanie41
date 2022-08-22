export default function () {
    let passiveSupport = false;
    /* eslint-disable */
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: () => {
                passiveSupport = true;
            }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
    } catch (e) {}
    /* eslint-enable */

    return passiveSupport ? { passive: true } : false;
}
