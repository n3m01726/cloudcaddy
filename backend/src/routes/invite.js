// backend/src/routes/invite.js
import express from "express";
import { randomBytes } from "crypto";
import db from "../dev.db"; // ton ORM ou accès DB

const router = express.Router();

// 1️⃣ Générer un token
router.post("/", async (req, res) => {
  const token = randomBytes(16).toString("hex");
  const invite = await db.invites.create({
    token,
    createdBy: req.user.id,
    expiresAt: new Date(Date.now() + 7*24*60*60*1000), // 7 jours
  });

  const inviteUrl = `${process.env.FRONTEND_URL}/invite/${token}`;
  res.json({ inviteUrl });
});

// 2️⃣ Validation du token et ajout utilisateur
router.get("/:token", async (req, res) => {
  const { token } = req.params;
  const invite = await db.invites.findOne({ where: { token } });

  if (!invite) return res.status(404).send("Token invalide");
  if (invite.expiresAt < new Date()) return res.status(400).send("Token expiré");

  // Ajouter l’utilisateur (exemple)
  await db.projectUsers.create({
    projectId: invite.projectId,
    userId: req.user.id,
    role: "member",
  });

  // Marquer token comme utilisé ou supprimer
  await db.invites.destroy({ where: { id: invite.id } });

  res.send("Invitation acceptée !");
});

export default router;
