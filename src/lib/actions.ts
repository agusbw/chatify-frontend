import Cookies from "js-cookie";
import { CreateRoom } from "./types";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${Cookies.get("token")}`,
};

export async function addRoom(newRoom: CreateRoom) {
  return await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`, {
    method: "POST",
    headers: {
      ...headers,
    },
    body: JSON.stringify(newRoom),
  });
}

export async function joinRoom(values: { code: string }) {
  return await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms/join`, {
    method: "POST",
    headers: {
      ...headers,
    },
    body: JSON.stringify(values),
  });
}
