const express = require('express');

const app = express();
// const baseUrl = 'https://api.flickr.com/services/feeds/photos_public.gne?format=json';
require('dotenv').config({ path: __dirname + '/.env' });
app.use(require('cors')());

app.use(express.json());
app.use(require('./router'));


app.listen(3010, () => {
  console.log("Listening on port 3010");
});