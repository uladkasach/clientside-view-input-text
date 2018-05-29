# Clientside-View-Input-Text

![clientside_view_input_text-demo](https://user-images.githubusercontent.com/10381896/40626997-25e91924-628a-11e8-9cea-85207a605f22.gif)

## Install
`npm install clientside-view-input-text --save`

## Use
```js
// building and appending the view
var view_loader = await load('clientside-view-loader'); // load the view loader
var text_input = await view_loader.load('clientside-view-text-input').build({label:"Full Name"});
document.body.appendChild(text_input);

// functionality usage
var value = text_button.value; // use the getter
```

# Options
```js
{
    label : STRING, // the label for the input
    title : STRING, // a description which displays on hover
    prefix : STRING, // a prefix before the input. e.g., "$"
    name : STRING, // dom name for the input element
    disabled : BOOLEAN, // disable the input
    password : BOOLEAN, // set as a password input, user input rendered as ****
    required : BOOLEAN, // make this a required field; shows red if empty
    type : STRING, // choose from ["number", "price", "percentage", "date", "time"]; input will enforce that only characters possible for that are accepted and validate that it is valid
}
```
