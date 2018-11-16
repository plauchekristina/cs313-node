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
  var operation = req.query.operation
  var leftparam = Number(req.query.leftparam)
  var rightparam = Number(req.query.rightparam)
  doMath(res, operation, leftparam, rightparam)
}

function doMath(res, operation, leftparam, rightparam) {
  var answer = 0;
  switch (operation) {
    case "+":
      answer = leftparam + rightparam
      break;
    case "-":
      answer = leftparam = rightparam
      break;
    case "*":
      answer = leftparam * rightparam;
      break;
    case "/":
      answer = leftparam / rightparam;
      break;

  }
  var equation = {
    operation: operation,
    leftparam: leftparam,
    rightparam: rightparam,
    answer: answer
  }
  res.render('pages/result', equation);


}
