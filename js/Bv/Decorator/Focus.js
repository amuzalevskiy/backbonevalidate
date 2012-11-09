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

                if (this.get('hasFocus')) {
                    if(this.getGroup().get('dom').css('z-index') != '1500') {
                        // increase z-index
                        this.zIndex = this.getGroup().get('dom').css('z-index');
                        this.getGroup().get('dom').css('z-index', 1500);
                    }
                } else{
                    // return back
                    this.getGroup().get('dom').css('z-index', this.zIndex);
                }
            },this.get('field'));
        }, this);
        this.trigger("change:field");
    }
});