Bv.Rule.dateBetween = Bv.Rule.extend({
    defaults: {
        message: Bv.translations[Bv.translations.currentLang].js_validation_msg9,
        from: new Date(1900,01,01),
        to: new Date() // today
    },
    initialize: function(){
        this.on("change:field", function(){
            this.get('field').get('dom').datepicker('option', 'minDate', this.get('from'));
            this.get('field').get('dom').datepicker('option', 'maxDate', this.get('to'));
        },this);
        Bv.Rule.proto.prototype.initialize.call(this);
    },
    isValid: function (v) {
        var parsed = /^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/.exec(jQuery.trim(v));
        if (!parsed) {
            return false;
        }
        var date = new Date(parsed[3], parseInt(parsed[2],10) - 1, parseInt(parsed[1],10));
        return (date >= this.get('from')) && (date <= this.get('to'));
    }
});