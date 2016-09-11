import env from 'node-env-file';
import PATH from 'path';
env(PATH.join(__dirname, '../.env'));

import _ from 'lodash';
import Botkit from 'botkit';

import { defaultController, article } from './controllers';

const controller = Botkit.slackbot({
  debug: false
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACK_KEY,
}).startRTM();

controller.hears(['hey'], ['direct_message','direct_mention','mention'], defaultController);
controller.hears('(.*)', ['direct_message','direct_mention','mention'], article);
