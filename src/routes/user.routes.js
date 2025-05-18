import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../../prisma/index.js";
import * as jwt from "jsonwebtoken";

const router = Router()

router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    const existinguser = await db.user.findFirst({
        where: {
            email: email
        }});
 
    if (existinguser) {
        return res.status(501).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await db.user.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword,
                role: role
            }
        });
        delete user.password;
        return res.status(201)
            .json({ message: "User created successfully", "user": user});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });

    }
})

export default router;