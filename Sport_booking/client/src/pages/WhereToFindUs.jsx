import React from "react";

export default function WhereToFindUs() {
    return (
        <div className="find-us">
            <header className="location">
                <h1>DOVE TROVARCI</h1>
            </header>
            <main>
                <div className="map">
                    <p>Via Edoardo Orabona, 4, 70126 Bari BA</p>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.836949416704!2d16.866079315318244!3d41.10632357929033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1347b8d467b805eb%3A0x7e85d32a6af3016d!2sVia%20Edoardo%20Orabona%2C%204%2C%2070126%20Bari%20BA!5e0!3m2!1sit!2sit!4v1681380974627!5m2!1sit!2sit" title="Politecnico di Bari" />
                </div>
                <div className="contact">
                    <h2>CONTATTACI</h2>
                    <p>Email: SportBooking@libero.it</p>
                    <p>Telefono: +39 345 918 8592</p>
                </div>
            </main>
        </div>
    );
};