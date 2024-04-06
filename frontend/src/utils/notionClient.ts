import axios from "axios";
import { axiosInstance } from "../config";

interface TGetUsers {
  databaseId: string;
  name: string;
  duration: string;
}
export const createDatabaseItem = async (input: TGetUsers) => {
  const token = localStorage.getItem("token") || null;
  console.log(token);
  if (token === null) return;
  try {
    const { data } = await axiosInstance.post("create-item", {
      token,
      database_id: input.databaseId,
      name: input.name,
      duration: input.duration,
    });

    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
    localStorage.removeItem("token");
    localStorage.removeItem("databaseID");
    window.location.reload();
  }
};
