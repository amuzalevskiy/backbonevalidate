Bv.Field.Validator.Rule = {
	proto: Backbone.Model.extend({
		defaults: {
			field: null,
			message: Bv.translations[Bv.translations.currentLang].js_validation_msg1,
			isValid: undefined,
			isAjaxRequestGoing: false,
			allowEmpty: true,
			validator: null
		},
		isValid: function () {
			return false;
		},
		initialize: function(){
			var rule = this;
			this.on("change:field", function(){
				var field = this.get('field');
				
				field.on("change:value", function(){
					
					var isValid = rule.isValid(field.get('value'));
					
					isValid = isValid || (this.get('allowEmpty') && jQuery.trim(field.get('value')) == '');
					
					if (rule.get('isValid') !== isValid) {
						rule.set({
							isValid: isValid
						});
					}
				}, field);
			});
		}
	}),
	
	initRules: function () {
		var rules = Bv.Field.Validator.Rule;
			
		rules.len = rules.proto.extend({
			isValid: function (v) {
				return jQuery.trim(v).length == this.get("length");
			},
			defaults: {
				length: 0
			}
		});
		
		rules.lenBetween = rules.proto.extend({
			isValid: function (v) {
				var len = jQuery.trim(v).length;
				return len >= this.get('from') && len <= this.get('to');
			},
			defaults: {
				from: 0,
				to: 0
			}
		});

		rules.isChecked = rules.proto.extend({
			isValid: function (v) {
				return v;
			},
			defaults: {
				message: Bv.translations[Bv.translations.currentLang].js_validation_msg2
			}
		});

		rules.notEmpty = rules.proto.extend({
			isValid: function (v) {
				return jQuery.trim(v).length > 0;
			},
			defaults: {
				message: Bv.translations[Bv.translations.currentLang].js_validation_msg3
			}
		});
		rules.notZero = rules.proto.extend({
			isValid: function (v) {
				return jQuery.trim(v) != "0";
			},
			defaults: {
				message: Bv.translations[Bv.translations.currentLang].js_validation_msg4 ,
				allowEmpty: false
			}
		});

		rules.between = rules.proto.extend({
			isValid: function (v) {
				var v = parseFloat(jQuery.trim(v));
				return v >= this.get('from') && v <= this.get('to');
			},
			defaults: {
				from: 0,
				to: 0,
				message: Bv.translations[Bv.translations.currentLang].js_validation_msg5
			}
		});
		
		rules.equalTo = rules.proto.extend({
			isValid: function (v) {
				return v == this.get('compareWith').get('value');
			},
			defaults: {
				compareWith: null
			},
			/**
			 * also listen to identical field changes
			 */
			initialize: function(){
				this.constructor.__super__.initialize.apply(this, arguments);
				var rule = this;
				this.on("change:compareWith", function(){
					this.get('compareWith').on("change:value", function(){
						if (!rule.get('field').get('isValidated')) {
							return;
						}
						var isValid = rule.isValid(rule.get('field').get('value'));
						if (rule.get('isValid') !== isValid) {
							rule.set({
								isValid: isValid
							});
						}
					});
				}, this);
				this.trigger("change:compareWith");
			}
		});
			
		rules.digits = rules.proto.extend({
			isValid: function (v) {
				return /^[0-9]+$/.test(jQuery.trim(v));
			},
			defaults: {
				length: 0,
				message: Bv.translations[Bv.translations.currentLang].js_validation_msg6
			}
		});
			
		rules.regexp = rules.proto.extend({
			isValid: function (v) {
				return this.get('test').test(jQuery.trim(v));
			},
			defaults: {
				test: null
			}
		});
			
		rules.email = rules.regexp.extend({
			defaults: {
				message: Bv.translations[Bv.translations.currentLang].js_validation_msg7,
				test: /^((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/
			}
		});

		rules.emailcase = rules.regexp.extend({
			defaults: {
				message: Bv.translations[Bv.translations.currentLang].js_email_case,
				test: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/
			}
		});

		rules.date = rules.regexp.extend({
			defaults: {
				message: Bv.translations[Bv.translations.currentLang].js_validation_msg8,
				test: /^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/
			}
		});
		
		rules.dateCheck = rules.proto.extend({
			defaults: {
				message: Bv.translations[Bv.translations.currentLang].js_validation_msg9,
				from: new Date(1900,01,01),
				to: new Date() // today
			},
			initialize: function(){
				this.on("change:field", function(){
					this.get('field').get('dom').datepicker('option', 'minDate', this.get('from'));
					this.get('field').get('dom').datepicker('option', 'maxDate', this.get('to'));
				},this);
				rules.proto.prototype.initialize.call(this);
			},
			isValid: function (v) {
				var parsed = /^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/.exec(jQuery.trim(v));
				if (!parsed) {
					return false;
				}
				var date = new Date(parsed[3], parseInt(parsed[2],10) - 1, parseInt(parsed[1],10));
				return (date >= this.get('from')) && (date <= this.get('to'));
			}
		});
		
		rules.dateNotInPast = rules.dateCheck.extend({
			initialize: function(){
				rules.dateCheck.prototype.initialize.call(this);				
			},
			defaults: {
				message: Bv.translations[Bv.translations.currentLang].js_text_2,
				from: Bv.Today, // today
				to: new Date(Bv.Today.getFullYear()+100, Bv.Today.getMonth(), Bv.Today.getDate())
			}
		});
		
		rules.server = rules.proto.extend({
			defaults: {
				url: function(){
					alert('Please specify url fn')
				},
				validateResponse: function (serverResponse) {
					return serverResponse.isValid;
				},
				requestDelay: 400,
				timeout:8000
			},
			isAsync: true,
			cache: null,
			initialize: function(){
				this.cache = {
					values:{},
					get: function (key) {
						return this.values[key];
					},
					has: function (key) {
						return typeof this.values[key] != 'undefined';
					},
					set: function (key, value) {
						this.values[key] = value;
					}
				};
				this.constructor.__super__.initialize.apply(this, arguments);
			},
			isValid: function (v) {
				if (!this.get('validator').isValidNotAsyncForField(this.get('field'))) {
					// just to do not show error message in this case
					this.stopAsyncValidation();
					return true;
				}
				if (this.cache.has(v)) {
					return this.get('isValid').call(this,this.cache.get(v));
				} else {
					this.startAsyncValidation();
					return false;
				}
			},
			startAsyncValidation: function (v) {
				clearTimeout(this.lastTimeoutServerValidation);
				var t = this;
				t.set({
					isAjaxRequestGoing:true
				});
				this.lastTimeoutServerValidation = setTimeout(function(){
					if (t.currentRequest) {
						t.currentRequest.abort();
					}
					var url = t.get('url').call(t, t.get('field').get('value'));
					if (typeof url.substring != 'function') {
						t.set({
							isAjaxRequestGoing: false
						});
						return;
					}
					t.currentRequest = $.ajax({
						url: url,
						timeout: t.get('timeout'),
						context: t,
						success: function(response){
							t.cache.set(v, response);
							t.processresponse(response);
						},
						error: function(jqXHR, textStatus, errorThrown){
							t.set({
								isValid: true,
								isAjaxRequestGoing: false
							});

							return;
						}
					});
				}, this.get('requestDelay'))
			},
			stopAsyncValidation: function() {
				if (this.currentRequest) {
					this.currentRequest.abort();
				};
				this.set({
					isAjaxRequestGoing: false
				});
			},
			processresponse: function (response) {
				this.set({
					isAjaxRequestGoing: false, 
					isValid: this.get("validateResponse").call(this, response)
				});
			}
		});
	}
}

Bv.Field.Validator.Rule.initRules();
