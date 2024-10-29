import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'; // Import the database module

const firebaseConfig = {
  apiKey: 'AIzaSyAu60bZwtuWb_2iAzbdnUJkoIz9LaLjnaw',
  authDomain: 'zootopia-c7454.firebaseapp.com',
  projectId: 'zootopia-c7454',
  storageBucket: 'zootopia-c7454.appspot.com',
  messagingSenderId: '751248730983',
  appId: '1:751248730983:android:13a2b535224ce9e4635dc2',
  databaseURL: 'https://zootopia-c7454-default-rtdb.firebaseio.com' // Add this line
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
