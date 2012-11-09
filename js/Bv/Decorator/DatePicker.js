Bv.Decorator.DatePicker = Backbone.Model.extend({
    defaults: {
        field: null,
        options: {}
    },
    initialize: function(){
        this.on('change:field', function(){
            if (!this.get('field')) {
                return;
            }
            this.get('field').get('dom').calendar(this.get('options'));
        }, this);
		
        this.trigger("change:field");
    }
});