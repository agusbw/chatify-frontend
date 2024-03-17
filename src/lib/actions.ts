import { CreateRoom } from "./types";

function getHeaders({ token }: { token?: string | null }) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function addRoom(newRoom: CreateRoom, token?: string | null) {
  return await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`, {
    method: "POST",
    headers: {
      ...getHeaders({ token }),
    },
    body: JSON.stringify(newRoom),
  });
}

export async function joinRoom(
  values: { code: string | null },
  token?: string | null
) {
  return await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms/join`, {
    method: "POST",
    headers: {
      ...getHeaders({ token }),
    },
    body: JSON.stringify(values),
  });
}
