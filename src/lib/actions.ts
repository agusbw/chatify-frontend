import { CreateRoom } from "./types";

function getHeaders({ token }: { token: string | null }) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function addRoom(newRoom: CreateRoom, token: string | null) {
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
  token: string | null
) {
  return await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms/join`, {
    method: "POST",
    headers: {
      ...getHeaders({ token }),
    },
    body: JSON.stringify(values),
  });
}

export async function deleteRoom(token: string | null, roomId: number | null) {
  return await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms/${roomId}`, {
    method: "DELETE",
    headers: {
      ...getHeaders({ token }),
    },
  });
}

export async function leaveRoom(token: string | null, roomId: number | null) {
  return await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/rooms/${roomId}/leave`,
    {
      method: "DELETE",
      headers: {
        ...getHeaders({ token }),
      },
    }
  );
}

export async function refreshCode(token: string | null, roomId: number | null) {
  return await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/rooms/${roomId}/refresh-code`,
    {
      method: "PATCH",
      headers: {
        ...getHeaders({ token }),
      },
    }
  );
}

export async function kickMember(
  token: string | null,
  roomId: number | null,
  memberId: number
) {
  return await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/rooms/${roomId}/member/${memberId}`,
    {
      method: "DELETE",
      headers: {
        ...getHeaders({ token }),
      },
    }
  );
}
