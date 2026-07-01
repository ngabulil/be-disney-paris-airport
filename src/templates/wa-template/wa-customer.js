const isFilled = (v) => {
  return v !== undefined && v !== null && v !== "" && v !== "-";
};

const getName = (item) => {
  if (!isFilled(item)) return "";

  if (
    typeof item === "string" ||
    typeof item === "number" ||
    typeof item === "boolean"
  ) {
    return String(item).trim();
  }

  return (
    item.name ||
    item.title ||
    item.label ||
    item.value ||
    item.code ||
    ""
  );
};

const value = (v, fallback = "-") => {
  if (!isFilled(v)) return fallback;

  if (typeof v === "object") {
    const name = getName(v);
    return name || fallback;
  }

  return String(v);
};

const pick = (...values) => {
  const found = values.find((v) => isFilled(v));
  return found === undefined ? "-" : found;
};

const toNumber = (val) => {
  const n = Number(val || 0);
  return Number.isNaN(n) ? 0 : n;
};

const boolValue = (v) => {
  return v === true || v === "true" || v === "yes" || v === 1 || v === "1";
};

const titleCase = (text) => {
  if (!isFilled(text)) return "-";

  return String(text)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const plural = (count, singular, pluralText = `${singular}s`) => {
  const n = toNumber(count);
  return `${n} ${n > 1 ? pluralText : singular}`;
};

const formatDate = (dateValue) => {
  if (!dateValue) return "-";

  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(d);
};

const formatTime = (dateValue) => {
  if (!dateValue) return "-";

  // Kalau Date object dari MongoDB / JS Date
  if (dateValue instanceof Date) {
    if (Number.isNaN(dateValue.getTime())) return "-";

    // Ambil jam UTC apa adanya dari ISO, tidak convert ke Paris
    return dateValue.toISOString().slice(11, 16);
  }

  const text = String(dateValue).trim();

  // Kalau ISO string: 2026-06-30T18:00:00.000Z
  // Hasil: 18:00
  const isoMatch = text.match(/T(\d{2}):(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}:${isoMatch[2]}`;
  }

  // Kalau format biasa: 18:00 atau 18.00
  const timeMatch = text.match(/^(\d{1,2})[:.](\d{2})/);
  if (timeMatch) {
    return `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
  }

  return "-";
};

const getDisplayDate = (dateValue, formattedDate) => {
  if (isFilled(formattedDate)) return formattedDate;
  return formatDate(dateValue);
};

const getDisplayTime = (dateValue, formattedTime) => {
  if (isFilled(formattedTime)) return formattedTime;
  return formatTime(dateValue);
};

const formatPrice = (data) => {
  if (isFilled(data.totalPrice)) {
    const text = String(data.totalPrice);
    return text.includes("€") ? text : `${text}€`;
  }

  if (data.totalPriceRaw !== undefined && data.totalPriceRaw !== null) {
    return `${Number(data.totalPriceRaw)}€`;
  }

  return "-";
};

const formatTerminal = (terminal) => {
  const terminalName = getName(terminal);

  if (!isFilled(terminalName)) return "";

  if (/terminal/i.test(terminalName)) return terminalName;

  return `Terminal ${terminalName}`;
};

const composePlace = ({ location, hotel, terminal, address }) => {
  const hotelName = getName(hotel);
  const addressText = getName(address);
  const locationName = getName(location);
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

const isBusinessBooking = (data) => {
  const text = [
    data.businessClass,
    data.vehicle,
    data.vehicleId,
    data.vehicleBookingType,
    data.vehicleType,
    data.transportClass,
  ]
    .map(getName)
    .join(" ")
    .toLowerCase();

  return /business|premium|luxury|vip|mercedes/.test(text);
};

const normalizeBookingData = (data = {}) => {
  return {
    ...data,

    pickupDateOut:
      data.pickupDateOut ||
      data.pickupDate ||
      data.date ||
      data.pickupDateOutRaw ||
      null,

    pickupDateReturn:
      data.pickupDateReturn ||
      data.returnDate ||
      data.pickupDateReturnRaw ||
      null,

    pickupLocation:
      data.pickupLocation ||
      data.from ||
      data.pickup ||
      data.pickupPlace ||
      "-",

    dropoffLocation:
      data.dropoffLocation ||
      data.to ||
      data.dropoff ||
      data.dropoffPlace ||
      "-",

    pickupFlightNumber:
      data.pickupFlightNumber ||
      data.flightNumber ||
      data.flight ||
      "",

    dropoffFlightNumber:
      data.dropoffFlightNumber ||
      data.returnFlightNumber ||
      "",
  };
};

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

const BUSINESS_FEATURES = [
  `${ICON.star} Starlight ceiling`,
  `${ICON.tv} TV with Disney movies`,
  `${ICON.seat} Luxury leather seats`,
  `${ICON.aircon} Air conditioning`,
];

const businessFeaturesBlock = () => {
  return BUSINESS_FEATURES.join("\n");
};

const generateCustomerBookingWhatsApp = (rawData, options = {}) => {
  const data = normalizeBookingData(rawData);
  const { type = "created" } = options;

  const isRoundTrip = boolValue(data.roundtrip) || boolValue(data.roundTrip);
  const isBusiness = isBusinessBooking(data);

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

  const passengerBlock = `${ICON.passengers} *Passengers:* ${value(
    data.passengers
  )}
${ICON.luggage} *Luggage:* ${formatBaggage(data)}
${ICON.childSeats} *Child Seats:* ${formatSeatsOnly(data)}`;

  const driverNote =
    "For your arrival, your driver will be waiting inside the arrivals hall with a name board displaying your name.";

  const confirmAsk =
    "Could you kindly confirm that all details above are correct?";

  const closing = `Kind regards,

Priya
Disney Paris Airport Transfer`;

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

${ICON.date} *Date:* ${getDisplayDate(
      data.pickupDateOut,
      data.pickupDateOutFormatted
    )}
${ICON.time} *Time:* ${getDisplayTime(
      data.pickupDateOut,
      data.pickupTimeOutFormatted
    )}

${ICON.pickup} *Pickup:* ${pickupPlace}
${ICON.dropoff} *Drop-off:* ${dropoffPlace}

${ICON.flight} *Flight/Train:* ${flightOrTrain}

${passengerBlock}

${vehicleBlock}

${ICON.price} *Price:* ${formatPrice(data)}
${ICON.payment} *Payment:* ${titleCase(data.paymentMethod)}

${driverNote}

${confirmAsk}${upgradeBlock}${returnTransferBlock}

${closing}`;
  }

  const confirmText = isBusiness
    ? "We are delighted to confirm your round-trip transfer:"
    : "We are pleased to confirm your round-trip transfer:";

  const arrivalRoute = `${pickupPlace} → ${dropoffPlace}`;
  const returnRoute = `${dropoffPlace} → ${pickupPlace}`;

  const arrivalFlight = pick(
    data.flightNumber,
    data.pickupFlightNumber,
    "-"
  );

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

${ICON.date} *Date:* ${getDisplayDate(
    data.pickupDateOut,
    data.pickupDateOutFormatted
  )}
${ICON.time} *Time:* ${getDisplayTime(
    data.pickupDateOut,
    data.pickupTimeOutFormatted
  )}

${ICON.pickup} ${arrivalRoute}

${ICON.flight} *Flight:* ${arrivalFlight}

${ICON.return} *Return Transfer*

${ICON.date} *Date:* ${getDisplayDate(
    data.pickupDateReturn,
    data.pickupDateReturnFormatted
  )}
${ICON.time} *Pickup Time:* ${getDisplayTime(
    data.pickupDateReturn,
    data.pickupTimeReturnFormatted
  )}

${ICON.pickup} ${returnRoute}

${passengerBlock}

${vehicleBlock}

${ICON.price} *Total Price:* ${formatPrice(data)}
${ICON.payment} *Payment:* ${titleCase(data.paymentMethod)}

${driverNote}

${confirmAsk}${upgradeBlock}${businessClosing}

${closing}`;
};

module.exports = {
  generateCustomerBookingWhatsApp,

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
  isBusinessBooking,
};