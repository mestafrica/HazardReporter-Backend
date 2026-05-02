import axios from "axios";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("Air quality request received with query:", req.query);
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const response = await axios.get(
      `https://api.waqi.info/feed/geo:${lat};${lon}/?token=eece4aa035d6de740e5c04b28f8c7ddf93199249`,
    );

    const data = response.data;
    console.log("Air quality data:", data);

    res.status(200).json({
      aqi: data?.data?.aqi ?? null,
      city: data?.data?.city?.name ?? null,
    });
  } catch (error) {
    console.error("Air quality error:", error);
    res.status(500).json({ message: "Failed to fetch air quality" });
  }
});

export default router;
