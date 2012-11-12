Bv.Rule.LenBetween = Bv.Rule.extend({
    isValid: function (v) {
        var len = jQuery.trim(v).length;
        return len >= this.get('from') && len <= this.get('to');
    },
    defaults: {
        from: 0,
        to: 0
    }
});