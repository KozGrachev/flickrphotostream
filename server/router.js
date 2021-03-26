const router = require('express').Router();
const fetch = require('node-fetch');
const baseUrl = 'https://api.flickr.com/services';
const querySettings = '&format=json&nojsoncallback=1';

//*
router.get('/feed/', async (req, res) => {
  console.log('GET REQUEST: feed')
  const fetchRes = await fetch('https://api.flickr.com/services/feeds/photos_public.gne?format=json');

});

router.get('/interesting/:pageNum', async (req, res) => {
  console.log('GET REQUEST: interesting');
  const { pageNum } = req.params;

  // const url = `${baseUrl}/rest/?api_key=${process.env.API_KEY + querySettings}&method=flickr.interestingness.getList&per_page=10${extras}`;
  const url = baseUrl + '/rest/?' + new URLSearchParams({
    extras: ['url_n', 'url_z', 'url_l', 'description', 'tags', 'owner_name'],
    api_key: process.env.API_KEY,
    method: 'flickr.interestingness.getList',
    format: 'json',
    nojsoncallback: 1,
    per_page: 20,
    page: pageNum
  }).toString();
  const fetchRes = await fetch(url);
  const jsonRes = await fetchRes.json();
  res.send(jsonRes);
})

router.get('/search/:query/:pageNum', async (req, res) => {
  const { query, pageNum } = req.params;
  const url = baseUrl + '/rest/?' + new URLSearchParams({
    text: query,
    page: pageNum,
    extras: ['url_n', 'url_w', 'url_c', 'description', 'tags', 'owner_name'],
    api_key: process.env.API_KEY,
    method: 'flickr.photos.search',
    format: 'json',
    nojsoncallback: 1,
    per_page: 20
  }).toString();

  console.log('SEARCHING :::    ', query)


  const fetchRes = await fetch(url);

  const jsonRes = await fetchRes.json();

  // console.log('SEARCH RESULT JSON:::  ', jsonRes);
  res.send(jsonRes);
})

module.exports = router;