// Creates a Express server in Node JS and use diff... modules    
const express = require('express');
const app = express();
let cors = require('cors');
const fileSystem = require('fs');

//Config for the backend
const backConfig = require('./backConfig.json');

// The server information
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
let countRegedUser = 0;
let incommingSQLDataArr = [];
let currentStatement = '';
let choosenStatement = '';

// All the accessable users for the app
let regedUserList = require('./RegedUser.json');

// ============================ Create a user ============================
//Create id
let userId  = () => { 
    for (let index = 0; index < regedUserList.regedUser.length; index++) {
        countRegedUser = regedUserList.regedUser[index].userId;
    }
    // Get the last id in my arr of users and add by one
    countRegedUser++;    
    return countRegedUser;
}
// Reg a user
let userReg = (userBody) => {
    console.log('94');
    console.log(userBody);
0
    let regedUser = {
        userId: userId(),
        fullName: userBody.fullName,
        userName: userBody.userName,
        userPassWord: userBody.userPassWord

    };
    regedUserList['regedUser'].push(regedUser);
    console.log(regedUserList);
    
    fileSystem.writeFile('./RegedUser.json', JSON.stringify(regedUserList //debugging  
             , null, 2
        ), function(err) {console.log(err);     
    });

};
// ======================= SQL Part ================================================================================================
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
    
    if (statementType === 'add' && addRecord === true) {
        let statementInsertIntoData = `('${ SQLObj.join("','")}');`;
        choosenStatement = `INSERT INTO ${ backConfig.SQLTable} (sent, ${ statementCols }) VALUES${ statementInsertIntoData}`;  
    }
    if (statementType === 'userSpec') {
        choosenStatement = `SELECT ${ statementCols } FROM ${backConfig.SQLTable} WHERE userID=${ SQLObj } ORDER BY date DESC`;
    }
    
    //if (statementType === 'filter') choosenStatement = `SELECT * FROM data ${SQLObj.currentStatement.operator} ${ SQLObj.currentStatement.filterIn } in ('${ SQLObj.currentStatement.SQLFilterStr}')`;
    
    currentStatement = choosenStatement;
    console.log('84');
    console.log(currentStatement);
    
    return currentStatement;
}
let emtyDataArrays = () => {
    //Emtying the array at the end
    incommingSQLDataArr = [];
}
// Validate the user who whants logging in
let validateUser = (incommingUser) => {
    let getFullName = '';
    let userReturnData = {};
    let isUserMatch = false;
    
    let userList = regedUserList['regedUser'];
    console.log('95');
    console.log(incommingUser);
    
    // Check the userList for a userName vs password match
    for (let index = 0; index < userList.length; index++) {
        const getUsername = userList[index].userName;
        const getPassword = userList[index].userPassWord;
        // Check if there are any match with a reged user
        if (getUsername === incommingUser.userName && getPassword === incommingUser.userPassWord) {
            userReturnData = {
                userId: userId(),
                userMatch: true,
                loginName: userList[index].fullName
            }
        }
        if (getUsername === incommingUser.userName || getPassword === incommingUser.userPassWord) isUserMatch = false;
    }

    
    return userReturnData;
}
// Run method when requested from client ======================================================================================
// Get - Default
app.get('/SQLData', (req, res) => {
    runSQLConn(buildCorrectSQLStatements('default', ''));
    setTimeout(()  => {
        console.log('111');
        //console.log(incommingSQLDataArr.length);
        res.status(200).send(incommingSQLDataArr);
    }, 1000);  
        console.log('=========================userSpec==========================================');
        
    emtyDataArrays();
});
app.get('/SQLData/:id', (req, res) => {
    inNewRecord = true;
    let getInlogedUser = parseInt(req.params.id);
    console.log('121');
    console.log(getInlogedUser);
    runSQLConn(buildCorrectSQLStatements('userSpec', getInlogedUser));
    
    setTimeout(() => {
        console.log('126');
        
        console.log(incommingSQLDataArr);
        res.status(200).send(incommingSQLDataArr);
    }, 3000);
    emtyDataArrays();
});
// AddSQLData & RegUsers ============================================================
app.post('/SQLData/AddRecord', (req, res) => {
    addRecord = true;
    let currentInData = req.body.bodyData;

    runSQLConn(buildCorrectSQLStatements('add', currentInData));
    //incommingSQLDataArr.push(currentStatement);
    console.log('===================================================================');
    addRecord = false;
    emtyDataArrays();
});
// UserReg =========================================================================
app.post('/SQLData/UserReg', (req, res) => {
    addRecord = true;
    console.log('152');
    userReg(req.body.bodyData);


    console.log('===================================================================');
    addRecord = false;
    emtyDataArrays();
});
// =================================================================================
// UserValidation
app.post('/SQLData/UserValidate', (req, res) => {
    /* The userdata is incomming and send into he function to be validated:
        if = true, the code = 200 is send back else the code = 404 is send.
     */
    let incommingUserData = req.body.bodyData;
    console.log(incommingUserData);
    
    let returninUserData = validateUser(incommingUserData);
    console.log('214');
    
    console.log(returninUserData);

    if (returninUserData.userMatch === true)  res.status(200).send(returninUserData); // User is match
    if (returninUserData === {}) res.status(403).send(); // User is unmatch
});
// Run filtering
app.post('/SQLData/filter', (req, res) => {
    

});

// ============================================================================================================================