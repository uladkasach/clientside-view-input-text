var validation_handler = {
    date : function(bool_blur, value){
        if(!bool_blur) return true; // assume ok if not blurred
        var dateString = value;

        // Validates that the input string is a valid date formatted as "mm/dd/yyyy"; https://stackoverflow.com/a/6178341/3068233
        // First check for the pattern
        if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;

        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if(year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    },
    time : function(bool_blur, value){
        if(!bool_blur) return true; // ok if not blured yet
        var s = value + ""; // https://stackoverflow.com/a/11928894/3068233
        var t = s.split(':');
        return /^\d\d:\d\d:\d\d$/.test(s) &&
             t[0] >= 0 && t[0] < 25 &&
             t[1] >= 0 && t[1] < 60 &&
             t[2] >= 0 && t[2] < 60;
        return valid;
    }
}
