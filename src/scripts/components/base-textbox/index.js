import template from './template.html';

export default template({
    name: 'base-textbox',

    inheritAttrs: false,

    props: {
        value: {
            type: [String, Number],
            default: ''
        },

        showError: {
            type: Boolean,
            default: false
        },

        errorMessage: {
            type: String,
            default: 'Обязательное поле'
        },

        placeholder: {
            type: String,
            default: ''
        },

        component: {
            type: String,
            default: 'input'
        }
    },

    data () {
        return {
            focused: false
        };
    },

    computed: {
        listeners () {
            return {
                ...this.$listeners,
                input: e => this.$emit('input', e.target.value)
            };
        }
    },

    methods: {
        onFocus () {
            this.focused = true;
        },

        onBlur () {
            this.focused = false;
        }
    }
});
