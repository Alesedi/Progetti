import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/LoginPanel";
import SignUp from "./pages/SignUpPanel";
import Home from "./pages/Home";
import NewGame from "./pages/NewGamePanel";
import CreateMatches from "./pages/CreateMatches";
import SubscribedMatches from "./pages/SubscribedMatches";
import Profile from "./pages/Profile";
import ChangePass from "./pages/ChangePass";
import DeleteAcc from "./pages/DeleteAcc";
import AboutUs from "./pages/AboutUs";
import WhereToFindUs from "./pages/WhereToFindUs";

import Navbar from "./components/Navbar";
import NewGameButton from "./components/NewGameButton";
import Layout from "./components/Layout";

import { ResultProvider } from "./context/ResultContext";
import { AuthProvider } from "./context/AuthContext";

import "./App.css";



export default function App() {
  return (
    <ResultProvider>

      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <div id="app">
              <Navbar />
              <main id="main-content">
                <Routes>
                  <Route
                    path="/"
                    element={<Home />}
                  />
                  <Route
                    path="/loginPanel"
                    element={<Login />}
                  />
                  <Route
                    path="/signUpPanel"
                    element={<SignUp />}
                  />
                  <Route
                    path="/newGamePanel"
                    element={<NewGame />}
                  />
                  <Route
                    path="/createdMatches"
                    element={<CreateMatches />}
                  />
                  <Route
                    path="/subscribedMatches"
                    element={<SubscribedMatches />}
                  />
                  <Route
                    path="/profile"
                    element={<Profile />}
                  />
                  <Route
                    path="/changePass"
                    element={<ChangePass />}
                  />
                  <Route
                    path="/deleteAcc"
                    element={<DeleteAcc />}
                  />
                  <Route
                    path="/aboutUs"
                    element={<AboutUs />}
                  />
                  <Route
                    path="/whereToFindUs"
                    element={<WhereToFindUs />}
                  />
                </Routes>
              </main>
              <NewGameButton />
            </div>
          </Layout>
        </AuthProvider>
      </BrowserRouter>

    </ResultProvider>
  );
}