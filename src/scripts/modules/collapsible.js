class Collapsible {
    constructor (rootElement, initialState) {
        this.root = rootElement;
        this.control = this.root.querySelector('.collapsible__tab');
        this.body = this.root.querySelector('.collapsible__body');
        this.isActive = initialState || false;
        this.toggle = this.toggle.bind(this);
    }

    init () {
        this.updateBody();
        this._setEventListeners();
        return this;
    }

    _setEventListeners () {
        this.control.addEventListener('click', this.toggle);
    }

    toggle () {
        this.isActive = !this.isActive;
        this.updateBody();
    }

    updateBody () {
        if (this.isActive) {
            this.root.classList.add('collapsible--is-active');
        } else {
            this.root.classList.remove('collapsible--is-active');
        }
    }
}

export default Collapsible;
