class Spinner {
    constructor ({ el, initial = 1, min = 0 }) {
        this.root = el;
        this.minValue = min;
        this.currentValue = -1;
        this.input = this.root.querySelector('.spinner__input');

        this._handleClick = this._handleClick.bind(this);
        this.root.addEventListener('click', this._handleClick);
        this.setValue(initial);
    }

    _handleClick (e) {
        const control = e.target.closest('button');
        if (!control || !this.root.contains(control)) {
            return;
        }

        const action = control.dataset.action;
        const newValue = action === 'increment' ? 1 : -1;
        this.setValue(this.currentValue + newValue);
    }

    setValue (newValue) {
        const value = Math.max(newValue, this.minValue);
        if (value !== this.currentValue) {
            this.currentValue = value;
            this.input.value = value;
        }
    }

    get getValue () {
        return this.currentValue;
    }
}

export default Spinner;
