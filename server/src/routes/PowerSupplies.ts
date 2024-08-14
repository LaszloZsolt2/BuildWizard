import express from "express";
import PowerSupplies from "../models/PowerSupplies";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const powerSupplies = await PowerSupplies.find();
    res.json(powerSupplies);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
});

export default router;
