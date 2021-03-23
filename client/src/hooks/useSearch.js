import { useEffect, useState } from 'react'
const url = "http://localhost:3010";

export default function useSearch (query, pageNum) {
  const controller = new AbortController();
  const { signal } = controller;
  let timeLimit;

  const [searching, setSearching] = useState(true);
  const [error, setError] = useState(false);
  const [foundPhotos, setFoundPhotos] = useState([]);
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setSearching(true);
    setError(false);

    async function searchFetch () {
      let res;

      try {
        res = await fetch(url + `/search/${query}/${pageNum}`, {signal});
        const jsonRes = await res.json();
        console.log('USING USESEARCH!!!!', query)
        console.log('JSON RESPONSE:::   ', jsonRes);
        setFoundPhotos(currentPhotos => {
          return [...new Set([...currentPhotos, ...jsonRes.photos.photo])]
        });

        setHasMore(jsonRes.photos.photo.length > 0);
        setSearching(false);
      } catch (error) {
        setError(true);
        if (error === 'AbortError') {
          console.log('Fetch aborted!!');
          return;
        }
      }
    }

    query && debounceFunction(searchFetch);

    return () => controller.abort();

  }, [query, pageNum]);

  useEffect(() => {
    setFoundPhotos([]);
  }, [query]);

  function debounceFunction (func) {
    clearTimeout(timeLimit);

    timeLimit = setTimeout(() => {
      func()
    }, 1000);
  }

  return {searching, error, foundPhotos, hasMore};
}
