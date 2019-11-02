
import {BehaviorSubject} from "rxjs";

let headName = '';
let SQLDataArr = [];
let SQLDataColsArr = [];
let SQLFilterMonthsBtnsArr = [];
let SQLFilterConcernedBtnsArr = [];

export const headName$ = new BehaviorSubject(headName);
export const SQLDataArr$ = new BehaviorSubject(SQLDataArr);
export const SQLDataColsArr$ = new BehaviorSubject(SQLDataColsArr);

export const SQLFilterMonthsBtnsArr$ = new BehaviorSubject(SQLFilterMonthsBtnsArr);
export const SQLFilterConcernedBtnsArr$ = new BehaviorSubject(SQLFilterConcernedBtnsArr);

export function updateHeadName(headName){
    if(headName) headName$.next(headName);
}
export function updateSQLDataArr(SQLDataArr){  
    if(SQLDataArr) SQLDataArr$.next(SQLDataArr);
}
export function updateSQLDataColsArr(SQLDataColsArr){  
    if(SQLDataColsArr) SQLDataColsArr$.next(SQLDataColsArr);
}
export function updateSQLFilterMonthsBtnsArr(SQLFilterMonthsBtnsArr){  
    if(SQLFilterMonthsBtnsArr) SQLFilterMonthsBtnsArr$.next(SQLFilterMonthsBtnsArr);
}
export function updateSQLFilterConcernedBtnsArr(SQLFilterConcernedBtnsArr){  
    if(SQLFilterConcernedBtnsArr) SQLFilterConcernedBtnsArr$.next(SQLFilterConcernedBtnsArr);
}