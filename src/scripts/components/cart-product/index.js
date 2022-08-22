import template from './template.html';

export default template({
    props: {
        product: Object,
        index: Number
    },

    computed: {
        breakfastPrice () {
            return this.product.breakfastPrice * this.product.amount;
        },

        price () {
            return this.product.price * this.product.amount;
        }
    },

    methods: {
        updateAmount (newValue) {
            const newAmount = this.product.amount + newValue;
            this.product.amount = Math.max(newAmount, 1);
        },

        removeProduct () {
            this.$emit('on-remove', this.index);
        }
    }
});
