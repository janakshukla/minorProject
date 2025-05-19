
import db from "../../prisma/index.js";
import { Router } from "express";
const router = Router()

router.post("/addchild", async (req, res) => {
    const { email, parentId} = req.body;
    if (!email ||  !parentId) {
        return res.status(400).json({ error: "Email parentid and name are required." });
    }
    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!user && user.role !== "child") {
        return res.status(404).json({ error: "child not found" });
    }
    const parent = await db.user.findUnique({
        where: {
            id: parentId,
        },
    });
    if (!parent) {
        return res.status(404).json({ error: "Parent not found" });
    }

    try {
        const child = await db.child.create({
            data: {
                id: user.id,
                name:user.name,
                email: email,
                parentId: parentId,
                pushtoken: user.pushToken,
            },
        });
        return res.status(201).json({ message: "Child added successfully", child });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });

    }

});
router.get("/getallchild/:parentId", async (req, res) => {
    const { parentId } = req.params;
    if (!parentId) {
        return res.status(400).json({ error: "Parent ID is required." });
    }

    try {
        const children = await db.child.findMany({
            where: {
                parentId: parentId,
            },
        });
        return res.status(200).json(children);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
);
router.get("/getlocation/:childId", async (req, res) => {
    const { childId } = req.params;
    if (!childId) {
        return res.status(400).json({ error: "Child ID is required." });
    }

    try {
        const location = await db.location.findMany({
            where: {
                childId: childId,
            },
        });
        return res.status(200).json(location);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
)
router.get("/api/geofence/:childId", async (req, res) => {
    const { childId } = req.params;
  
    try {
      const geofences = await db.geoFence.findMany({
        where: { childId },
      });
      res.json(geofences);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch geofences" });
    }
  });

export default router;