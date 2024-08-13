import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect("mongodb://192.168.2.4:27017/Projekt")
  .then(() => {
    console.log("Sikeresen csatlakozva a MongoDB-hez");
  })
  .catch((err) => {
    console.error("Hiba történt a MongoDB-hez való csatlakozás során:", err);
  });

app.get("/", (req, res) => {
  res.send("MongoDB kapcsolat sikeres!");
});

app.listen(PORT, () => {
  console.log(`A szerver a ${PORT} porton fut.`);
});
