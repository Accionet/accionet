const fs = require('fs');

fs.writeFile('./client/public/helloworld.html', 'Hello World menehs!', (err) => {
  if (err) {
    return console.log(err);
  }
});
