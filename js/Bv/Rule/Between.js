Bv.Rule.Between = Bv.Rule.extend({
    isValid: function (v) {
        v = parseFloat(jQuery.trim(v));
        return v >= this.get('from') && v <= this.get('to');
    },
    defaults: {
        from: 0,
        to: 0
    }
});