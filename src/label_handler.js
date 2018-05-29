function Label_Handler(label_element, text_handlers){
    // text handler definitions
    this.text_handlers = text_handlers; // text handlers will be used to get status
    this.text_handlers.forEach(this.append_status_change_listener.bind(this));
    this.text_handlers.forEach(this.define_status_state_holder.bind(this));

    // dom definition
    this.dom = label_element;

    // initialize status
    this.current_status = "default";
    this.display_status_as("default");
}


Label_Handler.prototype = {
    // static constants
    rank : [null, "valid", "default", "invalid"],
    rankBool : [null, true, null, false],

    /*
        getters
    */
    // submission status forces each element to report status `on_blur` and gets it directly from sources
    get submission_status(){
        var total = this.text_handlers.length;
        var statuses = [];
        for(var index = 0; index < total; index++){ // get the status of each handler, find the max_rank status
            var text_handler = this.text_handlers[index];
            if(bool_determine_for_submission) text_handler.determine_status(bool_determine_for_submission); // if user wants, we can update each texthandler as if we were submitting it to check what its final status would be now
            var this_status = text_handler.status;
            statuses.push(this_status);
        }
        return this.find_ranking_status(statuses);
    },
    get status(){
        return this.current_status;
    },

    /*
        utilities
    */
    force_status_update : function(bool_on_blur){
        this.text_handlers.forEach((handler)=>handler.determine_status(bool_on_blur));
    },
    find_ranking_status : function(statuses){
        var max_rank = 0;
        statuses.forEach((status)=>{
            var status_rank = this.rank.indexOf(status);;
            if(status_rank > max_rank) max_rank = status_rank;
        })
        return this.rank[max_rank];
    },

    /*
        status change logic
    */
    define_status_state_holder : function(text_handler, text_handler_index){
        if(typeof this.statuses == "undefined") this.statuses = {};
        this.statuses[text_handler_index] = text_handler.status;
    },
    append_status_change_listener : function(text_handler, text_handler_index){ // sets the on_status_change function for a text handler
        text_handler.on_status_change = (function(new_status){
            this.report_status_change(new_status, text_handler_index);
        }).bind(this);
    },
    report_status_change : function(new_status, text_handler_index){
        // update the status for that handler
        this.statuses[text_handler_index] = new_status;

        // determine new status
        var original_status = this.current_status;
        var new_status = this.find_ranking_status(Object.values(this.statuses));
        if(original_status == new_status) return; // status did not change

        // update label to new status, since it changed
        this.current_status = new_status;
        this.display_status_as(new_status);
    },

    /*
        display functionality
    */
    display_status_as : function(status){
        this.dom.setAttribute('input-status', status)
    },

}


module.exports = Label_Handler;
