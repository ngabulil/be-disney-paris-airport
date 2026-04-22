const value = (v, fallback = "-") => {
  if (v === undefined || v === null || v === "") return fallback;
  return v;
};

const generateAdminBookingWhatsApp = (data, options = {}) => {
  const { type = "created" } = options;

  const title =
    type === "updated"
      ? "BOOKING UPDATED"
      : "NEW BOOKING RECEIVED";

  return `*${title}*

*Booking ID:* ${value(data.bookingId)}
*Status Trip:* ${value(data.statusTrip)}

*Customer*
*Name:* ${value(data.fullName)}
*Phone:* ${value(data.phoneNumber)}
*Email:* ${value(data.email)}

Disney Paris Airport Transfer Team`;
};

module.exports = {
  generateAdminBookingWhatsApp,
};