// Handle the column of the SQL Table, lenght is 7
const statementCols = () => {
    return ' timeStamp, userName, date, activity, concerned, type, place, content';    
}
// Exports a whole string with the cols
exports.colsStr = statementCols();
// Exports the each string as an array of al cols strings
exports.colsArr = statementCols().split(',');
