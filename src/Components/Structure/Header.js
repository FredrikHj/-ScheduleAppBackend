import React, { useState, useEffect } from 'react';
import { headName$ } from '../GlobalProps.js';

export let Header = () => {
    let [ appName, setAppName ] = useState('');   

    useEffect(() => {
        headName$.subscribe((headName) => {
            console.log(headName);
            setAppName(headName$.value);
        });
    }, []);
    console.log('header');
    
    return (
        <>
            <section></section>
            <section>{ appName }</section>
            <section></section>
        </>
    );
}