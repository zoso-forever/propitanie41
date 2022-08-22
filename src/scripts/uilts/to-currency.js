const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
});

function toCurrency (value) {
    if (typeof value === 'undefined') {
        return '';
    }
    return formatter.format(value);
}

export default toCurrency;
