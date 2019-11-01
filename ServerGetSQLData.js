// Övning med routes     
const express = require('express');
const app = express();
let cors = require('cors');
var mysql = require('mysql');

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3001;

let currentStatement = '';
// Find correct SQLStatement
function correctSQLStatements(statementType, statementObj) {
    if (statementType === 'default') currentStatement = 'SELECT * FROM data'    
    if (statementType === 'filter') currentStatement = `SELECT * FROM data ${statementObj.operator} ${ statementObj.filterIn } in ('${ statementObj.SQLFilterStr}')`;
    if (statementType === 'add') currentStatement = `INSERT INTO data ${ statementObj.cols } VALUES ${ statementObj.data }`;

    return currentStatement;
}

let sqlChange = false;
let count = 0;
let incomminggSQLData = [];

// Default Select, is running when apps is openening
runSQLConn(correctSQLStatements('default'));

function runSQLConn(currentStatement) {
    console.log('23');
    count+= 1;
    console.log('Runda:');
    console.log(count);
    console.log(currentStatement);
    console.log('25');
    console.log(currentStatement);

    let con = mysql.createConnection('djcp7bmvky3s0mnm:osp74zwrq5ut4gun@m60mxazb4g6sb4nn.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/q3uqurm7z68qb3h2'
     /* process.env.JAWSDB_URL */);
    con.connect();

    con.query(currentStatement, function(err, rows, fields) {
      if (err) throw err;
    
      console.log(rows);
    });
    
    con.end();

    /* 
    con.connect(function(err) {
        if (err) throw err;
       console.log("Ansluten till DB :)");

        con.query(currentStatement, function (err, sqlResult) {
            console.log('41');
            
            incomminggSQLData.push(sqlResult);

            if (err) throw err;
            // Send the SQL into the Frontend App =============================================================================
            if (sqlChange === false) {
                app.get('/SQLData', (req, res) => {
                console.log('56');

                res.status(201).send(sqlResult);
                });
            }
           console.log('-----------------------------------');    
        });
    });
    if (count === 140) {
        con.destroy();
    }
    */
}
/*
// Run addData 
app.post('/SQLData/AddPost', (req, res) => {
    console.log('65');
    currentStatement = req.body.sqFilter;
    console.log(currentStatement.split());
    runSQLConn(correctSQLStatements('add', currentStatement));
   incomminggSQLData.push(currentStatement);
    console.log(incomminggSQLData);
    
})
// Run filtering
app.post('/SQLData/filter', (req, res) => {
    incomminggSQLData = [];
    sqlChange = true;
    currentStatement = req.body.SQLStatementsObj;
    console.log(currentStatement);

    console.log('79'); 
    runSQLConn(correctSQLStatements(currentStatement.filterType, currentStatement));
    console.log('69'); 
    setTimeout(() => {
        res.status(201).send(incomminggSQLData);
    }, 100);    
})    
app.listen(port, function (){
    console.log(`getSQLData is listening on port ${port}!`)
})    
*/