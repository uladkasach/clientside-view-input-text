load("./colors.css")

module.exports = function(dom_clone, options){
    if(typeof options == "undefined") options = {};
    var template = dom_clone;

    // set label
    if(typeof options.label !== "undefined") // if label is defined, set it
        template.querySelector(".input_text_template_label").innerHTML = options.label;

    // set prefix
    if(typeof options.prefix !== "undefined")
        template.querySelector(".prefix").innerHTML = options.prefix;

    // disable input if required
    if(options.disabled === true)
        template.querySelector("input").disabled = true;

    if(typeof options.classes_to_append !== "undefined")
        template.querySelector("input").classList.add(options.classes_to_append);

    if(typeof options.title !== "undefined")
        template.title = options.title;

    if(typeof options.password !== "undefined" && options.password === true)
        template.querySelector("input").type = "password";


    // give name if exists
    if(typeof options.name != "undefined")
        template.querySelector("input").name = options.name;


    /*
        define and initialize text handler
    */
    var promise_to_initialize_handler = Promise.all([load("./text_handler.js"), load("./label_handler.js")])
        .then(([text_handler_class, label_handler_class])=>{

            var labelHandler = new label_handler_class();
            labelHandler.element = template.querySelector(".input_text_template_label");
            labelHandler.initialize();

            var textHandler = new text_handler_class();
            textHandler.DOM = {
                inputElement : template.querySelector("input"),
                inputHolder : template.querySelector(".input_text_template_input_holder"),
            };
            textHandler.labelManager = labelHandler;
            textHandler.required = true;

            // if type is defined, add input enforcement
            if(typeof options.type !== "undefined"){
                if(options.type == "price"){
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
            return textHandler;
        })



        // add extraction logic (get value from input)
        var promise_to_define_extraction = promise_to_initialize_handler
            .then((text_handler)=>{
                // extraction functions
                template.extract = {
                    value : function(){
                        return text_handler.value;
                    },
                    status : function(){
                        return text_handler.status;
                    },
                }

                // getter methods
                Object.defineProperty(template, 'value', { // dom.value
                    get: function() { return template.extract.value(); }
                });
                Object.defineProperty(template, 'status', { // dom.status
                    get: function() { return template.extract.status(); }
                });
            })


    return promise_to_define_extraction.then(()=>{return template});
}
