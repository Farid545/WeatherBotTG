const http = require('http');
const botMethods = require('./bot_methods');

const polling = async (botFunc, offset) => {
  try {
    const updates = await botMethods.getUpdates(offset);
    for (const update of updates) {
      offset = update.update_id + 1;
      const { message } = update;
      const userId = message.from.id;
      const messageText = message.text;
      await botFunc(userId, messageText);
    }
  }
  catch (ex) {
    // timeout
  }
  await polling(botFunc, offset);
}

exports.createBot = (botFunc, useWebhook = false) => {
  if (useWebhook)
    http.createServer((req, res) => {
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        const data = JSON.parse(body);
        const { message } = data;
        const userId = message.from.id;
        const messageText = message.text;
        botFunc(userId, messageText).then(() => {
          res.statusCode = 200;
          res.end();
        });
      });
    }).listen(8080)
  else {
    polling(botFunc);
  }
};
