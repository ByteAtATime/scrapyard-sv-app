import useSWR, { mutate } from "swr";
import { getServerUrl } from "./config";
import type { User, UserResponse } from "~/lib/user/types";
import type { Event } from "~/lib/events/types";

// TODO: Replace with Clerk auth when ready
const getAuthHeaders = async () => ({
  "x-user-id": "admin1",
});

const fetcher = async (path: string) => {
  const serverUrl = await getServerUrl();
  if (!serverUrl) {
    throw new Error("Server URL not configured");
  }

  const headers = await getAuthHeaders();
  const response = await fetch(`${serverUrl}${path}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export function useUserData(user: User | null) {
  const { data, error, isLoading, mutate } = useSWR<UserResponse>(
    user ? `/api/v1/users/${user.id}` : null,
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
  const { data, error, isLoading } = useSWR<Event[]>(`/api/v1/events`, fetcher);

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
  if (!serverUrl) {
    throw new Error("Server URL not configured");
  }

  const headers = await getAuthHeaders();
  const response = await fetch(`${serverUrl}/api/v1/points/award`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to award points");
  }

  // Invalidate user data cache
  await mutate(`/api/v1/users/${payload.userId}`);
  return response.json();
}

export async function markAttendance(payload: {
  userId: string;
  eventId: string;
}) {
  const serverUrl = await getServerUrl();
  if (!serverUrl) {
    throw new Error("Server URL not configured");
  }

  const headers = await getAuthHeaders();
  const response = await fetch(`${serverUrl}/api/v1/attendance/mark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to mark attendance");
  }

  // Invalidate user data cache
  await mutate(`/api/v1/users/${payload.userId}`);
  return response.json();
}

// Add more hooks as needed for other API endpoints
