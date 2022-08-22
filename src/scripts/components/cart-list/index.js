import template from './template.html';
import CartProduct from '../cart-product';
import state, { nextStep } from '@/store';
import { addDays, subDays, format, isSaturday, isSunday, addMonths, getHours } from 'date-fns';
import Vue from 'vue';

export default template({
    name: 'cart-list',

    components: {
        'cart-product': CartProduct
    },

    data () {
        return {
            userData: state.userData,
            proxyDate: '',
            disableStartDates: {
                to: subDays(new Date(), 1)
            },
            ordersAcceptTime: window.ordersAcceptTime,
            disabledDates: []
        };
    },

    computed: {
        products () {
            return state.products;
        },

        totalPrice () {
            return this.products.reduce((acc, product) => {
                const { price, includeBreakfast, breakfastPrice, amount } = product;
                let productPrice = price * amount;
                if (includeBreakfast) {
                    productPrice += breakfastPrice * amount;
                }
                return acc + productPrice;
            }, 0) * this.userData.deliver_count;
        },

        formattedDate () {
            if (!this.proxyDate) {
                return '';
            }
            return format(this.proxyDate, 'DD.MM.YYYY');
        }
    },

    watch: {
        proxyDate (newDate) {
            this.userData.startDate = new Date(newDate);
        }
    },

    created () {
        // получаем время приема заказов
        const acceptTime = this.getOrdersAcceptedHour(this.ordersAcceptTime);
        let initialDate = this.userData.startDate || addDays(new Date(), 1);
        if (getHours(initialDate) >= acceptTime) {
            initialDate = addDays(initialDate, 1);
        }
        this.proxyDate = format(initialDate, 'YYYY-MM-DD');
        Vue.set(this.userData, 'deliver_count', 1);

        this.calcMonth(this.disableStartDates.to);
    },

    methods: {
        goToForm () {
            nextStep();
        },

        removeProduct (index) {
            state.products.splice(index, 1);
        },

        onDateSelected (date) {
            this.proxyDate = date;
        },

        updateDeliverAmount (newValue) {
            const newAmount = this.userData.deliver_count + newValue;
            this.userData.deliver_count = Math.max(newAmount, 1);
        },
        getOrdersAcceptedHour (acceptTime) {
            const defaultHour = 18;
            // время на входе в формате "18:00", разбиваем на массив для получения значения часов
            const timeArray = acceptTime && acceptTime.length ? acceptTime.split(':') : [defaultHour];
            return parseInt(timeArray && timeArray.length ? timeArray[0] : defaultHour, 10);
        },
        /**
         * * Расчёт массива выходных дней в месяце
        */
        calcMonth (firstDay) {
            const firstDate = Array.isArray(firstDay) ? firstDay[0] : firstDay;
            const secondDate = addMonths(firstDate, 1);
            const month = this.createMonth(firstDate, secondDate);
            this.disabledDates = [];
            month.forEach(day => {
                if (isSaturday(day) || isSunday(day)) {
                    this.disabledDates.push(day);
                }
            });
        },
        /**
        * Создаёт массив дней между двух заданных дат
        */
        createMonth (dateFrom, dateTo) {
            const date1 = Date.parse(dateFrom);
            const date2 = Date.parse(dateTo);
            let currentDay = date1;
            const result = [];
            let i = 0;
            while (currentDay < date2) {
                result.push(format(currentDay, 'YYYY-MM-DD'));
                currentDay = addDays(currentDay, 1);
                i++;
                if (i > 31) {
                    break;
                }
            }
            return result;
        }
    }
});
