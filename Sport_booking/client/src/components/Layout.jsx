import React, { useState, useEffect } from 'react';
import axios from 'axios'; //richieste HTTP

export default function Layout({ children }) {   //Layout accetta una proprietà children che rappresenta contenuto visualizzato nel layout
  const [backgroundImage, setBackgroundImage] = useState('');   //inizializza, con uno stato locale, la componente background image


  useEffect(() => {     //utilizza hook useEffect per recuperare immagine da un'API al caricamente del componente
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/image/images/Sfondo`, {    //richiesta GET al server per aver immagine sfondo
          responseType: 'blob'    //ci aspettiamo un file binario come risposta
        });

        const imageUrl = URL.createObjectURL(response.data);  //ricevuta la risposta si crea un oggetto URL mostratp nello strato background image
        setBackgroundImage(imageUrl);  
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,  //imposta immagine sfondo
        backgroundAttachment: 'fixed',  //immagine fissa durante scorrimento
        minHeight: '100vh',
        backgroundSize: 'cover',  //immagine copre intero elemento
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minWidth: 'fit-content'    //l'elemento si adatta al contenuto
      }}
    >
      
      {children} 
    </div>  //restituisce contenuto figlio nel layout permettendo a ogni componente o elemento di essere visualizzato in questo layout
  );
};

//garanita coerenza visiva per centralizzazione layout, permette poi di cambiare facilmente le immagini di sfondo in base al contesto o all' evento, incapsula il contenuto all'interno del layout

//Come posso ccambiare sfondo a seconda della pagina?