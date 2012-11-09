Bv.Decorator.InfoTooltip = Bv.Decorator.helper.extend({
    elmHtml: '<div class="Bv-field-tooltip field-tooltip field-tooltip-info"></div>',
    dependsFromField: "change:hasFocus change:isValidated",
    dependFromThis: "change:always",
    animationTime: 250,
    defaults: {
        always: true
    },
    setPosition: function(){

        if(this.get('isGroup')){
            this.getHelper().css({
                left: this.getHelper().parent().width() - 30, 
                top: 2
            });

        }else{
			
            var field = this.get('field'),
            dom = field.get('dom'),
            offset = dom.position();

            this.getHelper().css({
                left: offset.left + dom[0].clientWidth + 7, 
                top: offset.top
            });
        }
    },
    isShown: function(field){
        return field.get('hasFocus') && (!field.get('isValidated') || this.get('always'));
    }
});