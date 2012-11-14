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
        
    trackValue: function (field) {
        var t = this;
        field.on('focus change keyup blur click', function(){
            if (field.is(":checked") != t.get('value')) {
                t.set({
                    value: field.is(":checked")
                });
            }
        });
    },
    
    trackFocus: function () {
        Bv.Field.prototype.trackFocus.call(this);
        
        var t = this;
        this.get('dom').on('click', function () {
            t.set({
                wasBlur:true
            });
        });
    }
});