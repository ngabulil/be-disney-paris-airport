const {
  html,
  value,
  pick,
  titleCase,
  formatDate,
  formatTime,
  formatPrice,
  composePlace,
  formatSeatsOnly,
  formatBaggage,
  isRoundTripBooking,
  isBusinessBooking,
  businessFeaturesHtml,
  line,
  rawLine,
  sectionTitle,
  emailLayout,
} = require("../../utils/booking-template");

const generateBookingEmailCustomer = (data) => {
  const isRoundTrip = isRoundTripBooking(data);
  const isBusiness = isBusinessBooking(data);

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

  const arrivalFlight = pick(data.flightNumber, data.pickupFlightNumber, "-");

  const vehicleBlock = isBusiness
    ? `
      ${line("Vehicle", vehicleLabel)}
      ${businessFeaturesHtml()}
    `
    : line("Vehicle", vehicleLabel);

  const passengerBlock = `
    ${line("Passengers", value(data.passengers))}
    ${line("Luggage", formatBaggage(data))}
    ${line("Child Seats", formatSeatsOnly(data))}
    ${vehicleBlock}
  `;

  const driverNote = `
    <p style="margin-top:20px;margin-bottom:10px;">
      For your arrival, your driver will be waiting inside the arrivals hall with a name board displaying your name.
    </p>
  `;

  const confirmAsk = `
    <p style="margin-top:10px;margin-bottom:10px;">
      Could you kindly confirm that all details above are correct?
    </p>
  `;

  const closing = `
    <p style="margin-top:24px;margin-bottom:0;">
      Kind regards,<br/>
      Priya<br/>
      Disney Paris Airport Transfer
    </p>
  `;

  if (!isRoundTrip) {
    const confirmText = isBusiness
      ? "We are delighted to confirm your transfer:"
      : "We are pleased to confirm your transfer:";

    const upgradeBlock = !isBusiness
      ? `
        ${sectionTitle("Business Class Upgrade Available")}
        <p style="margin:0 0 8px 0;">
          For only 10€ extra per transfer, we can upgrade your journey to a Mercedes-Benz Business Class Vehicle.
        </p>
        ${businessFeaturesHtml()}
      `
      : "";

    const returnTransferBlock = `
      ${sectionTitle("Return Transfer")}
      <p style="margin:0 0 8px 0;">
        If you have not yet arranged your return transfer, we would be delighted to organise it for you.
      </p>
      <p style="margin:0 0 8px 0;">Please simply let us know:</p>
      <ul style="margin:8px 0 0 18px;padding:0;">
        <li>Return date</li>
        <li>Flight departure time</li>
        <li>Pickup hotel</li>
      </ul>
    `;

    const content = `
      <p style="margin-top:0;">Hello ${html(data.fullName)},</p>

      <p>Thank you for your booking with Disney Paris Airport Transfer.</p>

      <p>${html(confirmText)}</p>

      ${line("Date", formatDate(data.pickupDateOut))}
      ${line("Time", formatTime(data.pickupDateOut))}
      ${line("Pickup", pickupPlace)}
      ${line("Drop-off", dropoffPlace)}
      ${line("Flight/Train", flightOrTrain)}

      ${passengerBlock}

      ${line("Price", formatPrice(data.totalPrice))}
      ${line("Payment", titleCase(data.paymentMethod))}

      ${driverNote}
      ${confirmAsk}
      ${upgradeBlock}
      ${returnTransferBlock}
      ${closing}
    `;

    return emailLayout({
      title: "Booking Confirmation",
      subtitle: "Thank you for choosing our service.",
      content,
    });
  }

  const confirmText = isBusiness
    ? "We are delighted to confirm your round-trip transfer:"
    : "We are pleased to confirm your round-trip transfer:";

  const upgradeBlock = !isBusiness
    ? `
      ${sectionTitle("Business Class Upgrade Available")}
      <p style="margin:0 0 8px 0;">
        For only 10€ extra per transfer (20€ round trip), we can upgrade both journeys to a Mercedes-Benz Business Class Vehicle.
      </p>
      ${businessFeaturesHtml()}
    `
    : "";

  const businessClosing = isBusiness
    ? `
      <p style="margin-top:18px;margin-bottom:0;">
        We look forward to welcoming you to Disneyland Paris and providing a premium travel experience.
      </p>
    `
    : "";

  const arrivalRoute = `${pickupPlace} → ${dropoffPlace}`;
  const returnRoute = `${dropoffPlace} → ${pickupPlace}`;

  const content = `
    <p style="margin-top:0;">Hello ${html(data.fullName)},</p>

    <p>Thank you for your booking with Disney Paris Airport Transfer.</p>

    <p>${html(confirmText)}</p>

    ${sectionTitle("Arrival Transfer")}
    ${line("Date", formatDate(data.pickupDateOut))}
    ${line("Time", formatTime(data.pickupDateOut))}
    ${rawLine("Route", html(arrivalRoute))}
    ${line("Flight", arrivalFlight)}

    ${sectionTitle("Return Transfer")}
    ${line("Date", formatDate(data.pickupDateReturn))}
    ${line("Pickup Time", formatTime(data.pickupDateReturn))}
    ${rawLine("Route", html(returnRoute))}

    ${passengerBlock}

    ${line("Total Price", formatPrice(data.totalPrice))}
    ${line("Payment", titleCase(data.paymentMethod))}

    ${driverNote}
    ${confirmAsk}
    ${upgradeBlock}
    ${businessClosing}
    ${closing}
  `;

  return emailLayout({
    title: "Booking Confirmation",
    subtitle: "Thank you for choosing our service.",
    content,
  });
};

module.exports = {
  generateBookingEmailCustomer,
};