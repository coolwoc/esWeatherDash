import * as ELEMENTS from './app.elements';
import { Helpers } from './app.helpers';

export class location {
    constructor(localizaion, lat, long) {
        this.localizaion = localizaion;
        this.lat = lat;
        this.long = long;
    }
}

export class WeatherData {
    constructor(cityName, description, icon, feelsLike, windSpeed, visibility, humidity) {
        this.cityName = cityName;
        this.description = description;
        this.icon = icon;
        this.temperature = '';
        this.feelsLike = feelsLike;
        this.windSpeed = windSpeed;
        this.visibility = visibility;
        this.humidity = humidity
    }
}

export const WEATHER_PROXY_HANDLER = {
    get: function(target, property) {
        return Reflect.get(target, property);
    },
    set: function(target, property, value) {
        //const newValue = (value * 1.8 + 32).toFixed() + 'F.'; // conversion from celsius to farengeight
        const newValue = value.toFixed() + ' °C';
        return Reflect.set(target, property, newValue);
    }
};

// weekly data
export class WeeklyData extends WeatherData {
    constructor(cityName, description, icon, temp, tempMax, tempMin, timeStamp) {
        super(cityName, description, icon);
        this.temp = temp;
        this.tempMax = tempMax;
        this.tempMin = tempMin;
        this.timeStamp = timeStamp;
    }
}

// Day details
export class DayDetails extends WeatherData {
    constructor(cityName, temp, description, icon, sunset, sunrise, precipitation, humidity, uvIndex, maxWind) {
        super(cityName, temp, description, icon);
        this.sunset = sunset;
        this.sunrise = sunrise;
        this.precipitation = precipitation;
        this.humidity = humidity;
        this.uvIndex = uvIndex;
        this.maxWind = maxWind;
    }
    sunInfo() { // string for sunset and sunrise
        ELEMENTS.ELEMENT_DAILY_SUNRISE.textContent = Helpers.unitToHour(this.sunrise);        
        ELEMENTS.ELEMENT_DAILY_SUNSET.textContent = Helpers.unitToHour(this.sunset);
    }
}