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
        await db.sOSAlert.create({
            data: {
                childId,
                latitude,
                longitude,
                timestamp:Date.now()
            }
        })
        return res.status(200).json({ message: "SOS Alert added successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
)
export default router;