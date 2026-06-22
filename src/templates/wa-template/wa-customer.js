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

const yesNo = (v) => {
  return boolValue(v) ? "Yes" : "No";
};

const titleCase = (text) => {
  if (!text) return "-";
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "-";

  const d = new Date(dateValue);

  if (Number.isNaN(d.getTime())) {
    return String(dateValue);
  }

  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(d);

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Paris",
  }).format(d);

  return `${date} at ${time}`;
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

const composePlace = ({ location, hotel, terminal, flightNumber, address }) => {
  const locationName = getName(location);
  const hotelName = getName(hotel);
  const addressText = value(address, "");
  const terminalText = formatTerminal(terminal);

  const base = hotelName || addressText || locationName;

  const extras = [];

  if (terminalText) extras.push(terminalText);
  if (flightNumber) extras.push(`Flight ${flightNumber}`);

  if (extras.length) {
    return `${base} (${extras.join(" – ")})`;
  }

  return base || "-";
};

const composeSimplePlace = ({ location, hotel, address }) => {
  return getName(hotel) || value(address, "") || getName(location) || "-";
};

const formatPassengers = (data) => {
  const passengers = value(data.passengers);

  const seats = [
    toNumber(data.childSeats) > 0 ? plural(data.childSeats, "child seat") : "",
    toNumber(data.babySeats) > 0 ? plural(data.babySeats, "baby seat") : "",
    toNumber(data.boosterSeats) > 0 ? plural(data.boosterSeats, "booster seat") : "",
  ].filter(Boolean);

  if (!seats.length) return passengers;

  return `${passengers} (including ${seats.join(", ")})`;
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

const formatVehicle = (data) => {
  const vehicleName = pick(
    data.vehicleName,
    getName(data.vehicle),
    getName(data.vehicleId)
  );

  const vehicleType = pick(
    data.vehicleType,
    data.bookingType,
    data.vehicleId?.vehicleType,
    data.vehicleId?.bookingType
  );

  return [vehicleName, vehicleType].filter(Boolean).join(" – ") || "-";
};

const generateCustomerBookingWhatsApp = (data, options = {}) => {
  const { type = "created" } = options;

  const intro =
    type === "updated"
      ? "Your booking details have been updated!"
      : "Thank you for your booking!";

  const confirmText =
    type === "updated"
      ? "Please find your updated transfer details:"
      : "We are pleased to confirm your transfers:";

  const pickupSide = {
    location: data.pickupLocation,
    hotel: data.pickupHotel,
    terminal: data.pickupTerminal,
    flightNumber: data.pickupFlightNumber,
    address: data.pickupAddress,
  };

  const dropoffSide = {
    location: data.dropoffLocation,
    hotel: data.dropoffHotel,
    terminal: data.dropoffTerminal,
    flightNumber: data.dropoffFlightNumber,
    address: data.dropoffAddress,
  };

  const outboundPickup = composePlace(pickupSide);
  const outboundDropoff = composePlace(dropoffSide);

  const returnPickup = composeSimplePlace(dropoffSide);
  const returnDropoff = composeSimplePlace(pickupSide);

  const isRoundTrip = boolValue(data.roundtrip || data.roundTrip);

  return `Hello ${value(data.fullName)} 😊

${intro}

${confirmText}

📅 ${formatDateTime(data.pickupDateOut)}
📍 Pickup: ${outboundPickup}
🏨 Drop-off: ${outboundDropoff}
👥 Passengers: ${formatPassengers(data)}
🧳 Baggage: ${formatBaggage(data)}
🚼 Stroller: ${value(data.strollers, 0)}
🚐 Vehicle: ${formatVehicle(data)}
${
  isRoundTrip
    ? `
📅 ${formatDateTime(data.pickupDateReturn)}
🏨 Pickup: ${returnPickup} → ${returnDropoff}
`
    : ""
}
💶 Price: ${formatPrice(data.totalPrice)}
💳 Payment: ${titleCase(data.paymentMethod)}
✨ Business Class: ${yesNo(data.businessClass)}
🔁 Round trip: ${yesNo(isRoundTrip)}

Your driver will be waiting for you in the arrival area after landing${
    isRoundTrip ? " and at the hotel reception for your return" : ""
  }.

Please confirm that all details are correct ✅

Kind regards,
Priya
Disney Paris Airport Transfer 🚐`;
};

module.exports = {
  generateCustomerBookingWhatsApp,
};