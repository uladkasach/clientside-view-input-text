var Text_Handler = require("./text_handler.js");
var Label_Handler = require("./label_handler.js");
var validators = require("./validators.js")
module.exports = async function(dom, options){
    // normalize input
    if(typeof options == "undefined") options = {};

    // validate input
    var valid_types = ["number", "numeric", "price", "percentage", "float", "date", "type"];
    if(options.type == "string" && valid_types.indexOf(options.type) == -1) throw new Error("an unknown options.type was requested for clientside-view-input-text : " + options.type)

    /*
        initialize text handler ---------------------------------------------------------------------------------------
    */
    // determine constraints
    var constraints = [];
    if(options.type == "number") constraints.push("digits_only");
    if(options.type == "price") constraints.push("price");
    if(options.type == "percentage") constraints.push("numeric_only");
    if(options.type == "float") constraints.push("numeric_only");
    if(options.type == "date") constraints.push("numeric_date");
    if(options.type == "time") constraints.push("numeric_time");

    // determine required
    var required = (options.required === true)?true:false; // default to false

    // initialize text handler
    var text_handler = new Text_Handler(dom, constraints, required);

    // determine validation function
    if(options.type == "date") var validation = validators.date;
    if(options.type == "time") var validation = validators.time;
    // if validation is defined, set the validation function
    if(typeof validation == "function") text_handler.set_validation(validation);

    // define the dom.validation setter
    Object.defineProperty(dom, 'validation', { // dom.value
        set : function(validation_function) { return text_handler.set_validation(validation_function); },
    });

    /*
        define and initialize label handler ---------------------------------------------------------------------------------------
        - IF label is defined, if its not defined, then we expect the user to create a label_handler on their own
    */
    if(typeof options.label == "string"){
        var label_element = dom.querySelector(".input_text_template_label");
        var labelHandler = new Label_Handler(label_element, [text_handler]);
    }

    /*
        add extraction logic (get value from input)
    */
    Object.defineProperty(dom, 'value', { // dom.value
        get: function() { return text_handler.value; }
    });
    Object.defineProperty(dom, 'status', { // dom.status
        get: function() {
            if(required) text_handler.determine_status(true); // if required, determine status first
            return text_handler.status;
        }
    });


    return dom;
}
