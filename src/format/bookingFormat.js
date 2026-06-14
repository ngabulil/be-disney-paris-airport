const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "-";
  return `€${Number(amount).toFixed(2)}`;
};

const formatBookingEmailData = (booking) => {
  return {
    bookingId: booking._id?.toString() || "-",
    receivedDate: formatDate(booking.createdAt),
    createdAt: booking.createdAt ? new Date(booking.createdAt).toISOString() : "-",
    updatedAt: booking.updatedAt ? new Date(booking.updatedAt).toISOString() : "-",

    fullName: booking.fullName || "-",
    email: booking.email || "-",
    phoneNumber: booking.phoneNumber || "-",

    pickupLocation: booking.pickupLocation?.name || "-",
    pickupLocationType: booking.pickupLocation?.locationType || "-",
    dropoffLocation: booking.dropoffLocation?.name || "-",
    dropoffLocationType: booking.dropoffLocation?.locationType || "-",

    pickupHotel: booking.pickupHotel?.name || "-",
    dropoffHotel: booking.dropoffHotel?.name || "-",

    pickupTerminal: booking.pickupTerminal?.name || "-",
    pickupTerminalLocation: booking.pickupTerminal?.location || "-",
    dropoffTerminal: booking.dropoffTerminal?.name || "-",
    dropoffTerminalLocation: booking.dropoffTerminal?.location || "-",

    pickupFlightNumber: booking.pickupFlightNumber || "-",
    dropoffFlightNumber: booking.dropoffFlightNumber || "-",

    pickupAddress: booking.pickupAddress || "-",
    dropoffAddress: booking.dropoffAddress || "-",

    vehicle: booking.vehicleId?.name || "-",
    vehicleBookingType: booking.vehicleId?.bookingType || "-",
    vehicleType: booking.vehicleId?.vehicleType || "-",
    vehicleMaxPassenger: booking.vehicleId?.maxPassenger ?? "-",
    vehicleMaxUnit: booking.vehicleId?.maxUnit ?? "-",
    vehicleMaxStroller: booking.vehicleId?.maxStroller ?? "-",

    roundtrip: Boolean(booking.roundtrip),
    passengers: booking.passengers ?? 0,
    suitcases: booking.suitcases ?? 0,
    handLuggage: booking.handLuggage ?? 0,
    strollers: booking.strollers ?? 0,
    babySeats: booking.babySeats ?? 0,
    boosterSeats: booking.boosterSeats ?? 0,
    childSeats: booking.childSeats ?? 0,

    pickupDateOut: booking.pickupDateOut || null,
    pickupDateOutFormatted: formatDate(booking.pickupDateOut),
    pickupTimeOutFormatted: formatTime(booking.pickupDateOut),

    pickupDateReturn: booking.pickupDateReturn || null,
    pickupDateReturnFormatted: formatDate(booking.pickupDateReturn),
    pickupTimeReturnFormatted: formatTime(booking.pickupDateReturn),

    totalPrice: formatCurrency(booking.totalPrice),
    totalPriceRaw: booking.totalPrice ?? 0,

    statusTrip: booking.statusTrip || "-",
    statusPayment: Boolean(booking.statusPayment),
    paymentMethod: booking.paymentMethod || "-",

    isDeleted: Boolean(booking.isDeleted),
    deletedAt: booking.deletedAt ? new Date(booking.deletedAt).toISOString() : "-",

    from: booking.pickupLocation?.name || "-",
    to: booking.dropoffLocation?.name || "-",

    notes: booking.notes || "-",
  };
};

module.exports = {
  formatBookingEmailData,
};