// https://public-api.wordpress.com/wp/v2/sites/techcrunch.com/posts?per_page=100&search=santa%20monica%20drones
import fetch from 'node-fetch';
import querystring from 'querystring';
import SummaryTool from 'node-summary';
import entities from 'entities';
const {decodeHTML} = entities;
export function getArticle(text) {
  const query = {per_page: 1, search: text};
  const qs = querystring.stringify(query);
  const url = `https://public-api.wordpress.com/wp/v2/sites/techcrunch.com/posts?${qs}`;
  return fetch(url)
    .then(result => result.json());
}

function clean({rendered}) {
  return decodeHTML(rendered.replace(/<(?:.|\n)*?>/gm, '')).replace(/\[(?:.|\n)*?\]/gm, '');
}

function transformResult([{content, title}]) {
  return new Promise(function(resolve, reject) {
    const body = clean(content);
    const header = clean(title);
    SummaryTool.summarize(header, body, function(err, summary) {
      if (err) {
        return reject(err);
      }
      return resolve(summary);
    });
  });
}

export function article(bot, message) {
  const text = message.text;
  //bot.reply(message, `${text}?`);
  bot.startConversation(message, function(err, convo) {
    convo.ask(`${text}?`,function(response,convo) {
      if (response.text === 'no') {
        convo.say('Oh ok nm');
        return convo.next();
      }
      getArticle(text.toLowerCase()).then(transformResult).then(function(responseText){
        convo.say(responseText);
        convo.next();
      });
    });
  });

}
