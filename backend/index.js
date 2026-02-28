const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Get all pipelines with related groups and pods
app.get('/api/pipelines', async (req, res) => {
    try {
        const pipelines = await prisma.pipeline.findMany({
            include: {
                groups: true,
                pods: true,
            }
        });
        res.json(pipelines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update pipeline limits
app.put('/api/pipelines/:id/limits', async (req, res) => {
    const { id } = req.params;
    const { pushLimit, pullLimit } = req.body;
    try {
        const updated = await prisma.pipeline.update({
            where: { id },
            data: { pushLimit, pullLimit }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get notifications
app.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update notification status
app.put('/api/notifications/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updated = await prisma.notification.update({
            where: { id },
            data: { status }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update pod resources (Scale Up/Down)
app.put('/api/pods/:id/resources', async (req, res) => {
    const { id } = req.params;
    const { cpuLimit, memLimit } = req.body;
    try {
        const updated = await prisma.pod.update({
            where: { id },
            data: { cpuLimit, memLimit }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend API running on http://localhost:${port}`);
});
