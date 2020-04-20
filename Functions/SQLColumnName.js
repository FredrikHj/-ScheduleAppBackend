const statementCols = () => {
    return ' date, activity, state, concerned, type, place, content';    
}
exports.colsStr = statementCols();
exports.colsArr = statementCols().split(',');
