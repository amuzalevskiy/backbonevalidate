Bv = typeof Bv !== 'undefined' ? Bv : {};

Bv.Time = new Date();
/*
 * without time
 */
Bv.Today = new Date(Bv.Time.getFullYear(), Bv.Time.getMonth(), Bv.Time.getDate());

Bv.Field = Backbone.Model.extend({
    defaults: {
        dom: null,
        value: undefined,
        isEmpty: undefined,
        isValidated: false,
        isValid: true,
        hasFocus: false,
        wasBlur: false,
        decorators: 'Focus ValidateOnBlur',
        fnIsEmpty: function(val) {
            if (typeof val == 'undefined') {
                return true;
            }

            return val === "" || val === "0" || val === false;
        }
    },
    decoratorObjects: [],
    validatorObjects: [],
    
    initialize: function () {
        var field = this.get('dom');
        
        this.decoratorObjects = [];
        this.validatorObjects = [];

        this.trackValue(field);
		
        this.trackFocus();
        
        this.trackIsEmpty();
	
        this.initDecorators();
		
        this.set({
            value: field.val()
        });
    },
    
    trackValue: function (field) {
        var t = this;
        field.on('focus change keyup blur click', function(){
            if (field.val() != t.get('value')) {
                t.set({
                    value: field.val()
                });
            }
        });
    },
    
    trackIsEmpty: function () {
        this.on('change:value change:fnIsEmpty', function () {
            var fnIsEmpty = this.get("fnIsEmpty"),
            value = this.get("value"),
            isEmpty = fnIsEmpty.call(this, value);
            this.set({
                isEmpty: isEmpty
            });
        }, this);
    },
    
    trackFocus: function () {
        var field = this.get('dom'), t = this;
        field.focus(function(){
            t.set({
                hasFocus: true
            });
        });
		
        field.blur(function(){
            t.set({
                hasFocus: false
            });
            if (!t.get('wasBlur')) {
                t.set({
                    wasBlur:true
                });
            }
        });  
    },
    
    initDecorators: function () {
        if (this.get('decorators') != '') {
            var decorators = this.get('decorators').split(' ');
            this.decoratorObjects = [];
            for (var i = 0; i < decorators.length; i++) {
                this.addDecorator(decorators[i]);
            }
        }
    },
    
    addDecorator: function(decorator){
        if($.isFunction(decorator.substring)){
            decorator = new Bv.Decorator[decorator];
        }
        decorator.set({
            field:this
        });
        this.decoratorObjects.push(decorator);
		
        return decorator;
    },
    
    addValidationRule: function(rule){
        if($.isFunction(rule.substring)){
            rule = new Bv.Rule[rule];
        }
		
        rule.set({
            field: this
        });
		
        this.getValidator().addRule(rule);
        this.getValidator().addField(this);
    },
    
    setValidator: function(validator){
        this.validator = validator;
    },
    
    getValidator: function(){
        if (typeof this.validator == 'undefined') {
            this.validator = new Bv.Validator({
                tooltip: this.addDecorator('ErrorTooltip'),
                icon: this.addDecorator('Icon')
            });
        }
        return this.validator;
    },
    
    setValue: function(value, validate){
        this.get('dom').val(value);
        this.set({
            value:value
        });
		
        if (validate) {
            this.set({
                isValidated: true
            });
        }
    }
});