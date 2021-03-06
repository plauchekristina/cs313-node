const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || 'postgres://ilisdajjnzsqzw:605ba242b30efc1fe84c8a4361061194e3e0cfc61099a8725679d70433f9793c@ec2-54-163-230-178.compute-1.amazonaws.com:5432/d71mjq6odqkvlu'
const pool = new Pool({ connectionString: connectionString });

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json()) //support json encoded bodies
  .use(express.urlencoded({ extended: true })) //support url encoded bodies
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', getReportId)
  .get('/math', math)
  .get('/postal', (req, res) => res.sendFile(path.join(__dirname + '/public/submission.html')))
  .get('/getData', getData)
  .get('/selectUser', (req, res) => sendFile(path.join(__dirname + 'public/user.html')))
  .get('/userData', getUserData)
  .get('/submitReport', getReport)
  .get('/sendReport', sendReport)



  .listen(PORT, () => console.log(`Listening on ${PORT}`))


/////function to create dropdown of report ids //////


function getReportId(req, res) {
  var sql = "SELECT report_id, report_date FROM report ORDER BY report_date DESC"
  pool.query(sql, function (error, data) {
    res.render('pages/index', { data: data.rows })
  })
}


/////### Send Report to Database ### //////

function sendReport(req, res) {
  var high = req.query.high
  var low = req.query.low
  var name = req.query.name
  var date = req.query.date
  var conditions = req.query.conditions
  var equipment = req.query.equipment
  var workerCategory = req.query.wcategory
  var workerNumber = req.query.wnumber
  var workerContent = req.query.wcontent
  var reportContent = req.query.reportContent
  var imageFile = req.query.imageFile
  var issue = req.query.issue
  var lengthWorkerNumber = workerNumber.length

  var sql = "INSERT INTO report (report_name, report_date, report_weather_high, report_weather_low, report_weather_conditions, report_rental_equip, report_content) VALUES ($1, $2, $3, $4, $5, $6, $7) returning report_id"
  var params = [name, date, high, low, conditions, equipment, reportContent]
  pool.query(sql, params, function (error, data) {
    console.log(error)
    console.log("data inserted into database" + data.rows[0].report_id)
    console.log(workerCategory + workerNumber + workerContent)
    console.log(lengthWorkerNumber)
    var sql = "INSERT INTO workers(workers_report_id, workers_category, workers_number, workers_content) VALUES ($1, $2, $3, $4)"
    for (var i = 0; i < lengthWorkerNumber; i++) {
      var params = [data.rows[0].report_id, workerCategory[i], workerNumber[i], workerContent[i]]
      if (workerCategory[i] != "") {
        pool.query(sql, params, function (error, data) {
          console.log("inserted data into workers table")
        })
      }


    }
    var sql = "INSERT INTO images(images_report_id, images_upload) VALUES ($1, $2)"
    var params = [data.rows[0].report_id, imageFile]
    pool.query(sql, params, function (error, data) {
      console.log("inserted data into IMAGE table")
    })
    var sql = "INSERT INTO issue(issue_report_id, issue_content, issue_status) VALUES ($1, $2, $3)"
    var params = [data.rows[0].report_id, issue, false]
    pool.query(sql, params, function (error, data) {
      console.log("inserted data into ISSUE table")
    })
    getReportId(req, res)
  })



}



///#### Display Report ####/////
function getReport(req, res) {
  var report_id = req.query.report_id;
  getReportFromDb(report_id, function (error, result) {
    res.render('pages/report', { result: result });
  });
}
function getReportFromDb(report_id, callback) {
  var sql = "SELECT report_id, report_date , report_weather_high , report_weather_low, report_weather_conditions , report_rental_equip , report_content, workers_category, workers_number, workers_content, images_upload, issue_content  FROM report JOIN workers ON report.report_id=workers.workers_report_id JOIN issue ON report.report_id=issue.issue_report_id JOIN images ON report.report_id = images.images_report_id WHERE report_id =$1::int"
  var pass = [report_id];
  pool.query(sql, pass, function (error, result) {
    if (error) { } callback(null, result.rows);
  });
};



////##### Display User Data ####/////

function getData(req, res) {
  var client_id = req.query.client_id;
  getDataFromDb(client_id, function (error, result) {
    res.render('pages/user_data', { result: result });
  });


}
///this function is out of place. It renders data in another place ////
function getUserData(req, res) {
  var client_id = req.query.client_id;
  var sql = "SELECT client_id, client_fname, client_lname, client_email FROM client WHERE client_id = " + client_id
  res.render('pages/user_data', client_id);
}
///// ^^^^^^ out of place //////////
function getDataFromDb(client_id, callback) {
  var sql = "SELECT client_id, client_fname, client_lname, client_email FROM client WHERE client_id = $1::int";
  var pass = [client_id];
  pool.query(sql, pass, function (error, result) {
    if (error) {
      //res.write("An error occured with the database")
    }
    callback(null, result.rows);
  });
};






////####### Postal Calculator
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
