// utils/templates/generate-customer-booking-pdf.js

const {
  html,
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
  line,
} = require("./helper");

const BUSINESS_FEATURES = [
  "Starlight ceiling",
  "TV with Disney movies",
  "Luxury leather seats",
  "Air conditioning",
];

const businessFeaturesHtml = () => {
  return `
    <ul>
      ${BUSINESS_FEATURES.map((item) => `<li>${html(item)}</li>`).join("")}
    </ul>
  `;
};

const pdfLayout = ({ title, content }) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${html(title)}</title>
<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #061a2f;
    color: #ffffff;
    padding: 40px;
  }
  .container {
    background: #0c223a;
    border-radius: 12px;
    padding: 30px;
    border: 1px solid #1f3a5c;
  }
  h1 {
    text-align: center;
    margin-bottom: 5px;
  }
  .subtitle {
    text-align: center;
    color: #cbd5e1;
    margin-bottom: 25px;
  }
  .content {
    line-height: 24px;
    color: #cbd5e1;
    font-size: 14px;
  }
  .section-title {
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    margin-top: 24px;
    margin-bottom: 8px;
    border-bottom: 1px solid #1f3a5c;
    padding-bottom: 5px;
  }
  ul {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .closing {
    margin-top: 24px;
  }
</style>
</head>
<body>
  <div class="container">
    <h1>${html(title)}</h1>
    <div class="subtitle">Thank you for choosing our service.</div>
    <div class="content">
      ${content}
    </div>
  </div>
</body>
</html>
`;
};

const generateCustomerBookingPdf = (data) => {
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

  const vehicleBlock = isBusiness
    ? `
      ${line("Vehicle", vehicleLabel)}
      ${businessFeaturesHtml()}
    `
    : line("Vehicle", vehicleLabel);

  const passengerBlock = `
    ${line("Passengers", data.passengers)}
    ${line("Luggage", formatBaggage(data))}
    ${line("Child Seats", formatSeatsOnly(data))}
    ${vehicleBlock}
  `;

  const driverNote = `
    <p>
      For your arrival, your driver will be waiting inside the arrivals hall with a name board displaying your name.
    </p>
    <p>
      Could you kindly confirm that all details above are correct?
    </p>
  `;

  const closing = `
    <div class="closing">
      Kind regards,<br/>
      Priya<br/>
      Disney Paris Airport Transfer
    </div>
  `;

  if (!isRoundTrip) {
    const confirmText = isBusiness
      ? "We are delighted to confirm your transfer:"
      : "We are pleased to confirm your transfer:";

    const flightOrTrain = pick(
      data.flightNumber,
      data.trainNumber,
      data.pickupFlightNumber,
      data.dropoffFlightNumber,
      "-"
    );

    const upgradeBlock = !isBusiness
      ? `
        <div class="section-title">Business Class Upgrade Available</div>
        <p>
          For only 10€ extra per transfer, we can upgrade your journey to a Mercedes-Benz Business Class Vehicle.
        </p>
        ${businessFeaturesHtml()}
      `
      : "";

    const returnTransferBlock = `
      <div class="section-title">Return Transfer</div>
      <p>
        If you have not yet arranged your return transfer, we would be delighted to organise it for you.
      </p>
      <p>Please simply let us know:</p>
      <ul>
        <li>Return date</li>
        <li>Flight departure time</li>
        <li>Pickup hotel</li>
      </ul>
    `;

    const content = `
      <p>Hello ${html(data.fullName)},</p>

      <p>Thank you for your booking with Disney Paris Airport Transfer.</p>

      <p>${html(confirmText)}</p>

      ${line("Date", formatDate(data.pickupDateOut))}
      ${line("Time", formatTime(data.pickupDateOut))}
      ${line("Pickup", pickupPlace)}
      ${line("Drop-off", dropoffPlace)}
      ${line("Flight/Train", flightOrTrain)}

      <br/>

      ${passengerBlock}

      ${line("Price", formatPrice(data.totalPrice))}
      ${line("Payment", titleCase(data.paymentMethod))}

      ${driverNote}
      ${upgradeBlock}
      ${returnTransferBlock}
      ${closing}
    `;

    return pdfLayout({
      title: "Booking Confirmation",
      content,
    });
  }

  const confirmText = isBusiness
    ? "We are delighted to confirm your round-trip transfer:"
    : "We are pleased to confirm your round-trip transfer:";

  const arrivalRoute = `${pickupPlace} → ${dropoffPlace}`;
  const returnRoute = `${dropoffPlace} → ${pickupPlace}`;

  const arrivalFlight = pick(data.flightNumber, data.pickupFlightNumber, "-");

  const upgradeBlock = !isBusiness
    ? `
      <div class="section-title">Business Class Upgrade Available</div>
      <p>
        For only 10€ extra per transfer (20€ round trip), we can upgrade both journeys to a Mercedes-Benz Business Class Vehicle.
      </p>
      ${businessFeaturesHtml()}
    `
    : "";

  const businessClosing = isBusiness
    ? `
      <p>
        We look forward to welcoming you to Disneyland Paris and providing a premium travel experience.
      </p>
    `
    : "";

  const content = `
    <p>Hello ${html(data.fullName)},</p>

    <p>Thank you for your booking with Disney Paris Airport Transfer.</p>

    <p>${html(confirmText)}</p>

    <div class="section-title">Arrival Transfer</div>
    ${line("Date", formatDate(data.pickupDateOut))}
    ${line("Time", formatTime(data.pickupDateOut))}
    <div>${html(arrivalRoute)}</div>
    ${line("Flight", arrivalFlight)}

    <div class="section-title">Return Transfer</div>
    ${line("Date", formatDate(data.pickupDateReturn))}
    ${line("Pickup Time", formatTime(data.pickupDateReturn))}
    <div>${html(returnRoute)}</div>

    <br/>

    ${passengerBlock}

    ${line("Total Price", formatPrice(data.totalPrice))}
    ${line("Payment", titleCase(data.paymentMethod))}

    ${driverNote}
    ${upgradeBlock}
    ${businessClosing}
    ${closing}
  `;

  return pdfLayout({
    title: "Booking Confirmation",
    content,
  });
};

module.exports = { generateCustomerBookingPdf };