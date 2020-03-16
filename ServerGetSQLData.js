// Import functions
import {runSQLConn, buildCorrectSQLStatements, incommingSQLDataArr} from './Functions/SQLFunctions'; 
import {userId, validateUser, verifyUser} from './Functions/UserFunctions';

const SQLConfig = require('./Functions/SQLConfig');

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
    
    let emtyDataArrays = (emtyingArr) => {
        //Emtying the array at the end
        emtyingArr = [];
    }
    // Validate the user who whants logging in
const createdToken = [];

// Middleware for verfy token
let verifyToken = (req, res, next) =>{
    const bearerHeader = req.headers['authorization'].split(' ')[1];
    // check there is a token
    if (bearerHeader === createdToken[0]) {       
/*         let getInlogedUser = req.params.user;
        console.log("verifyToken -> getInlogedUser", getInlogedUser)
        runSQLConn(buildCorrectSQLStatements('userSpec', getInlogedUser));
        //jwt.verify(bearerHeader, 'inlogSecretKey');       
        setTimeout(() => {   
            res.status(200).send(verifyUser(getInlogedUser));
        }, 3000); */

        next();
    }
    else res.status(403).send('Authorization failed!');
} 

// Run method when requested from client ======================================================================================
// Run Logout  
app.get('/SQLData', (req, res) => {
    runSQLConn(buildCorrectSQLStatements('first run', '')); 
    setTimeout(()  => {
        res.status(200).send(incommingSQLDataArr);
    }, 1000);  
        console.log('=========================userSpec==========================================');
});

// User loging in =============================================================================================================
// Request a UserValidation and store the unser as a token back --> send the token as a response
app.post('/SQLData/Login', (req, res) => {
    /*  The userdata is incomming and send into he function to validate the Logging in user:
        if = true, the code = 200 is send back together with a tokem else the code = 404 is send with no data */
    let incommingUserData = req.body.bodyData;
    let returninUserData = validateUser(incommingUserData);
     
    if (returninUserData.userMatch === true) {        
        jwt.sign(returninUserData, 'inlogSecretKey', (error, token) => {
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
app.get('/SQLData/:user', verifyToken, (req, res) => {
    inNewRecord = true;
    let getInlogedUser = req.params.user;
    console.log("verifyToken -> getInlogedUser", getInlogedUser)
    runSQLConn(buildCorrectSQLStatements('userSpec', getInlogedUser));
    //jwt.verify(bearerHeader, 'inlogSecretKey');       
    setTimeout(() => {   
        res.status(200).send(verifyUser(getInlogedUser));
    }, 3000);
});


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

// Run filtering
app.post('/SQLData/filter', (req, res) => {
    

});

// ============================================================================================================================