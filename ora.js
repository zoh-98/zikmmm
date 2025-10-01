global.axios = require("axios");

global.fs = require("fs-extra");

const path = require('path');

const login = require('./controller/fca');

global.config = require('./config.json');

if(!global.config) return console.log("config err");

global.Import = require;

global.game = new Object();

global.fff = new Array();

global.funcs = require('./controller/funcs/utils.js');

global.Mods = funcs;

global.log = require('./controller/funcs/logger/log.js');

global.loading = global.log.master;

global.utils = {};

global.utils.createQueue = function createQueue(callback) {

  const queue = [];

  const queueObj = {

    push: function (task) {

      queue.push(task);

      if (queue.length == 1)

        queueObj.next();

    },

    running: null,

    length: function () {

      return queue.length;

    },

    next: function () {

      if (queue.length > 0) {

        const task = queue[0];

        queueObj.running = task;

        callback(task, async function (err, result) {

          queueObj.running = null;

          queue.shift();

          queueObj.next();

        });

      }

    }

  };

  return queueObj;

}

global.shelly = new Object({

  cmds: new Map(),

  events: new Array(),

  Time: new Map(),

  KJ: new Map(),

  eventV2: new Map(),

  onListen: new Map(),

  handleSchedule: new Array(),

  React: new Array(),

  Reply: new Array(),

  mainPath: process.cwd(),

  configPath: new String()

});

global.DBGRY = {

  database: {

    creatingThreadData: [],

    creatingUserData: [],

    creatingDashBoardData: [],

    creatingGlobalData: []

  }

};

global.temp = {createThreadDataError:[]};

global.db = {

  allThreadData: [],

  allUserData: [],

  allGlobalData: [],

  threadModel: null,

  userModel: null,

  globalModel: null,

  threadsData: null,

  usersData: null,

  globalData: null,

  receivedTheFirstMessage: {}

};

global.axios.get("https://raw.githubusercontent.com/zoh-98/zikmmm/refs/heads/main/list.json")
.then(response => {
  if (response.data.yo === true) {
    const appState = fs.readJSONSync(config.APPSTATEPATH);

    if (!appState) return console.log("check ur APPSTATE");

    login({ appState }, async (err, api) => {

      if (err) return console.error(err);

      global.config.shellyID = api.getCurrentUserID();

      const DB_GryKJ = await require('./DB/controller/index.js')(api);

      const {

        threadModel,

        userModel,

        globalModel,

        threadsData,

        usersData,

        globalData,

        databaseType

      } = DB_GryKJ;

      const commands = fs.readdirSync(__dirname + '/Shelly/cmds').filter(command => command.endsWith('.js'));

      for (let command of commands) {

        try {

          var module = require(__dirname + '/Shelly/cmds/' + command);

          

          // التصحيح هنا: التحقق من وجود run أو onType بدلاً من onType فقط

          if (!module.config || (!module.run && !module.onType)) {

            console.error(`Error in cmd format for file: ${command}`);

            continue;

          }

          

          if (global.shelly.cmds.has(module.config.name || '')) {

            console.error(`Name Is Repeated: ${module.config.name}`);

            continue;

          }

          if (module.All) {

            global.shelly.events.push(module.config.name);

          }

          

          global.shelly.cmds.set(module.config.name, module);

          if (module.config.KJ) {

            const Yora = module.config.KJ;

            for (let piro of Yora) {

              global.shelly.KJ.set(piro, module);

            }

          }

          if (module.onLoad) {

            try {

              const moduleData = {};

              moduleData.api = api;

              module.onLoad(moduleData);

            } catch (err) {

              console.error(`Can't onLoad : ${module.config.name} 👽 ${err}`);

            }

          }

        } catch (e) {

          console.error(e);

        }

      }

      const Hevents = fs.readdirSync(__dirname + '/Shelly/evts').filter(command => command.endsWith('.js'));

      for (let eventt of Hevents) {

        try {

          var module = require(__dirname + '/Shelly/evts/' + eventt);

          if (!module.config || !module.Event) {

            console.error(`Error in event format for file: ${eventt}`);

            continue;

          }

          

          if (global.shelly.eventV2.has(module.config.name || '')) {

            console.error(`Event Name Is Repeated: ${module.config.name}`);

            continue;

          }

          

          global.shelly.eventV2.set(module.config.name, module);

        } catch (e) {

          console.error(e);

        }

      }

      api.setOptions(global.config.FCAOption);

      async function start() {

        const listen = require("./controller/listen.js")({ threadsData, usersData, globalData, api });

        function listC(error, message) {

          if (error) return console.error(error);

          if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) return;

          if (global.config.DeveloperMode == true) console.log(message);

          return listen(message);

        };

        api.listenMqtt(listC);

      }

      start();

    });
  } else {
    console.log("stopped by Gry KJ");
    process.exit();
  }
})
.catch(err => {
  console.log("stopped by Gry KJ");
  process.exit();
});
