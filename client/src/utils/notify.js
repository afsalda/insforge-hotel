/**
 * Utility for sending WhatsApp notifications after successful booking.
 */
export async function sendBookingNotifications(bookingData) {
  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone, // format: 919876543210
        roomType: bookingData.roomType,
        checkIn: bookingData.checkIn,             // format: "15 Apr 2025"
        checkOut: bookingData.checkOut,
        totalAmount: bookingData.totalAmount,     // e.g. "3500"
        bookingId: bookingData.bookingId,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
        console.error("Notification API failed:", result);
        return;
    }
    console.log("WhatsApp notifications requested ✅", result);
  } catch (err) {
    // Don't block the booking flow if WhatsApp fails
    console.error("WhatsApp notification failed (non-blocking):", err);
  }
}
