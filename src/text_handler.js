var global_textHandler_enforceHandler = {

    alpha_only : function(textHandler){
        var value = textHandler.value;
        ///////////////////////////
        var enforcedValue = value.replace(/[^a-zA-Z]+/,'');
        //console.log(enforcedValue);

        ///////////////////////////
        if(value == enforcedValue){
            return true;
        }
        return enforcedValue;
    },
    alpha_only_blur : function(){ return true; },

    no_space : function(textHandler){
        var value = textHandler.value;
        ///////////////////////////

        var enforcedValue = value.replace(/ /g,'');

        ///////////////////////////
        if(value == enforcedValue){
            return true;
        }
        return enforcedValue;
    },
    no_space_blur : function(){ return true; },

    digits_only : function(textHandler){
        var value = textHandler.value;
        ///////////////////////////

        var enforcedValue = value.replace(/\D+/g, '');

        ///////////////////////////
        if(value == enforcedValue){
            return true;
        }
        return enforcedValue;
    },
    digits_only_blur : function() {return true},

    numeric_only : function(textHandler){
        var value = textHandler.value;
        ///////////////////////////

        var enforcedValue = value.replace(/[^0-9.]/g, '');

        ///////////////////////////
        if(value == enforcedValue){
            return true;
        }
        return enforcedValue;
    },
    numeric_only_blur : function() {return true},


    numeric_time : function(textHandler){
        var value = textHandler.value;
        ///////////////////////////

        var enforcedValue = value.replace(/[^0-9\:]/g, '');

        ///////////////////////////
        if(value == enforcedValue){
            return true;
        }
        return enforcedValue;
    },
    numeric_time_blur : function(textHandler) {
        var value = textHandler.value;
        ///////////////////////////
        if(value == "") return true; // if its empty, enable it to be null

        function pad_each_part_to_two(part){
            if(typeof part == "undefined" || part == null) part = "00"; // default to zero if undefined
            while(part.length < 2) part = "0" + part; // padd with 0's at front if less than 2
            if(part.length > 2) part = part.substring(0,2);
            return part;
        }

        var parts = value.split(":");
        while (parts.length < 3) parts.push("00"); // ensure default is 00:00:00 if any number is defined
        var cleaned_parts = [];
        parts.forEach((part)=>{
            var cleaned_part = pad_each_part_to_two(part);
            cleaned_parts.push(cleaned_part);
        })
        time = cleaned_parts.join(":");

        var enforced_value = time;
        ///////////////////////////
        if(value == enforced_value) return true;
        return enforced_value;
    },

    numeric_date : function(textHandler){
        var value = textHandler.value;
        ///////////////////////////

        var enforcedValue = value.replace(/[^0-9\\\/\-]/g, '');  // any number + / or \ or -

        ///////////////////////////
        if(value == enforcedValue){
            return true;
        }
        return enforcedValue;
    },
    numeric_date_blur : function() {return true},


    price : function(textHandler){
        var value = textHandler.value;
        var origValue = value;
        ///////////////////////////
        if(value == ""){
            return true;
        }
        value = value.replace(/([^0-9\.])+/g,'');
        var datas = value.split(".");

        var valueA = datas[0];
        var valueB = "";
        var total = datas.length;
        for(var index = 1; index < total; index++){
            valueB += datas[index];
        }
        valueB = valueB.substr(0,2);
        value = valueA;
        if(datas.length > 1){
            value += "." + valueB;
        }

        var enforcedValue = value;
        value = origValue;
        ///////////////////////////
        if(value == enforcedValue){
            return true;
        }
        return enforcedValue;
    },
    price_blur : function(textHandler){
        var value = textHandler.value;
        ///////////////////////////

        price = value+"";
        price = price.replace(/^0+/, '');
        price = price.split(".");
        if(price[0] == "") price[0] = "0";
        if(price[1] == undefined) price[1] = "00";
        while(price[1].length < 2) price[1] += "0";
        price = price.join(".");

        var enforcedValue = price;
        ///////////////////////////
        if(value == enforcedValue){
            return true;
        }
        return enforcedValue;
    },

}

var validation_handler = {

    date : function(bool_blur, value){
        if(!bool_blur) return true; // assume ok if not blurred
        var dateString = value;

        // Validates that the input string is a valid date formatted as "mm/dd/yyyy"; https://stackoverflow.com/a/6178341/3068233
        // First check for the pattern
        if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;

        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if(year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    },
    time : function(bool_blur, value){
        if(!bool_blur) return true; // ok if not blured yet
        var s = value + ""; // https://stackoverflow.com/a/11928894/3068233
        var t = s.split(':');
        return /^\d\d:\d\d:\d\d$/.test(s) &&
             t[0] >= 0 && t[0] < 25 &&
             t[1] >= 0 && t[1] < 60 &&
             t[2] >= 0 && t[2] < 60;
        return valid;
    }
}

function global_textHandler (){
    ////////////////////
    // Constants defined externally
    ////////////////////
    this.inputValidationFunction = null;
    this.google_autocomplete_manager = null;
    this.DOM = {}; // used also with coordination of classes, if defined in classes must be defined in DOM
    /*
        thisHandler.DOM.inputElement = document.getElementById(theID + "_"+"inputElement");
        thisHandler.DOM.inputHolder = document.getElementById(theID + "_"+"inputHolder");
        thisHandler.DOM.placeHolder = document.getElementById(theID + "_"+"placeHolder");
    */
    this.labelManager = null;
    this.enforce = {
        no_space : false,
        digits_only : false,
        price : false,
        alpha_only : false,
    };

    ////////////////////
    // Internally defined constants
    ////////////////////
    this.currentStatus = "default";
    this.raw_validity = null;
}

///////////////////////////////////////////////////////////////////
// Static Properties and Methods
/////////////////////////////////////
global_textHandler.prototype = {

    ////////////////////
    // Constants Re-Defined in init.js
    ////////////////////
    enforceHandler : global_textHandler_enforceHandler,
    validation_handler : validation_handler,
    classes : {},
    /*
    classes : {
        inputElement : {
            default : ...,
            valid : ....,
            invalid : .....,
        }
    },
    */

    get status(){
        return this.currentStatus;
    },

    get value () {
        return this.DOM.inputElement.value;
    },

    set value (str) {
        this.DOM.inputElement.value = str;
    },

    initialize : function(){
        // set classes to elements
        if(typeof this.DOM.inputElement !== "undefined") this.DOM.inputElement.className += " " + this.classes.inputElement.default;
        if(typeof this.DOM.inputHolder !== "undefined") this.DOM.inputHolder.className += " " + this.classes.inputHolder.default;
        if(typeof this.DOM.placeHolder !== "undefined") this.DOM.placeHolder.className += " " + this.classes.placeHolder.default;

        // set bindings
        this.DOM.inputElement.onfocus = (function(){ this.determineStatusOnActivity(); }).bind(this);
        this.DOM.inputElement.onkeyup = (function(){ this.determineStatusOnActivity(); }).bind(this);
        this.DOM.inputElement.onblur = (function(){ this.determineStatusOnBlur(); }).bind(this);
    },

    enforceInputRules : function(){
        var keys = Object.keys(this.enforce);
        var total = keys.length;
        for(var index = 0; index < total; index++){
            var thisKey = keys[index];
            var boolToEnforce = this.enforce[thisKey];
            if(boolToEnforce){
                var result = this.enforceHandler[thisKey](this);//run the function and pass this as a parameter
                if(typeof result == "string"){
                    this.value = result;
                }
            }
        }
    },


    enforceInputRules_blur : function(){
        var keys = Object.keys(this.enforce);
        var total = keys.length;
        for(var index = 0; index < total; index++){
            var thisKey = keys[index];
            var boolToEnforce = this.enforce[thisKey];
            if(boolToEnforce){
                var result = this.enforceHandler[thisKey+"_blur"](this);//run the function and pass this as a parameter
                if(typeof result == "string"){
                    this.value = result;
                }
            }
        }
    },

    determineStatusOnBlur : function(submissionAttempt){
        this.enforceInputRules_blur();

        var value = this.value;
        if(value.length > 0 || this.inputValidationFunction !== null){
            // If there is input, validate it or a specified validation function
            this.validateTheInput(true, submissionAttempt);
        } else if (this.required == true){
            // If its empty and required, show invalid
            this.displayThatInputIs("invalid");
        } else {
            // If its empty and not required, show default
            this.displayThatInputIs("default");
        }
        this.passRawStatusToLabel();
    },

    determineStatusOnActivity : function(){
        // Enforce Input Rules
        this.enforceInputRules();
        var value = this.value;
        if(value.length > 0 || this.inputValidationFunction !== null){
            // If there is input, validate it or a specified validation function
            this.validateTheInput(false);
        } else {
            // If its empty and key the input is active, just show valid
            this.displayThatInputIs("valid");
        }
        this.passRawStatusToLabel();
    },

    passRawStatusToLabel: function(){
      var current_raw_validity = this.assessRawValidity(true, true);
      if(this.raw_validity != current_raw_validity) this.labelManager.respondToRawValidityChange(current_raw_validity);
      this.raw_validity = current_raw_validity;
    },

    validateTheInput : function(bool_blur, submissionAttempt){
       if(this.inputValidationFunction == null){
            this.displayThatInputIs("valid");
       } else {
           var status = this.inputValidationFunction(bool_blur, this.value, submissionAttempt);
           //console.log(status);
           if(status == null){
                this.displayThatInputIs("default");
           } else if(status == true){
                this.displayThatInputIs("valid");
           } else {
                this.displayThatInputIs("invalid");
           }
      }
    },

    assessRawValidity : function(boolOnBlur, submissionAttempt){
       boolOnBlur = true;
       submissionAttempt = true;
       if(this.inputValidationFunction == null){
           if(this.required == true) var status = false;
           if(this.required == false) var status = null;
           if(this.value.length > 0) var status = true;
       } else {
           var status = this.inputValidationFunction(boolOnBlur, this.value, submissionAttempt);
       }
       return status;
    },

    displayThatInputIs : function(status, force){
        if(status == null){
            status = "default";
        } else if (status == true){
            status = "valid";
        } else if (status == false){
            status = "invalid";
        }
        //console.log(status);
        if(this.currentStatus == status){
            return;
        }

        if(status == "default" && this.required == true && force !== true){
            // if this is a required field, it should never go back to default, it should go to invalid
            status = "invalid";
        }

        keys = Object.keys(this.classes);
        total = keys.length;
        currentStatus = (this.currentStatus);
        for(index = 0; index < total; index++){
            thisKey = keys[index];
            if(thisKey == "labelHolder"){
                console.log("Warning : labelHolder was set in DOM");
            } else {
                this.changeDisplayStatusFromTo(thisKey, currentStatus, status);
            }
        }
        this.currentStatus = status;


        ///////////////////////
        // LabelHolder is parsed seperately due to cases when multiple inputs fall under the same label
        ///////////////////////
        this.labelManager.changeDisplayStatusFromTo(status);
    },

    changeDisplayStatusFromTo : function(thisKey, fromStatus, toStatus){
        currentStatus = fromStatus;
        status = toStatus;

        //console.log(thisKey);
        currentClass = this.classes[thisKey][currentStatus];
        newClass = this.classes[thisKey][status];
        if(currentClass == newClass) { return; }; // if they're equal, dont do anything
        thisElement = this.DOM[thisKey];
        if(thisElement == undefined){
            // if the DOM element was never defined, warn user and skip;
            //console.log("Warning : element for " + thisKey + " was never defined or does not exist, skipping");
            return;
        }
        elementClassContainsExpectedClass = (thisElement.className.indexOf(currentClass) > -1);
        if(!elementClassContainsExpectedClass){
            // If the element does not have the expected class inside its class name, warn client and skip
            console.log("Warning : input element without current class name, not changing class");
            return;
        }
        // Action
        thisElement.className = thisElement.className.replace(currentClass, newClass); // replace the old class with new class
    },
}



global_textHandler.prototype.classes = {
    inputElement : {
        default : null,
        valid : null,
        invalid : null,
    },
    inputHolder : {
        default : "text_handler_BottomBorderDefault",
        valid : "text_handler_BottomBorderValid",
        invalid : "text_handler_BottomBorderInvalid",
    },
    placeHolder : {
        default : "text_handler_SupportTextColorDefault",
        valid : "text_handler_MainTextColor",
        invalid : "text_handler_SupportTextColorDefault",
    },
};


module.exports = global_textHandler;
