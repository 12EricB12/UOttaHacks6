import React from "react";
import "./Solo.css";

// export default function Solo() {
//   return <div>Solo</div>;
// }
import { getDatabase, ref, set } from "firebase/database";

export default function Solo() {

  const db = getDatabase();
  set(ref(db, 'users/' + "5211"), {
    username: "Hamza",
    email: "hisra015@uottawa",
    profile_picture : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dphot&psig=AOvVaw0NMiSju11RBPFF8Zz1p70J&ust=1709523855065000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLiL6OSW14QDFQAAAAAdAAAAABAG"
  });
}