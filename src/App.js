import logo from './logo.svg';
import React, { useState } from 'react';
import { Container } from "react-bootstrap";
import Post from './Post'
import { AuthProvider } from "./contexts/AuthContext.js";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./pages/Login.js";
import Homepage from "./pages/Homepage.js";
import Signup from "./pages/Signup.js"
import firebase from 'firebase/app';
import PrivateRoute from "./PrivateRoute.js";
import "firebase/firestore";
import "firebase/auth";
import '../src/styles/App.css';
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const auth = firebase.auth();

  const [user] = useAuthState(auth)
  console.log(user); 
  return (
    <Container style = {{minHeight: "100vh", minWidth: "100vw", margin: 0, padding: 0, border: 0}} > 
      <div className = "d-flex align-items-center justify-content-center"
      style = {{ minHeight: "80vh" }}
      >

      <Router>
          <AuthProvider>
          <Switch>
            <Route path = "/login" component = {Login} />
            <Route path = "/signup" component = {Signup} />
            <Route path = "/homepage" component = {Homepage} />
            <Route path="/">
                {user ? <Redirect to="/profile"/> : <Redirect to="/login"/>}
              </Route>
          </Switch>
          </AuthProvider>
      </Router>
      </div>
	</Container>
  );
}

export default App;
