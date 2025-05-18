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
router.post("/usage", async (req, res) => {
    const {childId,appName,duration} = req.body
    if (!childId || !appName || !duration) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        await db.usageLog.create({
            data: {
                childId,
                appName,
                duration,
                timestamp:Date.now()
            }
        })
        return res.status(200).json({ message: "Usage added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/calllog", async (req, res) => {
    const {childId,callerid,duration,timestamp} = req.body
    if (!childId || !callerid || !duration || !timestamp) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        await db.callLog.create({
            data: {
                childId,
                callerid,
                duration,
                timestamp
            }
        })
        return res.status(200).json({ message: "Call log added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;