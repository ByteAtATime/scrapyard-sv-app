import useSWR, { mutate } from "swr";
import { getServerUrl } from "./config";
import type { User, UserResponse } from "~/lib/user/types";
import type { Event } from "~/lib/events/types";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export function useUserData(user: User | null) {
  const { data, error, isLoading, mutate } = useSWR<UserResponse>(
    user ? `${getServerUrl()}/api/users/${user.id}` : null,
    fetcher
  );

  return {
    userData: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useEvents() {
  const { data, error, isLoading } = useSWR<Event[]>(
    `${getServerUrl()}/api/v1/events`,
    fetcher
  );

  return {
    events: data,
    isLoading,
    isError: error,
  };
}

export async function awardPoints(payload: {
  userId: string;
  amount: number;
  reason: string;
  metadata?: object;
}) {
  const serverUrl = await getServerUrl();
  const response = await fetch(`${serverUrl}/api/v1/points/award`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to award points");
  }

  // Invalidate user data cache
  await mutate(`${serverUrl}/api/users/${payload.userId}`);
  return response.json();
}

export async function markAttendance(payload: {
  userId: string;
  eventId: string;
}) {
  const serverUrl = await getServerUrl();
  const response = await fetch(`${serverUrl}/api/v1/attendance/mark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to mark attendance");
  }

  // Invalidate user data cache
  await mutate(`${serverUrl}/api/users/${payload.userId}`);
  return response.json();
}

// Add more hooks as needed for other API endpoints
