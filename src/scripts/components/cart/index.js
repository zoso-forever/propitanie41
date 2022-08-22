import template from './template.html';
import CartList from '../cart-list';
import CartOrder from '../cart-order';
import CartSuccess from '../cart-success';
import CartEmpty from '../cart-empty';
import state from '@/store';

const scrollManager = new window.SmoothScroll(null, {
    speed: 450,
    speedAsDuration: true
});

export default template({
    name: 'cart',

    components: {
        'cart-list': CartList,
        'cart-order': CartOrder,
        'cart-success': CartSuccess,
        'cart-empty': CartEmpty
    },

    data () {
        return {
            isVisible: false,
            products: state.products
        };
    },

    computed: {
        currentOrderStep () {
            return state.orderStep;
        },

        isCartEmpty () {
            return this.products.length === 0;
        }
    },

    watch: {
        products: {
            handler (updatedCart) {
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            },
            deep: true
        }
    },

    mounted () {
        this.headerElement = document.querySelector('.js-header');

        this.$nextTick(() => {
            this.isVisible = true;
        });
    },

    methods: {
        onEnter () {
            this.$nextTick(() => {
                if (window.innerHeight < document.documentElement.scrollHeight) {
                    scrollManager.animateScroll(this.headerElement.clientHeight);
                }
            });
        }
    }
});
