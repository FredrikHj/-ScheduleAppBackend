// Import functions
import {runSQLConn, buildCorrectSQLStatements, incommingSQLDataArr} from './Functions/SQLFunctions'; 
import {sendCorrectUserData} from './Functions/UserFunctions';

const SQLConfig = require('./Functions/SQLConfig');

// Basic Server module
const express = require('express');
let jwt = require('jsonwebtoken');
const fileSystem = require('fs');
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
    
    // Run function for the mehods ================================================================================================
    
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
// Middleware for verfy token
let verifyToken = (req, res, next) =>{
    const bearerHeader = req.headers['authorization'].split(' ')[1];
    console.log("verifyToken -> bearerHeader", bearerHeader);

    // check there is a token
    if (bearerHeader !== undefined) {
        req.token = bearerHeader;
        console.log("verifyToken -> req.token", req.token)
        //jwt.verify(bearerHeader, );
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
    
    //runSQLConn(buildCorrectSQLStatements('userSpec', getInlogedUser));
    
    setTimeout(() => {   
        res.status(200).send(sendCorrectUserData(getInlogedUser));
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