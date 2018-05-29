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
    if(typeof options.name != "undefined"){
        dom.querySelector("input").name = options.name;
        dom.querySelector("input").setAttribute("name", options.name);
        dom.setAttribute("name", options.name); // set it on main element as well as on input element
    }

    // define placeholder
    if(typeof options.placeholder != "undefined")
        dom.querySelector('input').placeholder = options.placeholder;

    // set max width
    if(typeof options.max_width != "undefined")
        dom.style.maxWidth = options.max_width + "px";

    // set label attribute
    if(typeof options.label == "string")  // if defined
        dom.setAttribute('label', options.label);


    return dom;
}
