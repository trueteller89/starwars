var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
let urls = ['https://swapi.co/api/planets/?page=1', 'https://swapi.co/api/planets/?page=2', 'https://swapi.co/api/planets/?page=3','https://swapi.co/api/planets/?page=4','https://swapi.co/api/planets/?page=5','https://swapi.co/api/planets/?page=6','https://swapi.co/api/planets/?page=7']
router.get('/planets', (req, res) => {
Promise.all(urls.map(url =>fetch(url)
    ))
 .then(responses => 
  Promise.all(responses.map(res => res.json())
    )
 .then(dataArr => {
let data = {results:dataArr[0].results.concat(dataArr[1].results).concat(dataArr[2].results).concat(dataArr[3].results).concat(dataArr[4].results).concat(dataArr[5].results).concat(dataArr[6].results)}
  data.dataRes = []
  data.dataFilms=[]
  let residentsArr = [...new Set(data.results.map(el => el.residents).join().split(',').filter(el => el!==''))]
  let filmsArr = [...new Set(data.results.map(el => el.films).join().split(',').filter(el => el!==''))]
  Promise.all(residentsArr.map(url =>fetch(url)
    )).then(responses =>
  Promise.all(responses.map(res => res.json())
    ).then(function(dataRes) {
      data.dataRes = dataRes
      Promise.all(filmsArr.map(url =>fetch(url)
        )).then(responses =>
      Promise.all(responses.map(res => res.json())
        ).then(function(dataFilms) {
          data.dataFilms = dataFilms
          return res.send(data)
        }))
      }))
}))
 .catch(err => {
  res.redirect('/404');
})
})


module.exports = router;