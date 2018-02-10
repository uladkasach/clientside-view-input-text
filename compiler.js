module.exports = {
    generate : function(dom_clone, options){
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



        // add extraction logic (get value from input)
        template.extract = {
            value : function(){
                return template.querySelector("input").value;
            },
        }




        /*
            define and initialize text handler
        */
        var promise_to_initialize_handler = Promise.all([require("text_handler.js"), require("label_handler.js")])
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
                    } else {
                        console.error("Unknown type requested for options.type on template.input_text ")
                    }
                }

                textHandler.initialize();

                // add input to label manager
                labelHandler.textHandlers.push(textHandler);
            })


        return promise_to_initialize_handler.then(()=>{return template});
    }
}
