/**
 * Gallery Order Migration Script
 * Adds order field to existing Gallery documents
 * Run this with: node migrations/gallery-migration.js
 */

import mongoose from "mongoose";

// Gallery Schema (matching your backend model)
const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    alt: { type: String, required: true },
    img: { type: String, required: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

async function migrateGalleryOrder() {
  try {
    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/your-database";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Find all Gallery documents without an order field or with order = 0
    const galleries = await Gallery.find({
      $or: [{ order: { $exists: false } }, { order: 0 }],
    }).sort({ createdAt: 1 });

    console.log(`Found ${galleries.length} Gallery documents to update`);

    if (galleries.length === 0) {
      console.log("No Gallery documents need order field updates");
      return;
    }

    // Update each document with incremental order values
    for (let i = 0; i < galleries.length; i++) {
      const newOrder = (i + 1) * 10; // Start from 10, increment by 10
      await Gallery.findByIdAndUpdate(
        galleries[i]._id,
        { order: newOrder },
        { new: true }
      );
      console.log(
        `Updated Gallery "${galleries[i].title}" with order: ${newOrder}`
      );
    }

    console.log(
      `✅ Successfully updated ${galleries.length} Gallery documents with order values`
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the migration
migrateGalleryOrder();

export default migrateGalleryOrder;
