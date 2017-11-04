const fs = require('fs');
const request = require('request');

fs.readFile('raw-js/index.js', 'utf8', (err, data) => {
  if (err) return console.log(err);
  request.post({
    url: 'https://closure-compiler.appspot.com/compile', form: {
      output_format: 'json',
      output_info: 'compiled_code',
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      js_code: data
    }
  }, (err, httpResponse, body) => {
    if (err || httpResponse.statusCode !== 200) return console.log('error', err || httpResponse.statusCode);
    try {
      body = JSON.parse(body);
      const data = body.compiledCode;
      fs.writeFile('js/index.js', data, err => {
        if(err) return console.log(err);
        console.log('finished');
      });
    } catch (err) {
      console.log(err);
    }
  });
});