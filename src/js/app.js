import * as ELEMENTS from './modules/app.elements';
import { Http } from './modules/app.http';
import { WeatherData, WEATHER_PROXY_HANDLER, WeeklyData, DayDetails, location } from './modules/app.weather-data';
import { Helpers } from './modules/app.helpers';

import Chart from 'Chart.js';
import { linealHourChart } from './modules/app.linealHourChart';
import { DoughnutChart } from './modules/app.doughnutChart';

const APP_ID = 'use-your-own-key-here';
const APPIQ_ID = 'use-your-own-key-here';

// get location by city parse current data from browser navigator geolocation
getUserGeolocation();
function getUserGeolocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // get parameters
            const URL = 'https://eu1.locationiq.com/v1/reverse.php?key=' + APPIQ_ID + '&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&format=json';
            Http.fetchInterceptor(URL)
                .then(resolve => {
                    if(!resolve.address.village && !resolve.address.town && resolve.address.city) {
                        const LOCATION = new location(resolve.address.city, resolve.lat, resolve.lon);
                        getCodeHandler(LOCATION.localizaion);
                        getWeatherWeeklyHistory(LOCATION.lat, LOCATION.long)
                    } else if (!resolve.address.village && resolve.address.town && !resolve.address.city) {
                        const LOCATION = new location(resolve.address.town, resolve.lat, resolve.lon);
                        getCodeHandler(LOCATION.localizaion);
                        getWeatherWeeklyHistory(LOCATION.lat, LOCATION.long)
                    } else if (resolve.address.village && !resolve.address.town && !resolve.address.city) {
                        const LOCATION = new location(resolve.address.village, resolve.lat, resolve.lon);
                        getCodeHandler(LOCATION.localizaion);
                        getWeatherWeeklyHistory(LOCATION.lat, LOCATION.long)
                    } 
                    
                })
                .catch(error => console.log(error));
        });
    }
}

// AutoComplete
ELEMENTS.ELEMENT_SEARCH_CITY.addEventListener("keyup", function(event){
    setTimeout( () => hinterAutoComplete(event), 800 );
});

ELEMENTS.ELEMENT_SEARCH_CITY.addEventListener("focus", focusElement);
function focusElement() {
    ELEMENTS.ELEMENT_SEARCH_CITY.value = ''; // clear data
    ELEMENTS.ELEMENT_DATALIST.classList.remove('showList');
}

function hinterAutoComplete(event) {
    // retrieve the input elements
    let input = event.target;
    // minimum number of characters
    let min_characters = 0;
    if (input.value < min_characters) {
        return;
    } else {
        const URL = 'https://api.locationiq.com/v1/autocomplete.php?key='+ APPIQ_ID +'&q=' + input.value;
        Http.fetchInterceptor(URL)
        .then(respondData => {
            respondData.length > 0 ? ELEMENTS.ELEMENT_DATALIST.classList.add('showList') : ELEMENTS.ELEMENT_DATALIST.classList.contains('showList').remove('shoList'); 
            ELEMENTS.ELEMENT_DATALIST.textContent = '';
            respondData.forEach(function(item, idx) {
                // build the result list
                let option = document.createElement('option');
                let spanOption = document.createElement('span');
                option.value = item.display_name +'#'+ item.display_place +'#'+ item.lat +'#'+ item.lon +'#'+ item.address.country;
                spanOption.textContent = item.display_name;
                ELEMENTS.ELEMENT_DATALIST.appendChild(option);
                option.appendChild(spanOption);
                // onClick get value
                let targetOption = ELEMENTS.ELEMENT_DATALIST.getElementsByTagName('option');
                targetOption[idx].addEventListener('click', function(event) {
                    // get data from item
                    let tempString = event.target.value;
                    let tempTarget = tempString.split('#');
                    let tempName = tempTarget[1];
                    let tempLat = tempTarget[2];
                    let tempLong = tempTarget[3];
                    let tempCountry = tempTarget[4];
                    searchWeatherByName(tempName, tempCountry);
                    getWeatherWeeklyHistory(tempLat, tempLong);
                    ELEMENTS.ELEMENT_DATALIST.classList.remove('showList');
                });
            });
        })
        .catch(error => console.log(error));
    }
}

function getCodeHandler(searchValue) {
    // we toggle open-class
    let SEARCH_STRING = '';
    let openInputSearch = ELEMENTS.ELEMENT_SEARCH_CITY;
    openInputSearch.classList.toggle('isOpen'); // we toggle class here

    // if(SEARCH_STRING.length == 0) {
    //     alert('Please enter a city for autocomplete');
    // }

    ELEMENTS.ELEMENT_SEARCH_CITY.value.trim().length == 0 ? SEARCH_STRING = searchValue : SEARCH_STRING = ELEMENTS.ELEMENT_SEARCH_CITY.value.trim();

    // we make request
    //const URL = 'https://eu1.locationiq.com/v1/search.php?key=' + APPIQ_ID + '&q=' + SEARCH_STRING + '&format=json';
    const URL = 'https://api.locationiq.com/v1/autocomplete.php?key='+ APPIQ_ID +'&q=' + SEARCH_STRING;

    Http.fetchInterceptor(URL)
        .then(respondData => {
            let location = respondData[0].display_name.split(',')[0];
            searchWeatherByName(location);
        })
        .catch(error => console.log(error));

    // clear input field value and remove classes
    ELEMENTS.ELEMENT_SEARCH_CITY.value = null;
    ELEMENTS.ELEMENT_SEARCH_CITY.classList.remove('isOpen');
}

function searchWeatherByName(cityData, country) {
    const CITY_NAME = cityData;
    const CITY_COUNTRY = country;
    
    if(CITY_NAME.length == 0) {
        alert('Please enter a city name');
    } 
    const URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + CITY_NAME + '&units=metric&appid=' + APP_ID;
    Http.fetchInterceptor(URL)
        .then(respondData => {
            const WEATHER_DATA = new WeatherData(CITY_NAME, respondData.weather[0].description.toLowerCase(), respondData.weather[0].icon, respondData.main.feels_like, respondData.wind.speed, respondData.visibility, respondData.main.humidity);
            const WEATHER_PROXY = new Proxy(WEATHER_DATA, WEATHER_PROXY_HANDLER);
            WEATHER_PROXY.temperature = respondData.main.temp;
            updateWeather(WEATHER_PROXY, CITY_COUNTRY);
        })
        .catch(error => console.log(error));
}

// weekly data and charts
function getWeatherWeeklyHistory(lat, long) {
    const URL = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ long +'&exclude=null&units=metric&appid=' + APP_ID;
    Http.fetchInterceptor(URL)
        .then(respondData => {
            // init DOM and arrayData
            let dataOrganised = [];
            const elementLi = ELEMENTS.ELEMENT_WEEKLY_CARDS.getElementsByClassName('weather-week-item');
            while (elementLi.length > 0) elementLi[0].remove();

            let tempDataWeekly = respondData.daily;
            let tempDataHourly = respondData.hourly;
            let tempDataCurrently = respondData.current;
            // Build weekly Cards HTML
            for (let key in  tempDataWeekly) {
                if(tempDataWeekly.hasOwnProperty(key)) {
                    let numInt = +key;
                    dataOrganised[key] = {};
                    dataOrganised[key]['id'] = numInt + 1;
                    dataOrganised[key]['cityName'] = 'Istanbul';
                    dataOrganised[key]['timeStamp'] = tempDataWeekly[key].dt;
                    dataOrganised[key]['temperature'] = tempDataWeekly[key].temp;
                    dataOrganised[key]['weather'] = tempDataWeekly[key].weather[0];
                    dataOrganised.push(dataOrganised[key]);
                }
                dataOrganised.pop(); // fix to remove duplicate array element
            }
            dataOrganised.forEach(weeklyWeather => buildWeeklyWeatherCard(weeklyWeather));
            ELEMENTS.ELEMENT_WEEKLY_CARDS.firstElementChild.classList.add('selected'); // add select class

            // we render on init linel hourly chart
            const CHART_LINEAL_HOUR = new linealHourChart();
            ELEMENTS.ELEMENT_CHART_HOURLY6_BUTTON.addEventListener('click', renderChart6hr);
            ELEMENTS.ELEMENT_CHART_HOURLY12_BUTTON.addEventListener('click', renderChart12hr);
            ELEMENTS.ELEMENT_CHART_HOURLY24_BUTTON.addEventListener('click', renderChart24hr);
            ELEMENTS.ELEMENT_CHART_HOURLY48_BUTTON.addEventListener('click', renderChart48hr);

            // List elem add class
            ELEMENTS.ELEMENT_CHART_LIST_ITEM[0].children[0].classList.add('selected');

            function elemSelected() { // toogle class selected                
                for ( let elem of ELEMENTS.ELEMENT_CHART_LIST_ITEM ) {
                    if(elem.children[0].classList.contains('selected')) {
                        elem.children[0].classList.remove('selected');
                    }
                }
            }
            function renderChart6hr() {
                elemSelected();
                ELEMENTS.ELEMENT_CHART_HOURLY6_BUTTON.classList.add('selected');   
                CHART_LINEAL_HOUR.renderChart(6, tempDataHourly);
            };
            function renderChart12hr() {
                elemSelected();
                ELEMENTS.ELEMENT_CHART_HOURLY12_BUTTON.classList.add('selected');   
                CHART_LINEAL_HOUR.renderChart(12, tempDataHourly);
            };
            function renderChart24hr() {
                elemSelected();
                ELEMENTS.ELEMENT_CHART_HOURLY24_BUTTON.classList.add('selected');   
                CHART_LINEAL_HOUR.renderChart(24, tempDataHourly);
            };
            function renderChart48hr() {
                elemSelected();
                ELEMENTS.ELEMENT_CHART_HOURLY48_BUTTON.classList.add('selected');   
                CHART_LINEAL_HOUR.renderChart(48, tempDataHourly);
            };
            
            renderChart6hr(); // default 6 hrs chart display

            // Build daily details
            const DAY_WEATHER_INFO = new DayDetails(respondData.timezone, tempDataCurrently.temp, tempDataCurrently.weather[0].description, tempDataCurrently.weather[0].icon, tempDataCurrently.sunrise, tempDataCurrently.sunset);
            DAY_WEATHER_INFO.sunInfo();

            // Doughnut chart
            const DOUGNUTCHART = new DoughnutChart(tempDataCurrently.pressure, tempDataCurrently.humidity, tempDataCurrently.uvi, tempDataCurrently.wind_speed);
            DOUGNUTCHART.renderChart('humidity', DOUGNUTCHART.humidity);
            DOUGNUTCHART.renderChart('uv', DOUGNUTCHART.uviIndex);
            DOUGNUTCHART.renderChart('wind', DOUGNUTCHART.windSpeed);
            ELEMENTS.ELEMENT_DAY_DETAILS_PESSURE.textContent = DOUGNUTCHART.pressure;
        })
        .catch(error => console.log(error));
}
function updateWeather(weatherData, country) {
    (!country) ? ELEMENTS.ELEMENT_CURRENT_CITY.textContent = weatherData.cityName : ELEMENTS.ELEMENT_CURRENT_CITY.textContent = weatherData.cityName + ' - '+ country;
    ELEMENTS.ELEMENT_CURRENT_DESCRIPTION.textContent = weatherData.description;
    ELEMENTS.ELEMENT_CURRENT_TEMPERATURE.textContent = weatherData.temperature;
    ELEMENTS.ELEMENT_CURRENT_FEELS.textContent = weatherData.feelsLike;
    ELEMENTS.ELEMENT_CURRENT_WIND.textContent = weatherData.windSpeed;
    ELEMENTS.ELEMENT_CURRENT_VISIBILITY.textContent = weatherData.visibility;
    ELEMENTS.ELEMENT_CURRENT_HUMIDITY.textContent = weatherData.humidity;

    // remove dynamic icon and add a new one from search
    ELEMENTS.ELEMENT_CURRENT_ICON.classList.forEach(item => {
        if (item.startsWith('icon-')) {
            ELEMENTS.ELEMENT_CURRENT_ICON.classList.remove(item);
        }
    });
    
    // we add dynamic icon
    Helpers.elementIcon(weatherData, ELEMENTS.ELEMENT_CURRENT_ICON);
}

/* Build weekly card */
const buildWeeklyWeatherCard = (data) => {

    // build elements
    const li = document.createElement('li');
    li.classList.add('weather-week-item');

    const h3 = document.createElement('h3');
    h3.classList.add('title');
    h3.setAttribute('id', 'weekly-item-title');

    const div = document.createElement('div');
    div.classList.add('temp-wrapper');
    div.setAttribute('id', 'weekly-wrapper-list');
    
    const ulTemp = document.createElement('ul');
    ulTemp.classList.add('temp');
    ulTemp.setAttribute('id', 'weekly-list');

    const liTemp = document.createElement('li');
    liTemp.classList.add('temp-item');
    
    const spanTemp = document.createElement('span');
    spanTemp.classList.add('current');
    spanTemp.setAttribute('id', 'weekly-temp');

    const liTempMax = document.createElement('li');
    liTempMax.classList.add('temp-item');

    const spanTempMax = document.createElement('span');
    spanTempMax.classList.add('current-max');
    spanTempMax.setAttribute('id', 'weekly-temp-max');

    const liTempMin = document.createElement('li');
    liTempMin.classList.add('temp-item');

    const spanTempMin = document.createElement('span');
    spanTempMin.classList.add('current-min');
    spanTempMin.setAttribute('id', 'weekly-temp-min');

    const spanIcon = document.createElement('span');
    spanIcon.classList.add('icon');

    const p = document.createElement('p');
    p.setAttribute('id', 'week-description');
    p.classList.add('desc')

    // Append elements in DOM
    ELEMENTS.ELEMENT_WEEKLY_CARDS.append(li);
    li.append(h3);
    li.append(div);
    div.append(ulTemp);
    ulTemp.append(liTemp);
    liTemp.append(spanTemp);
    ulTemp.append(liTempMax);
    liTempMax.append(spanTempMax);
    ulTemp.append(liTempMin);
    liTempMin.append(spanTempMin);
    div.append(spanIcon);
    div.append(p);

    // extend class and parse data;
    const WEEKLY_WEATHER_DATA = new WeeklyData(data.cityName, data.weather.description, data.weather.icon, data.temperature.day, data.temperature.max, data.temperature.min, data.timeStamp);
    h3.textContent = Helpers.unixToDate(WEEKLY_WEATHER_DATA.timeStamp);
    spanTemp.textContent = WEEKLY_WEATHER_DATA.temp + ' °C';
    spanTempMax.textContent = WEEKLY_WEATHER_DATA.tempMax + ' °C';
    spanTempMin.textContent = WEEKLY_WEATHER_DATA.tempMin + ' °C';
    p.textContent = WEEKLY_WEATHER_DATA.description;

    // we add dynamic Icon
    Helpers.elementIcon(WEEKLY_WEATHER_DATA, spanIcon);
}
