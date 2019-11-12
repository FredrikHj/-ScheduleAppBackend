// Creates a Express server in Node JS and use diff... modules    
const express = require('express');
const app = express();
let cors = require('cors');

const port = process.env.PORT || 3001;
let serverIO = app.listen(port, () => console.log(`getSQLData is listening on port ${port}!`));

// Socket IO connection
const socketIO = require('socket.io');
const ioListen = socketIO(serverIO);

// MYSQL module for connection
var mysql = require('mysql');

app.use(express.json());
app.use(cors());

// Declaring variables
let sqlChange = false;
let count = 0;
let incommingSQLDataArr = [];
let currentStatement = '';
let choosenStatement = '';

// Default Select, is running when apps is openening
/* let defaultSQL = 'default';
runSQLConn(defaultSQL);

 */
/* setInterval(function(){
    runSQLConn({statementType: defaultSQL });
}, 4000, defaultSQL);
 */
// Find correct SQLStatement
function getSQLCols(){
    return 'date, lastEditedRecord, month, activity, state, concerned, type, place, content';
}
function correctSQLStatements(SQLObj){
    console.log('29');
    console.log(SQLObj);
    
    choosenStatement = '';
    
    if (SQLObj.statementType === 'default') choosenStatement = `SELECT ${ getSQLCols()} FROM data ORDER BY date DESC`;
    if (SQLObj.statementType === 'filter') choosenStatement = `SELECT * FROM data ${SQLObj.currentStatement.operator} ${ SQLObj.currentStatement.filterIn } in ('${ SQLObj.currentStatement.SQLFilterStr}')`;
    if (SQLObj.statementType === 'add') choosenStatement = `INSERT INTO data ${ SQLObj.currentStatement.cols } VALUES ${ SQLObj.currentStatement.data }`;  

    console.log('26'); 
    currentStatement = choosenStatement;
    console.log(currentStatement);
    return currentStatement;
}

function runSQLConn(SQLObj) {
/*     if (sqlChange === true) {
        
    } */
    count++;
    console.log('39');  
    console.log(count);
    // Creates a connection between the server and my client and listen for SQL changes¨
    let SQLConn = mysql.createConnection('mysql://djcp7bmvky3s0mnm:osp74zwrq5ut4gun@m60mxazb4g6sb4nn.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/q3uqurm7z68qb3h2');
    
    console.log("Ansluten till DB :)");
    SQLConn.connect(function(err) { 
        if (err) throw err;
        console.log('45');  
        console.log(correctSQLStatements(SQLObj));
        
        SQLConn.query(correctSQLStatements(SQLObj), function (err, sqlResult) {
         /*    if (!sqlResult.affectedRows) {
                
            } */
            //console.log(sqlResult[0].lastEditedRecord.split(' ')[0]);

            incommingSQLDataArr.push(sqlResult);
            console.log('77');
            //console.log(sqlResult.length);
            if (err) {
                //SQLConn.release();
                return;
            }
            
        });
        SQLConn.end();
    });      
    console.log(incommingSQLDataArr.length);
        if (incommingSQLDataArr.length = 2) {
        incommingSQLDataArr = [];
    }

}

// Run method when requested from client ======================================================================================
    // Get
    app.get('/SQLData', (req, res) => {
        sqlChange = true;

        runSQLConn({
            statementType: 'default',
        });

        console.log('56');
        setTimeout(() => {
            console.log(incommingSQLDataArr);
            res.status(201).send(incommingSQLDataArr[0]);
        }, 1000);    
    });
    // AddData 
    app.post('/SQLData/AddPost', (req, res) => {
        sqlChange = true;

        console.log('65');
        let currentInData = req.body.SQLStatementsObj;
        console.log(currentInData); 

        runSQLConn({
            statementType: 'add',
            currentStatement: currentInData,
        });
        currentInData = {};
        //incommingSQLDataArr.push(currentStatement);
        
    });
    // Run filtering
    app.post('/SQLData/filter', (req, res) => {
        sqlChange = true;
        if (incommingSQLDataArr.length = 2) {
            incommingSQLDataArr = [];
        }

        let currentInData = req.body.SQLStatementsObj;
        console.log(currentStatement);
        let incommingSQLData = {
            statementType: currentInData.filterType,
            currentStatement: currentInData
        }
        //defaultSQL+= incommingSQLData;

        console.log('79'); 
        runSQLConn(incommingSQLData); 
        console.log('69'); 
        //console.log(incommingSQLDataArr[1].length);
        
        setTimeout(() => {
            res.status(201).send(incommingSQLDataArr);
        }, 1000);    
    });
// ============================================================================================================================