"use server";
import { pinata } from "../pinata";
import { getToken } from "../server-actions";
import { isAdmin } from "./auth.actions";
import { getAllEvents } from "./event.actions";
import { getAllFeaturedDrinks } from "./featured-drinks.actions";
import { getAllGalleries } from "./gallery.actions";
import { getAllHomeSwipers } from "./home-swiper.actions";
import { getAllShoutOuts } from "./shout-out.actions";
import { getAllSocials } from "./social.actions";

export const dashboardCounts = async () => {
  try {
    const [featuredDrinks, shoutOuts, events, galleries, homeSwipers, socials] =
      await Promise.all([
        getAllFeaturedDrinks(),
        getAllShoutOuts(),
        getAllEvents(),
        getAllGalleries(),
        getAllHomeSwipers(),
        getAllSocials(),
      ]);

    const featuredDrinksCount = featuredDrinks?.data?.length ?? 0;
    const shoutOutsCount = shoutOuts?.data?.length ?? 0;
    const eventsCount = events?.data?.length ?? 0;
    const galleriesCount = galleries?.data?.length ?? 0;
    const homeSwiperCount = homeSwipers?.data?.length ?? 0;
    const socialsCount = socials?.data?.length ?? 0;

    const dashboardCountsData: DashboardCountsData = {
      featuredDrinksCount,
      shoutOutsCount,
      eventsCount,
      galleriesCount,
      homeSwiperCount,
      socialsCount,
    };
    return {
      success: true,
      data: dashboardCountsData,
    };
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error fetching dashboard counts",
    };
  }
};

export async function deleteImage(fileId: string) {
  const token = await getToken();
  if (!token) return { success: false, message: "Not authenticated" };
  const admin = await isAdmin();

  if (!admin)
    return {
      success: false,
      message: "You are not authorized to delete the image.",
    };

  console.log("Deleting image with ID:", fileId);
  try {
    const unpin = await pinata.files.public.delete([fileId]);
    console.log("Unpin response:", unpin);
    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error deleting image",
    };
  }
}
