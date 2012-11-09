
Bv.Decorator.Icon = Bv.Decorator.helper.extend({
    defaults: {
        state: "hidden",
        text: "",
        isGroup: false
    },
    elmHtml: '<div class="field-icon"></div>',
    dependsFromField: false,
    dependsFromThis: "change:state",
    isPositionSet: false,
    isShown: function(field){
        return this.get('state') != 'hidden' || this.get('state') != '';
    },
    setPosition: function(){
        if(!this.isPositionSet){
            this.getHelper().css({
                right: 37, 
                top: 4
            });
            this.isPositionSet = true;
        }
    },
    getHelper: function(){
        if (this.helper == false) {
            var t = this;
            this.helper = $(this.elmHtml);
            this.helper.html(this.get('text'));
            this.helper.hide();
            if (this.get('isGroup')) {
                t.get('field').get('dom').prepend(this.helper);
            }else{
                t.get('field').get('dom').parent().prepend(this.helper);
            }
            this.helper.click(function(){
                t.get('field').get('dom').focus();
            });
            this.on('change:text', function(){
                this.helper.html(this.get('text'));
            }, this);
        }
        return this.helper;
    },
    initialize: function(){
        var t=this;
        this.constructor.__super__.initialize.apply(this, arguments);
        this.on('change:state', function(){
            if (Bv.isMobile) {
                if (this.get('isGroup')) {

                    _.each(t.get('field').getValidator().fields,function(val,key){
                        val.get('dom').closest(".field-box").removeClass('field-box-invalid field-box-hidden field-box-loading field-box-invalid field-box-valid').addClass('field-box-' + t.get('state'));
                    })

                }else{
                    this.get('field').get('dom').find(".field-box").removeClass('field-box-invalid field-box-hidden field-box-loading field-box-invalid field-box-valid').addClass('field-box-' + this.get('state'));
                }

            }
            this.getHelper().attr('class', 'field-icon field-icon-' + this.get('state'));
        }, this);
    }
});
