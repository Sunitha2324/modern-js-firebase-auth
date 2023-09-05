import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  where,
  query,
  orderBy,
  desc,
  asc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0UIo1Svlijd7AgM24bF5Dkg-Zb0_6JQI",
  authDomain: "fir-setup-frontend.firebaseapp.com",
  projectId: "fir-setup-frontend",
  storageBucket: "fir-setup-frontend.appspot.com",
  messagingSenderId: "318530371591",
  appId: "1:318530371591:web:47ea9a8ef55ecf8df12aa2",
};

// init firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "books");

// get collection data and it return promises
// getDocs(colRef)
//   .then((snapshot) => {
//     console.log(snapshot.docs);
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// Query
const q = query(colRef, where("author", "==", "ggg"));

// Realtime upadte and get the data
const unsubCol = onSnapshot(colRef, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log("books", books);
});

const addbook = document.querySelector(".add");
addbook.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(colRef, {
    title: addbook.title.value,
    author: addbook.author.value,
  }).then(() => {
    addbook.reset();
  });
});

const deletebook = document.querySelector(".delete");
deletebook.addEventListener("submit", (e) => {
  e.preventDefault();
  const deleteRef = doc(db, "books", deletebook.id.value);
  deleteDoc(deleteRef).then(() => deletebook.reset());
});

// // get single doc
const contRef = doc(db, "books", "aWqfQLWfnM3pJmUBo4gU");
// // getDoc(contRef, "c5biFFNotBIUgdsmcyZn").then((doc) => {
// //   console.log("loaded", doc.data(), doc.id);
// // });
// fetching a single document (& realtime)
const docRef = doc(db, "books", "aWqfQLWfnM3pJmUBo4gU");

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// updating a document
// updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateForm.reset();
  });
});

//signing user
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("cred", cred.user);
      signupForm.reset();
    })
    .catch((err) => console.log("signup error", err));
});

//logout
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("user signedout");
    })
    .catch((err) => console.log("signout err", err));
});

//login

const login = document.querySelector(".login");
login.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = login.email.value;
  const password = login.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user logged in", cred);
      login.reset();
    })
    .catch((err) => console.log("login err", err.message));
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");
  unsubCol();
  unsubDoc();
  unsubAuth();
});
