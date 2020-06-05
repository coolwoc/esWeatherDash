// autocomplete
export const ELEMENT_SEARCH_BUTTON =  document.querySelector('#button-autocomplete');
export const ELEMENT_SEARCH_CITY = document.querySelector('#city');
export const ELEMENT_DATALIST = document.querySelector('#result');

//export const ELEMENT_LOADING_TEXT = document.querySelector('#load');

// Elements Today Widgets
export const ELEMENT_CURRENT = document.querySelector('#weather-today');
export const ELEMENT_CURRENT_CITY = ELEMENT_CURRENT.querySelector('#today-location');
export const ELEMENT_CURRENT_DESCRIPTION = ELEMENT_CURRENT.querySelector('#today-description');
export const ELEMENT_CURRENT_TEMPERATURE = ELEMENT_CURRENT.querySelector('#today-temp');
export const ELEMENT_CURRENT_ICON = ELEMENT_CURRENT.querySelector('.icon');
export const ELEMENT_CURRENT_FEELS = ELEMENT_CURRENT.querySelector('#today-feels');
export const ELEMENT_CURRENT_WIND = ELEMENT_CURRENT.querySelector('#today-wind');
export const ELEMENT_CURRENT_VISIBILITY = ELEMENT_CURRENT.querySelector('#today-visibility');
export const ELEMENT_CURRENT_HUMIDITY = ELEMENT_CURRENT.querySelector('#today-humidity');

// Elements Today Widgets
export const ELEMENT_TODAY_LOCATION = document.querySelector('#today-location');
export const ELEMENT_TODAY_LOCATION_TEMP = document.querySelector('#today-temp');
export const ELEMENT_TODAY_LOCATION_DESCRIPTION = document.querySelector('#today-description');
export const ELEMENT_TODAY_LOCATION_ICON = document.querySelector('.icon');

// Elements Weekly Widget
export const ELEMENT_WEEKLY = document.querySelector('#weather-weekly-wrapper');
export const ELEMENT_WEEKLY_CARDS = ELEMENT_WEEKLY.querySelector('#weather-weekly');
export const ELEMENT_WEEKLY_ICON = ELEMENT_WEEKLY.querySelector('#icon-temp');

// daily Widget Info
export const ELEMENT_DAILY_WRAPPER = document.querySelector('#day-detail-wrapper');
export const ELEMENT_DAILY_SKY_TEXT = ELEMENT_DAILY_WRAPPER.querySelector('#day-sky-detail');
export const ELEMENT_DAILY_SUNSET = ELEMENT_DAILY_WRAPPER.querySelector('#sunset-description');
export const ELEMENT_DAILY_SUNRISE = ELEMENT_DAILY_WRAPPER.querySelector('#sunrise-description');

// Day Details
export const ELEMENT_DAY_DETAILS = document.querySelector('#day-detail-wrapper');
export const ELEMENT_DAY_DETAILS_PESSURE = ELEMENT_DAY_DETAILS.querySelector('#pressure-description');

// chart anchors
export const ELEMENT_CHART_LINE = document.getElementById('line-chart');
export const ELEMENT_CHART_LIST_ITEM = document.querySelector('#hourly-list').getElementsByTagName('li');
export const ELEMENT_CHART_HOURLY6_BUTTON = document.querySelector('#hourly6');
export const ELEMENT_CHART_HOURLY12_BUTTON = document.querySelector('#hourly12');
export const ELEMENT_CHART_HOURLY24_BUTTON = document.querySelector('#hourly24');
export const ELEMENT_CHART_HOURLY48_BUTTON = document.querySelector('#hourly48');
