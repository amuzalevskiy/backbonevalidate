	
Bv.Rule.server = Bv.Rule.proto.extend({
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