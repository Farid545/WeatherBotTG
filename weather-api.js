const qs = require('querystring');
const { fetch } = require('./utils');
//const token = process.env.OPENWEATHERMAP_TOKEN;
const token = '58720ed8a7d3c3dbfa1bd75073e5cdd5';
const baseUrl = 'https://api.openweathermap.org';
const getLocationUrl = (location) =>
  `${baseUrl}/geo/1.0/direct?` + qs.stringify({ q: location, limit: 5, appid: token });

exports.getLocations = (locationName) => {
  const url = getLocationUrl(locationName);
  return fetch(url).then(locations => locations.map(location => {
    let { name } = location.name;
    if (location.local_names)
      name = location.local_names.ru || location.local_names.en
    const { country, state, lat, lon } = location;
    name += `, ${state}, ${country}`;
    return {
      lat, lon, name
    };
  }));
};

const getWeatherUrl = (coords) =>
  `${baseUrl}/data/2.5/weather?` + qs.stringify({ ...coords, units: 'metric', lang: 'ru', appid: token });

const getWeatherStr = ({ temp, feels_like, description }) =>
  `${description}\nТемпература: ${temp}°\nЧувствуется как: ${feels_like}°`;

const capitalize = str => str.slice(0, 1).toUpperCase() + str.slice(1);

exports.getWeather = (coords) => {
  const url = getWeatherUrl(coords);
  return fetch(url).then(data => {
    const { weather, main } = data;
    const last = weather.length - 1;
    const description = capitalize(weather[last].description);
    const { temp, feels_like } = main;
    return getWeatherStr({ temp, feels_like, description });
  });
}
