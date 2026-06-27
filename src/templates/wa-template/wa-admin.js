const {
  value,
  pick,
  boolValue,
  titleCase,
  formatDate,
  formatTime,
  formatPrice,
  composePlace,
  formatBaggage,
  formatSeatsOnly,
} = require("./wa-customer");

const generateAdminBookingWhatsApp = (data, options = {}) => {
  const { type = "created" } = options;

  const title = type === "updated" ? "BOOKING UPDATED" : "NEW BOOKING RECEIVED";

  const isRoundTrip = boolValue(data.roundtrip || data.roundTrip);
  const isBusiness = boolValue(data.businessClass);

  const pickupSide = {
    location: data.pickupLocation,
    hotel: data.pickupHotel,
    terminal: data.pickupTerminal,
    address: data.pickupAddress,
  };

  const dropoffSide = {
    location: data.dropoffLocation,
    hotel: data.dropoffHotel,
    terminal: data.dropoffTerminal,
    address: data.dropoffAddress,
  };

  const vehicleLabel = isBusiness
    ? "Mercedes-Benz Business Class Vehicle"
    : "Economy Class";

  const flightOrTrain = pick(
    data.flightNumber,
    data.trainNumber,
    data.pickupFlightNumber,
    data.dropoffFlightNumber,
    "-"
  );

  const transferBlock = !isRoundTrip
    ? `*Date:* ${formatDate(data.pickupDateOut)}
*Time:* ${formatTime(data.pickupDateOut)}

*Pickup:* ${composePlace(pickupSide)}
*Drop-off:* ${composePlace(dropoffSide)}

*Flight/Train:* ${flightOrTrain}`
    : `*Arrival*
*Date:* ${formatDate(data.pickupDateOut)}
*Time:* ${formatTime(data.pickupDateOut)}
${composePlace(pickupSide)} → ${composePlace(dropoffSide)}
*Flight:* ${pick(data.flightNumber, data.pickupFlightNumber, "-")}

*Return*
*Date:* ${formatDate(data.pickupDateReturn)}
*Pickup Time:* ${formatTime(data.pickupDateReturn)}
${composePlace(dropoffSide)} → ${composePlace(pickupSide)}`;

  return `*${title}*

*Booking ID:* ${value(data.bookingId)}
*Status Trip:* ${value(data.statusTrip)}
*Trip Type:* ${isRoundTrip ? "Round Trip" : "One Way"}
*Class:* ${isBusiness ? "Business" : "Economy"}

*Customer*
*Name:* ${value(data.fullName)}
*Phone:* ${value(data.phoneNumber)}
*Email:* ${value(data.email)}

*Transfer Details*
${transferBlock}

*Passengers:* ${value(data.passengers)}
*Luggage:* ${formatBaggage(data)}
*Child Seats:* ${formatSeatsOnly(data)}
*Vehicle:* ${vehicleLabel}
*Price:* ${formatPrice(data.totalPrice)}
*Payment:* ${titleCase(data.paymentMethod)}

Disney Paris Airport Transfer Team`;
};

module.exports = {
  generateAdminBookingWhatsApp,
};