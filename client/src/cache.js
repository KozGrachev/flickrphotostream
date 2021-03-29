let cache = {};

export function storeCache () {
  localStorage.setItem('holidayExtras_cache', JSON.stringify(cache))
}

export function assignCache (val) {
  cache = JSON.parse(val);
}

export async function cacheQuery (query, queryHandler) {
  if (cache[query]) {
    return cache[query];
  }

  const result = await queryHandler(query);
  return cache[query] = result;
}