export default function getGeometry (target) {
    const height = target.clientHeight;
    const width = target.clientWidth;

    let offsetTop = 0;
    let offsetLeft = 0;
    let node = target;

    do {
        if (!isNaN(node.offsetTop)) {
            offsetTop += node.offsetTop;
        }
        if (!isNaN(node.offsetLeft)) {
            offsetLeft += node.offsetLeft;
        }
        node = node.offsetParent;
    } while (node);

    return {
        top: offsetTop,
        right: offsetLeft + width,
        bottom: offsetTop + height,
        left: offsetLeft,
        height,
        width
    };
}
