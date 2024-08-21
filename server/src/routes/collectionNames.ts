import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);
    res.json(collectionNames);
  } catch (err) {
    console.error("Error occurred while fetching collection names:", err);
    if (err instanceof Error) {
      res.status(500).json({
        message: "Failed to fetch collection names",
        error: err.message,
      });
    } else {
      res.status(500).json({
        message: "Failed to fetch collection names",
        error: "Unknown error occurred",
      });
    }
  }
});

export default router;
