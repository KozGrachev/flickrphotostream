let numCalls = 0;
const url = "http://localhost:3010";

export async function fetchFlickr (path, ...params) {
  const response = await fetch(url + path + params.join('/'));

  if (!response.ok) {
    alert('Error while fetching. Status: ' + response.status);
  }

  numCalls++;
  console.log(path + params.join('/'));
  console.log(`API called ${numCalls} times`);
  return await response.json();
}
