$(function(){
	
	Kredito.Page.initFields();
	Kredito.Page.initGroups();
	
	for (var i in Kredito.Page.subform) {
		var form = Kredito.Page.subform[i];
		initFields(form);
	}

});

function initFields(parentForm){
	
        /**
         * SHORTCUTS
         */
	var decorator = Kredito.Field.Decorator,
	rule = Kredito.Field.Validator.Rule,
	field = parentForm.field,
	group = parentForm.group;
	
	for (var i in field) {
		var currentField = field[i];
		switch (i) {
			/**
			 * STEP 2
			 */

			case "prename":
				currentField.setGroup(group.name);
				currentField.addValidationRule('notEmpty');
				break;

			case "lastname":
				currentField.setGroup(group.name);
				currentField.addValidationRule('notEmpty');
				break;

			case "phone_prefix":
				currentField.setGroup(group.financephone);
				currentField.addValidationRule('notEmpty');
				currentField.addValidationRule('digits');
				break;

			case "phone":
				currentField.addDecorator(new decorator.onlyDigits());
				currentField.setGroup(group.financephone);
				currentField.addValidationRule('notEmpty');
				currentField.addValidationRule('digits');
                                currentField.addValidationRule(new rule.lenBetween({
                                    from: 6,
                                    to: 9,
                                    message: kredito.translations[kredito.translations.currentLang].js_validation_msg12
                                }));
				break;

			case "email":

				currentField.addDecorator(new decorator.infotooltip({
					text: kredito.translations[kredito.translations.currentLang].js_validation_msg28
				}));
				currentField.addValidationRule('notEmpty');
				currentField.addValidationRule('email');
				currentField.addValidationRule('emailcase');
				break;

			case "email_confirm":				
				currentField.addDecorator(new decorator.infotooltip({
					text: kredito.translations[kredito.translations.currentLang].js_validation_msg29
				}));
				currentField.addValidationRule('notEmpty');
				currentField.addValidationRule(new rule.equalTo({
					compareWith: field.email, 
					message: kredito.translations[kredito.translations.currentLang].js_validation_msg10
				}));
				break;
				
			case "birthdate":
				currentField.addDecorator(new decorator.datePicker({
					options: {
						yearRange: "1900:" + Kredito.Today.getFullYear()
					}
				}));
				currentField.addValidationRule('notEmpty');
				currentField.addValidationRule('date');
				currentField.addValidationRule(new rule.dateCheck({
					to: new Date(Kredito.Today.getFullYear()-18, Kredito.Today.getMonth(), Kredito.Today.getDate()),
					message: kredito.translations[kredito.translations.currentLang].js_validation_msg11
				}));
				break;
				
			case "birthplace":
				currentField.get('dom').autocomplete({
					source:Kredito.Data.searchFromStartBy(Kredito.Data.cities, 10)
				});
				currentField.addValidationRule('notEmpty');
				break;
			case "gender":
				currentField.addValidationRule('notEmpty');
				break;
				
			case "has_financephone":
				currentField.on("change:value", function(){
					if (this.get('value') == '1') {
						group.financephone.show();
					} else {
						group.financephone.hide();
					}
				}, currentField);
				currentField.trigger("change:value");
				break;

			case "mobilephone":
				currentField.setGroup(group.mobilephone);
				currentField.addDecorator(new decorator.infotooltip({
					text: kredito.translations[kredito.translations.currentLang].js_validation_msg30
				}));
				currentField.addValidationRule('notEmpty');
				currentField.addValidationRule('digits');
				currentField.addValidationRule(new rule.lenBetween({
					from: 6,
					to: 9,
					message: kredito.translations[kredito.translations.currentLang].js_validation_msg12
				}));
				break;

		}
	}
}