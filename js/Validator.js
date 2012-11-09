
Bv.Field.Validator = Backbone.Model.extend({
	defaults:{
		tooltip: null,
		icon: null
	},
	rules: null,
	fields: null,
	initialize: function(){
		this.rules = {};
		this.fields = {};
	},
	addField: function (field) {
		if (typeof this.fields[field.cid] != 'undefined') {
			return;
		}
		this.fields[field.cid] = field;
		field.on('change:isValidated', function(){
			this.updateUI();
		}, this);
		field.trigger("change:isValidated");
	},
	addRule: function (rule) {
		this.rules[rule.cid] = rule;
		rule.on('change:isValid change:isAjaxRequestGoing', function(){
			this.updateUI();
		}, this);
		rule.trigger("change:isValid");
		rule.set({
			validator: this
		});
		rule.get('field').trigger("change:value");
	},
	isAjaxRequest: function () {
		for (var i in this.rules) {
			if (this.rules[i].get('isAjaxRequestGoing'))
				return true;
		}
		return false;
	},
	isAnyFieldValidated: function () {
		for (var i in this.fields) {
			if (this.fields[i].get('isValidated'))
				return true;
		}
		return false;		
	},
	isValid: function () {
		for (var i in this.rules) {
			if (!this.rules[i].get('isValid'))
				return false;
		}
		return true;
	},
	isValidNotAsync: function () {
		for (var i in this.rules) {
			if (!this.rules[i].get('isValid') && !this.rules[i].isAsync)
				return false;
		}
		return true;
	},
	isValidNotAsyncForField: function (field) {
		for (var i in this.rules) {
			if (!this.rules[i].get('isValid') 
				&& !this.rules[i].isAsync 
				&& this.rules[i].get('field') == field)
				return false;
		}
		return true;
	},
	getFirstMessage: function () {
		for (var i in this.rules) {
			if (!this.rules[i].get('isValid'))
				return this.rules[i].get('message');
		}
		return "";
	},
	updateUI: function () {
		if (!this.isAnyFieldValidated()) {
			this.get('tooltip').set({
				isVisible: false
			});
			this.get('icon').set({
				state: "hidden"
			});
			return;
		}
		if (this.isAjaxRequest()) {
			this.get('tooltip').set({
				isVisible: false
			});
			this.get('icon').set({
				state: 'loading'
			});
			return;
		}
		if (!this.isValid()) {
			this.get('tooltip').set({
				isVisible: true,
				text: this.getFirstMessage()
			});
			this.get('icon').set({
				state: 'invalid'
			});
			return;			
		}
		// valid and all is ok
		this.get('tooltip').set({
			isVisible: false
		});
		this.get('icon').set({
			state: 'valid'
		});
	}
});