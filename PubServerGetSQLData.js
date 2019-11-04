// Övning med routes     
const express = require('express');
const app = express();
let cors = require('cors');
var mysql = require('mysql');

app.use(express.json());
app.use(cors());
const port = 3001;

let sqlSelect = 'SELECT * FROM data';
let sqlChange = false;
let count = 0;
let incomminggSQLData = [];

// Authentication 
app.post('/SQLData/AddPost', (req, res) => {
   console.log('20');
   console.log(req);
    setTimeout(() => {
       console.log(incomminggSQLData);
        res.status(201).send(incomminggSQLData);
    }, 500);
})
runSQLConn(sqlSelect);

//setInterval(runSQLConn, 1000, sqlSelect);
function runSQLConn(sqlSelect) {
   console.log('23');
    count+= 1;
   console.log('Runda:');
   console.log(count);
    
   console.log(sqlSelect);
   console.log('25');

   console.log(sqlSelect);


    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: '',
        database: 'scheduleapp'
    });
    con.connect(function(err) {
        if (err) throw err;
       console.log("Ansluten till DB :)");
        //sendSelectToSql(sqlSelect);
        con.query(sqlSelect, function (err, resultToFrontend) {
            console.log('51');
            
            incomminggSQLData.push(resultToFrontend);

            if (err) throw err;
            // Send the SQL into the Frontend App =============================================================================
            if (sqlChange === false) {
                app.get('/SQLData', (req, res) => {
                 console.log('56');
                console.log(resultToFrontend);
                    
                res.status(201).send(resultToFrontend);
                });
            }
           console.log('-----------------------------------');    
            // runAppGetRequests(resultToFrontend);
        });
    });
    if (count === 140) {
        con.destroy();
    }
}
app.post('/SQLData/filter', (req, res) => {
    incomminggSQLData = [];
    sqlChange = true;
    sqlSelect = req.body.sqFilter;

   console.log('66');
    runSQLConn(sqlSelect);
   console.log('69');
    setTimeout(() => {
       console.log(incomminggSQLData);
        res.status(201).send(incomminggSQLData);
    }, 100);
})
app.listen(port, function (){
    console.log(`getSQLData is listening on port ${port}!`)

})