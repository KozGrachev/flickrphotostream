import { useEffect, useState } from 'react'
import { cacheQuery } from '../cache';
const url = "http://localhost:3010";

export default function useFeed (path, pageNum, filterTags) {

  const [searching, setSearching] = useState(true);
  const [error, setError] = useState(false);
  const [foundPhotos, setFoundPhotos] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [newSearch, setNewSearch] = useState(true)

  useEffect(() => {
    if (filterTags.length === 0) {
      setNewSearch(true);
      setFoundPhotos([]);
    }
  }, [filterTags]);

  useEffect(() => {
    setSearching(true);
    setError(false);
    const controller = new AbortController();
    const { signal } = controller;

    async function searchFetch () {
      try {
        const query = url + `/${path}/${newSearch ? 1 : pageNum}`;
        const jsonRes = await cacheQuery(query, async (q) => {
          const r = await fetch(q, { signal });
          const j = await r.json();
          return j;
        });

        setFoundPhotos(currentPhotos => {
          if (newSearch) {
            return jsonRes.photos.photo;
          }

          return [...new Set([...currentPhotos, ...jsonRes.photos.photo])]
        });

        setNewSearch(false);
        setHasMore(jsonRes.photos.photo.length > 0);
        setSearching(false);
      } catch (error) {
        setError(true);
      }
    }
    searchFetch();

    return () => controller.abort();
  }, [pageNum, path, filterTags, newSearch]);


  return { searching, error, foundPhotos, hasMore };
}
