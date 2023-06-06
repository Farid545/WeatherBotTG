const { sendMessage } = require('./bot_methods');
const { createBot } = require('./server');
const { getWeather, getLocations } = require('./weather-api');

const usersData = new Map();
const START_MESSAGE = 'Введите название населённого пункта:';
const ENTER_INDEX_MESSAGE = 'Введите индекс:';
const ERROR_INDEX_MESSAGE = 'Введите правильный индекс!';

const START_MSG = 'START';
const CHOOSE_MSG = 'CHOOSE';
const CHOSEN_MSG = 'CHOSEN';

createBot(async (id, message) => {
  const data = usersData.get(id);
  if (message === '/start') {
    usersData.set(id, { prev: START_MSG });
    await sendMessage(id, START_MESSAGE);
  }
  else if (data == null)
    return;
  else if (data.prev === START_MSG) {
    const locations = await getLocations(message);
    usersData.set(id, { locations, prev: CHOOSE_MSG } );
    const text = locations.map((l, i) => `${i + 1} ${l.name}`).join('\n');
    await sendMessage(id, ENTER_INDEX_MESSAGE + '\n' + text);
  }
  else if (data.prev === CHOOSE_MSG) {
    const { locations } = data;
    const index = Number(message);
    if (isNaN(index) || !(1 <= index && index <= locations.length))
      await sendMessage(id, ERROR_INDEX_MESSAGE);
    else {
      const location = locations[index - 1];
      usersData.set(id, { location, prev: CHOSEN_MSG });
      const weather = await getWeather(location);
      await sendMessage(id, weather);
    }
  }
  else if (message === '/weather' && data.prev == CHOSEN_MSG) {
    const { location } = data;
    const weather = await getWeather(location);
    await sendMessage(id, weather);
  }
});
