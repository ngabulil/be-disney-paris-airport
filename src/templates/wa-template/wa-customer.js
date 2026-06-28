// ===== Helper Functions =====

const { isBusinessBooking } = require("../../utils/booking-template");

const ICON = {
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
  star: "🌟",
  tv: "📺",
  seat: "💺",
  aircon: "❄️",
  return: "🔁",
  hotel: "🏨",
};

const value = (v, fallback = "-") => {
  if (v === undefined || v === null || v === "") return fallback;
  return v;
};

const pick = (...values) => {
  return values.find((v) => v !== undefined && v !== null && v !== "");
};

const getName = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.name || item.title || item.label || "";
};

const toNumber = (val) => {
  const n = Number(val || 0);
  return Number.isNaN(n) ? 0 : n;
};

const plural = (count, singular, pluralText = `${singular}s`) => {
  const n = toNumber(count);
  return `${n} ${n > 1 ? pluralText : singular}`;
};

const boolValue = (v) => {
  return v === true || v === "true" || v === "yes" || v === 1 || v === "1";
};

const titleCase = (text) => {
  if (!text) return "-";
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
};

const formatDate = (dateValue) => {
  if (!dateValue) return "-";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return String(dateValue);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(d);
};

const formatTime = (dateValue) => {
  if (!dateValue) return "-";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Paris",
  }).format(d);
};

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") return "-";
  const text = String(price);
  if (text.includes("€")) return text;
  return `${text}€`;
};

const formatTerminal = (terminal) => {
  const terminalName = getName(terminal);
  if (!terminalName) return "";
  if (/terminal/i.test(terminalName)) return terminalName;
  return `Terminal ${terminalName}`;
};

// Nama tempat (hotel/alamat/lokasi) + terminal jika ada, dipakai untuk Pickup/Drop-off
const composePlace = ({ location, hotel, terminal, address }) => {
  const locationName = getName(location);
  const hotelName = getName(hotel);
  const addressText = value(address, "");
  const terminalText = formatTerminal(terminal);

  const base = hotelName || addressText || locationName || "-";

  return terminalText ? `${base} (${terminalText})` : base;
};

const formatSeatsOnly = (data) => {
  const seats = [
    toNumber(data.childSeats) > 0 ? plural(data.childSeats, "child seat") : "",
    toNumber(data.babySeats) > 0 ? plural(data.babySeats, "baby seat") : "",
    toNumber(data.boosterSeats) > 0
      ? plural(data.boosterSeats, "booster seat")
      : "",
  ].filter(Boolean);

  return seats.length ? seats.join(", ") : "0";
};

const formatBaggage = (data) => {
  const items = [
    toNumber(data.suitcases) > 0 ? plural(data.suitcases, "suitcase") : "",
    toNumber(data.handLuggage) > 0
      ? plural(data.handLuggage, "hand luggage", "hand luggage")
      : "",
  ].filter(Boolean);

  return items.length ? items.join(", ") : "0";
};

const BUSINESS_FEATURES = [
  `${ICON.star} Starlight ceiling`,
  `${ICON.tv} TV with Disney movies`,
  `${ICON.seat} Luxury leather seats`,
  `${ICON.aircon} Air conditioning`,
];

const businessFeaturesBlock = () => BUSINESS_FEATURES.join("\n");

// ===== Template Builder =====
// Menghasilkan salah satu dari 4 varian:
// 1. One way - No business
// 2. One way - Business
// 3. 2 ways - No business
// 4. 2 ways - Business
const generateCustomerBookingWhatsApp = (data, options = {}) => {
  const { type = "created" } = options;

  const isRoundTrip = boolValue(data.roundtrip || data.roundTrip);
  const isBusiness = isBusinessBooking
    ? isBusinessBooking(data)
    : boolValue(data.businessClass);

  const intro =
    type === "updated"
      ? "Your booking details have been updated."
      : "Thank you for your booking with Disney Paris Airport Transfer.";

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
    ? `${ICON.vehicle} *Vehicle:* ${vehicleLabel}

${businessFeaturesBlock()}`
    : `${ICON.vehicle} *Vehicle:* ${vehicleLabel}`;

  const passengerBlock = `${ICON.passengers} *Passengers:* ${value(data.passengers)}
${ICON.luggage} *Luggage:* ${formatBaggage(data)}
${ICON.childSeats} *Child Seats:* ${formatSeatsOnly(data)}`;

  const driverNote =
    "For your arrival, your driver will be waiting inside the arrivals hall with a name board displaying your name.";

  const confirmAsk = "Could you kindly confirm that all details above are correct?";

  const closing = `Kind regards,

Priya
Disney Paris Airport Transfer`;

  // ONE WAY
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

${ICON.business} *Business Class Upgrade Available*

For only 10€ extra per transfer, we can upgrade your journey to a Mercedes-Benz Business Class Vehicle.

${businessFeaturesBlock()}`
      : "";

    const returnTransferBlock = `

${ICON.return} *Return Transfer*

If you have not yet arranged your return transfer, we would be delighted to organise it for you.

Please simply let us know:

${ICON.date} Return date
${ICON.time} Flight departure time
${ICON.hotel} Pickup hotel`;

    return `Hello ${value(data.fullName)} 😊

${intro}

${confirmText}

${ICON.date} *Date:* ${formatDate(data.pickupDateOut)}
${ICON.time} *Time:* ${formatTime(data.pickupDateOut)}

${ICON.pickup} *Pickup:* ${pickupPlace}
${ICON.dropoff} *Drop-off:* ${dropoffPlace}

${ICON.flight} *Flight/Train:* ${flightOrTrain}

${passengerBlock}

${vehicleBlock}

${ICON.price} *Price:* ${formatPrice(data.totalPrice)}
${ICON.payment} *Payment:* ${titleCase(data.paymentMethod)}

${driverNote}

${confirmAsk}${upgradeBlock}${returnTransferBlock}

${closing}`;
  }

  // ROUND TRIP
  const confirmText = isBusiness
    ? "We are delighted to confirm your round-trip transfer:"
    : "We are pleased to confirm your round-trip transfer:";

  const arrivalRoute = `${pickupPlace} → ${dropoffPlace}`;
  const returnRoute = `${dropoffPlace} → ${pickupPlace}`;

  const arrivalFlight = pick(data.flightNumber, data.pickupFlightNumber, "-");

  const upgradeBlock = !isBusiness
    ? `

${ICON.business} *Business Class Upgrade Available*

For only 10€ extra per transfer (20€ round trip), we can upgrade both journeys to a Mercedes-Benz Business Class Vehicle.

${businessFeaturesBlock()}`
    : "";

  const businessClosing = isBusiness
    ? `

We look forward to welcoming you to Disneyland Paris and providing a premium travel experience.`
    : "";

  return `Hello ${value(data.fullName)} 😊

${intro}

${confirmText}

${ICON.flight} *Arrival Transfer*

${ICON.date} *Date:* ${formatDate(data.pickupDateOut)}
${ICON.time} *Time:* ${formatTime(data.pickupDateOut)}

${ICON.pickup} ${arrivalRoute}

${ICON.flight} *Flight:* ${arrivalFlight}

${ICON.return} *Return Transfer*

${ICON.date} *Date:* ${formatDate(data.pickupDateReturn)}
${ICON.time} *Pickup Time:* ${formatTime(data.pickupDateReturn)}

${ICON.pickup} ${returnRoute}

${passengerBlock}

${vehicleBlock}

${ICON.price} *Total Price:* ${formatPrice(data.totalPrice)}
${ICON.payment} *Payment:* ${titleCase(data.paymentMethod)}

${driverNote}

${confirmAsk}${upgradeBlock}${businessClosing}

${closing}`;
};

module.exports = {
  generateCustomerBookingWhatsApp,
  // di-export juga supaya bisa dipakai ulang di template admin
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
};