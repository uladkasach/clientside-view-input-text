function Text_Handler(dom, constraints, required){
    this.dom = dom;
    this.text_element = this.dom.querySelector("input[type='text']");

    // define input constraints
    if(typeof input_constraints == "undefined") input_constraints = [];
    if(!Array.isArray(input_constraints)) throw new Error("input constraints must be an array");
    this.input_constraints = constraints;

    // append listeners
    this.text_element.onfocus = (function(){ this.determine_status(); }).bind(this);
    this.text_element.onkeyup = (function(){ this.determine_status(); }).bind(this);
    this.text_element.onblur = (function(){ this.determine_status(true); }).bind(this);

    // define requried state
    if(required === true) this.required = true;

    // define state
    this.current_status = "default";
    this.display_status_as("default"); // initialize as default status
}

///////////////////////////////////////////////////////////////////
// Static Properties and Methods
/////////////////////////////////////
Text_Handler.prototype = {
    /*
        utility getters and setters
    */
    get status(){
        return this.current_status;
    },
    get value () {
        return this.text_element.value;
    },
    set value (str) {
        this.text_element.value = str;
    },
    on_status_change(a_function) {
        this.on_status_change = a_function;
    },

    /*
        logic
    */
    determine_status : function(bool_on_blur){
        this.enforce_input_constraints(bool_on_blur);
        if(bool_on_blur && this.value.length == 0 && this.required === true){ // if required, must not be empty
            var status = "invalid";
        } else if(this.value.length > 0 || !bool_on_blur){ // if value exists OR we are still focused, set status to valid
            var status = "valid";
        } else {
            var status = "default";
        }
        this.update_status_to(status); // update the status
        return status;
    },
    enforce_input_constraints : function(bool_on_blur){
        var key_modifier = (bool_on_blur)?"_blur":""; // if bool_on_blur, modify with "_blur"
        this.input_constraints.forEach((constraint)=>{
            var original_input = this.value;
            var constrained_input = input_constraint_handler[this_key+key_modifier](original_value);
            if(original_input != constrained_input) this.value = constrained_input; // if constrained value is not equal to actual value, update value
        })
    },


    /*
        update status function must:
         - update ui to show status
         - alert the label if status changed
    */
    update_status_to : function(new_status){
        if(this.current_status == new_status) return; // do nothing if already that status
        this.current_status = new_status;
        this.display_status_as(new_status);
        if(typeof this.on_status_change == "function") this.on_status_change(new_status); // if there is an on status change function, run it
    },
    display_status_as : function(status){
        this.dom.setAttribute('input-status', status)
    },
}




module.exports = Text_Handler;







var input_enforce_handler = {

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
