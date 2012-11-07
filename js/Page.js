

Kredito.Page = {
	field: {},
	group: {},
	subform:{},
	step: 0,
	ValidateForm:{
		step2: function(e){
                    // something here
		},
		step3: function(e){
		}
	},

	initFields: function(){
		var t = this;
		$("input[type=text], input[type=password], input[type=hidden]").each(function(){
			t.field[this.name] = new Kredito.Field.Text({
				dom:$(this)
			});
			t.field[this.name].registerInSubform();
		});
		
		$("select").each(function(){
			t.field[this.name] = new Kredito.Field.Select({
				dom:$(this)
			});
			t.field[this.name].registerInSubform();
		});
		
		$("input[type=radio]").each(function(){
			// radiogroups should be different for each subform
			subformName = $(this).parents('.fields-subform').attr('data-subform-name');
			
			if (typeof t.field[this.name + '_' + subformName] == 'undefined') {
				t.field[this.name + '_' + subformName] = new Kredito.Field.Radio({
					name:this.name
				});
			}
			t.field[this.name + '_' + subformName].addRadioInput($(this));
			t.field[this.name + '_' + subformName].registerInSubform();
		});
		
		$("input[type=checkbox]").each(function(){
			t.field[this.name] = new Kredito.Field.Checkbox({
				dom:$(this)
			});
			t.field[this.name].registerInSubform();
		});
	},
	initGroups: function(){
		var t = this;
		$(".field-group").each(function(){
			t.group[$(this).attr('data-group-name')] = new Kredito.Field.Group({
				dom: $(this)
			});
			t.group[$(this).attr('data-group-name')].registerInSubform();
		});
	},
	validate: function(){
		for(var formName in this.subform) {
			for(var name in this.subform[formName].field) {
				this.subform[formName].field[name].set({
					isValidated: true
				});
			}
		}
	},
	getSubformCount: function(){
		var counter = 0;
		for(var i in this.subform) {
			counter++;
		}
		return counter;
	},

	findFieldsWithAjaxRequests: function(){
		for(var field in this.field) {
			if (this.field[field].getValidator().isAjaxRequest()){
				return true
			}
		}
		return false
	},

	validationForm: function (e){
		if (typeof e.preventDefault ==='undefined'){
			e = this;
			var isDeferredEvent = true;
			Kredito.Page.removeAjaxCallBackFunction(e);
		}
		Kredito.Page.validate();
		if(!Kredito.Page.isValid()) {
			e.preventDefault();
			Kredito.Util.showFormErrorMessage();
		} else {
			var fnName = 'step' + Kredito.Page.step;
			if (typeof Kredito.Page.ValidateForm[fnName] == 'function') {
				Kredito.Page.ValidateForm[fnName].call(Kredito.Page, e);
			}
		}
		if(isDeferredEvent){
			$('#registration-form-submit').click();
		}



	},

	addAjaxCallBackFunction: function(onChange,e){
		for(var field in this.field) {
			if (this.field[field].getValidator().isAjaxRequest()){
				for(var rules in this.field[field].getValidator().rules) {
					this.removeAjaxCallBackFunction(e);
					this.field[field].getValidator().rules[rules] .on('change:isAjaxRequestGoing', this.validationForm, e);
					e.preventDefault();
				}
			}
		}
	},
	removeAjaxCallBackFunction: function(e){
		for(var field in this.field) {
			for(var rules in this.field[field].getValidator().rules) {
				this.field[field].getValidator().rules[rules].off('change:isAjaxRequestGoing', this.validationForm);
			}
		}
	},

	isValid: function(){
		for(var formName in this.subform) {
			if (this.subform[formName].isVisible || formName == 'undefined'){
				for(var name in this.subform[formName].field) {
					if (! this.subform[formName].field[name].get('dom').is(':visible')) {
						continue;
					}
					if ( !this.subform[formName].field[name].getValidator().isValid()) {
						return false;
					}
				}
			}
		}
		return true;
	}
};