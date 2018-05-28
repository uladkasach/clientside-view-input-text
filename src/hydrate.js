var Text_Handler = require("./text_handler.js");
var Label_Handler = require("./label_handler.js");
module.exports = async function(template, options){
    if(typeof options == "undefined") options = {};

    /*
        define and initialize text handler
    */
    var labelHandler = new Label_Handler();
    labelHandler.element = template.querySelector(".input_text_template_label");
    labelHandler.initialize();

    var textHandler = new Text_Handler();
    textHandler.DOM = {
        inputElement : template.querySelector("input"),
        inputHolder : template.querySelector(".input_text_template_input_holder"),
    };
    textHandler.labelManager = labelHandler;
    textHandler.required = (options.required === true)?true:false; // default to false

    // if type is defined, add input enforcement
    if(typeof options.type !== "undefined"){
        if(options.type == "number"){
            textHandler.enforce.digits_only = true;
        } else if(options.type == "price"){
            textHandler.enforce.price = true;
        } else if(options.type == "percentage" || options.type == "float"){
            textHandler.enforce.numeric_only = true;
        } else if(options.type == "date"){
            textHandler.inputValidationFunction = textHandler.validation_handler.date; // assign validation function
            textHandler.enforce.numeric_date = true;
        } else if(options.type == "time"){
            textHandler.inputValidationFunction = textHandler.validation_handler.time; // assign validation function
            textHandler.enforce.numeric_time = true;
        } else {
            console.error("Unknown type requested for options.type on template.input_text ")
        }
    }

    textHandler.initialize();

    // add input to label manager
    labelHandler.textHandlers.push(textHandler);



    /*
        add extraction logic (get value from input)
    */
    Object.defineProperty(template, 'value', { // dom.value
        get: function() { return textHandler.value; }
    });
    Object.defineProperty(template, 'status', { // dom.status
        get: function() {
            if(textHandler.required) textHandler.determineStatusOnBlur(); // if required, determine status first
            return textHandler.status;
        }
    });


    return template;
}
