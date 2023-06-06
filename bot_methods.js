// const token = process.env.TELEGRAM_BOT_TOKEN;
const token = '6065329861:AAHBy1Ca5hIvwtFFK1ajwKJpMeHFvfCadaU';
const url = `https://api.telegram.org/bot${token}`;

const { fetch } = require('./utils.js');

exports.sendMessage = (chat_id, text) =>
  fetch(`${url}/sendMessage`, 'POST', { chat_id, text });

exports.getUpdates = (offset) => {
  let body = {
    timeout: 10
  };
  if (offset != null)
    body.offset = offset;
  return fetch(`${url}/getUpdates`, 'GET', body).then(obj => obj.result);
}
