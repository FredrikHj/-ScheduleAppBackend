// Creates a Express server in Node JS and use diff... modules    
const express = require('express');
const app = express();
let cors = require('cors');
const backConfig = require('./backConfig.json');

const port = process.env.PORT || backConfig.serverPort;
let serverIO = app.listen(port, () => console.log(`getSQLData is listening on port ${port}!`));

// Socket IO connection
const socketIO = require('socket.io');
const ioListen = socketIO(serverIO);

// MYSQL module for connection
var mysql = require('mysql');

app.use(express.json());
app.use(cors());

// Declaring variables
let addRunning = false;
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
function runSQLConn(SQLStatement) {
    count++;
    // Creates a connection between the server and my client and listen for SQL changes¨
    //let SQLConn = mysql.createConnection([{multipleStatements: true}, 'mysql://djcp7bmvky3s0mnm:osp74zwrq5ut4gun@m60mxazb4g6sb4nn.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/q3uqurm7z68qb3h2']);
    let SQLConn = mysql.createConnection({
        host: backConfig.host,
        user: backConfig.user,
        password: backConfig.password,
        port: backConfig.sqlPort,
        database: backConfig.database,
        multipleStatements: backConfig.multipleStatements,
    });
    console.log("Ansluten till DB :)");
    SQLConn.connect(function(err) { 
        if (err) throw err;
        console.log('51');
        console.log(SQLStatement);
        
        SQLConn.query(SQLStatement, function (err, sqlResult) {
            console.log('53');
            console.log(sqlResult);
            incommingSQLDataArr.push(sqlResult);
            //console.log(sqlResult);

/*             if (incommingSQLDataArr.length > 1) incommingSQLDataArr.pop();
            else */ 
  
            if (err) {
                //SQLConn.release();
                return;
            }
            
        });
        SQLConn.end();
    });

}
// Run function for the mehods ================================================================================================
function buildCorrectSQLStatements(statementType, SQLObj){ // Find correct SQLStatement
    let statementCols = 'date, month, activity, state, concerned, type, place, content';
    let settSentNr = 'UPDATE data SET sent = 1 WHERE sent=0';
    
    console.log('79');
    console.log(SQLObj);
    
    if (statementType === 'default' && addRunning === false) choosenStatement = `SELECT ${ statementCols } FROM ${backConfig.SQLTable} ORDER BY date DESC`;
    if (statementType === 'default' && addRunning === true) choosenStatement = `SELECT sent, ${ statementCols } FROM data ORDER BY ${backConfig.SQLTable} DESC; ${settSentNr}`;
    if (statementType === 'add' && addRunning === true) {
        let statementInsertIntoData = `('${ SQLObj.join("','")}');`;
        choosenStatement = `INSERT INTO ${ backConfig.SQLTable} sent, ${ statementCols } VALUES${ statementInsertIntoData}`;  
    }
    if (statementType === 'filter') choosenStatement = `SELECT * FROM data ${SQLObj.currentStatement.operator} ${ SQLObj.currentStatement.filterIn } in ('${ SQLObj.currentStatement.SQLFilterStr}')`;
    
    currentStatement = choosenStatement;
    console.log('84');
    console.log(currentStatement);

    addRunning = false;
    return currentStatement;
}


// Run method when requested from client ======================================================================================
    // Get
    app.get('/SQLData', (req, res) => {
        runSQLConn(buildCorrectSQLStatements('default', ''));
        setTimeout(() => {
            console.log('92');
            //console.log(incommingSQLDataArr.length);
            res.status(201).send(incommingSQLDataArr);
        }, 1000);    
    });
    // AddData 
    app.post('/SQLData/AddPost', (req, res) => {
        addRunning = true;

        console.log('65');
        let currentInData = req.body.formBody;
        console.log(currentInData); 
        runSQLConn(buildCorrectSQLStatements('add', currentInData));

        currentInData = {};
        //incommingSQLDataArr.push(currentStatement);
        
    });
    // Run filtering
/*     app.post('/SQLData/filter', (req, res) => {
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
        runSQLConn(incommingSQLData.length); 
        console.log('69'); 
        //console.log(incommingSQLDataArr[1].length);
        
        setTimeout(() => {
            res.status(201).send(incommingSQLDataArr);
        }, 1000);    
    }); */
// ============================================================================================================================