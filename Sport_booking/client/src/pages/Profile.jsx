import React from "react";
import axios from "axios";
import { useState, useEffect } from 'react';
import PasswordIcon from '@mui/icons-material/Password';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import NavButton from '../components/NavButton';




export default function Profile() {

    const [userInfo, setUserInfo] = useState(null);
    const [imageSrc, setImageSrc] = useState('');
    const [loading, setLoading] = useState(true);
    const [favouriteSport, setFavouriteSport] = useState('');
    const [loadingImage, setLoadingImage] = useState(true);



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users`);
                setUserInfo(response.data.user)
                setFavouriteSport(response.data.user.favouriteSport); 
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }

        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchImage = async () => {
            if (!favouriteSport) return;
            try {
                console.log(favouriteSport)
                const response = await axios.get(`http://localhost:5000/api/image/images/${favouriteSport}Icon`, {
                    responseType: 'blob' 
                });

                const imageUrl = URL.createObjectURL(response.data);
                setImageSrc(imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            } finally {
                setLoadingImage(false);
            }
        };

        fetchImage();
    }, [favouriteSport]);


    if (loading || loadingImage) {
        return <div>Caricamento in corso...</div>;
    }

    
    if (!userInfo) {
        return <div>Nessun dato utente disponibile.</div>;
    }

    const formattedDate = userInfo.birthDate
        ? new Date(userInfo.birthDate).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Data di nascita non disponibile';




    return (
        <div className="profile-container">
            {imageSrc && <img src={imageSrc} className="profile-image" alt="Event" />}
            <div className="profile-card">
                <h1>Username: {userInfo.username}</h1>
                <p>Nome: {userInfo.name} </p>
                <p>Cognome: {userInfo.surname} </p>
                <p>Data di nascita: {formattedDate}</p>
                <p>Email: {userInfo.email}</p>

            </div>
            <div className="profile-buttons">
                <ul>
                    <li><NavButton url="/changePass" icon={PasswordIcon} description="Cambia Password" /></li>
                    <li><NavButton url="/deleteAcc" icon={PersonOffIcon} description="Elimina Account" /></li>
                </ul>
            </div>
        </div>
    )
}