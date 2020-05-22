// ==================================== Main server file ====================================

const SQLFunctions = require('./Functions/SQLFunctions'); 
const userFunctions = require('./Functions/UserFunctions');

const SQLConfig = require('./Functions/SQLConfig');

// Import statementCols
const statementCols = require('./Functions/SQLColumnName');
// Import SQLDataCols
const SQLDataColsObj = require('./Functions/SQLDataCols.json');
// Basic Server module
const express = require('express');
let jwt = require('jsonwebtoken');

let cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const fileSystem = require('fs');
const path = require('path');

let addRecord = false;
let inNewRecord = false; 
let countRegedUser = 0;

// The server information
const port = process.env.PORT || SQLConfig.serverPort;
app.listen(port, () => console.log(`getSQLData is listening on port ${port}!`));

/* Run function for the mehods ==============================================================
    Validate the user who whants logging in */
const createdToken = [];

/* Middleware according the name
    Will using varifying the token string from eatch server request */ 
/* let verifyToken = (req, res, next) =>{
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
        }, 500); 
        next();
    //}
    //else res.status(403).send('Authorization failed!');
}  */

// Run method when requested from client ====================================================
// Get siteLoga
app.get('/SiteLoga', (req, res) => {
    console.log('========================= Get SiteLogo ==========================================');
    let correctPath = '';
    const directoryPath = path.join(__dirname, './public/Images');

    fileSystem.readdir(directoryPath, (err, file) => {
        let imgPath =  directoryPath.split('public\\')[1];
        res.set({'Content-Type': 'image/jpg'});
        res.status(200).send(`/${imgPath}/${file}`);
    });
    SQLFunctions.resetSQLData();
});
// Run default   
app.get('/SQLData', (req, res) => {
    console.log('========================= Default ==========================================');
    /* Triggering the main sql function with a callback to creating a SQL question as (Att 1)
        The callback take 2 att (Atr 1 = Run type, Atr 2 = some data object to send in for including to the question builder.
        Att 2 is emty because there is no data sending in for the default.  */
    SQLFunctions.runSQLConn( SQLFunctions.buildCorrectSQLStatements('first run', '') ); 

    setTimeout(()  => {
        res.status(200).send(SQLFunctions.incommingSQLData());        
    }, 500);  
    SQLFunctions.resetSQLData();
});
// UserReg =========================================================================
app.post('/SQLData/UserReg', (req, res) => {
    console.log('========================= UserReg ==========================================');
    addRecord = true;
    const incomingNewUser = req.body; // Axios add, bodyData
    // Triggering the userReg function and sending in the new user data (Att 1)
    userFunctions.userReg(incomingNewUser.bodyData);

    res.status(201).send('Användaren skapad');
    addRecord = false;
    
});
/* User loging in ===========================================================================
    Request a UserValidation and store the user as a token --> the token is then sending back as a response */
app.post('/SQLData/Auth', (req, res) => {
    /*  The userdata is comming and send into the function to validate the Logging in user:
        if = true, the code = 200 is sending back as respons together with a token
        else the code = 404 is sending with no data */
    let incommingUserData = req.body.bodyData;
    let returningVaryfiedUserData = userFunctions.validateUser(incommingUserData);
     
    if (returningVaryfiedUserData.userMatch === true) {        
        jwt.sign(returningVaryfiedUserData, 'inlogSecretKey', (error, token) => {
            if(token){
                createdToken.push(token);
                res.statusMessage = "You are authenticated'";
                res.status(200).send(token);
            }
            if (error) res.status(500);             
        });        
     }    

    if (returningVaryfiedUserData.userMatch === false) {
        res.statusMessage = "User does not find!";
        res.status(203).send(null); // User is unmatch
    }
    returningVaryfiedUserData = {};
});

// Requested userData is send back if the token is the same as created
app.get('/SQLData/:user',/*  verifyToken, */ (req, res) => {
    console.log('========================= User specific ==========================================');
        SQLFunctions.resetSQLData();
        inNewRecord = true;
    /* Triggering the main sql function with a callback to creating a SQL question as (Att 1)
        The callback take 2 att (Atr 1 = Run type, Atr 2 = The inlogging user to send in for including into the question builder. */
        SQLFunctions.runSQLConn(SQLFunctions.buildCorrectSQLStatements('userSpec', req.params.user));
            
        setTimeout(() => {   
            res.status(200).send({
                SQLData: SQLFunctions.incommingSQLData(),
                structuringCols: userFunctions.fixSQLDataColsObj(SQLDataColsObj),
            })
        }, 500); 
});
// AddSQLData & RegUsers ============================================================
app.post('/SQLData/AddRecord', (req, res) => {
    addRecord = true;
    let currentInData = req.body.bodyData;
    /* Triggering the main sql function with a callback to creating a SQL question as (Att 1)
        The callback take 2 att (Atr 1 = Run type, Atr 2 = The added user to send in for including into the question builder. */
    SQLFunctions.runSQLConn(SQLFunctions.buildCorrectSQLStatements('addRecord', currentInData));
    res.status(201).send('Användaren Skapades!'); ;
    console.log('===================================================================');
    addRecord = false;
    SQLFunctions.resetSQLData();

});

// Record remove ============================================================================
app.post('/SQLData/RemoveRecord', (req, res) => {
    /* Triggering the main sql function with a callback to creating a SQL question as (Att 1)
    The callback take 2 att (Atr 1 = Run type, Atr 2 = The records currentTimeStamp to be remove for including into the question builder. */
    SQLFunctions.runSQLConn(SQLFunctions.buildCorrectSQLStatements('removeRecord', req.body.bodyData));
    res.status(200).send('Aktiviteten Bortagen!');
});