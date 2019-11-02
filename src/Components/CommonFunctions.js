import React, { useState, useEffect } from 'react';
import { SQLDataQuantity$, SQLDataArr$ } from './GlobalProps.js';

export let CommonFunctions = () => {
    let [ incommingSQLData, updateincommingSQLData ] = useState([]);

    useEffect(() => {
        SQLDataArr$.subscribe((SQLDataArr) => {
           console.log(SQLDataArr);
            
            updateincommingSQLData(SQLDataArr$.value);
        });
    }, []);    

    function productSearch(e) {
    /*     let removeProductLimit = 0;
        setProductLimit(removeProductLimit);
        let targetProduct = e.target.value;
        
        setSearchProducts(targetProduct);
        if (targetProduct === '') {
        setProductLimit(startProductLimit);
        } */
    }
    function filterMonths(SQLMonthsArr, activeMonths){
        let insertedMonthsStr = '';

       console.log(SQLMonthsArr);
        for (const monthsStrs of activeMonths) {
            insertedMonthsStr = monthsStrs;
        }
       console.log(insertedMonthsStr);
        
        SQLMonthsArr.filter((filteredMonths) => {
            return filteredMonths.month.includes(insertedMonthsStr)
        })


    } 
    let exportObj = {
        filterMonths: filterMonths,

         
    }
    return (
        <>
        </>
    );
}