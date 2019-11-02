import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Helmet} from "react-helmet";
import { updateHeadName } from './Components/GlobalProps.js';

import { Header } from './Components/Structure/Header.js';
import { Information } from './Components/Structure/Information.js';
import { HeadTable } from './Components/Structure/HeadTable.js';
import { Filtering } from './Components/Structure/FilteringHead.js';

let MainApp = () => {
  let [ appName, setAppName ] = useState('WorkshoppSchema');  
  useEffect(() => {

    updateHeadName(appName);
  }, []);

  
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{ appName }</title>
      </Helmet>
      <header className="header">
        <Header/>
      </header>
      <section className="infoNav">
        <section className="infoNav__info">
          <Information/>
        </section>
        <nav className="infoNav__nav">
          <Filtering/>
        </nav>
      </section>    
      <hr id="hrLine"></hr>
      <main id="mainContainer">
      <HeadTable/>
      </main>
      <footer>
      </footer>
    </>
  );
}

export default MainApp;
