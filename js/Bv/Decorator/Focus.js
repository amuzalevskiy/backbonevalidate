Bv.Decorator.Focus = Backbone.Model.extend({
    defaults: {
        field: null
    },
    initialize: function(){
        this.on('change:field', function(){
            if (!this.get('field')) {
                return;
            }
            this.get('field').on("change:hasFocus", function(){
                this.get('dom').toggleClass("field-under-focus", this.get('hasfocus'));
            },this.get('field'));
        }, this);
        this.trigger("change:field");
    }
});