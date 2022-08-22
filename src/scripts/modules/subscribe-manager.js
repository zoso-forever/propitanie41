import { getStorageRecord } from '../uilts/local-storage';
import Popup from './popup';

class SubscribeManager {
    constructor () {
        this.subscribed = getStorageRecord('subscribe', false);
        this.email = null;
        this.popup = new Popup('.js-subscribe-banner');
        this.timeout = null;
        this.delay = 40000;
        this.onPopupClosed = this.onPopupClosed.bind(this);
    }

    init () {
        if (!this.subscribed) {
            this.startTimeout();
            window.addEventListener('popup-closed', this.onPopupClosed, false);
        }
    }

    startTimeout () {
        this.timeout = setTimeout(() => {
            this.showPopup();
        }, this.delay);
    }

    stopTimeout () {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    restartTimeout () {
        this.stopTimeout();
        this.startTimeout();
    }

    showPopup () {
        this.stopTimeout();
        this.popup.open();
    }

    onPopupClosed () {
        if (!this.subscribed) {
            this.startTimeout();
        }
    }

    async subscribe (email) {
        this.stopTimeout();

        try {
            /* send request for subsription here */
            this.email = email;
            localStorage.setItem('subscribe', 'true');
            this.subscribed = true;
        } catch (error) {
            throw error;
        }
    }
}

export default SubscribeManager;
