Bv.Field.Radio = Bv.Field.extend({
    inputs: null,
    isValueChangeTriggered: false,
    initialize: function () {
        this.inputs = [];
                
        this.initDecorators();
		
        this.trackIsEmpty();
		
        this.set({
            value: $("input[name=" + this.get("name") + "]:checked").val()
        });
		
        this.trigger("change:value");
    },
    
    addRadioInput: function(input){
        this.inputs.push(input);
        this.trackValue(input);
    },
    
    getGroup: function(){
        if (typeof this.group == 'undefined') {
            this.group = new Bv.Field.Group({
                dom: $(this.inputs[0]).parent().parent().parent()
            });
        }
        return this.group;
    },
    
    setValue: function(value, validate){
        for (var i = 0; i< this.inputs.length; i++) {
            if (this.inputs[i].val() == value) {
                this.inputs[i].attr({
                    checked:"checked"
                });
                this.set({
                    value:value
                });
                return;
            }
        }
		
        if (validate) {
            this.set({
                isValidated: true
            });
        }
    }

});