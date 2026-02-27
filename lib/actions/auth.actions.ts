"use server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_USER_ENDPOINT;

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }
    // Set cookies for token and user (as JSON string)
    const cookieStore = await cookies();
    cookieStore.set("token", data.data.token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: true,
    });

    cookieStore.set("user", JSON.stringify(data.data.user), {
      httpOnly: false, // user info can be read by client if needed
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: true,
    });
    return { success: true, data: data.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  // Clear cookies
  cookieStore.delete("token");
  cookieStore.delete("user");
  return { success: true, message: "Logged out successfully" };
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  if (!userCookie) {
    return { success: false, message: "User not found" };
  }
  return { success: true, data: JSON.parse(userCookie) };
};

export const getCurrentUserToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return { success: false, message: "Token not found" };
  }
  return { success: true, data: token };
};

export const isAdmin = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  if (!user.success) {
    return false;
  }

  return user.data.role === "admin";
};
