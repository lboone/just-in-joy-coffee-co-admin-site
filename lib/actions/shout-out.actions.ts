"use server";
import { getToken } from "@/lib/server-actions";

let API_BASE = process.env.API_SHOUT_OUT_ENDPOINT;
if (process.env.NODE_ENV === "development") {
  API_BASE = "http://localhost:3000/api/v1/shout-outs";
}
// const API_BASE = "https://just-in-joy-coffee-co.com/api/v1/shout-outs";

// CREATE a shout-out (admin only)
export const createShoutOut = async (shoutOut: CreateShoutOut) => {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await fetch(`${API_BASE}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(shoutOut),
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to create shout-out",
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

// GET all shout-outs (public)
export const getAllShoutOuts = async () => {
  try {
    const res = await fetch(`${API_BASE}/get`, { cache: "no-store" });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch shout-outs",
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

// GET shout-out by ID (admin only)
export const getShoutOutById = async (id: string) => {
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
        message: data.message || "Failed to fetch shout-out",
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
export const updateActiveStatusShoutOut = async (
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
        message: data.message || "Failed to update shout out",
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
// UPDATE shout-out by ID (admin only)
export const updateShoutOut = async (id: string, shoutOut: UpdateShoutOut) => {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await fetch(`${API_BASE}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(shoutOut),
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to update shout-out",
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

// DELETE shout-out by ID (admin only)
export const deleteShoutOut = async (id: string) => {
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
        message: data.message || "Failed to delete shout-out",
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

// Reorder shout-outs (admin only)
export async function reorderShoutOuts(
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
    return await response.json();
  } catch (error) {
    console.error("Error reordering shout-outs:", error);
    return { success: false, message: "Failed to reorder items" };
  }
}

// Reset ShoutOut order values
export async function resetShoutOutOrder() {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const response = await fetch(`${API_BASE}/reset`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error resetting shout-out order:", error);
    return { success: false, message: "Failed to reset order" };
  }
}

// Move ShoutOut item to specific position
export async function moveShoutOutToPosition(id: string, newPosition: number) {
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
    return await response.json();
  } catch (error) {
    console.error("Error moving shout-out:", error);
    return { success: false, message: "Failed to move item" };
  }
}
