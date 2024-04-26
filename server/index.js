const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

async function fetchDataFromSource(id) {
  // Fetch Pokemon data
  const pokemonData = await new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((response) => response.json())
      .then(resolve)
      .catch(reject)
  })

  // Fetch data from each ability
  pokemonData.abilities = await Promise.all(
    pokemonData.abilities.map(async (abilityData) => (
      new Promise((resolve, reject) => {
        fetch(abilityData.ability.url)
          .then((response) => response.json())
          .then(resolve)
          .catch(reject)
      })
    ))
  )

  // Simulate a slow server
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return pokemonData;
}

function isValidCacheEntry(filename) {
  const TTL = 1000 * 60 * 60 * 24;

  // Check file does not exist, not valid.
  if (!fs.existsSync(filename)) return false;

  // Check if file exist but older than TTL, not valid.
  const fileAge = Date.now() - fs.statSync(filename).mtimeMs;
  if (fileAge > TTL) return false;

  // Otherwise, valid.
  return true;
}

async function getResult(id) {
  const filename = `.cache/${id}.json`;

  // If the cached file exists && not expire, read it and return the cached data
  if(isValidCacheEntry(filename)) {
    const resultAsString = fs.readFileSync(filename);
    const result = JSON.parse(resultAsString);
    return result;
  };
  
  // Else, fetch the data from the source and save it to the cache
  const result = await fetchDataFromSource(id);

  if (!fs.existsSync(".cache")) fs.mkdirSync(".cache");
  const resultAsString = JSON.stringify(result);
  fs.writeFileSync(filename, resultAsString);
  
  return result;
}

app.get("/api/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getResult(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});