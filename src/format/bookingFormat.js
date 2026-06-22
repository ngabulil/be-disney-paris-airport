const value = (v, fallback = "-") => {
  if (v === undefined || v === null || v === "" || v === "-") return fallback;
  return v;
};

const isFilled = (v) => {
  return v !== undefined && v !== null && v !== "" && v !== "-";
};

const toNumber = (v) => {
  const n = Number(v || 0);
  return Number.isNaN(n) ? 0 : n;
};

const titleCase = (text) => {
  if (!isFilled(text)) return "-";

  return String(text)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const yesNo = (value) => {
  return value ? "Yes" : "No";
};

const plural = (count, singular, pluralText = `${singular}s`) => {
  const n = toNumber(count);
  return `${n} ${n > 1 ? pluralText : singular}`;
};

const formatWaDateTime = (dateValue) => {
  if (!dateValue) return "-";

  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "-";

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

const formatTerminal = (terminal) => {
  if (!isFilled(terminal)) return "";

  const text = String(terminal).trim();

  if (/terminal/i.test(text)) return text;

  return `Terminal ${text}`;
};

const formatAirportDetail = ({ terminal, flightNumber }) => {
  const details = [];

  if (isFilled(terminal)) {
    details.push(formatTerminal(terminal));
  }

  if (isFilled(flightNumber)) {
    details.push(`Flight ${flightNumber}`);
  }

  return details.length ? ` (${details.join(" – ")})` : "";
};

const formatPickupPlace = (data) => {
  const base =
    value(data.pickupHotel, "") ||
    value(data.pickupAddress, "") ||
    value(data.pickupLocation, "");

  const airportDetail = formatAirportDetail({
    terminal: data.pickupTerminal,
    flightNumber: data.pickupFlightNumber,
  });

  return `${base || "-"}${airportDetail}`;
};

const formatDropoffPlace = (data) => {
  const base =
    value(data.dropoffHotel, "") ||
    value(data.dropoffAddress, "") ||
    value(data.dropoffLocation, "");

  const airportDetail = formatAirportDetail({
    terminal: data.dropoffTerminal,
    flightNumber: data.dropoffFlightNumber,
  });

  return `${base || "-"}${airportDetail}`;
};

const formatSimplePickupPlace = (data) => {
  return (
    value(data.pickupHotel, "") ||
    value(data.pickupAddress, "") ||
    value(data.pickupLocation, "-")
  );
};

const formatSimpleDropoffPlace = (data) => {
  return (
    value(data.dropoffHotel, "") ||
    value(data.dropoffAddress, "") ||
    value(data.dropoffLocation, "-")
  );
};

const formatPassengers = (data) => {
  const passengers = toNumber(data.passengers);

  const seats = [
    toNumber(data.childSeats) > 0 ? plural(data.childSeats, "child seat") : "",
    toNumber(data.babySeats) > 0 ? plural(data.babySeats, "baby seat") : "",
    toNumber(data.boosterSeats) > 0 ? plural(data.boosterSeats, "booster seat") : "",
  ].filter(Boolean);

  if (!seats.length) {
    return String(passengers);
  }

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
  const vehicleName = value(data.vehicle, "");
  const vehicleType = value(data.vehicleBookingType, "") || value(data.vehicleType, "");

  if (vehicleName && vehicleType) {
    return `${vehicleName}– ${vehicleType}`;
  }

  return vehicleName || vehicleType || "-";
};

const formatPrice = (data) => {
  if (data.totalPriceRaw !== undefined && data.totalPriceRaw !== null) {
    return `${Number(data.totalPriceRaw)}€`;
  }

  if (isFilled(data.totalPrice)) {
    return String(data.totalPrice).replace("€", "") + "€";
  }

  return "-";
};

const isBusinessClass = (data) => {
  if (typeof data.businessClass === "boolean") return data.businessClass;

  // Kalau belum ada field khusus businessClass di model, default No.
  return false;
};

const generateCustomerBookingWhatsApp = (data, options = {}) => {
  const { type = "created" } = options;

  const intro =
    type === "updated"
      ? "Your booking details have been updated!"
      : "Thank you for your booking!";

  const transferTitle =
    type === "updated"
      ? "Please find your updated transfer details:"
      : "We are pleased to confirm your transfers:";

  const isRoundTrip = Boolean(data.roundtrip);

  const returnBlock = isRoundTrip
    ? `

📅 ${formatWaDateTime(data.pickupDateReturn)}
🏨 Pickup: ${formatSimpleDropoffPlace(data)} → ${formatSimplePickupPlace(data)}`
    : "";

  return `Hello ${value(data.fullName)} 😊

${intro}

${transferTitle}

📅 ${formatWaDateTime(data.pickupDateOut)}
📍 Pickup: ${formatPickupPlace(data)}
🏨 Drop-off: ${formatDropoffPlace(data)}
👥 Passengers: ${formatPassengers(data)}
🧳 Baggage: ${formatBaggage(data)}
🚼 Stroller: ${toNumber(data.strollers)}
🚐 Vehicle: ${formatVehicle(data)}${returnBlock}

💶 Price: ${formatPrice(data)}
💳 Payment: ${titleCase(data.paymentMethod)}
✨ Business Class: ${yesNo(isBusinessClass(data))}
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