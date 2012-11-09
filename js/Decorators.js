
Bv.Field.Decorator = {};

Bv.Field.Decorator.datePicker = Backbone.Model.extend({
	defaults: {
		field: null,
		options: {}
	},
	initialize: function(){
		this.on('change:field', function(){
			if (!this.get('field')) {
				return;
			}
			this.get('field').get('dom').calendar(this.get('options'));
		}, this);
		
		this.trigger("change:field");
	}
})

Bv.Field.Decorator.onlyDigits = Backbone.Model.extend({
	initialize: function(){
		this.on('change:field', function(){
			if (!this.get('field')) {
				return;
			}
			this.get('field').get('dom').numeric();
		}, this);

		this.trigger("change:field");
	}
})

Bv.Field.Decorator.passwordValidate = Backbone.Model.extend({
	initialize: function(){
		this.on('change:field', function(){
			if (!this.get('field')) {
				return;
			}
			this.get('field').get('dom').passwordValidate();
		}, this);

		this.trigger("change:field");
	}
})

Bv.Field.Decorator.focus = Backbone.Model.extend({
	defaults: {
		field: null
	},
	initialize: function(){
		this.on('change:field', function(){
			if (!this.get('field')) {
				return;
			}
			this.get('field').on("change:hasFocus", function(){
				this.get('dom').toggleClass("field-under-focus", this.get('hasfocus'));
				
				if (this.get('hasFocus')) {
					if(this.getGroup().get('dom').css('z-index') != '1500') {
						// increase z-index
						this.zIndex = this.getGroup().get('dom').css('z-index');
						this.getGroup().get('dom').css('z-index', 1500);
					}
				} else{
					// return back
					this.getGroup().get('dom').css('z-index', this.zIndex);					
				}
			},this.get('field'));
		}, this);
		this.trigger("change:field");
	}
});

Bv.Field.Decorator.validateOnBlur = Backbone.Model.extend({
	initialize: function(){
		this.on('change:field', function(){
			if (!this.get('field')) {
				return;
			}
			this.get('field').on("change:wasBlur", function(){
				if(this.get('wasBlur')) {
					this.set({
						isValidated: true
					});
				}
			},this.get('field'));
		}, this);		
	}
});
Bv.Field.Decorator.helper = Backbone.Model.extend({
	defaults: {
		field: null,
		text: "",
		isGroup: false
	},
	helper: false,
	elmHtml: '<div class="input-helper"></div>',
	dependsFromField: "change:isEmpty change:hasFocus",
	dependsFromThis: false,
	animationTime: 0,
	setPosition: function(){
		var field = this.get('field'),
		dom = field.get('dom'),
		offset = dom.position();
		this.getHelper().css({
			left: offset.left - (this.get('isGroup')?37:0), 
			top: offset.top
		});
	},
	isShown: function(field){
		return field.get('isEmpty') && !field.get('hasFocus');
	},
	updateUI: function(){
		if (this.isShown(this.get('field'))) {
			this.show();
		}else{
			this.hide();
		}
	},
	initialize: function(){
		var t = this;
		this.on('change:field', function(){
			if (!this.get('field')) {
				return;
			}
			if (this.dependsFromField) {
				this.get('field').on(this.dependsFromField, this.updateUI, this);
			}
			
			if (this.dependsFromThis) {
				this.on(this.dependsFromThis, this.updateUI, this);
			}
			
			this.get('field').trigger("change:isEmpty");
		}, this);
		
		
		
		this.trigger("change:field");
	},
	/*
	 * this to prevent blinking
	 */
	lastShowTimeout: 0,
	lastHideTimeout: 0,
	show: function () {
		var t = this;
		clearTimeout(t.lastHideTimeout);
		this.lastShowTimeout = setTimeout(function(){
			t.setPosition();
			t.getHelper().fadeIn(t.animationTime);
		}, 50);
	},
	hide: function (moment) {
		var t = this;
		clearTimeout(this.lastShowTimeout);
		this.lastHideTimeout = setTimeout(function(){
			t.getHelper().fadeOut(t.animationTime);
		}, 50);
	},
	getHelper: function(){
		if (this.helper == false) {
			var t = this;
			this.helper = $(this.elmHtml);
			this.helper.html(this.get('text'));
			this.helper.hide();
			if (Bv.isMobile) {
				if (this.get('isGroup')) {
					_.each(t.get('field').getValidator().fields,function(val,key){
						val.get('dom').parent().append(t.helper);
					})
				}else{
					t.get('field').get('dom').parent().find(".field-box").append(this.helper);
				}
			} else {
				if (this.get('isGroup')) {
					t.get('field').get('dom').prepend(this.helper);
				}else{
					t.get('field').get('dom').parent().prepend(this.helper);
				}
			}

			this.helper.click(function(){
				t.get('field').get('dom').focus();
			});
			this.on('change:text', function(){
				this.helper.html(this.get('text'));
			}, this);
		}
		return this.helper;
	}
});

Bv.Field.Decorator.infotooltip = Bv.Field.Decorator.helper.extend({
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

Bv.Field.Decorator.errortooltip = Bv.Field.Decorator.infotooltip.extend({
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


Bv.Field.Decorator.icon = Bv.Field.Decorator.helper.extend({
	defaults: {
		state: "hidden",
		text: "",
		isGroup: false
	},
	elmHtml: '<div class="field-icon"></div>',
	dependsFromField: false,
	dependsFromThis: "change:state",
	isPositionSet: false,
	isShown: function(field){
		return this.get('state') != 'hidden' || this.get('state') != '';
	},
	setPosition: function(){
		if(!this.isPositionSet){
			this.getHelper().css({
				right: 37, 
				top: 4
			});
			this.isPositionSet = true;
		}
	},
	getHelper: function(){
		if (this.helper == false) {
			var t = this;
			this.helper = $(this.elmHtml);
			this.helper.html(this.get('text'));
			this.helper.hide();
			if (this.get('isGroup')) {
				t.get('field').get('dom').prepend(this.helper);
			}else{
				t.get('field').get('dom').parent().prepend(this.helper);
			}
			this.helper.click(function(){
				t.get('field').get('dom').focus();
			});
			this.on('change:text', function(){
				this.helper.html(this.get('text'));
			}, this);
		}
		return this.helper;
	},
	initialize: function(){
		var t=this;
		this.constructor.__super__.initialize.apply(this, arguments);
		this.on('change:state', function(){
			if (Bv.isMobile) {
				if (this.get('isGroup')) {

					_.each(t.get('field').getValidator().fields,function(val,key){
						val.get('dom').closest(".field-box").removeClass('field-box-invalid field-box-hidden field-box-loading field-box-invalid field-box-valid').addClass('field-box-' + t.get('state'));
					})

				}else{
					this.get('field').get('dom').find(".field-box").removeClass('field-box-invalid field-box-hidden field-box-loading field-box-invalid field-box-valid').addClass('field-box-' + this.get('state'));
				}

			}
			this.getHelper().attr('class', 'field-icon field-icon-' + this.get('state'));
		}, this);
	}
});
