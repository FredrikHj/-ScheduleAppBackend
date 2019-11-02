import React, { useState, useEffect } from 'react';
import { headName$ } from '../GlobalProps.js';

export let Information = () => {
    //let [ appName, setAppName ] = useState('');   


    useEffect(() => {
/*     headName$.subscribe((headName) => {
       console.log(headName);
        setAppName(headName$.value);
    }); */
    }, []);
    return (
        <>
Hej kollega!
<br></br>
Välj vad du vill se med knapparna till höger.
<br></br><br></br>
Vill du lägga in aktiviteter så väljer du Berörda -> Ingen, skriver in info om aktiviteten och vem som berörs. 
<br></br><br></br>
Du tar bort filtreringen som finns genom att trycka på "Tratten med det röda krysset" överst         </>
    );
}