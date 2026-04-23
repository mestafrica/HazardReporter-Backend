import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // Example using WAQI API (replace with your key)
    const response = await axios.get(
      `https://api.waqi.info/feed/geo:${lat};${lon}/?token=eece4aa035d6de740e5c04b28f8c7ddf93199249`
    );

    const data = response.data;

    res.status(200).json({
      aqi: data?.data?.aqi ?? null,
    });
  } catch (error) {
    console.error("Air quality error:", error);
    res.status(500).json({ message: "Failed to fetch air quality" });
  }
});

export = router;