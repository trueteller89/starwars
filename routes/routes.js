var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
let basicUrlPlanets = 'https://swapi.co/api/planets/?page='
let basicUrlFilmID = 'https://swapi.co/api/films/'
let basicUrlPeopleID = 'https://swapi.co/api/people/'
let getAllElements = async (basicUrl) => {
  elements = await getElements(basicUrl)
  return elements
}
let getElements = async (basicUrl) => {
  let records = [];
  let keepGoing = true;
  let page = 1;
  while (keepGoing) {
    let response = await reqElements(basicUrl + page)
    await records.push.apply(records, response.results);
    page += 1
    if (!response.next) {
      keepGoing = false;
      return records;
    }
  }
}

let reqElements = async (url) => {
  let result = await fetch(url).then(res => res.json())
  return result
}

router.get('/planets', (req, res) => {
  getAllElements(basicUrlPlanets).then(data => res.send(data))
})
router.get('/films/:id', (req, res) => {
  let id = req.params.id;
  fetch(basicUrlFilmID + id)
    .then(data => data.json())
    .then(data => res.send(data))
})
router.get('/people/:id', (req, res) => {
  let id = req.params.id;
  fetch(basicUrlPeopleID + id)
    .then(data => data.json())
    .then(data => res.send(data))
})

module.exports = router;