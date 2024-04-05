import axios from "axios";
import { firebaseDb } from "../config";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

// interface ExchangeTokenResponseInterface {
//   access_token: string;
//   token_type: string;
//   bot_id: string;
//   workspace_name: string;
//   workspace_icon: string;
//   workspace_id: string;
//   owner: {
//     type: string;
//     user: {
//       object: string;
//       id: string;
//       name: string;
//       avatar_url: string;
//       type: string;
//       person: {
//         email: string;
//       };
//     };
//   };
//   duplicated_template_id: null | string;
//   request_id: string;
// }

export const exchangeCodeForAccessToken = async (code: string) => {
  if (!code) return;
  try {
    const { data } = await axios.post(
      "http://localhost:1235/api/exchange-code",
      {
        code,
      }
    );

    createNewUserInFirebaseDb({
      email: data.data.owner.user.person.email,
      name: data.data.owner.user.name,
      token: data.data.access_token,
      workspace_id: data.data.workspace_id,
    });
  } catch (error) {
    console.log(error);
  }
};

interface NewUserItem {
  email: string;
  name: string;
  token: string;
  workspace_id: string;
}

export const createNewUserInFirebaseDb = async (user: NewUserItem) => {
  try {
    const usersRef = collection(firebaseDb, "users");
    const q = query(usersRef, where("email", "==", user.email));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(collection(firebaseDb, "users"), user);
    } else {
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { ...user });
      });
    }

    localStorage.setItem("token", user.token);
    window.history.replaceState({}, document.title, window.location.pathname);

    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
