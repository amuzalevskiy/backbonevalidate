Bv.Decorator.ErrorTooltip = Bv.Decorator.infotooltip.extend({
    defaults: {
        isVisible: false
    },
    elmHtml: '<div class="Bv-field-tooltip field-tooltip field-tooltip-invalid"></div>',
    dependsFromField: false,
    dependsFromThis: "change:isVisible",
    isShown: function(field){
        return this.get('isVisible');
    }
});