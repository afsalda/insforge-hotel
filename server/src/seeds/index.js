import { seedBookings } from './bookings.seed.js';

const seed = async () => {
    console.log('Starting database seed...');
    try {
        await seedBookings();
        console.log('Database seed completed successfully.');
    } catch (error) {
        console.error('Database seed failed:');
        console.error(error);
        process.exitCode = 1;
    }
};

seed();
