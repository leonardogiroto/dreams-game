import { auth } from '../config';

export function register(email: string, password: string) {
  return auth().createUserWithEmailAndPassword(email, password);
}
 
export function login(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}
