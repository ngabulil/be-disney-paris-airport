const value = (v, fallback = "-") => {
  if (v === undefined || v === null || v === "") return fallback;
  return v;
};

const yesNo = (v) => (v ? "Yes" : "No");

const generateAdminBookingWhatsApp = (data, options = {}) => {
  const { type = "created", senderNumber = "" } = options;

  const title =
    type === "updated"
      ? "BOOKING UPDATED"
      : "NEW BOOKING RECEIVED";

  return `*${title}*

*Booking ID:* ${value(data.bookingId)}
*Received:* ${value(data.receivedDate)}
*Status Trip:* ${value(data.statusTrip)}
*Status Payment:* ${data.statusPayment ? "Paid" : "Unpaid"}
*Roundtrip:* ${yesNo(data.roundtrip)}

*Customer*
*Name:* ${value(data.fullName)}
*Phone:* ${value(data.phoneNumber)}
*Email:* ${value(data.email)}

*Transfer Details*
*Pickup:* ${value(data.pickupLocation)} (${value(data.pickupLocationType)})
*Dropoff:* ${value(data.dropoffLocation)} (${value(data.dropoffLocationType)})
*Pickup Hotel:* ${value(data.pickupHotel)}
*Dropoff Hotel:* ${value(data.dropoffHotel)}
*Pickup Terminal:* ${value(data.pickupTerminal)}
*Dropoff Terminal:* ${value(data.dropoffTerminal)}
*Pickup Flight:* ${value(data.pickupFlightNumber)}
*Dropoff Flight:* ${value(data.dropoffFlightNumber)}
*Pickup Date:* ${value(data.pickupDateOutFormatted)}
*Pickup Time:* ${value(data.pickupTimeOutFormatted)}
*Return Date:* ${value(data.pickupDateReturnFormatted)}
*Return Time:* ${value(data.pickupTimeReturnFormatted)}

*Passengers & Luggage*
*Passengers:* ${value(data.passengers)}
*Suitcases:* ${value(data.suitcases)}
*Hand Luggage:* ${value(data.handLuggage)}
*Strollers:* ${value(data.strollers)}
*Child Seats:* ${value(data.childSeats)}
*Baby Seats:* ${value(data.babySeats)}
*Booster Seats:* ${value(data.boosterSeats)}

*Vehicle*
*Transport Class:* ${value(data.vehicle)}
*Booking Type:* ${value(data.vehicleBookingType)}
*Vehicle Type:* ${value(data.vehicleType)}

*Payment*
*Method:* ${value(data.paymentMethod)}
*Amount:* ${value(data.totalPrice)}

${senderNumber ? `_Sender: ${senderNumber}_` : ""}`;
};

module.exports = {
  generateAdminBookingWhatsApp,
};