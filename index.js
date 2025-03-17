const mineflayer = require('mineflayer');
const { Authflow } = require('prismarine-auth');

var lasttime = -1;
var moving = 0;
var connected = 0;
var actions = ['forward', 'back', 'left', 'right'];
var lastaction;
var pi = 3.14159;
var moveinterval = 2; // 2 second movement interval
var maxrandom = 5; // 0-5 seconds added to movement interval (randomly)

// Читаем переменные из Config Vars
const host = process.env.HOST || 'uailchort.aternos.me'; // Значение по умолчанию
const port = parseInt(process.env.PORT) || 24502; // Преобразуем в число
const username = process.env.USERNAME || 'Valichort';
const version = process.env.VERSION || '1.21';

// Настройка авторизации через Microsoft Account
const auth = new Authflow('your-email@example.com', './auth-cache', {
  authTitle: 'Microsoft',
  deviceType: 'Xbox'
});

// Создаем бота с авторизацией
const bot = mineflayer.createBot({
  host: host,
  port: port,
  username: username,
  version: version,
  auth: auth
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

bot.on('login', function () {
  console.log('Logged In');
});

bot.on('spawn', function () {
  connected = 1;
  console.log('Bot spawned on the server');
});

bot.on('time', function () {
  if (connected < 1) {
    return;
  }
  if (lasttime < 0) {
    lasttime = bot.time.age;
  } else {
    var randomadd = Math.random() * maxrandom * 20;
    var interval = moveinterval * 20 + randomadd;
    if (bot.time.age - lasttime > interval) {
      if (moving == 1) {
        bot.setControlState(lastaction, false);
        moving = 0;
        lasttime = bot.time.age;
      } else {
        var yaw = Math.random() * pi - 0.5 * pi;
        var pitch = Math.random() * pi - 0.5 * pi;
        bot.look(yaw, pitch, false);
        lastaction = actions[Math.floor(Math.random() * actions.length)];
        bot.setControlState(lastaction, true);
        moving = 1;
        lasttime = bot.time.age;
        bot.activateItem();
      }
    }
  }
});

bot.on('error', function (err) {
  console.error('Bot error:', err);
});

bot.on('end', function () {
  console.log('Bot disconnected');
});
