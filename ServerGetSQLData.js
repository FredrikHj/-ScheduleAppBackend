// Basic Server module
const express = require('express');
let jwt = require('jsonwebtoken');
const fileSystem = require('fs');
let cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

//SQL Config
var mysql = require('mysql');
const SQLConfig = require('./SQLConfig');
const routes = require('./Routes');

// Declaring variables
let defaultStatement = `SELECT * FROM ${SQLConfig.SQLTable}`;
let addRecord = false;
let inNewRecord = false;
let count = 0;
let countRegedUser = 0;
let incommingSQLDataArr = [];
let currentStatement = '';
let choosenStatement = '';

// The server information
const port = process.env.PORT || SQLConfig.serverPort;
let serverIO = app.listen(port, () => console.log(`getSQLData is listening on port ${port}!`));

// MYSQL module for connection



// All the accessable users for the app
let regedUserList = require('./RegedUser.json');

// ============================ Create a user ============================
//Create id
let userId  = () => { 
    //Note - When calling this function I need set the id value = -1 able starting the user id from nr 1 -->
    for (let index = 0; index < regedUserList.regedUser.length; index++) {
        countRegedUser = regedUserList.regedUser[index].userId;
    }
    // Get the last id in my arr of users and add by one
    countRegedUser++;    
    return countRegedUser;
}
// Reg a user
let userReg = (userBody) => {
    console.log('46');
    console.log(userBody);

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
// =============================================== SQL Part ===============================================
function runSQLConn(SQLStatement) {
    incommingSQLDataArr = [];
    count++;
    console.log(`Körning - ${count}`);
    // Creates a connection between the server and my client and listen for SQL changes¨
    //let SQLConn = mysql.createConnection([{multipleStatements: true}, 'mysql://djcp7bmvky3s0mnm:osp74zwrq5ut4gun@m60mxazb4g6sb4nn.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/q3uqurm7z68qb3h2']);

    console.log("Ansluten till DB :)");
    let SQLConn = mysql.createConnection({
        host: SQLConfig.host,
        user: SQLConfig.user,
        password: SQLConfig.password,
        port: SQLConfig.sqlPort,
        database: SQLConfig.database,
        multipleStatements: SQLConfig.multipleStatements,
    });
    SQLConn.connect(function(err) { 
        if (err) throw err;        
        SQLConn.query(SQLStatement, function (err, sqlResult) {
            console.log('85');
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

    if (statementType === 'first run') choosenStatement = `SELECT * FROM ${SQLConfig.SQLTable} ORDER BY date DESC`;
    
    if (statementType === 'addRecord') {
        let statementInsertIntoData = `('${ SQLObj.join("','")}');`;
        choosenStatement = `INSERT INTO ${ SQLConfig.SQLTable} (sent, ${ statementCols }) VALUES${ statementInsertIntoData}`;  
    }


    if (statementType === 'userSpec') {
        choosenStatement = `SELECT * FROM ${SQLConfig.SQLTable} WHERE userName=${ SQLObj } ORDER BY date DESC`;
    }
    
    //if (statementType === 'filter') choosenStatement = `SELECT * FROM data ${SQLObj.currentStatement.operator} ${ SQLObj.currentStatement.filterIn } in ('${ SQLObj.currentStatement.SQLFilterStr}')`;
    
    currentStatement = choosenStatement;
    console.log('116');
    console.log(currentStatement);
    
    return currentStatement;
}
let emtyDataArrays = (emtyingArr) => {
    //Emtying the array at the end
    emtyingArr = [];
}
// Validate the user who whants logging in
let validateUser = (incommingUser) => {
    let getFullName = '';
    let userReturnData = {userMatch: false};
    
    let userList = regedUserList['regedUser'];
    console.log('130');
    console.log(incommingUser);
    
    // Check the userList for a userName vs password match
    for (let index = 0; index < userList.length; index++) {
        const getUsername = userList[index].userName;
        const getPassword = userList[index].userPassWord;
        // Check if there are any match with a reged user
        if (incommingUser.userName === getUsername && incommingUser.userPassWord === getPassword) {
            userReturnData = {
                userId: userId()-1,
                userMatch: true,
                loginName: userList[index].fullName
            }
        }
    }
    return userReturnData;
}

// Run method when requested from client ======================================================================================
// Get - Default
app.get('/SQLData', (req, res) => {
    runSQLConn(buildCorrectSQLStatements('first run', '')); 
    setTimeout(()  => {
        res.status(200).send(incommingSQLDataArr);
    }, 1000);  
        console.log('=========================userSpec==========================================');
});
app.get('/SQLData/:user', (req, res) => {
    inNewRecord = true;
    let getInlogedUser = req.params.user;
    console.log(`166 - ${getInlogedUser}`);

    //runSQLConn(buildCorrectSQLStatements('userSpec', getInlogedUser));
    
    setTimeout(() => {
        console.log('173');        
        console.log(sendCorrectUserData());
        res.status(200).send(sendCorrectUserData(getInlogedUser));
    }, 3000);
});
let sendCorrectUserData = (getInlogedUser) => {  
    let getCorrectUserData = [];  
    incommingSQLDataArr.map((obj) => {
        for (const key in obj) {
            if (obj[key].userName === getInlogedUser) {
                getCorrectUserData.push(obj[key]);
            }
        }
        return getCorrectUserData;
    });
    console.log('242');
    
    console.log(getCorrectUserData);
    
    return getCorrectUserData;
} 

// AddSQLData & RegUsers ============================================================
app.post('/SQLData/AddRecord', (req, res) => {
    addRecord = true;
    let currentInData = req.body.bodyData;

    runSQLConn(buildCorrectSQLStatements('addRecord', currentInData));
    //incommingSQLDataArr.push(currentStatement);
    console.log('===================================================================');
    addRecord = false;
    emtyDataArrays();
});
// UserReg =========================================================================
app.post('/SQLData/UserReg', (req, res) => {
    addRecord = true;
    console.log('192');
    console.log(req.body.bodyData);
    
    userReg(req.body.bodyData);


    console.log('===================================================================');
    addRecord = false;
    emtyDataArrays();
});
// =================================================================================
// UserValidation
app.post('/SQLData/Login', (req, res) => {
    /* The userdata is incomming and send into he function to be validated:
        if = true, the code = 200 is send back else the code = 404 is send.
     */
     let incommingUserData = req.body.bodyData;
     console.log("incommingUserData", incommingUserData)
     let returninUserData = validateUser(incommingUserData);
     console.log("returninUserData -225", returninUserData)
     
     if (returninUserData.userMatch === true) {
         
        jwt.sign(returninUserData, 'inlogSecretKey', (error, token) => {
             console.log("token", token)
             
             res.statusMessage = "Du har loggats in :)";
             res.status(200).send(token); // User is match
             
        });        
     }    

    if (returninUserData.userMatch === false) {
        res.statusMessage = "Användaren finns inte!";
        res.status(203).send(null); // User is unmatch
    }
    returninUserData = {};
});
// Run filtering
app.post('/SQLData/filter', (req, res) => {
    

});

// ============================================================================================================================