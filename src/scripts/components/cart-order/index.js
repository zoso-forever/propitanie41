import template from './template.html';
import BaseSelect from '../base-select';
import BaseTextbox from '../base-textbox';
import { required, maxLength } from 'vuelidate/lib/validators';
import state, { nextStep, previousStep } from '@/store';
import { mask } from 'vue-the-mask';
import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';

const request = axios.create({
    baseURL: !isProd ? 'http://localhost:1337/' : '/api/v1/admin/'
});

const iOS = Boolean(navigator.platform) && /iPad|iPhone|iPod/.test(navigator.platform);

const SUBMIT_STATUS_INITIAL = 'INITIAL';
const SUBMIT_STATUS_ERROR = 'ERROR';
const SUBMIT_STATUS_PENDING = 'PENDING';
const SUBMIT_STATUS_SUCCESS = 'SUCCESS';

export default template({
    name: 'cart-order',

    components: {
        'base-select': BaseSelect,
        'base-textbox': BaseTextbox
    },

    directives: { mask },

    data () {
        return {
            iOS,
            SUBMIT_STATUS_INITIAL,
            SUBMIT_STATUS_ERROR,
            SUBMIT_STATUS_PENDING,
            SUBMIT_STATUS_SUCCESS,
            submitStatus: SUBMIT_STATUS_INITIAL,
            deliveryOptions: [
                'Доставка курьером',
                'Самомывоз (Галант Плаза)'
            ],
            streetOptions: [],
            buildingOptions: [],
            cityOptions: [
                'Петропавловск-Камчатский',
                'Елизово',
                'Завойко'
            ],
            userData: state.userData,
            errors: null
        };
    },

    validations: {
        userData: {
            name: { required },
            phone: { required },
            street: { required },
            building: { required },
            entrance: { maxLength: maxLength(10) }
        }
    },

    created () {
        this.userData.delivery = this.deliveryOptions[0];
        this.userData.city = this.cityOptions[0];
    },

    mounted () {
        if (!this.userData.name) {
            this.$refs.firstInput.$el.focus();
        }
    },

    methods: {
        async submitOrder () {
            this.errors = null;
            if (this.$v.$invalid) {
                this.submitStatus = SUBMIT_STATUS_ERROR;
                return;
            }

            this.submitStatus = SUBMIT_STATUS_PENDING;

            try {
                /* send request with order data here */
                this.submitStatus = SUBMIT_STATUS_SUCCESS;
                localStorage.removeItem('cart');
                nextStep();

                this.saveFormData();
                state.products = [];
            } catch (error) {
                this.submitStatus = SUBMIT_STATUS_ERROR;
                this.errors = error;
                console.log(this.errors);
            }
        },

        backToCart () {
            previousStep();
        },

        onCityChanged () {
            this.userData.street = null;
            this.userData.building = null;
            this.streetOptions = [];
            this.buildingOptions = [];
        },

        onStreetChanged () {
            this.userData.building = null;
            this.buildingOptions = [];
        },

        async onStreetSearchQueryChange (query) {
            if (query.length < 2) {
                return;
            }
            const { data } = await request.post('/suggest/address', {
                query,
                city: this.userData.city
            });
            this.streetOptions = data.suggestions;
        },

        async onBuildingSearchQueryChange (query) {
            if (query.length < 2) {
                return;
            }
            const { data } = await request.post('/suggest/address', {
                query: this.userData.street.value,
                city: this.userData.city,
                house: query
            });
            this.buildingOptions = data.suggestions;
        },

        onPhoneFocus () {
            if (!this.userData.phone) {
                this.$set(this.userData, 'phone', '+7 ');
            }
        },

        onPhoneBlur () {
            if (this.userData.phone === '+7 ' || !this.userData.phone) {
                this.$set(this.userData, 'phone', '');
            }
        },

        saveFormData () {
            localStorage.setItem('userData', JSON.stringify({
                name: state.userData.name,
                phone: state.userData.phone,
                city: state.userData.city,
                street: state.userData.street,
                building: state.userData.building,
                entrance: state.userData.entrance,
                appartment: state.userData.appartment,
                delivery: state.userData.delivery
            }));
            state.userData = {};
        }
    }
});
