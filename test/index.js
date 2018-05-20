process.env.src_root = __dirname + "/../src";
process.env.test_env_root = __dirname + "/_env";
process.env.modules_root = __dirname + "/../node_modules";

// dependencies
var assert = require('assert');

// log trace for unhandled rejections
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});


/*
    setup browser env variables for clientside require
*/
var jsdom = require("jsdom");
var xmlhttprequest = require("xmlhttprequest");
global.window = new jsdom.JSDOM(``,{
    url: "file:///",
    resources: "usable", // load iframes and other resources
    runScripts : "dangerously", // enable loading of scripts - dangerously is fine since we are running code we wrote.
}).window;
window.XMLHttpRequest = xmlhttprequest.XMLHttpRequest; // use this http request so that CORS is not considered.

/*
    load the clientside_require module
*/
window.node_modules_root = process.env.modules_root; // define modules root
require("clientside-require"); // initializes clientside_require into the window global object


/*
    run tests
*/
describe('general', function(){
    it('should be able to load', async function(){
        var view_loader = await window.clientside_require.asynchronous_require("clientside-view-loader");
        var dom = await view_loader.load(process.env.src_root).build();
        assert.equal(dom.className, "input_text_template_holder", "check that classname matches up")
    })
})
