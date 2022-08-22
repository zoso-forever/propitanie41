import template from './template.html';
import getGeometry from '../../uilts/get-geometry';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import throttle from 'lodash/throttle';

export default template({
    name: 'base-select',

    props: {
        value: {
            type: [String, Object, Boolean, Array, Number],
            default: null
        },

        options: {
            type: Array,
            default () {
                return [];
            }
        },

        searchable: {
            type: Boolean,
            default: false
        },

        disabled: {
            type: Boolean,
            default: false
        },

        placeholder: {
            type: String,
            default: ''
        },

        labelKey: {
            type: String,
            default: 'label'
        },

        name: {
            type: String,
            default: ''
        }
    },

    data () {
        return {
            isOpen: false,
            proxyValue: null,
            proxyOptions: [],
            highlightedIndex: -1,
            searchQuery: '',
            listPosition: {}
        };
    },

    computed: {
        filteredOptions () {
            return this.proxyOptions.filter(o => !isEqual(o, this.proxyValue));
        },

        selectClasses () {
            return {
                select: true,
                'select--is-open': this.isOpen,
                'select--is-disabled': this.disabled
            };
        }
    },

    watch: {
        value (newValue) {
            this.proxyValue = newValue;
            this.searchQuery = newValue ? this.getOptionValue(newValue) : newValue;
        },

        options (options) {
            this.proxyOptions = [...options];
        }
    },

    created () {
        this.proxyValue = this.value;
        this.proxyOptions = [...this.options];
        this.searchQuery = this.value ? this.getOptionValue(this.value) : this.value;

        this.onResize = throttle(this.setComputedPosition, 150);
    },

    methods: {
        toggle () {
            this[this.isOpen ? 'close' : 'open']();
        },

        open () {
            this.isOpen = true;
            this.setComputedPosition();
            this.attachListeners();
        },

        close () {
            this.isOpen = false;
            this.detachListeners();
            this.highlightedIndex = -1;
        },

        attachListeners () {
            document.addEventListener('click', this.handleExternalClick);
            window.addEventListener('resize', this.onResize, false);
            window.addEventListener('keydown', this.handleKeydown, false);
        },

        detachListeners () {
            document.removeEventListener('click', this.handleExternalClick);
            window.removeEventListener('resize', this.onResize, false);
            window.removeEventListener('keydown', this.handleKeydown, false);
        },

        handleKeydown (e) {
            switch (e.keyCode) {
                case 38:
                    e.preventDefault();
                    if (this.highlightedIndex > 0) {
                        this.highlightedIndex -= 1;
                    }
                    break;
                case 40:
                    e.preventDefault();
                    if (this.highlightedIndex + 1 < this.filteredOptions.length) {
                        this.highlightedIndex += 1;
                    }
                    break;
                case 27:
                    e.preventDefault();
                    this.close();
                    break;
                case 13:
                    e.preventDefault();
                    this.select(this.filteredOptions[this.highlightedIndex]);
                    break;
                default:
                    break;
            }
        },

        select (option) {
            this.proxyValue = option;
            this.searchQuery = this.getOptionValue(option);
            this.close();
            this.$emit('input', option);
        },

        onSearchQueryChange (e) {
            this.searchQuery = e.target.value;
            this.$emit('on-search-query-change', e.target.value);
        },

        handleExternalClick (e) {
            if (e.target !== this.$el && !this.$el.contains(e.target)) {
                this.close();
            }
        },

        setComputedPosition () {
            const { left, top, width } = getGeometry(this.$el);
            this.listPosition = {
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                zIndex: 10000,
                position: 'absolute'
            };
        },

        getOptionValue (value) {
            return isObject(value) ? value[this.labelKey] : value;
        },

        bindOption (value) {
            return isObject(value) ? value : { [this.labelKey]: value };
        }
    }
});
