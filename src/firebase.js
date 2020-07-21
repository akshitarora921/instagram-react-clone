import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyDnqh0ZrxT17LsFDS72YVpzf5ltAYUcd9s',
	authDomain: 'instagram-react-clone-1d8e6.firebaseapp.com',
	databaseURL: 'https://instagram-react-clone-1d8e6.firebaseio.com',
	projectId: 'instagram-react-clone-1d8e6',
	storageBucket: 'instagram-react-clone-1d8e6.appspot.com',
	messagingSenderId: '841164213148',
	appId: '1:841164213148:web:82eaefe7af72ac76f71659',
	measurementId: 'G-TDY50YKT0Z',
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,storage,auth}