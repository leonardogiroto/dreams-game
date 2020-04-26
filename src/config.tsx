import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDZpXISVz3GbG7I90F7dLollv0qMrralfo",
  authDomain: "dreams-game-1d367.firebaseapp.com",
  databaseURL: "https://dreams-game-1d367.firebaseio.com"
};
firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();

export const getCurrentUser = (): firebase.User | null => {
  return firebase.auth().currentUser;
}
