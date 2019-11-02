import React, { useState, useEffect } from 'react';
import { FormAdd } from './FormAdd.js';

import { isArray } from 'util';

export let LogInOut = (props) => {
    return (
        <>
            <section>
                {( props.addForm === false) 
                    ?
                        <button className="button adminBtn" data-admin="logIn" onClick={ props.runAdmin }>
                            <p id="logInOut__heaflineStr" data-admin="logIn" onClick={ props.runAdmin }>Login</p>
                            <section id="logInOut__inputContainer" data-admin="logIn" onClick={ props.runAdmin }>
                                <section id="inputContainer__userName" data-admin="logIn" onClick={ props.runAdmin }>
                                    <p id="userName__str" data-admin="logIn" onClick={ props.runAdmin }>Användarnamn</p>
                                    <i className="material-icons icons__userName" data-admin="logIn" onClick={ props.runAdmin }>arrow_right</i>
                                    <input type="Text" className="logInOut__inputUserName" />
                                </section>
                                <section id="inputContainer__pwd" data-admin="logIn" onClick={ props.runAdmin }>
                                    <p id="pwd__str" data-admin="logIn" onClick={ props.runAdmin }>Lösenord</p>
                                    <i className="material-icons icons__pwd" data-admin="logIn" onClick={ props.runAdmin }>arrow_right</i>
                                    <input type="Text" className="logInOut__inputPwd"/>    
                                </section>                         
                            </section>    
                        </button>   
                    :
                        <button className="button adminBtn" data-admin="logOut" onClick={ props.runAdmin }>
                            <p id="logInOut__heaflineStr" data-admin="logOut" onClick={ props.runAdmin }>Logout</p>
                        </button>
                }
            </section>
            <FormAdd
                addForm={ props.addForm }
                setAddSQLPostID={ props.setAddSQLPostID }
            />
        </>
    );
}