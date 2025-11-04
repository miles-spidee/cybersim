import express from "express";
import {
  logCommand,
  getStatus,
  resetProgress
} from "../controllers/defenseController.js";

const router = express.Router();

router.post("/log", logCommand);
router.get("/status/:userId", getStatus);
router.post("/reset", resetProgress);

export default router;
