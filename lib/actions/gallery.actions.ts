"use server";
import { getToken } from "@/lib/server-actions";

let API_BASE = process.env.API_GALLERY_ENDPOINT;
if (process.env.NODE_ENV === "development") {
  API_BASE = "http://localhost:3000/api/v1/gallery";
}
//const API_BASE = "https://just-in-joy-coffee-co.com/api/v1/gallery";

// CREATE a gallery (admin only)
export const createGallery = async (gallery: CreateGallery) => {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await fetch(`${API_BASE}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(gallery),
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to create gallery",
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

// GET all gallerys (public)
export const getAllGalleries = async () => {
  try {
    const res = await fetch(`${API_BASE}/get`, { cache: "no-store" });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch galleries",
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

// GET gallery by ID (admin only)
export const getGalleryById = async (id: string) => {
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
        message: data.message || "Failed to fetch gallery",
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

export const updateActiveStatusGallery = async (
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
        message: data.message || "Failed to update gallery",
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

// UPDATE gallery by ID (admin only)
export const updateGallery = async (id: string, gallery: UpdateGallery) => {
  try {
    const token = await getToken();
    if (!token) return { success: false, message: "Not authenticated" };

    const res = await fetch(`${API_BASE}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(gallery),
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to update gallery",
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

// DELETE gallery by ID (admin only)
export const deleteGallery = async (id: string) => {
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
        message: data.message || "Failed to delete gallery",
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

// Add these to your existing gallery.actions.ts file

export async function reorderGalleries(
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
    console.error("Error reordering galleries:", error);
    return { success: false, message: "Failed to reorder items" };
  }
}

// Reset Gallery order values
export async function resetGalleryOrder() {
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
    console.error("Error resetting gallery order:", error);
    return { success: false, message: "Failed to reset order" };
  }
}

// Move Gallery item to specific position
export async function moveGalleryToPosition(id: string, newPosition: number) {
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
    console.error("Error moving gallery:", error);
    return { success: false, message: "Failed to move item" };
  }
}
