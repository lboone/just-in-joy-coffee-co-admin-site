"use server";
import { cookies } from "next/headers";
export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token;
}

export async function fetchLatLng(address: string) {
  const encoded = encodeURIComponent(address);
  console.log("Fetching coordinates for address:", encoded);
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Just-In-Joy-Coffee-Co", // Required by Nominatim policy
    },
  });

  if (!res.ok) {
    return {
      success: false,
      message: `Error fetching data: ${res.status} ${res.statusText}`,
    };
  }

  const data = await res.json();
  if (data.length === 0) {
    return {
      success: false,
      message: "No results found for the given address",
    };
  }

  return {
    success: true,
    message: "Coordinates fetched successfully",
    data: {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    },
  };
}
