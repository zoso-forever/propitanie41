import Vue from 'vue';
import { getStorageRecord } from '../uilts/local-storage';

const state = Vue.observable({
    orderStep: 0,
    userData: getStorageRecord('userData', {}),
    products: getStorageRecord('cart', [])
});

export default state;

export function nextStep () {
    state.orderStep += 1;
}

export function previousStep () {
    state.orderStep = Math.max(state.orderStep - 1, 0);
}
