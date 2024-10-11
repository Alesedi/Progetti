import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  //hook che permette di cambiare rotta quando si verifica un evento
import NavButton from "./NavButton";
import { useAuth } from '../context/AuthContext';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import SportsIcon from '@mui/icons-material/Sports';
import LoginIcon from '@mui/icons-material/Login';


export default function Navbar() {

  const { isAuthenticated, user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [isSubMenuVisible, setSubMenuVisible] = useState(false);


  useEffect(() => {
    checkAuth();    //gestisce logica di autenticazione
  }, [checkAuth]);


  const handleLogout = async () => {
    await logout();
    navigate('/loginPanel');
  };

  const toggleSubMenu = () => {
    setSubMenuVisible(!isSubMenuVisible);
  };



  return (
    <>
      <div className="top-space">
        <h1 className="site-title">Sport Booking</h1>
        <p>L'app per prenotare le tue partite online</p>
      </div>
      <aside id="navbar">
        <div className="nav-left">
          <ul>
            <li><NavButton url="/" icon={HomeIcon} description="HOME" /></li>
            <li><NavButton url="/aboutUs" icon={InfoIcon} description="CHI SIAMO" /></li>
            <li><NavButton url="/whereToFindUs" icon={LocationOnIcon} description="DOVE TROVARCI" /></li>
          </ul>
        </div>
        <div className="nav-right">
          <ul>
            {isAuthenticated ? (
              <>
                <ul className="dropdown">
                  <li><NavButton onClick={toggleSubMenu} icon={SportsIcon} description="PARTITE" /></li>

                  {isSubMenuVisible && (
                    <ul className="sub-menu">
                      <li><NavButton url="/createdMatches" description="PARTITE CREATE" onClick={toggleSubMenu} /></li>
                      <li><NavButton url="/subscribedMatches" description="ISCRIZIONI" onClick={toggleSubMenu}/></li>
                    </ul>
                  )}
                </ul>
                <li>
                  <NavButton url="/profile" icon={AccountCircleIcon} description={user ? user.toUpperCase() : 'PROFILO'} />
                </li>
                <li>
                  <NavButton url="/loginPanel" icon={LogoutIcon} onClick={handleLogout} description="LOGOUT" />

                </li>
              </>
            ) : (
              <li>
                <NavButton url="/loginPanel" icon={LoginIcon} description="LOGIN" />
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  )
}