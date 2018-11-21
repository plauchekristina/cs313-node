const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/math', math)
  .get('/postal', (req, res) => res.sendFile(path.join(__dirname + '/public/submission.html')))

  .listen(PORT, () => console.log(`Listening on ${PORT}`))



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
    answer: answer.toFixed
  }
  res.render('pages/result', equation);


} 
