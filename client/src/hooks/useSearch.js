import { useEffect, useState } from 'react';
import { cacheQuery } from '../cache';
const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3010' : 'https://flickrphotostream.herokuapp.com';

export default function useSearch (pageNum, searchQuery) {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [foundPhotos, setFoundPhotos] = useState([]);
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setLoading(true);
    setError(false);
    let timeLimit;
    const controller = new AbortController();
    const { signal } = controller;

    async function searchFetch () {
      try {
        const query = url + `/search/${searchQuery}/${pageNum}`;
        const jsonRes = await cacheQuery(query, async (q) => {
          const r = await fetch(q, { signal });
          const j = await r.json();
          return j;
        });
        setFoundPhotos(currentPhotos => {
          return [...new Set([...currentPhotos, ...jsonRes.photos.photo])]
        });

        setHasMore(jsonRes.photos.photo.length > 0);
        setLoading(false);
      } catch (error) {
        setError(true);
        if (error === 'AbortError') {
          return;
        }
      }
    }

    function debounceFunction (func) {
      clearTimeout(timeLimit);

      timeLimit = setTimeout(() => {
        func()
      }, 500);
    }
    if (searchQuery && searchQuery.length > 2) debounceFunction(searchFetch);

    return () => controller.abort();

  }, [searchQuery, pageNum]);

  useEffect(() => {
    setFoundPhotos([]);
  }, [searchQuery]);


  return { loading, error, foundPhotos, hasMore };
}
