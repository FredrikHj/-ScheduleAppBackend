// ==================================== Userfunctions handling ====================================
// Module import for the filesystem working
const fs = require('fs');

// Function for the server and its funtion working
const SQLFunctions = require('./SQLFunctions');
const regedUserList = require('./RegedUser.json');

/* =======================================================================================================================
 Create a user account and its id creation */
 exports.userReg = (regedUser) =>{
     /*  The incomming user and its various keys is saved in a new object which is saving as json in the file RegedUser.json.
     The key one in the object is holding the user´s ID nr, which is calculated according the included array length */
     const regedUserObj = {
         userId: userId(),
         yourName: regedUser.fullName, 
         yourID: regedUser.userName,
         passWord: regedUser.userPassWord
    }
    regedUserList.regedUser.push(regedUserObj);
    // The object is writes to the json file
    fs.writeFile('./Functions/RegedUser.json', JSON.stringify(regedUserList, null, 1), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}
let countRegedUser = 0;
const userId  = () => {  
    //Note - When calling this function I need set the id value = -1 able starting the user id from nr 1 -->
    for (let index = 0; index < regedUserList.regedUser.length; index++) { 
        countRegedUser = regedUserList.regedUser[index].userId;
    }
    // Get the last id in my arr of users and add by one
    countRegedUser++;    
    return countRegedUser;
}
// =======================================================================================================================

// Validate the user who whants logging in
exports.validateUser = (incommingUser) => {
console.log("incommingUser", incommingUser)
    let getFullName = '';
    let userReturnData = {userMatch: false};
        
    let userList = regedUserList['regedUser'];
    
    // Check the userList for a userName vs password match
    for (let index = 0; index < userList.length; index++) {
        const getUsername = userList[index].userName;
        console.log("getUsername", getUsername)
        const getPassword = userList[index].userPassWord;
        // Check if there are any match with a reged user
        if (incommingUser.userName === getUsername && incommingUser.userPassWord === getPassword) {
            userReturnData = {
                userId: userId()-1,
                userMatch: true,
                loginName: userList[index].fullName,
                veryfiedUser: getUsername
            }
        }
    }
    return userReturnData;
} 
exports.verifyUser = (getInlogedUser) => {  
    let getCorrectUserData = [];  
    SQLFunctions.incommingSQLDataArr.map((obj) => {
        for (const key in obj) {
            if (obj[key].userName === getInlogedUser) {
                getCorrectUserData.push(obj[key]);
            }
        }
        return getCorrectUserData;
    });
    console.log("getCorrectUserData", getCorrectUserData)
    return getCorrectUserData;
}
exports.fixSQLDataColsObj = (incommingCols) => {

    return incommingCols;
}