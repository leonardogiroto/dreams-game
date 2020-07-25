import React, { useState } from 'react';
import firebase from 'firebase';
import './App.css';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './components/routing/PrivateRoute';
import GameLobby from './pages/GameLobby';
import Game from './pages/Game';

const App = () => {
  const [ isLoggedIn, setAuthState ] = useState(true);

  firebase.auth().onAuthStateChanged(authUser => {
    setAuthState(authUser !== null);
  });

  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" isLoggedIn={isLoggedIn} component={GameLobby}></PrivateRoute>
        <PrivateRoute path="/lobby" isLoggedIn={isLoggedIn} component={GameLobby}></PrivateRoute>
        <PrivateRoute path="/game" isLoggedIn={isLoggedIn} component={Game}></PrivateRoute>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/register" component={Register}></Route>
      </Switch>
    </Router>
  );
}

export default App;
