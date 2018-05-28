load("./colors.css")
module.exports = async function(dom, options){
    if(typeof options == "undefined") options = {};

    // set label
    if(typeof options.label !== "undefined") // if label is defined, set it
        dom.querySelector(".input_text_template_label").innerHTML = options.label;

    // set prefix
    if(typeof options.prefix !== "undefined")
        dom.querySelector(".prefix").innerHTML = options.prefix;

    // disable input if required
    if(options.disabled === true)
        dom.querySelector("input").disabled = true;

    if(typeof options.classes_to_append !== "undefined")
        dom.querySelector("input").classList.add(options.classes_to_append);

    if(typeof options.title !== "undefined")
        dom.title = options.title;

    if(typeof options.password !== "undefined" && options.password === true)
        dom.querySelector("input").type = "password";


    // give name if exists
    if(typeof options.name != "undefined")
        dom.querySelector("input").name = options.name;


    return dom;
}
