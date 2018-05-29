var input_constraint_handler = require("./constraint_handler.js");

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
        var status = this.current_status;
        if(status == "active_valid") status = "valid";
        return status;
    },
    get value () {
        return this.text_element.value;
    },
    set value (str) {
        this.text_element.value = str;
    },
    set_on_status_change : function(a_function) {
        this.on_status_change = a_function;
    },

    /*
        logic
    */
    determine_status : function(bool_on_blur){
        if(this.value.length > 0) this.enforce_input_constraints(bool_on_blur); // only enforce if there is input to enforce it upon
        if(bool_on_blur && this.value.length == 0 && this.required === true){ // if required, must not be empty
            var status = "invalid";
        } else if(this.value.length > 0 || !bool_on_blur){ // if value exists OR we are still focused, set status to valid
            var status = "valid";
        } else {
            var status = "default";
        }
        this.update_status_to(status, bool_on_blur); // update the status
        return status;
    },
    enforce_input_constraints : function(bool_on_blur){
        var key_modifier = (bool_on_blur)?"_blur":""; // if bool_on_blur, modify with "_blur"
        this.input_constraints.forEach((constraint)=>{
            var original_input = this.value;
            var constrained_input = input_constraint_handler[constraint+key_modifier](original_input);
            if(original_input != constrained_input) this.value = constrained_input; // if constrained value is not equal to actual value, update value
        })
    },

    /*
        update status function must:
         - update ui to show status
         - alert the label if status changed
    */
    update_status_to : function(new_status, bool_on_blur){
        if(!bool_on_blur && new_status == "valid") new_status = "active_valid"; // useful for multi_field - that way it looks valid when you enter the first element, but drops back to default if any are not filled in
        if(this.current_status == new_status) return; // do nothing if already that status
        this.current_status = new_status;
        this.display_status_as(new_status);
        if(typeof this.on_status_change == "function") this.on_status_change(new_status); // if there is an on status change function, run it
    },
    display_status_as : function(status){
        if(status == "active_valid") status = "valid";
        this.dom.setAttribute('input-status', status)
    },
}




module.exports = Text_Handler;
