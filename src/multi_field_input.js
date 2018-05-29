/*
    NOTE: typical usage of this view does not include this  file. It uses the clientside-view-loader to build, based on the generators and hydrators in this directory
*/

var Label_Handler = require("./label_handler.js");

/*
    export a multi-field labeling function, which hydrates the label_element with the same functionality as any other input-text AND creates the working label
        - .status()
        - .value()
*/
var Multi_Field_Input = function(label_element, text_inputs){
    // validate options
    if(!Array.isArray(text_inputs)) throw new Error("text inputs must be passed as an array");

    // append style classes to label
    label_element.classList.add('color_scheme-blue', 'input_text_element')

    // create the label handler
    this.label_handler = new Label_Handler(label_element, text_inputs);

    // define the text_inputs to retreive values from
    this.text_inputs = text_inputs;
}
Multi_Field_Input.prototype = {
    /*
    get value(){
        var value_list = [];
        this.text_inputs.forEach((input)=>{value_list.push(input.value)});
        return value_list;
    },
    get status() {
        return this.label_handler.submission_status;
    },
    */
}



module.exports = Multi_Field_Input;
