"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.createTask = exports.getTasks = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getTasks = async (req, res) => {
    const { projectId } = req.query;
    try {
        const tasks = await prisma_1.default.task.findMany({
            where: {
                projectId: Number(projectId),
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true
            }
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: `error retriving tasks ${error.message}` });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    const { title, description, status, priority, tags, startDate, dueDate, points, projectId, authorUserId, assignedUserId } = req.body;
    try {
        const newTask = await prisma_1.default.task.create({
            data: {
                title,
                description,
                status,
                priority,
                tags,
                startDate,
                dueDate,
                points,
                projectId,
                authorUserId,
                assignedUserId
            }
        });
        res.status(201).json(newTask);
    }
    catch (error) {
        res.status(500).json({ message: `Error creating task ${error.message}` });
    }
};
exports.createTask = createTask;
const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const updatedTask = await prisma_1.default.task.update({
            where: {
                id: Number(taskId),
            },
            data: {
                status: status
            }
        });
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ message: `error updating task ${error.message}` });
    }
};
exports.updateTaskStatus = updateTaskStatus;
//# sourceMappingURL=taskController.js.map