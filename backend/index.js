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

// Create a new pipeline
app.post('/api/pipelines', async (req, res) => {
    const { name, description, pushLimit, pullLimit } = req.body;
    try {
        const pipeline = await prisma.pipeline.create({
            data: {
                name,
                description,
                pushLimit: pushLimit || 10000,
                pullLimit: pullLimit || 50000,
            }
        });
        // Auto-seed some default pods for the new pipeline to make it functional
        await prisma.pod.createMany({
            data: [
                { name: 'push-data', cpuLimit: 2, memLimit: 8, pipelineId: pipeline.id },
                { name: 'kafka-consumer', cpuLimit: 4, memLimit: 16, pipelineId: pipeline.id },
            ]
        });
        res.json(pipeline);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Assign a group/client to an existing pipeline
app.post('/api/pipelines/:id/groups', async (req, res) => {
    const { id } = req.params;
    const { groupName, ownerName } = req.body;
    try {
        const group = await prisma.group.create({
            data: {
                name: groupName,
                ownerName: ownerName || 'Unknown Owner',
                pipelineId: id
            }
        });
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend API running on http://localhost:${port}`);
});
