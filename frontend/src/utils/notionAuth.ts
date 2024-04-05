import axios from "axios";

const client = "695b8556-de84-4c9c-b004-bf84a98457f1";
const secretId = "secret_VXxQ60Nnjp1VoRteBQUX5E8rErn9GeVwowZCNAbxyzK";

// export const authorizeWithCode = async (code: string) => {
//   try {
//     const res = await axios.post("https://api.notion.com/v1/oauth/token", {
//       grant_type: "authorization_code",
//       code,
//       client_id: client,
//       client_secret: secretId,
//     });
//     console.log(res);
//   } catch (error) {
//     console.log(error);
//   }
// };

export const exchangeCodeForAccessToken = async (code: string) => {
  try {
    const res = await axios.post("http://localhost:1235/api/exchange-code", {
      code,
    });

    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
