// ==================================== SQLfunctions handling ====================================

//SQL Module
var mysql = require('mysql');
// Import the SQL Config
const SQLConfig = require('./SQLConfig');
// Import statementCols
const statementCols = require('./SQLColumnName');

// Some useful variables used in the functions bellow 
let incommingSQLDataArr = [];
let currentInlogedUser = ''
//let SQLDataColsArr = statementCols.colsArr;
let currentStatement = '';
//let choosenStatement = '';

// Exported function running when called from both the: Default and User specific method
exports.incommingSQLData = () => {
    return incommingSQLDataArr;
}
/* =======================================================================================================================
 Headfunction for SQL*/
exports.runSQLConn = (SQLStatement) =>{      
    // Creates a connection between the server and my client and listen for SQL changes    
    console.log("Connect for the SQL DB :)");
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
        SQLConn.query(SQLStatement, function (error, sqlResult) {
        //console.log("exports.runSQLConn -> sqlResult", sqlResult)
            incommingSQLDataArr.push(sqlResult);

            if (err) {
                return;
            }
        }); 
        // Closing the connection
        SQLConn.end();
    });
}
exports.SQLDataArr = [incommingSQLDataArr];
/* =======================================================================================================================
   SQL Question builder */
exports.buildCorrectSQLStatements = (statementType, inlogedUser, dataArr) =>{ // Find correct SQLStatement
    if (statementType === 'first run') currentStatement = `SELECT * FROM ${SQLConfig.SQLTable} ORDER BY date DESC`;
    if (statementType === 'userSpec') currentStatement = `SELECT * FROM ${SQLConfig.SQLTable} WHERE userName="${inlogedUser}" ORDER BY date DESC`;
    
    if (statementType === 'addRecord') {
        // Is adding currentInlogedUser at index 2 and adds the length with one 
        dataArr.unshift(addCurrentTimeSpamp());
        dataArr.splice(1, 0, inlogedUser);
        
        let statementInsertIntoData = `('${ dataArr.join("','")}');`;
        currentStatement = `INSERT INTO ${ SQLConfig.SQLTable} (${ statementCols.colsStr }) VALUES${ statementInsertIntoData}`;  
    }
    if (statementType === 'editRecord'){
        console.log("statementType", statementType);
        console.log("dataArr", dataArr);
        console.log(inlogedUser);
        console.log(statementCols.colsArr);

        currentStatement = `UPDATE ${SQLConfig.SQLTable} SET ${ setRecordsCol(statementCols.colsArr, dataArr) } WHERE userName="${ inlogedUser }" AND WHERE timeStamp="${dataArr}"`;
    }
    if (statementType === 'removeRecord') currentStatement = `DELETE FROM ${SQLConfig.SQLTable} WHERE timeStamp="${dataArr}"`;

    return currentStatement;
}
// General functions =========================================================================
/* Add currrentTimeStamp for the tables records. The stamp is using identifaying the record to be removed when you
clicking at the corresponding btns*/ 
const addCurrentTimeSpamp = () => {
    const currentDate = new Date();
    
    let date = currentDate.getDate();
    let month = currentDate.getMonth(); //Be careful! January is 0 not 1
    let year = currentDate.getFullYear();
    let hour = currentDate.getHours();
    let min = currentDate.getMinutes();
    let sec = currentDate.getSeconds();
    let millisec = currentDate.getMilliseconds();
    let dateString = `${year}-${(date)}-${month+1}|${hour}:${min}:${sec}:${millisec}`;
    return dateString;
}
let setRecordsCol = (colArr, dataArr) => {
let setStr = '';

/* for (let index = 0; index < array.length; index++) {
    const element = array[index];
    
} */
}
exports.resetSQLData = () => {
    incommingSQLDataArr = [];
}