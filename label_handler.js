function global_textLabelHandler(){
    ////////////////////
    // Constants defined externally
    ////////////////////
    this.textHandlers = []; // text handlers will be used to get status
    this.element = null;
    this.on_update_function = null;

    ////////////////////
    // Constants defined internally
    ////////////////////
    this.status = "default";


}


global_textLabelHandler.prototype = {
    ////////////////////
    // Constants Re-Defined in init.js
    ////////////////////
    classes : {},
    /*
    classes : {
        default : ...,
        valid : ....,
        invalid : .....,
    },
    */
    rank : [null, "valid", "default", "invalid"],
    rankBool : [null, true, null, false],


    get submissionStatus () {
        // Run through each textHandler, run onblurvalidation on each, then return rank in bool form
        var total = this.textHandlers.length;
        //console.log("running submissionStatus for " + this.title);
        for(var index = 0; index < total; index++){
            thisHandler = this.textHandlers[index];
            thisHandler.determineStatusOnBlur(true);
        }
        var rankOfStatus = this.rank.indexOf(this.status);
        return this.rankBool[rankOfStatus];
    },

    get all_valid_raw() {
        var all_valid = true;
        var total = this.textHandlers.length;
        //console.log("running all_valid_if_blured for " + this.title);
        for(var index = 0; index < total; index++){
            thisHandler = this.textHandlers[index];
            var response = thisHandler.assessRawValidity(true, true);
            if(response != true){
                all_valid = false;
                break;
            }
        }
        return all_valid;
    },

    get title (){
        if(this.element.getElementsByClassName("labelManager_title")[0] == undefined) return "undefined";
        title = this.element.getElementsByClassName("labelManager_title")[0].innerHTML;
        title = title.replace(/\s/g, "");
        return title;
    },

    initialize : function(){
        this.element.className += " " + this.classes[this.status];
    },


    getHighest : function(statusA, statusB){
        var rankA = this.rank.indexOf(statusA);
        var rankB = this.rank.indexOf(statusB);
        var highest = null;
        if(rankA < rankB){
            highest = statusB;
        } else {
            highest = statusA;
        }
        //console.log("return " + highest);
        return highest;
    },

    // trigger update function when rawValidity of an input changes (raw -> blur and submission)
    respondToRawValidityChange : function(raw_validity){
        //console.log("new raw validity");
        if(this.on_update_function == null) return;
        //console.log(raw_validity);
        this.on_update_function();
    },

    changeDisplayStatusFromTo : function(setStatus){
        // Highest level = invalid
        // Mid level = default
        // Lowest level = valid
        // Run through all textHandlers and determine highest level - status level

        highestStatus = setStatus;
        total = this.textHandlers.length;
        for(index = 0; index < total; index++){
            thisHandler = this.textHandlers[index];
            thisStatus = thisHandler.status;
            highestStatus = this.getHighest(highestStatus, thisStatus);
        }

        currentClass = this.classes[this.status];
        nextClass = this.classes[highestStatus];
        if(currentClass == nextClass){
            //console.log("already set");
            return; // not going to change a thing
        }

        //console.log(currentClass + " VS " + nextClass);
        //console.log(this.element.className);
        this.element.className = this.element.className.replace(currentClass, nextClass); // replace the old class with new class
        //console.log(this.element.className);


        this.status = highestStatus;
    },

}




global_textLabelHandler.prototype.classes = {
    default : "text_handler_SupportTextColorDefault",
    valid : "text_handler_SupportTextColorValid",
    invalid : "text_handler_SupportTextColorInvalid",
}


module.exports = global_textLabelHandler;
