const router = require('express').Router();
const fetch = require('node-fetch');
const baseUrl = 'https://api.flickr.com/services';
const querySettings = '&format=json&nojsoncallback=1';

//*
router.get('/feed/', async (req, res) => {
  console.log('GET REQUEST: feed')
  const fetchRes = await fetch('https://api.flickr.com/services/feeds/photos_public.gne?format=json');

});

router.get('/interesting/:size', async (req, res) => {
  console.log('GET REQUEST: interesting');
  const { size } = req.params;

  const extras = `&extras=url_${size}%2C+description%2C+tags%2C+owner_name`
  const url = `${baseUrl}/rest/?api_key=${process.env.API_KEY + querySettings}&method=flickr.interestingness.getList&per_page=10${extras}`;

  const fetchRes = await fetch(url);
  const jsonRes = await fetchRes.json();
  res.send(jsonRes);
})

router.get('/getUserUrl/:id', async (req, res) => {
  const { id } = req.params;

  const url = `${baseUrl}/rest/?method=flickr.urls.getUserProfile&api_key=${process.env.API_KEY}&user_id=${id + querySettings}`;

  const fetchRes = await fetch(url);
  const jsonRes = await fetchRes.json();
  res.send(jsonRes);
});

module.exports = router;