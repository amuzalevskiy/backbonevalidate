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
		validators: [],
		isValidated: false,
		isValid: true,
		hasFocus: false,
		wasBlur: false,
		messages: [],
		decorators: 'focus',
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
		this.decoratorObjects = [];
		this.validatorObjects = [];
		
		/*
		 * prepare DOM structure
		 */
		var field = this.get('dom'),
		t = this;
			
		/*
		 * track value
		 */
		field.on('focus change keyup blur click', function(){
			if (field.val() != t.get('value')) {
				t.set({
					value: field.val()
				});
			}
		});
		
		/*
		 * track focus
		 */
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
		
		/*
		 * track isEmpty
		 */
		this.on('change:value change:fnIsEmpty', function () {
			var fnIsEmpty = this.get("fnIsEmpty"),
			value = this.get("value"),
			isEmpty = fnIsEmpty.call(this, value);
                        this.set({
                                isEmpty: isEmpty
                        });
		}, this);
		
		/*
		 * init decorators
		 */
		if (this.get('decorators') != '') {
			var decorators = this.get('decorators').split(' ');
			this.decoratorObjects = [];
			for (var i = 0; i < decorators.length; i++) {
				this.addDecorator(decorators[i]);
			}
		}
		
		this.set({
			value: field.val()
		});
	},
	addDecorator: function(decorator){
		if($.isFunction(decorator.substring)){
			decorator = new Bv.Field.Decorator[decorator];
		}
		decorator.set({
			field:this
		});
		this.decoratorObjects.push(decorator);
		
		return decorator;
	},
	addValidationRule: function(rule){
		if($.isFunction(rule.substring)){
			rule = new Bv.Field.Validator.Rule[rule];
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
			this.validator = this.getGroup().getValidator();
			this.decoratorObjects = this.getGroup().decoratorObjects;
		}
		return this.validator;
	},
	setGroup: function(group){
		this.group = group;
	},
	getGroup: function(){
		if (typeof this.group == 'undefined') {
			this.group = new Bv.Field.Group({
				dom: this.get('dom').parent().parent()
			});
		}
		return this.group;
	},
	registerInSubform: function(){
		var subform;
		if (subform = this.get('dom').parents('.fields-subform')) {
			var subformName = subform.attr('data-subform-name');
			if (typeof Bv.Page.subform[subformName] == 'undefined') {
				Bv.Page.subform[subformName] = new Bv.Field.Group({
					dom: subform?subform:$(document.body),
					formName: subformName
				});
			}
			this.subform = Bv.Page.subform[subformName];
			Bv.Page.subform[subformName].field[this.get('dom').attr('name')] = this;
		}
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

Bv.Field.Text = Bv.Field;

Bv.Field.Select = Bv.Field;

Bv.Field.Radio = Bv.Field.extend({
	defaults: {
		value: undefined,
		name: undefined,
		dom: undefined,
		isEmpty: "",
		validators: [],
		isValidated: false,
		isValid: false,
		isAsyncValidationGoing: false,
		hasFocus: false,
		wasBlur: false,
		decorators: '',
		fnIsEmpty: function(val) {
			if (typeof value == 'undefined') {
				return true;
			}
			return val === "" || val === "0" || val === false;
		}
	},
	inputs: null,
	isValueChangeTriggered: false,
	initialize: function () {
		this.inputs = [];
		/*
		 * init decorators
		 */
		if (this.get('decorators') != '') {
			var decorators = this.get('decorators').split(',');
			this.decoratorObjects = [];
			for (var i = 0; i < decorators.length; i++) {
				this.addDecorator(decorators[i]);
			}
		}
		
		/*
		 * track isEmpty
		 */
		this.on('change:value change:fnIsEmpty', function (model, name) {
			var fnIsEmpty = this.get("fnIsEmpty"),
			value = this.get("value"),
			isEmpty = fnIsEmpty.call(model, value);
			if (this.get("isEmpty") !== isEmpty) {
				this.set({
					isEmpty: isEmpty
				});
			}
		}, this);
		
		this.set({
			value: $("input[name=" + this.get("name") + "]:checked").val()
		});
		
		this.trigger("change:value");
	},
	addRadioInput: function(input){
		this.inputs.push(input);
		var t = this;
		if (!this.get('dom')) {
			this.set({
				dom:$(input)
			});
		}
		input.on('focus change keyup blur click', function(){
			if ($(this).val() != t.get('value'))
				t.set({
					value: $(this).val()
				});
		});
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

Bv.Field.Checkbox = Bv.Field.extend({
    defaults: {
        value: undefined,
        name: undefined,
        dom: undefined,
        isEmpty: "",
        validators: [],
        isValidated: false,
        isValid: false,
        isAsyncValidationGoing: false,
        hasFocus: false,
        wasBlur: false,
        decorators: '',
        fnIsEmpty: function(val) {
            if (typeof value == 'undefined') {
                return true;
            }
            return val === "" || val === "0" || val === false;
        }
    },
    inputs: null,
    isValueChangeTriggered: false,
		initialize: function () {
			this.decoratorObjects = [];
			this.validatorObjects = [];

			/*
			* prepare DOM structure
			*/
			var field = this.get('dom'),
			t = this;

			/*
			* track value
			*/
			field.on('focus change keyup blur click', function(){
				if (field.is(":checked") != t.get('value')) {
					t.set({
						value: field.is(":checked")
					});
				}
			});

			/*
			* track focus
			*/
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
			this.on('change:value', function () {
				if (!t.get('wasBlur')) {
					t.set({
						wasBlur:true
					});
				}
			}, this);

			/*
			* init decorators
			*/
			if (this.get('decorators') != '') {
				var decorators = this.get('decorators').split(' ');
				this.decoratorObjects = [];
				for (var i = 0; i < decorators.length; i++) {
					this.addDecorator(decorators[i]);
				}
			}

			this.set({
				value: field.is(":checked")
			});
		}
	});

Bv.Field.Group = Backbone.Model.extend({
	decoratorObjects: null,
	field: null,
	group: null,
	isVisible: true,
	initialize: function () {
		this.decoratorObjects = [];
		this.field = {};
		this.group = {};
		this.isVisible = this.get('dom').is(":visible");
		if(!this.isVisible) {
			this.get('dom').find('input,select').attr('disabled', 'disabled');
		}
	},
	addDecorator: function(decorator){
		if($.isFunction(decorator.substring)){
			decorator = new Bv.Field.Decorator[decorator];
		}
		decorator.set({
			field:this,
			isGroup: true
		});
		this.decoratorObjects.push(decorator);
		
		return decorator;
	},
	getValidator: function(){
		if (typeof this.validator == 'undefined') {
			options = {
				tooltip: this.addDecorator('errortooltip'),
				icon: this.addDecorator('icon')
			}
			this.validator = new Bv.Field.Validator(options);
		}
		return this.validator;
	},
	registerInSubform: function(){
		var subform;
		if (subform = this.get('dom').parents('.fields-subform')) {
			if (typeof Bv.Page.subform[subform.attr('data-subform-name')] == 'undefined') {
				Bv.Page.subform[subform.attr('data-subform-name')] = new Bv.Field.Group({
					dom: subform?subform:$(document.body),
					formName: subform.attr('data-subform-name')
				});
			}
			this.subform = Bv.Page.subform[subform.attr('data-subform-name')];
			Bv.Page.subform[subform.attr('data-subform-name')].group[this.get('dom').attr('data-group-name')] = this;
		}
	},
	show: function(){
		this.get('dom').show();
		this.get('dom').find('input,select').removeAttr('disabled');
		
		var group = this;
		this.get('dom').find('input[type=radio]').each(function () {
			var name = $(this).attr("name");
			group.field[name].setValue(group.field[name].get("value"));
		});
		this.isVisible = true;
	},
	hide: function(){
		this.get('dom').hide();		
		this.get('dom').find('input,select').attr('disabled', 'disabled');
		this.isVisible = false;
	}
});