Bv.Field.Checkbox = Bv.Field.extend({
    inputs: null,
    isValueChangeTriggered: false,
    initialize: function () {
        this.decoratorObjects = [];
        this.validatorObjects = [];

        this.trackValue(this.get('dom'));

        this.trackFocus();

        this.initDecorators();

        this.set({
            value: this.get('dom').is(":checked")
        });
    },
    
    trackFocus: function () {
        
        this.prototype.trackFocus.call(this);
        
        this.on('change:value', function () {
            if (!t.get('wasBlur')) {
                t.set({
                    wasBlur:true
                });
            }
        }, this);
    }
});