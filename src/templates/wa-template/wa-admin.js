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

const ICON = {
  booking: "📌",
  status: "📋",
  customer: "👤",
  phone: "📱",
  email: "📧",
  date: "🗓️",
  time: "⏰",
  pickup: "📍",
  dropoff: "📍",
  flight: "✈️",
  passengers: "👥",
  luggage: "🧳",
  childSeats: "🚼",
  vehicle: "🚐",
  price: "💶",
  payment: "💳",
  business: "✨",
  return: "🔁",
};

const isBusinessFromData = (data) => {
  return /business|premium|luxury|vip|mercedes/i.test(
    [
      data.vehicle,
      data.vehicleId?.name,
      data.vehicleBookingType,
      data.vehicleType,
      data.transportClass,
    ]
      .filter(Boolean)
      .join(" ")
  );
};

const generateAdminBookingWhatsApp = (data, options = {}) => {
  const { type = "created" } = options;

  const title = type === "updated" ? "BOOKING UPDATED" : "NEW BOOKING RECEIVED";

  const isRoundTrip = boolValue(data.roundtrip || data.roundTrip);
  const isBusiness = isBusinessFromData(data);

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

  const pickupPlace = composePlace(pickupSide);
  const dropoffPlace = composePlace(dropoffSide);

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
    ? `${ICON.date} *Date:* ${formatDate(data.pickupDateOut)}
${ICON.time} *Time:* ${formatTime(data.pickupDateOut)}

${ICON.pickup} *Pickup:* ${pickupPlace}
${ICON.dropoff} *Drop-off:* ${dropoffPlace}

${ICON.flight} *Flight/Train:* ${flightOrTrain}`
    : `${ICON.flight} *Arrival Transfer*

${ICON.date} *Date:* ${formatDate(data.pickupDateOut)}
${ICON.time} *Time:* ${formatTime(data.pickupDateOut)}

${ICON.pickup} ${pickupPlace} → ${dropoffPlace}

${ICON.flight} *Flight:* ${pick(data.flightNumber, data.pickupFlightNumber, "-")}

${ICON.return} *Return Transfer*

${ICON.date} *Date:* ${formatDate(data.pickupDateReturn)}
${ICON.time} *Pickup Time:* ${formatTime(data.pickupDateReturn)}

${ICON.pickup} ${dropoffPlace} → ${pickupPlace}`;

  return `*${ICON.booking} ${title}*

${ICON.booking} *Booking ID:* ${value(data.bookingId)}
${ICON.status} *Status Trip:* ${value(data.statusTrip)}
${ICON.return} *Trip Type:* ${isRoundTrip ? "Round Trip" : "One Way"}
${ICON.business} *Class:* ${isBusiness ? "Business" : "Economy"}

${ICON.customer} *Customer*
*Name:* ${value(data.fullName)}
${ICON.phone} *Phone:* ${value(data.phoneNumber)}
${ICON.email} *Email:* ${value(data.email)}

*Transfer Details*

${transferBlock}

${ICON.passengers} *Passengers:* ${value(data.passengers)}
${ICON.luggage} *Luggage:* ${formatBaggage(data)}
${ICON.childSeats} *Child Seats:* ${formatSeatsOnly(data)}

${ICON.vehicle} *Vehicle:* ${vehicleLabel}

${ICON.price} *Price:* ${formatPrice(data.totalPrice)}
${ICON.payment} *Payment:* ${titleCase(data.paymentMethod)}

Disney Paris Airport Transfer Team`;
};

module.exports = {
  generateAdminBookingWhatsApp,
};