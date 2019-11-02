import React, { useState, useEffect } from 'react';
import { headName$ } from '../GlobalProps.js';
//import { ??? } from './Components/Structure/???.js';

export let Header = () => {
    //let [ appName, setAppName ] = useState();   
    
    useEffect(() => {
/*     headName$.subscribe((headName) => {
       console.log(headName);
        setAppName(headName$.value);
    }); */
    }, []);
    return (
        <>

        </>
    );
}