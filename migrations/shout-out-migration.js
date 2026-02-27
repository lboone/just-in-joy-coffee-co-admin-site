/**
 * ShoutOut Order Migration Script
 * Adds order field to existing ShoutOut documents
 * Run this with: node migrations/shout-out-migration.js
 */

import mongoose from "mongoose";

// ShoutOut Schema (matching your backend model)
const shoutOutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    imgAlt: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    active: { type: Boolean, default: true },
    imgKey: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const ShoutOut = mongoose.model("ShoutOut", shoutOutSchema);

async function migrateShoutOutOrder() {
  try {
    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/your-database";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Find all ShoutOut documents without an order field or with order = 0
    const shoutOuts = await ShoutOut.find({
      $or: [{ order: { $exists: false } }, { order: 0 }],
    }).sort({ createdAt: 1 });

    console.log(`Found ${shoutOuts.length} ShoutOut documents to update`);

    if (shoutOuts.length === 0) {
      console.log("No ShoutOut documents need order field updates");
      return;
    }

    // Update each document with incremental order values
    for (let i = 0; i < shoutOuts.length; i++) {
      const newOrder = (i + 1) * 10; // Start from 10, increment by 10
      await ShoutOut.findByIdAndUpdate(
        shoutOuts[i]._id,
        { order: newOrder },
        { new: true }
      );
      console.log(
        `Updated ShoutOut "${shoutOuts[i].title}" with order: ${newOrder}`
      );
    }

    console.log(
      `✅ Successfully updated ${shoutOuts.length} ShoutOut documents with order values`
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the migration
migrateShoutOutOrder();

export default migrateShoutOutOrder;
