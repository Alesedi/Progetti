import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

//createRoot usato per creare una radice reacr in cui sarà montato albero di componenti
ReactDOM.createRoot(document.getElementById('root')).render(   
  <React.StrictMode>
    <App />
  </React.StrictMode>,    //usato per potenziali problemi di codice, usato per evidenziari problemi potenziali, se si hanno effetti collaterali usando UseEffect ad esempio, usato per migliorare qualità codice
);


//reinderizza applicazione nel DOM
