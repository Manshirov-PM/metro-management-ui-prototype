const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Clear existing
    await prisma.pod.deleteMany();
    await prisma.group.deleteMany();
    await prisma.pipeline.deleteMany();
    await prisma.notification.deleteMany();

    // Create Pipelines
    const p1 = await prisma.pipeline.create({
        data: {
            name: 'Rokak',
            description: 'Core financial data ingestion pipeline.',
            pushLimit: 2000,
            pullLimit: 5000,
        }
    });

    const p2 = await prisma.pipeline.create({
        data: {
            name: 'Air',
            description: 'Core data ingestion and streaming pathway for Marketing Air pipeline.',
            pushLimit: 5000,
            pullLimit: 10000,
        }
    });

    const p3 = await prisma.pipeline.create({
        data: {
            name: 'Navy',
            description: 'Sales and lead generation sync pipeline.',
            pushLimit: 8000,
            pullLimit: 12000,
        }
    });

    // Create Groups
    await prisma.group.createMany({
        data: [
            { name: 'Finance Group', ownerName: 'Sarah Jenkins', pipelineId: p1.id },
            { name: 'Marketing Group', ownerName: 'David Miller', pipelineId: p2.id },
            { name: 'Sales Group', ownerName: 'Amanda Roberts', pipelineId: p3.id },
        ]
    });

    // Create Pods (matching some UI nodes)
    await prisma.pod.createMany({
        data: [
            { name: 'push-data', cpuLimit: 2, memLimit: 4, pipelineId: p2.id },
            { name: 'kafka-consumer', cpuLimit: 6, memLimit: 16, pipelineId: p2.id },
            { name: 'python-validate-1', cpuLimit: 8, memLimit: 32, pipelineId: p2.id },
            { name: 'Pod-Alpha-01', cpuLimit: 2, memLimit: 8, pipelineId: p1.id },
            { name: 'Pod-Beta-04', cpuLimit: 16, memLimit: 64, pipelineId: p2.id },
        ]
    });

    // Create Notifications
    await prisma.notification.createMany({
        data: [
            { type: 'request', message: 'Request from John Doe for Read to source Sales_DB for group Analysts', status: 'pending' },
            { type: 'request', message: 'Request from Jane Smith for Write to source HR_Lake for group Engineering_Core', status: 'pending' },
            { type: 'status', message: 'Your request for Owner for source Marketing_Logs was Approved by Admin_Bob', status: 'approved' },
        ]
    });

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
