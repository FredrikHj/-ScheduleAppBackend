import axios from 'axios';
import { updateSQLDataArr, updateSQLDataColsArr, updateSQLFilterMonthsBtnsArr,  updateSQLFilterConcernedBtnsArr } from '../GlobalProps.js';

let SQLFilterMonthsBtnsArr = [];
let SQLFilterConcernedBtnsArr = [];

console.log(process);
let backendURL = 'https://hbgworks-poc-event-schedule.herokuapp.com/'; // Heroku;
//let backendURL = `${process.env.baseURL}:${process.env.PORT}` || "http://localhost:5000"; // Heroku
//let backendURL = 'http://fredrikipnrtelia.mina-projekt.se:3001'; // Pub
//let backendURL = 'http://fredrikipnrtelia.mina-projekt.se:3002'; // Dev
export let axiosGet = (/* type, currentSQLStatement */) => {
    axios.get(`${backendURL}/SQLData`).
    then(response => {
        // Store the incommingg API data in a object
        console.log(response.data);
        updateSQLDataArr(response.data);           
        saveFilterBtns(response.data);
        updateSQLDataColsArr(Object.keys(response.data[0]));            
    }).
    catch(error => {
        //console.log(error.response);
    });

/*     axios.get('http://fredrikipnrtelia.mina-projekt.se:81/HBGWorksApp/index.php').
    then(response => {
        // Store the incommingg API data in a object
        console.log(response.data);
    }).
    catch(error => {
        //console.log(error.response);
    }); */
}
export let axiosPost = (postType, SQLStatementsObj) => {  
    let type = '';
    let sendToSqlBackend = {
        SQLStatementsObj,
    };
    console.log(sendToSqlBackend);
    if (postType === 'filter') type = 'filter';
    if (postType === 'add') type = 'AddPost';
    axios.post(
        `${backendURL}/SQLData/${ type }`
        , sendToSqlBackend ).
    then(response => {
        console.log(response.data);
        // Update the returning sqlData table
        let SQLStatementsObj = {
            type: 'SELECT',
            typeOfStatement: 'default',
        }
        if (postType !== 'add') updateSQLDataArr(response.data[0]);
    }).
    catch(error => {
        //console.log(error.response);
    });
}
function saveFilterBtns(filterBtns) {
    /*
    Save both the months ans the cerncerned filter Btn in a individuall
    array. The arrays are sep... from the filerering funtions!
    */
    for (let index = 0; index < filterBtns.length; index++) {
        let filterMonthsBtnStr = filterBtns[index].month;
        let filterConcernedBtnStr = filterBtns[index].concerned;

        // Check if the strings already is in the array 
        if (!SQLFilterMonthsBtnsArr.includes(filterMonthsBtnStr)) SQLFilterMonthsBtnsArr.push(filterMonthsBtnStr);
        if (!SQLFilterConcernedBtnsArr.includes(filterMonthsBtnStr)) SQLFilterConcernedBtnsArr.push(filterConcernedBtnStr);
    }
    
    updateSQLFilterMonthsBtnsArr(SQLFilterMonthsBtnsArr);
    updateSQLFilterConcernedBtnsArr(SQLFilterConcernedBtnsArr);
}