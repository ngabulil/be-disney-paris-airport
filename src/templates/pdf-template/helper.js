// utils/templates/pdf-helper.js

const isEmpty = (v) => {
  return v === undefined || v === null || v === "" || v === "-";
};

const getName = (item) => {
  if (isEmpty(item)) return "";

  if (
    typeof item === "string" ||
    typeof item === "number" ||
    typeof item === "boolean"
  ) {
    return String(item);
  }

  return item.name || item.title || item.label || item.value || item.code || "";
};

const value = (v, fallback = "-") => {
  if (isEmpty(v)) return fallback;

  if (typeof v === "object") {
    const name = getName(v);
    return name || fallback;
  }

  return String(v);
};

const html = (v, fallback = "-") => {
  return value(v, fallback)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const pick = (...values) => {
  const found = values.find((v) => !isEmpty(v));
  return found === undefined ? "-" : found;
};

const boolValue = (v) => {
  return v === true || v === "true" || v === "yes" || v === 1 || v === "1";
};

const toNumber = (v) => {
  const n = Number(v || 0);
  return Number.isNaN(n) ? 0 : n;
};

const plural = (count, singular, pluralText = `${singular}s`) => {
  const n = toNumber(count);
  return `${n} ${n > 1 ? pluralText : singular}`;
};

const titleCase = (text) => {
  if (isEmpty(text)) return "-";

  return String(text)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
  if (isEmpty(price)) return "-";

  const text = String(price);
  return text.includes("€") ? text : `${text}€`;
};

const formatTerminal = (terminal) => {
  const terminalName = getName(terminal);

  if (!terminalName) return "";
  if (/terminal/i.test(terminalName)) return terminalName;

  return `Terminal ${terminalName}`;
};

const composePlace = ({ location, hotel, terminal, address }) => {
  const locationName = value(location, "");
  const hotelName = value(hotel, "");
  const addressText = value(address, "");
  const terminalText = formatTerminal(terminal);

  const base = hotelName || addressText || locationName || "-";

  return terminalText ? `${base} (${terminalText})` : base;
};

const formatSeatsOnly = (data) => {
  const seats = [
    toNumber(data.childSeats) > 0 ? plural(data.childSeats, "child seat") : "",
    toNumber(data.babySeats) > 0 ? plural(data.babySeats, "baby seat") : "",
    toNumber(data.boosterSeats) > 0 ? plural(data.boosterSeats, "booster seat") : "",
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

const isRoundTripBooking = (data) => {
  return boolValue(data.roundtrip) || boolValue(data.roundTrip);
};

const isBusinessBooking = (data) => {
  const text = [
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

const line = (label, val) => {
  return `<div><strong>${html(label)}:</strong> ${html(val)}</div>`;
};

module.exports = {
  html,
  value,
  pick,
  boolValue,
  titleCase,
  formatDate,
  formatTime,
  formatPrice,
  formatTerminal,
  composePlace,
  formatSeatsOnly,
  formatBaggage,
  isRoundTripBooking,
  isBusinessBooking,
  line,
};