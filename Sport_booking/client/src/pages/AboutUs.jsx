import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AboutUs() {
    const [images, setImages] = useState({
        carlo: null,
        alessandro: null,
        davide: null,
    });

    const fetchImage = async (name) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/image/images/${name}`, {
                responseType: 'blob', // Ottieni la risposta come blob
            });
            return URL.createObjectURL(response.data); // Crea un URL temporaneo per l'immagine
        } catch (error) {
            console.error(`Error fetching image for ${name}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchImages = async () => {
            const carloImage = await fetchImage("Carlo_Savino");
            const alessandroImage = await fetchImage("Alessandro_Sedicina");
            const davideImage = await fetchImage("Davide_Tarsitano");

            setImages({
                carlo: carloImage,
                alessandro: alessandroImage,
                davide: davideImage,
            });
        };

        fetchImages(); 
    }, []);



    return (
        <div className="about-us">
            <header>
                <h1>CHI SIAMO</h1>
                <p>Benvenuti su <span class="highlight">SportBooking</span>, la piattaforma dedicata agli appassionati di sport! La nostra missione è rendere semplice e divertente partecipare a partite sportive e creare nuove opportunità di gioco direttamente in modo virtuale senza dover necessariamente passare la tua giornata a parlare al telefono per trovare i partecipanti.</p>
            </header>
            <main>
                <div class="about-content">
                    <figure>
                        {images.carlo ? (
                            <img src={images.carlo} alt="Carlo Savino" />
                        ) : (
                            <p>Caricamento immagine...</p>
                        )}
                        <figcaption><strong>Carlo Savino</strong><p>16/03/2002</p><p>Studente di Ingegneria Informatica e dell'Automazione</p></figcaption>
                    </figure>
                    <figure>
                        {images.alessandro ? (
                            <img src={images.alessandro} alt="Alessandro Sedicina" />
                        ) : (
                            <p>Caricamento immagine...</p>
                        )}
                        <figcaption><strong>Alessandro Sedicina</strong><p>29/08/2002</p><p>Studente di Ingegneria Informatica e dell'Automazione</p></figcaption>
                    </figure>
                    <figure>
                        {images.davide ? (
                            <img src={images.davide} alt="Davide Tarsitano" />
                        ) : (
                            <p>Caricamento immagine...</p>
                        )}
                        <figcaption><strong>Davide Tarsitano</strong><p>01/02/2002</p><p>Studente di Ingegneria Informatica e dell'Automazione</p></figcaption>
                    </figure>
                </div>
                <div class="about-text">
                    <h2>LA NOSTRA STORIA</h2>
                    <p>SportBooking è nata dall'idea di un gruppo di colleghi universitari che volevano facilitare l'organizzazione di partite di Calcetto, Basket, Ping Pong e Beach Volley nella loro università con i campi convenzionati con il <a href="https://www.poliba.it/">Politecnico di Bari</a>. Con il tempo, la nostra comunità è cresciuta e ora offriamo la possibilità di prenotare e creare partite di diversi sport in tutta Bari.</p>
                    <h2>IL NOSTRO TEAM</h2>
                    <p>Il nostro team è composto da appassionati di sport, sviluppatori, designer e professionisti del marketing. Lavoriamo insieme per offrirti la migliore esperienza possibile.</p>
                    <h2>I NOSTRI VALORI</h2>
                    <ul>
                        <li><strong>Passione:</strong> Amiamo lo sport e vogliamo condividerlo con tutti.</li>
                        <li><strong>Comunità:</strong> Crediamo nel potere dello sport per unire le persone.</li>
                        <li><strong>Innovazione:</strong> Cerchiamo sempre nuovi modi per migliorare la tua esperienza.</li>
                        <li><strong>Affidabilità:</strong> Puoi contare su di noi per organizzare le tue partite in modo semplice e sicuro.</li>
                    </ul>
                </div>
            </main>
        </div>
    );
};