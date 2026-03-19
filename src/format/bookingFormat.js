const formatBookingEmailData = (booking) => {
  return {
    bookingId: booking._id,
    receivedDate: new Date().toLocaleString(),
    fullName: booking.fullName,
    phoneNumber: booking.phoneNumber,
    email: booking.email,
    from: booking.pickupLocation?.name || "-",
    to: booking.dropoffLocation?.name || "-",
    pickupDate: booking.pickupDateOut,
    pickupTime: new Date(booking.pickupDateOut).toLocaleTimeString(),
    flightNumber: booking.flightNumber || "-",
    terminal: booking.pickupTerminal?.name || "-",
    passengers: booking.passengers,
    childSeats: booking.childSeats,
    babySeats: booking.babySeats,
    boosterSeats: booking.boosterSeats,
    handLuggage: booking.handLuggage,
    suitcases: booking.suitcases,
    vehicle: booking.vehicleId?.name || "-",
    paymentMethod: booking.paymentMethod,
    totalPrice: booking.totalPrice,
    statusPayment: booking.statusPayment,
    notes: booking.notes,
  }
}

module.exports = {
  formatBookingEmailData
}