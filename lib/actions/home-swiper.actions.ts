"use server";
import { getToken } from "@/lib/server-actions";

let API_BASE = process.env.API_HOME_SWIPER_ENDPOINT;

if (process.env.NODE_ENV === "development") {
  API_BASE = "http://localhost:3000/api/v1/home-swipers";
}
//const API_BASE = "https://just-in-joy-coffee-co.com/api/v1/home-swipers";

// CREATE a home-swiper (admin only)
export const createHomeSwiper = async (homeSwiper: CreateHomeSwiper) => {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await fetch(`${API_BASE}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(homeSwiper),
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to create home swiper",
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

// GET all home-swiper (public)
export const getAllHomeSwipers = async () => {
  try {
    const res = await fetch(`${API_BASE}/get`, { cache: "no-store" });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch home swipers",
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

// GET home-swiper by ID (admin only)
export const getHomeSwiperById = async (id: string) => {
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
        message: data.message || "Failed to fetch home swiper",
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

export const updateActiveStatusHomeSwiper = async (
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
        message: data.message || "Failed to update home swiper",
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
// UPDATE home-swiper by ID (admin only)
export const updateHomeSwiper = async (
  id: string,
  shoutOut: UpdateHomeSwiper
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
      body: JSON.stringify(shoutOut),
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to update home swiper",
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

// DELETE home-swiper by ID (admin only)
export const deleteHomeSwiper = async (id: string) => {
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
        message: data.message || "Failed to delete home swiper",
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

// Add this to your existing actions file
export async function reorderHomeSwipers(
  reorderedItems: { id: string; order: number }[]
) {
  try {
    const response = await fetch(`${API_BASE}/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reorderedItems }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reordering home swipers:", error);
    return { success: false, message: "Failed to reorder items" };
  }
}
