Bv.Field.Checkbox = Bv.Field.extend({

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
        Bv.Field.prototype.trackFocus.call(this);
        
        var t = this;
        
        this.on('change:value', function () {
            if (!t.get('wasBlur')) {
                t.set({
                    wasBlur:true
                });
            }
        }, this);
    }
});