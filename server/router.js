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
  const url = `${baseUrl}/rest/?api_key=${process.env.API_KEY + querySettings}&method=flickr.interestingness.getList&per_page=1${extras}`;

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


router.get('/search/:query/:pageNum', async (req, res) => {
  const { query, pageNum } = req.params;
  const url = baseUrl + '/rest/?' + new URLSearchParams({
    text: query,
    page: pageNum,
    extras: ['url_s', 'description', 'tags', 'owner_name'],
    api_key: 'fced83294eb6fb247c8febeb9c10770d',
    method: 'flickr.photos.search',
    format: 'json',
    nojsoncallback: 1,
    per_page: 10
  }).toString();

  console.log('SEARCHING :::    ', query)


  const fetchRes = await fetch(url);

  const jsonRes = await fetchRes.json();

  // console.log('SEARCH RESULT JSON:::  ', jsonRes);
  res.send(jsonRes);
})

module.exports = router;