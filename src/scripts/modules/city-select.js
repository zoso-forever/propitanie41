import throttle from 'lodash/throttle';
import { onTransitionEnd, nextFrame } from '../uilts/transition-util';
import { scrollBarWidth } from '../uilts/get-scrollwidth';

class CitySelect {
    constructor (rootElement, options, selected = null) {
        this.root = rootElement;
        this.options = options;
        this.toggleElement = this.root.querySelector('.city-select__toggle');
        this.selectedOption = selected || this.options[0].value;
        this.isActive = false;

        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleExternalClick = this.handleExternalClick.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.setComputedPosition = this.setComputedPosition.bind(this);
        this.onResize = throttle(this.setComputedPosition, 200);
        this.onScroll = this.onScroll.bind(this);
    }

    init () {
        this.toggleElement.addEventListener('click', this.handleToggleClick);
        this.container = document.querySelector('.city-body-container');

        if (!this.container) {
            this.container = document.createElement('div');
            this.container.classList.add('city-body-container');
            document.body.appendChild(this.container);
        }

        const bodyFragment = document.createRange().createContextualFragment(this.getBodyMarkup());
        this.container.appendChild(bodyFragment);
        this.body = this.container.querySelector('.city-select__body');
        this.optionElements = Array.from(
            this.body.querySelectorAll('.city-select__option')
        );

        this.optionElements.forEach(option => {
            option.addEventListener('click', this.handleOptionClick);
        });

        const selectedOption = this.optionElements.find(element => {
            return element.dataset.value === this.selectedOption;
        });

        this.selectedElement = this.body.querySelector('.city-select__selected');

        this.updateDOMState(selectedOption);

        return this;
    }

    updateDOMState (selectedOptionElement) {
        const label = selectedOptionElement.textContent;
        const value = selectedOptionElement.dataset.value;

        this.selectedElement.textContent = label;
        this.toggleElement.textContent = label;
        this.selectedOption = value;

        this.optionElements.forEach(option => {
            option.classList.remove('city-select__option--is-selected');
        });
        selectedOptionElement.classList.add('city-select__option--is-selected');
    }

    getBodyMarkup () {
        return `
            <div class="city-select__body">
                <h3 class="city-select__title">Выбрать город</h3>
                <h4 class="city-select__lead">Ваш город:</h4>
                <div class="city-select__selected">${this.selectedOption.label}</div>
                <div role="listbox" class="city-select__options">
                    ${this.getOptionsMarkup()}
                </div>
            </div>
        `;
    }

    getOptionsMarkup () {
        return this.options.map(({ value, label }) => {
            return `
                <div role="option" data-value="${value}" class="city-select__option">
                    ${label}
                </div>
            `;
        }).join('');
    }

    setComputedPosition () {
        const WINDOW_OFFSET = 5;
        const bodyRect = this.body.getBoundingClientRect();
        const rootRect = this.root.getBoundingClientRect();
        let left = rootRect.left + (rootRect.width / 2) - (bodyRect.width / 2);
        let top;

        if (left + bodyRect.width > window.innerWidth - scrollBarWidth) {
            left = window.innerWidth - bodyRect.width - scrollBarWidth - WINDOW_OFFSET;
        } else if (rootRect.left < bodyRect.width / 2) {
            left = WINDOW_OFFSET;
        }

        if (window.innerHeight - rootRect.top < bodyRect.height) {
            top = window.innerHeight - (bodyRect.height + WINDOW_OFFSET);
        } else {
            top = rootRect.top;
        }

        this.body.style.left = `${left}px`;
        this.body.style.top = `${top}px`;
    }

    handleToggleClick () {
        if (this.isActive) {
            this.close();
        } else {
            this.open();
        }
    }

    handleOptionClick (e) {
        this.close();
        this.updateDOMState(e.target);
    }

    onScroll () {
        this.close();
    }

    open () {
        this.toggleElement.setAttribute('aria-expanded', 'true');
        this.body.style.display = 'block';

        nextFrame(() => {
            this.setComputedPosition();
            this.isActive = true;
            this.body.classList.add('is-active');
            document.addEventListener('click', this.handleExternalClick);
            window.addEventListener('resize', this.setComputedPosition);
            document.addEventListener('scroll', this.onScroll);
        });
    }

    async close () {
        this.body.classList.remove('is-active');
        this.toggleElement.setAttribute('aria-expanded', 'false');
        await onTransitionEnd(this.body);
        this.body.style.display = 'none';
        this.isActive = false;
        document.removeEventListener('click', this.handleExternalClick);
        window.removeEventListener('resize', this.setComputedPosition);
        document.removeEventListener('scroll', this.onScroll);
    }

    handleExternalClick (e) {
        const el = e.target;
        if (el !== this.body && !this.body.contains(el)) {
            this.close();
        }
    }
}

export default CitySelect;
