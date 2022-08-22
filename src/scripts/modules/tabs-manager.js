class TabsManager {
    constructor (rootSelector, initialIndex = 0) {
        this.root = document.querySelector(rootSelector);
        this.controlsParent = this.root.querySelector('.tabs__controls');
        this.controls = Array.from(
            this.root.querySelectorAll('.tabs__control')
        );
        this.panels = Array.from(this.root.querySelectorAll('.tabs__panel'));

        this.selectElement = this.root.querySelector('.tabs__select');
        this.selectToggle = this.selectElement
            .querySelector('.tabs__select-toggle');
        this.selectOptions = Array.from(
            this.selectElement.querySelectorAll('.tabs__select-option')
        );

        this.activeIndex = initialIndex;
        this.isSelectActive = false;

        this.handleControlClick = this.handleControlClick.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleExternalClick = this.handleExternalClick.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
    }

    init () {
        this.update(this.activeIndex);
        this.setListeners();
    }

    setListeners () {
        this.controlsParent.addEventListener('click', this.handleControlClick);
        this.selectToggle.addEventListener('click', this.handleToggleClick);
        this.selectOptions.forEach(el => {
            el.addEventListener('click', this.handleOptionClick);
        });
    }

    afterChange (fn) {
        this.emitAfterChange = fn;
        return () => {
            this.emitAfterChange = null;
        };
    }

    beforeChange (fn) {
        this.emitBeforeChange = fn;
        return () => {
            this.emitBeforeChange = null;
        };
    }

    handleControlClick (e) {
        const control = e.target.closest('button');
        if (!control || !this.controlsParent.contains(control)) {
            return;
        }

        const index = control.dataset.tabIndex;

        if (!index || Number(index) === this.activeIndex) {
            return;
        }

        this.showPanel(Number(index));
    }

    handleToggleClick () {
        if (!this.isSelectActive) {
            this.openSelect();
        } else {
            this.closeSelect();
        }
    }

    handleOptionClick (e) {
        const index = e.target.dataset.tabIndex;

        if (index && Number(index) !== this.activeIndex) {
            this.showPanel(Number(index));
            this.closeSelect();
        }
    }

    openSelect () {
        this.isSelectActive = true;
        this.selectElement.classList.add('tabs__select--is-active');
        document.addEventListener('click', this.handleExternalClick);
    }

    closeSelect () {
        this.isSelectActive = false;
        this.selectElement.classList.remove('tabs__select--is-active');
        document.removeEventListener('click', this.handleExternalClick);
    }

    handleExternalClick (e) {
        const el = e.target;
        if (el !== this.selectElement && !this.selectElement.contains(el)) {
            this.closeSelect();
        }
    }

    showPanel (index) {
        if (this.emitBeforeChange) {
            this.emitBeforeChange(index, this.activeIndex, (newIndex = index) => {
                if (newIndex !== false) {
                    this.update(newIndex);
                }
            });
        } else {
            this.update(index);
        }
    }

    update (index) {
        const oldIndex = this.activeIndex;
        this.activeIndex = index;
        this.updatePanels();
        this.updateControls();
        this.updateSelect();

        if (this.emitAfterChange) {
            this.emitAfterChange(this.activeIndex, oldIndex);
        }
    }

    updatePanels () {
        this.panels.forEach(panel => {
            panel.classList.remove('tabs__panel--is-active');
        });
        this.panels[this.activeIndex].classList.add('tabs__panel--is-active');
    }

    updateSelect () {
        const label = this.selectToggle.querySelector('.tabs__select-label');
        this.selectOptions.forEach(option => {
            option.classList.remove('tabs__select-option--is-selected');
        });
        const selectedOption = this.selectOptions[this.activeIndex];
        selectedOption.classList.add('tabs__select-option--is-selected');
        label.textContent = selectedOption.textContent;
    }

    updateControls () {
        this.controls.forEach(control => {
            control.classList.remove('tabs__control--is-active');
        });
        this.controls[this.activeIndex].classList.add('tabs__control--is-active');
    }

    get getActivePanelIndex () {
        return this.activeIndex;
    }

    get getActivePanelElement () {
        return this.panels[this.activeIndex];
    }
}

export default TabsManager;
