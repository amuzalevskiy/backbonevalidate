
Bv.Decorator.Helper = Backbone.Model.extend({
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
    }
});