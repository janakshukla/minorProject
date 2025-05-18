import { Router } from "express";
import db from "../../prisma/index.js";
const router = Router()

router.post("/location", async (req, res) => {
    const {childId,latitude,longitude} = req.body
    if (!childId || !latitude || !longitude) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        await db.location.create({
            data: {
                childId,
                latitude,
                longitude,
                timestamp:Date.now()
            }
        })
        return res.status(200).json({ message: "Location added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
);
router.post("/sosalert", async (req, res) => {
    const {childId,latitude,longitude} = req.body
    if (!childId || !latitude || !longitude) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
       const sosalert = await db.sOSAlert.create({
            data: {
                childId,
                latitude,
                longitude,
                timestamp:Date.now()
            }
        })
        const child = await db.child.findUnique({
            where: {
                id: childId,
            },
        });
        const message = {
            to: child.pushToken,
            sound: 'default',
            title: "emergency SOS Alert",
            body: sosalert,
            data: { withSome: 'data' },
          };
      
          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          });

        return res.status(200).json({ message: "SOS Alert added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
)
router.post("/sendnotification", async (req, res) => {
    const {childId,title,body} = req.body
    if (!childId || !title || !body) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const child = await db.child.findUnique({
            where: {
                id: childId,
            },
        });
        const message = {
            to: child.pushToken,
            sound: 'default',
            title: title,
            body: body,
            data: { withSome: 'data' },
          };
      
          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          });
        return res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
);
router.post("/api/geofence", async (req, res) => {
    const { childId, latitude, longitude, radius, name } = req.body;
  
    try {
      const geo = await db.geoFence.create({
        data: {
          childId,
          latitude,
          longitude,
          radius,
          name,
        },
      });
      res.status(201).json(geo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create geofence" });
    }
  });

export default router;