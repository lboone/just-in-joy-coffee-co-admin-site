"use server";
import { getToken } from "@/lib/server-actions";

let API_BASE = process.env.API_SOCIAL_ENDPOINT;
if (process.env.NODE_ENV === "development") {
  API_BASE = "http://localhost:3000/api/v1/socials";
}
// const API_BASE = "https://just-in-joy-coffee-co.com/api/v1/socials";

// CREATE a social (admin only)
export const createSocial = async (social: CreateSocial) => {
  try {
    const token = await getToken();
    console.log("Token:", token);
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await fetch(`${API_BASE}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(social),
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to create social",
      };
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// GET all socials (public)
export const getAllSocials = async () => {
  try {
    const res = await fetch(`${API_BASE}/get`, { cache: "no-store" });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch socials",
      };
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// GET social by ID (admin only)
export const getSocialById = async (id: string) => {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await fetch(`${API_BASE}/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch social",
      };
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const updateActiveStatusSocial = async (
  id: string,
  updateValue: { active: boolean }
) => {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await fetch(`${API_BASE}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateValue),
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to update social",
      };
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// UPDATE social by ID (admin only)
export const updateSocial = async (id: string, social: UpdateSocial) => {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await fetch(`${API_BASE}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(social),
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to update social",
      };
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// DELETE social by ID (admin only)
export const deleteSocial = async (id: string) => {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await fetch(`${API_BASE}/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to delete social",
      };
    }
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Add these to your existing social.actions.ts file

export async function reorderSocials(
  reorderedItems: { id: string; order: number }[]
) {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const response = await fetch(`${API_BASE}/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reorderedItems }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reordering socials:", error);
    return { success: false, message: "Failed to reorder items" };
  }
}

// Reset Social order values
export async function resetSocialOrder() {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const response = await fetch(`${API_BASE}/reset`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error resetting social order:", error);
    return { success: false, message: "Failed to reset order" };
  }
}

// Move Social item to specific position
export async function moveSocialToPosition(id: string, newPosition: number) {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const response = await fetch(`${API_BASE}/move/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPosition }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error moving social:", error);
    return { success: false, message: "Failed to move item" };
  }
}
