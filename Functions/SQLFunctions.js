//SQL Module
var mysql = require('mysql');
// Import the SQL Config
const SQLConfig = require('./SQLConfig');
// Import statementCols
const statementCols = require('./SQLColumnName');

// Some useful variables used in the functions bellow 
let incommingSQLDataArr = [];
let SQLDataColsArr = statementCols.colsArr;
let currentStatement = '';
let choosenStatement = '';

// Exported function running when called from both the: Default and User specific method
exports.incommingSQLData = () => {
    return incommingSQLDataArr;
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