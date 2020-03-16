//SQL Config
var mysql = require('mysql');
const SQLConfig = require('./SQLConfig');
export let incommingSQLDataArr = [];
let currentStatement = '';
let choosenStatement = '';
let count = 0;

let defaultStatement = `SELECT * FROM ${SQLConfig.SQLTable}`;

export let test = 2;

export let runSQLConn = (SQLStatement) =>{      
    count++;
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
        console.log("runSQLConn -> SQLStatement", SQLStatement)
        SQLConn.query(SQLStatement, function (err, sqlResult) {
        console.log("runSQLConn -> sqlResult", sqlResult);
            incommingSQLDataArr.push(sqlResult);
            //console.log("incommingSQLDataArr - 43", incommingSQLDataArr)
            if (err) {
                //SQLConn.release();
                return;
            }
        }); 
        SQLConn.end();
    });
}
export let buildCorrectSQLStatements = (statementType, SQLObj) =>{ // Find correct SQLStatement
    let statementCols = 'date, activity, state, concerned, type, place, content';    
    
    if (statementType === 'first run') choosenStatement = `SELECT * FROM ${SQLConfig.SQLTable} ORDER BY date DESC`;
    
    if (statementType === 'addRecord') {
        let statementInsertIntoData = `('${ SQLObj.join("','")}');`;
        choosenStatement = `INSERT INTO ${ SQLConfig.SQLTable} (sent, ${ statementCols }) VALUES${ statementInsertIntoData}`;  
    }
    
    
    if (statementType === 'userSpec') {
        choosenStatement = `SELECT * FROM ${SQLConfig.SQLTable} WHERE userName=${ SQLObj } ORDER BY date DESC`;
    }
    
    //if (statementType === 'filter') choosenStatement = `SELECT * FROM data ${SQLObj.currentStatement.operator} ${ SQLObj.currentStatement.filterIn } in ('${ SQLObj.currentStatement.SQLFilterStr}')`;
    
    currentStatement = choosenStatement;   
    return currentStatement;
}
    //Function to choose correct statement according the inomming data