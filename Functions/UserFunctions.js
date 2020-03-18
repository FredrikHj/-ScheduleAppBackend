// ==================================== User functions handling ====================================
import {incommingSQLDataArr} from './SQLFunctions';
const regedUserList = require('./RegedUser.json');
const fs = require('fs');

// Create a user account
export const userReg = (regedUser) =>{
    console.log("userReg -> regedUser", regedUser)

    const regedUserObj = {
        userId: userId(),
        fullName: regedUser.fullName, 
        userName: regedUser.userName,
        userPassWord: regedUser.userPassWord
    }

    regedUserList.regedUser.push(regedUserObj);
    console.log("userReg -> regedUserList", regedUserList)

    fs.writeFile('./Functions/RegedUser.json', JSON.stringify(regedUserList, null, 1), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}
//Create id for the created user
let countRegedUser = 0;
export const userId  = () => {  
    //Note - When calling this function I need set the id value = -1 able starting the user id from nr 1 -->
    for (let index = 0; index < regedUserList.regedUser.length; index++) { 
        countRegedUser = regedUserList.regedUser[index].userId;
    }
    // Get the last id in my arr of users and add by one
    countRegedUser++;    
    return countRegedUser;
}
// Validate the user who whants logging in
export const validateUser = (incommingUser) => {
        let getFullName = '';
        let userReturnData = {userMatch: false};
        
    let userList = regedUserList['regedUser'];
    
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
export const verifyUser = (getInlogedUser) => {  
    console.log("verifyUser -> getInlogedUser - 61", getInlogedUser)
    let getCorrectUserData = [];  
    console.log("verifyUser -> incommingSQLDataArr - 63", incommingSQLDataArr)
    incommingSQLDataArr.map((obj) => {
        for (const key in obj) {
            if (obj[key].userName === getInlogedUser) {
                getCorrectUserData.push(obj[key]);
            }
        }
        return getCorrectUserData;
    });
    return getCorrectUserData;
}