//SQL Module
var mysql = require('mysql');
// Import the SQL Config
const SQLConfig = require('./SQLConfig');
// Import statementCols
const statementCols = require('./SQLColumnName');

// Some useful variables used in the functions bellow 
let incommingSQLDataArr = [];
let currentInlogedUser = ''
let SQLDataColsArr = statementCols.colsArr;
let currentStatement = '';
let choosenStatement = '';

// Exported function running when called from both the: Default and User specific method
exports.incommingSQLData = () => {
    return incommingSQLDataArr;
}

// Headfunction for SQL
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
        console.log("runSQLConn -> SQLStatement - 35", SQLStatement)
        SQLConn.query(SQLStatement, function (error, sqlResult) {
            //if(getStatus === 'default') 
            incommingSQLDataArr.push(sqlResult);

            if (err) {
                //SQLConn.release();
                return;
            }
        }); 
        SQLConn.end();
    });
}
exports.SQLDataArr = [incommingSQLDataArr];

// SQL Question builder 
exports.buildCorrectSQLStatements = (statementType, SQLObj) =>{ // Find correct SQLStatement
    console.log("buildCorrectSQLStatements -> SQLObj - 42", SQLObj)
    if (statementType === 'first run') currentStatement = `SELECT * FROM ${SQLConfig.SQLTable} ORDER BY date DESC`;
    
    if (statementType === 'addRecord') {
        // Is adding currentInlogedUser at index 2 and adds the length with one 
        SQLObj.unshift(addCurrentTimeSpamp());
        SQLObj.splice(1, 0, currentInlogedUser);

        let statementInsertIntoData = `('${ SQLObj.join("','")}');`;
        currentStatement = `INSERT INTO ${ SQLConfig.SQLTable} (${ statementCols.colsStr }) VALUES${ statementInsertIntoData}`;  
        console.log("exports.buildCorrectSQLStatements -> statementInsertIntoData", statementInsertIntoData)
        console.log("exports.buildCorrectSQLStatements -> choosenStatement", currentStatement)
    }
    if (statementType === 'userSpec') {
        currentInlogedUser = SQLObj;
        currentStatement = `SELECT * FROM ${SQLConfig.SQLTable} WHERE userName="${SQLObj}" ORDER BY date DESC`;
    }
    if (statementType === 'removeRecord') {
        currentStatement = `DELETE FROM ${SQLConfig.SQLTable} WHERE timeStamp="${SQLObj}"`;
    }

    return currentStatement;
}

// General functions =========================================================================
exports.resetSQLData = () => {
    incommingSQLDataArr = [];
}
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