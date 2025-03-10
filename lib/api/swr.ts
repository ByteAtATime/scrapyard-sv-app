import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { getServerUrl } from "./config";
import type { User, UserResponse, UsersListResponse } from "~/lib/user/types";
import type { Event } from "~/lib/events/types";
import { useAuth } from "@clerk/clerk-expo";

const fetcher = async (path: string, headers: HeadersInit) => {
  const serverUrl = await getServerUrl();
  if (!serverUrl) {
    throw new Error("Server URL not configured");
  }

  const response = await fetch(`${serverUrl}${path}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

export function useAwardPoints() {
  const { getToken } = useAuth();

  const { trigger, isMutating, error } = useSWRMutation(
    "/api/v1/points/award",
    async (path: string, { arg: payload }: { arg: any }) => {
      const serverUrl = await getServerUrl();
      if (!serverUrl) {
        throw new Error("Server URL not configured");
      }

      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${serverUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to make request");
      }
      const result = await response.json();
      if (!result?.success) {
        throw new Error(result?.error || "Failed to award points");
      }
      return result;
    }
  );

  const awardPoints = async (payload: {
    userId: number;
    amount: number;
    reason: string;
    metadata?: object;
  }) => {
    const result = await trigger(payload);
    // Invalidate user data cache
    await mutate(`/api/v1/users/${payload.userId}`);
    return result;
  };

  return {
    awardPoints,
    isLoading: isMutating,
    error,
  };
}

export function useMarkAttendance() {
  const { getToken } = useAuth();

  const { trigger, isMutating, error } = useSWRMutation(
    "/api/v1/attendance/mark",
    async (path: string, { arg: payload }: { arg: any }) => {
      const serverUrl = await getServerUrl();
      if (!serverUrl) {
        throw new Error("Server URL not configured");
      }

      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${serverUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to make request");
      }
      const result = await response.json();
      if (!result?.success) {
        throw new Error(result?.error || "Failed to mark attendance");
      }
      return result;
    }
  );

  const markAttendance = async (payload: {
    userId: number;
    eventId: number;
  }) => {
    const result = await trigger(payload);
    // Invalidate user data cache
    await mutate(`/api/v1/users/${payload.userId}`);
    return result;
  };

  return {
    markAttendance,
    isLoading: isMutating,
    error,
  };
}

export function useUserData(user: User | null) {
  const { getToken } = useAuth();
  const { data, error, isLoading, mutate } = useSWR<UserResponse>(
    user ? `/api/v1/users/${user.id}` : null,
    async (path: string) => {
      const token = await getToken();
      return fetcher(path, {
        Authorization: `Bearer ${token}`,
      });
    }
  );

  return {
    userData: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useEvents() {
  const { getToken } = useAuth();
  const { data, error, isLoading } = useSWR<{
    data: Event[];
    success: boolean;
  }>("/api/v1/events", async (path: string) => {
    const token = await getToken();
    return fetcher(path, {
      Authorization: `Bearer ${token}`,
    });
  });

  return {
    events: data?.data ?? [],
    isLoading,
    isError: error,
  };
}

export function useUsers() {
  const { getToken } = useAuth();
  const { data, error, isLoading } = useSWR<UsersListResponse>(
    "/api/v1/users",
    async (path: string) => {
      const token = await getToken();
      return fetcher(path, {
        Authorization: `Bearer ${token}`,
      });
    }
  );

  return {
    users: data?.data ?? [],
    isLoading,
    isError: error,
  };
}

// Add more hooks as needed for other API endpoints
