// Creates a Express server in Node JS and use diff... modules    
const express = require('express');
const app = express();
let cors = require('cors');
const backConfig = require('./backConfig.json');

const port = process.env.PORT || backConfig.serverPort;
let serverIO = app.listen(port, () => console.log(`getSQLData is listening on port ${port}!`));

// MYSQL module for connection
var mysql = require('mysql');

app.use(express.json());
app.use(cors());

// Declaring variables
let defaultStatement = `SELECT * FROM ${backConfig.SQLTable}`;
let addRecord = false;
let inNewRecord = false;
let count = 0;
let incommingSQLDataArr = [];
let currentStatement = '';
let choosenStatement = '';

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
            //console.log(sqlResult);
            incommingSQLDataArr.push(sqlResult)
            if (err) {
                //SQLConn.release();
                return;
            }
        });
        SQLConn.end();
    });
}
/* Run function for the mehods ================================================================================================
  Function to choose correct statement according the inomming data */
function buildCorrectSQLStatements(statementType, SQLObj){ // Find correct SQLStatement
    let statementCols = 'date, activity, state, concerned, type, place, content';
    let settSentNr = 'UPDATE data SET sent = 1 WHERE sent=0';
    
    if (statementType === 'default' && addRecord === false) choosenStatement = `SELECT ${ statementCols } FROM ${backConfig.SQLTable} ORDER BY date DESC`;
    // Fortsätt här imorgon
    if (statementType === 'newRecord' && inNewRecord === true) {
        console.log('2x statements');
        
        choosenStatement = `SELECT sent, ${ statementCols } FROM data WHERE sent=0 ORDER BY date DESC; ${settSentNr}`;
    }
    if (statementType === 'add' && addRecord === true) {
        let statementInsertIntoData = `('${ SQLObj.join("','")}');`;
        choosenStatement = `INSERT INTO ${ backConfig.SQLTable} (sent, ${ statementCols }) VALUES${ statementInsertIntoData}`;  
    }
    if (statementType === 'filter') choosenStatement = `SELECT * FROM data ${SQLObj.currentStatement.operator} ${ SQLObj.currentStatement.filterIn } in ('${ SQLObj.currentStatement.SQLFilterStr}')`;
    
    currentStatement = choosenStatement;
    console.log('84');
    console.log(currentStatement);
    
    return currentStatement;
}
let emtyDataArrays = () => {
    //Emtying the array at the end
    incommingSQLDataArr = [];
}
/* Validate users =============================================================================================================
    Validate the user who whants logging in
*/
let validateUser = (incommingUser) => {
    let userMatch = false;
    let userList = {
        userId: 1,
        fullName: 'Fredrik Hjärpe',
        userName: 'fredde',
        userPassWord: 'test'
    };
    if (incommingUser.userName === userList.userName && incommingUser.userPassWord === userList.userPassWord) {
        userMatch = true;
    }
    let userReturnData = {
        userId: userList.userId,
        loginStatus: userMatch,
        loginName: userList.fullName
    }
    return userReturnData;
}
// Run method when requested from client ======================================================================================
// Get - Default
app.get('/SQLData', (req, res) => {
    runSQLConn(buildCorrectSQLStatements('default', ''));
    setTimeout(()  => {
        console.log('92');
        //console.log(incommingSQLDataArr.length);
        res.status(200).send(incommingSQLDataArr);
    }, 1000);  
        console.log('===================================================================');
        
    emtyDataArrays();
});
app.get('/SQLData/:id', (req, res) => {
    inNewRecord = true;
    let getInlogedUser = req.params.id;
    //runSQLConn(buildCorrectSQLStatements('newRecord', ''));
    console.log('nEWrECORD');
    //setTimeout(() => {
        res.status(201).send(incommingSQLDataArr);
    //}, 3000);
    console.log('===================================================================');
    emtyDataArrays();
});
// AddData 
app.post('/SQLData/AddRecord', (req, res) => {
    addRecord = true;
    let currentInData = req.body.bodyData;

    runSQLConn(buildCorrectSQLStatements('add', currentInData));
    //incommingSQLDataArr.push(currentStatement);
    console.log('===================================================================');
    addRecord = false;
    emtyDataArrays();
});
app.post('/SQLData/UserValidate', (req, res) => {
    /* The userdata is incomming and send into he function to be validated:
        if = true, the code = 200 is send back else the code = 404 is send.
     */
    let userData = req.body.bodyData;
    console.log(userData);
    
    let returninUserData = validateUser(userData);
    console.log(returninUserData);

    if (returninUserData.loginStatus === true)  res.status(200).send(returninUserData); // User is match
    if (returninUserData.loginStatus === false) res.status(403).send(); // User is unmatch
});
// Run filtering
app.post('/SQLData/filter', (req, res) => {
    

});
// ============================================================================================================================