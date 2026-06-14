const value = (v, fallback = "-") => {
  if (v === undefined || v === null || v === "") return fallback;
  return v;
};

const generateCustomerBookingWhatsApp = (data, options = {}) => {
  const { type = "created" } = options;

  const intro =
    type === "updated"
      ? "Your booking status has been updated."
      : "Thank you for your booking.";

  return `*BOOKING CONFIRMATION*

Hello *${value(data.fullName)}*,
${intro}

*Booking ID:* ${value(data.bookingId)}
*Status Trip:* ${value(data.statusTrip)}

Please check your email for the full booking details.

Disney Paris Airport Transfer Team`;
};

module.exports = {
  generateCustomerBookingWhatsApp,
};