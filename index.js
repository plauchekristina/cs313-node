const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || 'postgres://ilisdajjnzsqzw:605ba242b30efc1fe84c8a4361061194e3e0cfc61099a8725679d70433f9793c@ec2-54-163-230-178.compute-1.amazonaws.com:5432/d71mjq6odqkvlu'
const pool = new Pool({ connectionString: connectionString });

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/math', math)
  .get('/postal', (req, res) => res.sendFile(path.join(__dirname + '/public/submission.html')))
  .get('/getData', getData)
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

function getData(req, res) {
  console.log("Getting person information");
  var result = { id: 123, name: "mama" };
  res.json(result);
}

function math(req, res) {
  var leftparam = Number(req.query.leftparam)
  var rightparam = req.query.rightparam
  doMath(res, leftparam, rightparam)
}

function doMath(res, leftparam, rightparam) {
  var answer = 0;
  switch (rightparam) {
    case "stamped":
      answer = (((leftparam * .21) - .21) + .50)
      break;
    case "metered":
      answer = (((leftparam * .21) - .21) + .47)
      break;
    case "flats":
      answer = (((leftparam * .21) - .21) + 1)
      break;
    case "retail":
      answer = (((leftparam * .25) - .25) + 3.50)
      break;

  }
  var equation = {
    leftparam: leftparam,
    rightparam: rightparam,
    answer: answer.toFixed(2)
  }
  res.render('pages/result', equation);


} 
