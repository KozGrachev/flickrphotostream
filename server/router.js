const router = require('express').Router();
const fetch = require('node-fetch');
const baseUrl = 'https://api.flickr.com/services/rest/?';

const sharedExtras = {
  extras: ['url_n', 'url_z', 'url_l', 'url_h', 'description', 'tags', 'owner_name'],
  api_key: process.env.API_KEY,
  format: 'json',
  nojsoncallback: 1,
}

router.get('/interesting/:pageNum', async (req, res) => {
  const { pageNum } = req.params;
  const url = baseUrl + new URLSearchParams({
    ...sharedExtras,
    method: 'flickr.interestingness.getList',
    per_page: 50,
    page: pageNum
  }).toString();
  const fetchRes = await fetch(url);
  const jsonRes = await fetchRes.json();
  res.send(jsonRes);
})

router.get('/search/:query/:pageNum', async (req, res) => {
  const { query, pageNum } = req.params;
  const url = baseUrl + new URLSearchParams({
    ...sharedExtras,
    method: 'flickr.photos.search',
    safe_search: 1,
    text: query,
    page: pageNum,
    per_page: 50
  }).toString();
  const fetchRes = await fetch(url);
  const jsonRes = await fetchRes.json();
  res.send(jsonRes);
})

module.exports = router;