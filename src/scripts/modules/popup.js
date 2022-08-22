import { onTransitionEnd, nextFrame } from '../uilts/transition-util';

class Popup {
    constructor (rootSelector) {
        this.root = document.querySelector(rootSelector);
        this.rootInner = this.root.querySelector('.popup__inner');
        this.closeButton = this.root.querySelector('.popup__close');
        this.isOpen = false;
        this._handleExternalClick = this._handleExternalClick.bind(this);
        this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
    }

    open () {
        if (this.isOpen) {
            return;
        }

        this.isOpen = true;
        this.root.style.display = 'block';

        nextFrame(() => {
            document.documentElement.classList.add('u-lock-scroll');
            this.root.classList.add('popup--is-active');
            window.addEventListener('click', this._handleExternalClick, false);
            this.closeButton.addEventListener('click', this.onCloseButtonClick);
        });
    }

    onCloseButtonClick (e) {
        e.stopPropagation();
        this.close();
    }

    async close () {
        this.isOpen = false;
        document.documentElement.classList.remove('u-lock-scroll');
        window.removeEventListener('click', this._handleExternalClick, false);
        this.closeButton.removeEventListener('click', this.onCloseButtonClick);
        this.root.classList.remove('popup--is-active');
        await onTransitionEnd(this.root);
        this.root.style.display = 'none';

        const event = new Event('popup-closed');
        window.dispatchEvent(event);
    }

    _handleExternalClick (e) {
        const el = e.target;
        if (el !== this.rootInner && !this.rootInner.contains(el)) {
            this.close();
        }
    }
}

export default Popup;
