import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../../prisma/index.js";
const router = Router()

router.get("/", async (req, res) => {
    res.json({ message: "Hello from child data route" });
});


export default router;