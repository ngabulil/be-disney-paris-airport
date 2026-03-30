const value = (v, fallback = "-") => {
  if (v === undefined || v === null || v === "") return fallback;
  return v;
};

const yesNo = (v) => (v ? "Yes" : "No");

const generateCustomerBookingWhatsApp = (data, options = {}) => {
  const { type = "created", senderNumber = "" } = options;

  const intro =
    type === "updated"
      ? "Your booking status has been updated."
      : "Thank you for your booking. Here are your booking details.";

  return `*BOOKING CONFIRMATION*

Hello *${value(data.fullName)}*,
${intro}

*Booking ID:* ${value(data.bookingId)}
*Status Trip:* ${value(data.statusTrip)}
*Status Payment:* ${data.statusPayment ? "Paid" : "Unpaid"}
*Roundtrip:* ${yesNo(data.roundtrip)}

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

*Passenger Information*
*Phone:* ${value(data.phoneNumber)}
*Email:* ${value(data.email)}
*Passengers:* ${value(data.passengers)}
*Suitcases:* ${value(data.suitcases)}
*Hand Luggage:* ${value(data.handLuggage)}
*Strollers:* ${value(data.strollers)}
*Baby Seats:* ${value(data.babySeats)}
*Booster Seats:* ${value(data.boosterSeats)}
*Child Seats:* ${value(data.childSeats)}

*Vehicle*
*Transport Class:* ${value(data.vehicle)}
*Booking Type:* ${value(data.vehicleBookingType)}
*Vehicle Type:* ${value(data.vehicleType)}

*Payment*
*Method:* ${value(data.paymentMethod)}
*Amount:* ${value(data.totalPrice)}

_Payment will be made upon arrival at your destination._
Disney Paris Airport Transfer Team`;
};

module.exports = {
  generateCustomerBookingWhatsApp,
};