module.exports = {
    alpha_only : function(value){
        return value.replace(/[^a-zA-Z]+/,'');
    },
    alpha_only_blur : function(value){ return value; },

    no_space : function(value){
        return value.replace(/ /g,'');
    },
    no_space_blur : function(value){ return value; },

    digits_only : function(value){
        return value.replace(/\D+/g, '');
    },
    digits_only_blur : function(value) {return value},

    numeric_only : function(value){
        return value.replace(/[^0-9.]/g, '');
    },
    numeric_only_blur : function(value) {return value},


    numeric_time : function(value){
        return value.replace(/[^0-9\:]/g, '');
    },
    numeric_time_blur : function(value) {
        function pad_each_part_to_two(part){
            if(typeof part == "undefined" || part == null) part = "00"; // default to zero if undefined
            while(part.length < 2) part = "0" + part; // padd with 0's at front if less than 2
            if(part.length > 2) part = part.substring(0,2);
            return part;
        }

        var parts = value.split(":");
        while (parts.length < 3) parts.push("00"); // ensure default is 00:00:00 if any number is defined
        var cleaned_parts = [];
        parts.forEach((part)=>{
            var cleaned_part = pad_each_part_to_two(part);
            cleaned_parts.push(cleaned_part);
        })
        time = cleaned_parts.join(":");

        return time;
    },

    numeric_date : function(value){
        return value.replace(/[^0-9\\\/\-]/g, '');  // any number + / or \ or -
    },
    numeric_date_blur : function(value) {return value},


    price : function(value){
        value = value.replace(/([^0-9\.])+/g,'');
        var datas = value.split(".");

        var valueA = datas[0];
        var valueB = "";
        var total = datas.length;
        for(var index = 1; index < total; index++){
            valueB += datas[index];
        }
        valueB = valueB.substr(0,2);
        value = valueA;
        if(datas.length > 1){
            value += "." + valueB;
        }

        return value;
    },
    price_blur : function(value){
        price = value+"";
        price = price.replace(/^0+/, '');
        price = price.split(".");
        if(price[0] == "") price[0] = "0";
        if(price[1] == undefined) price[1] = "00";
        while(price[1].length < 2) price[1] += "0";
        price = price.join(".");
        return price;
    },

}
