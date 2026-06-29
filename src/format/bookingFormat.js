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

const toNumber = (v) => {
  const n = Number(v || 0);
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

const yesNo = (val) => {
  return boolValue(val) ? "Yes" : "No";
};

const plural = (count, singular, pluralText = `${singular}s`) => {
  const n = toNumber(count);
  return `${n} ${n > 1 ? pluralText : singular}`;
};

const formatDateParis = (dateValue) => {
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

const formatTimeParis = (dateValue) => {
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

const formatWaDateTime = (dateValue) => {
  if (!dateValue) return "-";

  const date = formatDateParis(dateValue);
  const time = formatTimeParis(dateValue);

  if (date === "-" || time === "-") return "-";

  return `${date} at ${time}`;
};

const formatTerminal = (terminal) => {
  const terminalName = getName(terminal);

  if (!isFilled(terminalName)) return "";

  const text = String(terminalName).trim();

  if (/terminal/i.test(text)) return text;

  return `Terminal ${text}`;
};

const formatAirportDetail = ({ terminal, flightNumber }) => {
  const details = [];

  const terminalText = formatTerminal(terminal);

  if (isFilled(terminalText)) {
    details.push(terminalText);
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
    toNumber(data.boosterSeats) > 0
      ? plural(data.boosterSeats, "booster seat")
      : "",
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
  const vehicleType =
    value(data.vehicleBookingType, "") || value(data.vehicleType, "");

  if (vehicleName && vehicleType) {
    return `${vehicleName} – ${vehicleType}`;
  }

  return vehicleName || vehicleType || "-";
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

const isBusinessClass = (data) => {
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

const stringifyId = (id) => {
  if (!id) return "-";

  try {
    return String(id);
  } catch {
    return "-";
  }
};

const formatBookingEmailData = (booking) => {
  const b =
    booking && typeof booking.toObject === "function"
      ? booking.toObject()
      : booking || {};

  const pickupLocationName = getName(b.pickupLocation);
  const dropoffLocationName = getName(b.dropoffLocation);

  const pickupHotelName = getName(b.pickupHotel);
  const dropoffHotelName = getName(b.dropoffHotel);

  const pickupTerminalName = getName(b.pickupTerminal);
  const dropoffTerminalName = getName(b.dropoffTerminal);

  const vehicleName = getName(b.vehicleId);

  return {
    bookingId: stringifyId(b._id),

    receivedDate: new Date().toLocaleString("en-GB", {
      timeZone: "Europe/Paris",
    }),

    createdAt: b.createdAt
      ? new Date(b.createdAt).toLocaleString("en-GB", {
        timeZone: "Europe/Paris",
      })
      : "-",

    updatedAt: b.updatedAt
      ? new Date(b.updatedAt).toLocaleString("en-GB", {
        timeZone: "Europe/Paris",
      })
      : "-",

    fullName: b.fullName || "-",
    phoneNumber: b.phoneNumber || "-",
    email: b.email || "-",

    pickupLocation: pickupLocationName || "-",
    pickupLocationType: b.pickupLocation?.locationType || "-",

    dropoffLocation: dropoffLocationName || "-",
    dropoffLocationType: b.dropoffLocation?.locationType || "-",

    pickupHotel: pickupHotelName || "",
    dropoffHotel: dropoffHotelName || "",

    pickupTerminal: pickupTerminalName || "",
    pickupTerminalLocation: b.pickupTerminal?.location || "",

    dropoffTerminal: dropoffTerminalName || "",
    dropoffTerminalLocation: b.dropoffTerminal?.location || "",

    pickupFlightNumber: b.pickupFlightNumber || "",
    dropoffFlightNumber: b.dropoffFlightNumber || "",

    pickupAddress: b.pickupAddress || "",
    dropoffAddress: b.dropoffAddress || "",

    vehicleId: b.vehicleId || "",
    vehicle: vehicleName || "-",
    vehicleBookingType: b.vehicleId?.bookingType || "-",
    vehicleType: b.vehicleId?.vehicleType || "-",
    vehicleMaxPassenger: b.vehicleId?.maxPassenger ?? "-",
    vehicleMaxUnit: b.vehicleId?.maxUnit ?? "-",
    vehicleMaxStroller: b.vehicleId?.maxStroller ?? "-",

    roundtrip: boolValue(b.roundtrip),

    passengers: b.passengers ?? 0,
    suitcases: b.suitcases ?? 0,
    handLuggage: b.handLuggage ?? 0,
    strollers: b.strollers ?? 0,
    babySeats: b.babySeats ?? 0,
    boosterSeats: b.boosterSeats ?? 0,
    childSeats: b.childSeats ?? 0,

    pickupDateOut: b.pickupDateOut || null,
    pickupDateOutFormatted: formatDateParis(b.pickupDateOut),
    pickupTimeOutFormatted: formatTimeParis(b.pickupDateOut),

    pickupDateReturn: b.pickupDateReturn || null,
    pickupDateReturnFormatted: b.pickupDateReturn
      ? formatDateParis(b.pickupDateReturn)
      : "-",
    pickupTimeReturnFormatted: b.pickupDateReturn
      ? formatTimeParis(b.pickupDateReturn)
      : "-",

    totalPrice: b.totalPrice ?? "-",
    totalPriceRaw: b.totalPrice ?? null,

    statusTrip: b.statusTrip || "-",
    statusPayment: Boolean(b.statusPayment),
    paymentMethod: b.paymentMethod || "-",

    isDeleted: Boolean(b.isDeleted),
    deletedAt: b.deletedAt || "-",

    // fallback untuk template lama
    from: pickupLocationName || "-",
    to: dropoffLocationName || "-",
    pickupDate: b.pickupDateOut || null,
    pickupTime: formatTimeParis(b.pickupDateOut),
    flightNumber: b.pickupFlightNumber || "-",
    terminal: pickupTerminalName || "-",

    notes: b.notes || "-",
  };
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

  const isRoundTrip = boolValue(data.roundtrip);

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

Your driver will be waiting for you in the arrival area after landing${isRoundTrip ? " and at the hotel reception for your return" : ""
    }.

Please confirm that all details are correct ✅

Kind regards,
Priya
Disney Paris Airport Transfer 🚐`;
};

module.exports = {
  generateCustomerBookingWhatsApp,
  formatBookingEmailData,

  value,
  isFilled,
  getName,
  toNumber,
  boolValue,
  titleCase,
  yesNo,
  plural,
  formatDateParis,
  formatTimeParis,
  formatWaDateTime,
  formatTerminal,
  formatPickupPlace,
  formatDropoffPlace,
  formatSimplePickupPlace,
  formatSimpleDropoffPlace,
  formatPassengers,
  formatBaggage,
  formatVehicle,
  formatPrice,
  isBusinessClass,
};