const express = require('express');
const PORT = process.env.PORT || 3010;
const buildPath = path.resolve('client/build');

const app = express();
require('dotenv').config({ path: __dirname + '/.env' });
app.use(require('cors')());

app.use(require('./router'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (_, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

app.listen(PORT, () => {
  console.log("Listening on port 3010");
});