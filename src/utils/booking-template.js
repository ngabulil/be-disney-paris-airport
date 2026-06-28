// utils/templates/booking-template-helper.js

const LOGO_URL = "https://backend.disneyparisairporttransfer.com/public/image/logo.png";

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

  if (item instanceof Date) {
    return item.toISOString();
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
  return found === undefined ? undefined : found;
};

const toNumber = (v) => {
  const n = Number(v || 0);
  return Number.isNaN(n) ? 0 : n;
};

const boolValue = (v) => {
  return v === true || v === "true" || v === "yes" || v === 1 || v === "1";
};

const yesNo = (v) => {
  return boolValue(v) ? "Yes" : "No";
};

const titleCase = (text) => {
  if (isEmpty(text)) return "-";

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

  if (text.includes("€")) return text;

  return `${text}€`;
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

  return /business|premium|luxury|vip/.test(text);
};

const BUSINESS_FEATURES = [
  "Starlight ceiling",
  "TV with Disney movies",
  "Luxury leather seats",
  "Air conditioning",
];

const businessFeaturesHtml = () => {
  return `
    <ul style="margin:8px 0 0 18px;padding:0;">
      ${BUSINESS_FEATURES.map((item) => `<li>${html(item)}</li>`).join("")}
    </ul>
  `;
};

const line = (label, val) => {
  return `
    <div style="margin-bottom:6px;">
      <strong>${html(label)}:</strong> ${html(val)}
    </div>
  `;
};

const rawLine = (label, val) => {
  return `
    <div style="margin-bottom:6px;">
      <strong>${html(label)}:</strong> ${val}
    </div>
  `;
};

const sectionTitle = (title) => {
  return `
    <div style="color:#ffffff;font-size:16px;font-weight:bold;margin-top:24px;margin-bottom:10px;">
      ${html(title)}
    </div>
  `;
};

const emailLayout = ({ title, subtitle, content }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${html(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#061a2f;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#061a2f">
    <tr>
      <td align="center" style="padding:30px 15px;">
        <table width="700" cellpadding="0" cellspacing="0" border="0" style="max-width:700px;width:100%;background:#0c223a;border-radius:12px;border:1px solid #1f3a5c;padding:30px;">
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <img 
                src="${LOGO_URL}" 
                alt="Disney Paris Airport Transfer" 
                width="140" 
                style="display:block;border:0;outline:none;text-decoration:none;margin:0 auto;"
              />
            </td>
          </tr>

          <tr>
            <td align="center" style="color:#ffffff;font-size:22px;font-weight:bold;">
              ${html(title)}
            </td>
          </tr>

          ${
            subtitle
              ? `
          <tr>
            <td align="center" style="color:#cbd5e1;font-size:14px;padding:10px 0 20px 0;">
              ${html(subtitle)}
            </td>
          </tr>
              `
              : ""
          }

          <tr>
            <td style="color:#cbd5e1;font-size:14px;line-height:22px;padding-top:10px;">
              ${content}
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:30px;border-top:1px solid #1f3a5c;">
              <span style="color:#ffffff;font-size:14px;font-weight:bold;">
                Disney Paris Airport Transfer
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

module.exports = {
  LOGO_URL,
  html,
  value,
  pick,
  getName,
  toNumber,
  boolValue,
  yesNo,
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
  businessFeaturesHtml,
  line,
  rawLine,
  sectionTitle,
  emailLayout,
};