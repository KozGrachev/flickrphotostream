let cache = {};

export function storeCache () {
  localStorage.setItem('holidayExtras_cache', JSON.stringify(cache))
}

export function assignCache (val) {
  cache = JSON.parse(val);
}

export async function cacheQuery (query, queryHandler) {
  if (cache[query]) {
    console.log("RETURNING CACHED RESULT to QUERY ", query, cache[query]);
    return cache[query];
  }

  const result = await queryHandler(query);
  console.log("NEW QUERY -- NOT FOUND IN CACHE", query);
  return cache[query] = result;
}



// export async function cacheQuery (query, queryHandler) {
//   if (localStorage.getItem('holidayExtras_cache')[query]) {
//     console.log('RETURNING CACHED RESULT to QUERY ', query, localStorage.getItem('holidayExtras_cache')[query]);
//     return localStorage.getItem('holidayExtras_cache')[query];
//   }

//   if (!localStorage.getItem('holidayExtras_cache')) {
//     localStorage.setItem('holidayExtras_cache', '{}');
//   }
//   const result = await queryHandler(query);
//   localStorage.setItem('holidayExtras_cache', result);
//   console.log('NEW QUERY -- NOT FOUND IN CACHE'.holidayExtras_cache, query);
//   return result;
// }