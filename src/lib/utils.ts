import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scrollToEndElement(ref: React.RefObject<HTMLDivElement>) {
  if (ref.current) {
    ref.current.scrollTop = ref.current.scrollHeight - ref.current.clientHeight;
  }
}

export function getInitialName(name: string): string {
  const nameArr = name.trim().split(/\s+/);
  let initialName = "";
  if (nameArr.length > 1) {
    for (let i = 0; i < Math.min(nameArr.length, 3); i++) {
      initialName += nameArr[i][0];
    }
  } else {
    initialName = nameArr[0].slice(0, 2);
  }
  return initialName.toUpperCase();
}

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 403 || res.status === 401) {
      throw new Error("You dont have access to this data");
    }
    throw new Error("An error occurs when fetching data");
  }

  return res.json();
}
