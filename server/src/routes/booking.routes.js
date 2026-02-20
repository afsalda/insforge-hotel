import express from 'express';
import {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking
} from '../models/Booking.model.js';

const router = express.Router();

// GET    /api/bookings        → List all bookings
// GET    /api/bookings/:id    → Get one booking
// POST   /api/bookings        → Create booking
// PUT    /api/bookings/:id    → Update booking
// DELETE /api/bookings/:id    → Delete booking

router.get('/', async (req, res) => {
    try {
        const bookings = await getAllBookings();
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const booking = await getBookingById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const booking = await createBooking(req.body);
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const booking = await updateBooking(req.params.id, req.body);
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteBooking(req.params.id);
        res.json({ success: true, message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
