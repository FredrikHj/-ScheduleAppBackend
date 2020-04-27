//SQL Module
var mysql = require('mysql');
// Import the SQL Config
const SQLConfig = require('./SQLConfig');
// Import statementCols
const statementCols = require('./SQLColumnName');
// Import SQLRecordsCellArr
const SQLRecordsCellArr = require('./SQLRecordsCellArr');

// Some useful variables used in the functions bellow 
let incommingSQLDataArr = [];
let SQLDataColsArr = statementCols.colsArr;
let currentStatement = '';
let choosenStatement = '';
let colStructureArr = [];

// Exported function running when called from both the: Default and User specific method
exports.incommingSQLData = () => {
    return incommingSQLDataArr;
}
// Common functionfor the head SQL functions
const removeEmptyStr = (structuredSQLDataArr, structuredObjToArr, outerIndex, innerIndex) => {
    /* From structuredObjToArr I placing every other index value´s into pushToStructuredSQLDataArr in opposite order.
    The structure of pushToStructuredSQLDataArr are every body index are representing the SQLData´s columns.
    I needing the pushToStructuredSQLDataArr in mapping the CellInput component. */
    const arrStr = structuredObjToArr[outerIndex][innerIndex];
    // Removing empty strings
    if (arrStr !== '' || arrStr !== structuredObjToArr[outerIndex][innerIndex]) structuredSQLDataArr[innerIndex].push(structuredObjToArr[outerIndex][innerIndex]);
}
const removeDublicate = (structuredSQLDataArr) =>{
    const removedDublicatedStr = [];
    for (let outerIndex = 0; outerIndex < structuredSQLDataArr.length; outerIndex++) {
        // Remove dublicated strings
        const removedDublicatedStrArr = [...new Set(structuredSQLDataArr[outerIndex])]
        //Push the new arraies = The dublicated strings is removed
        removedDublicatedStr.push(removedDublicatedStrArr);
    }
    console.log("removeDublicate -> structuredSQLDataArr - ArrUt", removedDublicatedStr)
    return removedDublicatedStr;
}

exports.structureSQLData = (incommingSQLDataArr) => {
    const structuredSQLDataArr = [];
    const structuredObjToArr = [];
    // Loop through the SQLData´s index = 0 and get into the object finding the keys = SQLCols
    for (const key in incommingSQLDataArr[0]) structuredSQLDataArr.push([]);
    
    // In SQLData the structure are like a tabel there every index starting at 0 are handle the key value pair from the SQL Tabel as a object 
    for (let outerIndex = 0; outerIndex < incommingSQLDataArr.length; outerIndex++) {
        /* From every SQL tabels object I taking the value´s and collect it in structuredObjToArr. 
        structuredObjToArr has the same structure as SQLData accept from that the every index are handle just the values.*/
        structuredObjToArr.push(Object.values(incommingSQLDataArr[outerIndex]));
        console.log("exports.structureSQLData -> structuredObjToArr", structuredObjToArr)
        for (let innerIndex = 0; innerIndex < structuredSQLDataArr.length; innerIndex++)
            // Cleaning the structuredObjToArr from empty strings
            removeEmptyStr(structuredSQLDataArr, structuredObjToArr, outerIndex, innerIndex);
        }
    // Remove the first index = InlogedUser
    structuredSQLDataArr.shift();
    return removeDublicate(structuredSQLDataArr);
}
exports.runSQLConn = (SQLStatement) =>{      
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
        console.log("runSQLConn -> SQLStatement - 29", SQLStatement)
        SQLConn.query(SQLStatement, function (error, sqlResult) {
            //if(getStatus === 'default') 
            incommingSQLDataArr.push(sqlResult);

            if (err) {
                //SQLConn.release();
                return;
            }
        }); 
        console.log("exports.runSQLConn -> colStructureArr", colStructureArr)
        SQLConn.end();
    });
}
exports.SQLDataArr = [incommingSQLDataArr];
exports.buildCorrectSQLStatements = (statementType, SQLObj) =>{ // Find correct SQLStatement
    console.log("exports.buildCorrectSQLStatements -> statementType", statementType)
    console.log("buildCorrectSQLStatements -> SQLObj - 42", SQLObj)
    if (statementType === 'first run') choosenStatement = `SELECT * FROM ${SQLConfig.SQLTable} ORDER BY date DESC`;
    
    if (statementType === 'addRecord') {
        let statementInsertIntoData = `('${ SQLObj.join("','")}');`;
        choosenStatement = `INSERT INTO ${ SQLConfig.SQLTable} (sent, ${ statementCols.colsStr }) VALUES${ statementInsertIntoData}`;  
    }
    
    
    if (statementType === 'userSpec') {
        choosenStatement = `SELECT * FROM ${SQLConfig.SQLTable} WHERE userName="${SQLObj}" ORDER BY date DESC`;
    }
    
    //if (statementType === 'filter') choosenStatement = `SELECT * FROM data ${SQLObj.currentStatement.operator} ${ SQLObj.currentStatement.filterIn } in ('${ SQLObj.currentStatement.SQLFilterStr}')`;
    
    currentStatement = choosenStatement;   
    console.log("buildCorrectSQLStatements -> currentStatement - 60", currentStatement)
    return currentStatement;
}
    //Function to choose correct statement according the inomming data
    
exports.resetSQLData = () => {
    incommingSQLDataArr = [];
}