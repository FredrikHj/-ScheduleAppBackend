import React, { useState, useEffect } from 'react';
import '../CSS/Interigate.css';

export let Months = (props) => {
    let [ filtering ] = useState('month');
    let [ presentStr, updatePresentStr ] = useState([]);

    useEffect(() => {

    });
    return ( 
        <>
            <p className="nav__headline" >Månader</p>            
            <section className="navButtonsMonth">
                {( props.getFilterStr(filtering).length !== 0)
                    ?
                    props.getFilterStr(filtering).map((btnStr, checkboxIndex) => {        
                            let nrInList = checkboxIndex+1;
                            let checkboxName = btnStr;
                            return(
                                <section key={ nrInList } className="container__checkboxMonth">
                                    <input
                                        key={ 'inputs' + nrInList }
                                        type="checkbox" 
                                        name="month"
                                        className="checkbox__input"
                                        id={ 'checkbox__input' + nrInList }
                                        data-checkboxname={ checkboxName } 
                                        onClick={ props.sqlFiltering }
                                    />
                                    <label htmlFor={'checkbox__input' + nrInList }  key={ 'label' + nrInList } className="checkbox__labelMonth" id={'checkbox__label' + nrInList }>{ btnStr }</label>
                                </section>
                            );
                        })
                    :   <p>Datan laddas in.... </p>
                }
            </section>
        </>
    );
}