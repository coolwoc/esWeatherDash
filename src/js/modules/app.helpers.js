export class Helpers {
    static unixToDateTime (value) {
        // init values
        let ampm = null;
        let monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        
        let date = new Date (value*1000);
        let hours = date.getHours();
        let minutes = '0' + date.getMinutes();
        
        let day = date.getDate();
        let month = monthArray[date.getMonth()];
    
        (hours > 0 && hours < 12)  ? ampm = 'am' : (hours == 0 ? ampm = 'am' : ampm = 'pm');
    
        // display time
        let newFormat = day+' '+ month +' '+ hours +':'+ minutes.substr(-2) + ' '+ ampm;
        
        return newFormat;
    }
    static unixToDate(value) {
        // init values
        let ampm = null;
        let monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        let date = new Date (value*1000);
        let day = date.getDate();
        let month = monthArray[date.getMonth()];
    
        // display time
        let newFormat = day+' '+ month;

        return newFormat;
    }
    static unitToHour(value) {
        // init values
        let ampm = null;

        let date = new Date (value*1000);
        let hours = date.getHours();
        let minutes = '0' + date.getMinutes();

        (hours > 0 && hours < 12)  ? ampm = 'am' : (hours == 0 ? ampm = 'am' : ampm = 'pm');

        // display time
        let newFormat = hours +':'+ minutes.substr(-2) + ' '+ ampm;

        return newFormat;
    }
    static elementIcon(data, element) {
        if ( data.icon == '01d') {
            element.classList.add('icon-sunny');
        } else if (data.icon == '02d' || '03d' || '04d') {
            element.classList.add('icon-clouds');
        } else if (data.icon == '09d' || '10d') {
            element.classList.add('icon-rain');
        } else if (data.icon == '11d') {
            element.classList.add('icon-thunderstorm');
        } else if (data.icon == '13d') {
            element.classList.add('icon-snow');
        } else if (data.icon == '50d') {
            element.classList.add('icon-mist');
        }
    }
}