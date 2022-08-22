import Vue from 'vue';
import PortalVue from 'portal-vue';
import toCurrency from './uilts/to-currency';
import Vuelidate from 'vuelidate';
import Cart from './components/cart';
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker';

Vue.filter('toCurrency', toCurrency);
Vue.use(Vuelidate);
Vue.use(PortalVue);
Vue.use(AirbnbStyleDatepicker, {
    days: [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье'
    ],
    daysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ]
});

Vue.config.productionTip = process.env.NODE_ENV === 'production';

/* eslint-disable-next-line */
new Vue({
    render: h => h(Cart)
}).$mount('#cart');
