// utils/templates/generate-admin-booking-pdf.js

const {
  html,
  value,
  titleCase,
  formatDate,
  formatTime,
  formatPrice,
  formatTerminal,
  formatBaggage,
  formatSeatsOnly,
  isRoundTripBooking,
  isBusinessBooking,
  line,
} = require("./helper");

const withType = (name, type) => {
  const nameText = value(name);
  const typeText = value(type, "");

  return typeText ? `${nameText} (${typeText})` : nameText;
};

const generateAdminBookingPdf = (data) => {
  const isRoundTrip = isRoundTripBooking(data);
  const isBusiness = isBusinessBooking(data);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>New Booking</title>
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
    margin-bottom: 20px;
  }
  .section {
    margin-top: 25px;
  }
  .section h2 {
    font-size: 16px;
    border-bottom: 1px solid #1f3a5c;
    padding-bottom: 5px;
  }
  .content {
    margin-top: 10px;
    line-height: 22px;
    color: #cbd5e1;
    font-size: 14px;
  }
  .highlight {
    color: ${data.statusPayment ? "#22c55e" : "#f87171"};
    font-weight: bold;
  }
</style>
</head>
<body>

<div class="container">

<h1>New Booking Received</h1>

<div class="content">
${line("Booking ID", data.bookingId)}
${line("Received", data.receivedDate)}
${line("Created At", data.createdAt)}
${line("Updated At", data.updatedAt)}
<strong>Status Payment:</strong> <span class="highlight">${data.statusPayment ? "PAID" : "UNPAID"}</span><br/>
${line("Status Trip", data.statusTrip)}
${line("Roundtrip", isRoundTrip ? "Yes" : "No")}
${line("Class", isBusiness ? "Business" : "Economy")}
${line("Deleted", data.isDeleted ? "Yes" : "No")}
${line("Deleted At", data.deletedAt)}
</div>

<div class="section">
<h2>Customer</h2>
<div class="content">
${line("Name", data.fullName)}
${line("Phone", data.phoneNumber)}
${line("Email", data.email)}
</div>
</div>

<div class="section">
<h2>Transfer Details</h2>
<div class="content">
${line("Pickup Location", withType(data.pickupLocation, data.pickupLocationType))}
${line("Dropoff Location", withType(data.dropoffLocation, data.dropoffLocationType))}
${line("Pickup Hotel", data.pickupHotel)}
${line("Dropoff Hotel", data.dropoffHotel)}
${line("Pickup Terminal", formatTerminal(data.pickupTerminal))}
${line("Pickup Terminal Location", data.pickupTerminalLocation)}
${line("Dropoff Terminal", formatTerminal(data.dropoffTerminal))}
${line("Dropoff Terminal Location", data.dropoffTerminalLocation)}
${line("Pickup Flight Number", data.pickupFlightNumber)}
${line("Dropoff Flight Number", data.dropoffFlightNumber)}
${line("Pickup Address", data.pickupAddress)}
${line("Dropoff Address", data.dropoffAddress)}
${line("Pickup Date", data.pickupDateOutFormatted || formatDate(data.pickupDateOut))}
${line("Pickup Time", data.pickupTimeOutFormatted || formatTime(data.pickupDateOut))}
${line("Return Date", data.pickupDateReturnFormatted || formatDate(data.pickupDateReturn))}
${line("Return Time", data.pickupTimeReturnFormatted || formatTime(data.pickupDateReturn))}
</div>
</div>

<div class="section">
<h2>Passengers & Luggage</h2>
<div class="content">
${line("Passengers", data.passengers)}
${line("Luggage", formatBaggage(data))}
${line("Child Seats", formatSeatsOnly(data))}
${line("Suitcases", data.suitcases)}
${line("Hand Luggage", data.handLuggage)}
${line("Strollers", data.strollers)}
${line("Baby Seats", data.babySeats)}
${line("Booster Seats", data.boosterSeats)}
</div>
</div>

<div class="section">
<h2>Vehicle</h2>
<div class="content">
${line("Transport Class", data.vehicle || data.vehicleId)}
${line("Booking Type", data.vehicleBookingType)}
${line("Vehicle Type", data.vehicleType)}
${line("Max Passenger", data.vehicleMaxPassenger)}
${line("Max Unit", data.vehicleMaxUnit)}
${line("Max Stroller", data.vehicleMaxStroller)}
</div>
</div>

<div class="section">
<h2>Payment</h2>
<div class="content">
${line("Method", titleCase(data.paymentMethod))}
${line("Amount", formatPrice(data.totalPrice))}
</div>
</div>

</div>

</body>
</html>
`;
};

module.exports = { generateAdminBookingPdf };