import React, { useState,  } from 'react';
import '../CSS/Interigate.css';

export let Concerned = (props) => {
    let [ filtering ] = useState('concerned');
    return (
        <>
            <p className="nav__headline">Berörda</p>            
            <section className="navButtonsConcerned">
                {( props.getFilterStr(filtering).length !== 0)
                    ?
                    props.getFilterStr(filtering).map((btnStr, checkboxIndex) => {        
                            let nrInList = checkboxIndex+1;
                            let checkboxName = btnStr;
                            return(
                                <section key={ nrInList } className="container__checkboxConcerned">
                                    <input
                                        key={ 'inputs' + nrInList }
                                        type="checkbox"
                                        name="concerned"
                                        className="checkbox__input"
                                        id={ 'checkbox__input' + nrInList }
                                        data-checkboxname={ checkboxName } 
                                        onClick={ props.sqlFiltering }
                                    />
                                    <label htmlFor={'checkbox__input' + nrInList }  key={ 'label' + nrInList } className="checkbox__labelConcerned" id={'checkbox__label' + nrInList }>{ btnStr }</label>
                                </section>
                            );
                        })
                    :   <p>Datan laddas in.... </p>
                }
            </section>
        </>
    );
}