import {incommingSQLDataArr} from './SQLFunctions'; 

export let sendCorrectUserData = (getInlogedUser) => {  
    let getCorrectUserData = [];  
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