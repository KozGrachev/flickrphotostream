import { useEffect, useState } from 'react'
import { cacheQuery } from '../cache';
const url = "http://localhost:3010";

export default function useFeed (path, pageNum, searchQuery, filterTags) {

  const [searching, setSearching] = useState(true);
  const [error, setError] = useState(false);
  const [foundPhotos, setFoundPhotos] = useState([]);
  const [hasMore, setHasMore] = useState(false)

  // useEffect(() => {
  //   console.log("@@@@@@@@@@@@@@@  CLEARING FEED PHOTOS")
  //   setFoundPhotos([]);
  // }, [path, searchQuery]);

  useEffect(() => {
    console.log("@@@@@@@@@@@@@@@ NO FILTER TAGS --  CLEARING FEED PHOTOS")
    if (filterTags === []) setFoundPhotos([]);
  }, [filterTags]);



  useEffect(() => {
    console.log('FOUND PHOTOS ::: ', foundPhotos)
    setSearching(true);
    setError(false);
    const controller = new AbortController();
    const { signal } = controller;

    async function searchFetch () {


      try {
        const query = url + `/${path}/${pageNum}`;
        const jsonRes = await cacheQuery(query, async (q) => {
          // console.log('HANDLING QUERY', query);
          const r = await fetch(q, {signal});
          const j = await r.json();
          return j;
        });

        // console.log('JSON RESPONSE:::   ', jsonRes);
        setFoundPhotos(currentPhotos => {
          return [...new Set([...currentPhotos, ...jsonRes.photos.photo])]
        });

        setHasMore(jsonRes.photos.photo.length > 0);
        setSearching(false);
      } catch (error) {
        setError(true);
      }
    }
    searchFetch();

    return () => controller.abort();
  }, [pageNum, path]);



  return { searching, error, foundPhotos, hasMore };
}
