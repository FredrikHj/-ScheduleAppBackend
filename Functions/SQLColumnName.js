const statementCols = () => {
    return ' timeStamp, userName, date, activity, concerned, type, place, content';    
}
exports.colsStr = statementCols();
exports.colsArr = statementCols().split(',');
