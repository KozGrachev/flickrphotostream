let numCalls = 0;
const url = "http://localhost:3010";

export async function fetchFlickr (path, pageNum) {
  const response = await fetch(url + path + pageNum);

  if (!response.ok) {
    alert('Error while fetching. Status: ' + response.status);
  }

  numCalls++;
  console.log(path , `    API called ${numCalls} times`);
  return await response.json();
}
