var fetch = require('node-fetch');

module.exports = function Skb(token) {
  this.baseUrl = 'http://account.skill-branch.ru/api/v1'
  this.token = token;
  this.taskHelloWorld = function (hello, taskId) {
    if (!taskId) {
      taskId = '5810956a102b073743a167ea';
    }
    var url = this.baseUrl + '/task/' + taskId + '/attach';
    var body = {
      values: {
        hello: hello,
      },
    };
    return fetch(url, {
        method: 'POST',
        body:    JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json' ,
          'X-Access-Token': this.token ,
        },
    })
    .then(function(res) {
        return res.json();
    })
    .then(function(json) {
      if (!!json.data.code || !!json.err) {
        console.log('Чтото пошло не так');
      } else {
        console.log('Все прошло успешно');
      }
      console.log(json);
    })
    .catch(function(err) {
      console.log('Чтото пошло не так');
      console.log(err);
    });

  };
};
