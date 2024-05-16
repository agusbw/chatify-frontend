// Handling non-websocket data mutatation

function getHeaders({ token }: { token: string | null }) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
