// utils/templates/generate-admin-booking-email.js

const {
  html,
  value,
  yesNo,
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
  sectionTitle,
  emailLayout,
} = require("../../utils/booking-template");

const withType = (name, type) => {
  const nameText = value(name);
  const typeText = value(type, "");

  return typeText ? `${nameText} (${typeText})` : nameText;
};

const generateAdminBookingEmail = (data) => {
  const isRoundTrip = isRoundTripBooking(data);
  const isBusiness = isBusinessBooking(data);

  const content = `
    ${sectionTitle("Booking Information")}
    ${line("Booking ID", data.bookingId)}
    ${line("Received", data.receivedDate)}
    ${line("Created At", data.createdAt)}
    ${line("Updated At", data.updatedAt)}
    ${line("Source", "Website")}
    ${line("Status Trip", data.statusTrip)}
    ${line("Status Payment", data.statusPayment ? "Paid" : "Unpaid")}
    ${line("Roundtrip", isRoundTrip ? "Yes" : "No")}
    ${line("Class", isBusiness ? "Business" : "Economy")}

    ${sectionTitle("Customer")}
    ${line("Name", data.fullName)}
    ${line("Phone", data.phoneNumber)}
    ${line("Email", data.email)}

    ${sectionTitle("Transfer Details")}
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

    ${sectionTitle("Passengers & Luggage")}
    ${line("Passengers", data.passengers)}
    ${line("Luggage", formatBaggage(data))}
    ${line("Child Seats", formatSeatsOnly(data))}
    ${line("Suitcases", data.suitcases)}
    ${line("Hand Luggage", data.handLuggage)}
    ${line("Strollers", data.strollers)}
    ${line("Baby Seats", data.babySeats)}
    ${line("Booster Seats", data.boosterSeats)}

    ${sectionTitle("Vehicle")}
    ${line("Transport Class", data.vehicle || data.vehicleId)}
    ${line("Booking Type", data.vehicleBookingType)}
    ${line("Vehicle Type", data.vehicleType)}
    ${line("Max Passenger", data.vehicleMaxPassenger)}
    ${line("Max Unit", data.vehicleMaxUnit)}
    ${line("Max Stroller", data.vehicleMaxStroller)}

    ${sectionTitle("Payment & Status")}
    ${line("Method", titleCase(data.paymentMethod))}
    ${line("Amount", formatPrice(data.totalPrice))}
    ${line("Status Payment", data.statusPayment ? "Paid" : "Unpaid")}
    ${line("Status Trip", data.statusTrip)}
    ${line("Deleted", yesNo(data.isDeleted))}
    ${line("Deleted At", data.deletedAt)}
  `;

  return emailLayout({
    title: "New Booking Received",
    subtitle: "A new booking has been submitted from the website.",
    content,
  });
};

module.exports = {
  generateAdminBookingEmail,
};