// Fiunns denna?
const SQLFunctions = require('./Functions/SQLFunctions'); 
const userFunctions = require('./Functions/UserFunctions');

const SQLConfig = require('./Functions/SQLConfig');

// Import statementCols
const statementCols = require('./functions/SQLColumnName');

// Basic Server module
const express = require('express');
let jwt = require('jsonwebtoken');

let cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

let addRecord = false;
let inNewRecord = false; 
let countRegedUser = 0;

// The server information
const port = process.env.PORT || SQLConfig.serverPort;
let serverIO = app.listen(port, () => console.log(`getSQLData is listening on port ${port}!`));

// All the accessable users for the app
let regedUserList = require('./Functions/RegedUser.json');

// Run function for the mehods ================================================================================================

/* let resetSQLData = (emtyingArr) => {
    //Emtying the array at the end
    emtyingArr = [];
} */
// Validate the user who whants logging in
const createdToken = [];

// Middleware according the name
let verifyToken = (req, res, next) =>{
    //const bearerHeader = req.headers['authorization'].split(' ')[1];
    // check there is a token
    //if (bearerHeader === createdToken[0]) {       
        let getInlogedUser = req.params.user;
        SQLFunctions.runSQLConn(SQLFunctions.buildCorrectSQLStatements('userSpec', getInlogedUser));
        SQLFunctions.runSQLConn(SQLFunctions.structuredCols());

        //jwt.verify(bearerHeader, 'inlogSecretKey');
        userFunctions.verifyUser(getInlogedUser)       
        setTimeout(() => {   
            res.status(200).send(SQLFunctions.incommingSQLDataArr);
        }, 3000); 
        next();
    //}
    //else res.status(403).send('Authorization failed!');
} 
let verifyUserData = (req, res, next) =>{

}
// Run method when requested from client ======================================================================================
// Run Logout  
app.get('/SQLData', (req, res) => {
    console.log('========================= Default ==========================================');
    SQLFunctions.runSQLConn(SQLFunctions.buildCorrectSQLStatements('first run', '')); 
/*     for (let index = 0; index < statementCols.colsArr.length; index++) {
        SQLFunctions.runSQLConn(SQLFunctions.structuredCols(), 'colStructure', index);
    } */
    setTimeout(()  => {
        //console.log("SQLFunctions.incommingSQLDataArr - 60", SQLFunctions.incommingSQLData());
        res.status(200).send(SQLFunctions.incommingSQLData());
            // Key with the completely SQLTabel and one key with the eatch colum data
            //SQLTabel: 
            //structuredInCol: 
        
    }, 1000);  
    SQLFunctions.resetSQLData();
});
// UserReg =========================================================================
app.post('/SQLData/UserReg', (req, res) => {
    addRecord = true;
    console.log('116');
    const incomingNewUser = req.body; // Axios add, bodyData

    userFunctions.userReg(incomingNewUser);

    res.status(200).send(incomingNewUser);

    console.log('===================================================================');
    addRecord = false;
    SQLFunctions.resetSQLData();
});
// User loging in =============================================================================================================
/* 
    Request a UserValidation and store the unser as a token --> the token sending back as a response.
    When the user is logedin there is a getmethos for collecting the user specefic data and sending back to the app
*/
app.post('/SQLData/Auth', (req, res) => {
    /*  The userdata is incomming and send into he function to validate the Logging in user:
        if = true, the code = 200 is send back together with a tokem else the code = 404 is send with no data */
    let incommingUserData = req.body.bodyData;
    let returninUserData = userFunctions.validateUser(incommingUserData);
     
    if (returninUserData.userMatch === true) {        
        jwt.sign(returninUserData, 'inlogSecretKey', (error, token) => {
        console.log("token", token)
            if(token){
                createdToken.push(token);
                res.statusMessage = "You are authenticated'";
                res.status(200).send(token);
            }
            if (error) res.status(500);             
        });        
     }    

    if (returninUserData.userMatch === false) {
        res.statusMessage = "User does not find!";
        res.status(203).send(null); // User is unmatch
    }
    returninUserData = {};
});
// Requested userData is send back if the token is the same as created
app.get('/SQLData/:user',/*  verifyToken, */ (req, res) => {
    console.log('========================= User specific ==========================================');
    SQLFunctions.resetSQLData();
    inNewRecord = true;
    let getInlogedUser = req.params.user;   
    SQLFunctions.runSQLConn(SQLFunctions.buildCorrectSQLStatements('userSpec', getInlogedUser));
   
    setTimeout(() => {   
        res.status(200).send({
            SQLData: SQLFunctions.incommingSQLData(),
            structuringCols: SQLFunctions.structureSQLData(SQLFunctions.incommingSQLData()[0])
        })
    }, 500); 
});
// AddSQLData & RegUsers ============================================================
app.post('/SQLData/AddRecord', (req, res) => {
    addRecord = true;
    let currentInData = req.body.bodyData;

    SQLFunctions.runSQLConn(SQLFunctions.buildCorrectSQLStatements('addRecord', currentInData));
    //incommingSQLDataArr.push(currentStatement);
    console.log('===================================================================');
    addRecord = false;
    SQLFunctions.resetSQLData();
});

// =================================================================================

// Run filtering
app.post('/SQLData/filter', (req, res) => {
    

});

// ============================================================================================================================ 