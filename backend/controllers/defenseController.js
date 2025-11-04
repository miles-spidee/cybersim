import Log from "../models/Log.js";
import Progress from "../models/Progress.js";

export const logCommand = async (req, res) => {
  try {
    const { userId, command, output, success } = req.body;

    // Save the log
    const log = await Log.create({ userId, command, output, success });

    // Update progress if command is valid
    let progress = await Progress.findOne({ userId });
    if (!progress) progress = await Progress.create({ userId, completedTasks: [] });

    const validTasks = {
      "sudo ufw enable": "firewall",
      "sudo apt update && sudo apt upgrade": "update",
      "chmod 700 /root": "chmod",
      "sudo sed": "sshd",
      "sudo systemctl disable guest-account": "guest"
    };

    const taskId = validTasks[command];
    if (taskId && !progress.completedTasks.includes(taskId)) {
      progress.completedTasks.push(taskId);
      progress.percentage = Math.round((progress.completedTasks.length / 5) * 100);
      progress.lastUpdated = Date.now();
      await progress.save();
    }

    res.status(201).json({ log, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.params.userId });
    res.json(progress || { completedTasks: [], percentage: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetProgress = async (req, res) => {
  try {
    const { userId } = req.body;
    await Log.deleteMany({ userId });
    await Progress.findOneAndDelete({ userId });
    res.json({ message: "Progress reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
