Bv.Form = Backbone.Model.extend({
    /**
     * Field access by name
     */
    field: {},
    state: "NOT_VALIDATED", // NOT_VALIDATED, PARTIALLY VALIDATED, VALIDATING, VALID
    
    initialize: function () {
        this.initFields();
    },
    
    applyTemplate: function(template){
        
    },
    
    initFields: function(){
        var t = this, dom = this.get('dom');
        dom.find("input[type=text], input[type=password], input[type=hidden]").each(function(){
            t.field[this.name] = new Bv.Field.Text({
                dom:$(this)
            });
        });
		
        dom.find("select").each(function(){
            t.field[this.name] = new Bv.Field.Select({
                dom:$(this)
            });
        });
		
        dom.find("input[type=radio]").each(function(){
            if (typeof t.field[this.name] == 'undefined') {
                t.field[this.name] = new Bv.Field.Radio({
                    name:this.name
                });
            }
            t.field[this.name].addRadioInput($(this));
        });
		
        dom.find("input[type=checkbox]").each(function(){
            t.field[this.name] = new Bv.Field.Checkbox({
                dom:$(this)
            });
        });
    },
    
    validateAll: function(){
        for(var name in this.field) {
            this.field[name].set({
                isValidated: true
            });
        }
    }
});