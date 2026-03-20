const generateBookingEmailCustomer = (data) => {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#061a2f;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#061a2f">
<tr>
<td align="center">

<table width="700" cellpadding="0" cellspacing="0" style="max-width:700px;background:#0c223a;border-radius:12px;border:1px solid #1f3a5c;padding:30px;">

<tr>
<td align="center" style="color:#ffffff;font-size:22px;font-weight:bold;">
Booking Confirmation
</td>
</tr>

<tr>
<td align="center" style="color:#cbd5e1;font-size:14px;padding:10px 0 20px 0;">
Thank you for choosing our service.
</td>
</tr>

<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;">Booking Information</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;line-height:22px;padding-top:5px;">
<strong>Booking ID:</strong> ${data.bookingId}<br/>
<strong>Received:</strong> ${data.receivedDate}<br/>
<strong>Status Trip:</strong> ${data.statusTrip}<br/>
<strong>Status Payment:</strong> ${data.statusPayment ? "Paid" : "Unpaid"}<br/>
<strong>Roundtrip:</strong> ${data.roundtrip ? "Yes" : "No"}
</td>
</tr>

<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:25px;">Transfer Details</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;line-height:22px;padding-top:5px;">
<strong>Pickup Location:</strong> ${data.pickupLocation} (${data.pickupLocationType})<br/>
<strong>Dropoff Location:</strong> ${data.dropoffLocation} (${data.dropoffLocationType})<br/>
<strong>Pickup Hotel:</strong> ${data.pickupHotel}<br/>
<strong>Dropoff Hotel:</strong> ${data.dropoffHotel}<br/>
<strong>Pickup Terminal:</strong> ${data.pickupTerminal}<br/>
<strong>Pickup Terminal Location:</strong> ${data.pickupTerminalLocation}<br/>
<strong>Dropoff Terminal:</strong> ${data.dropoffTerminal}<br/>
<strong>Dropoff Terminal Location:</strong> ${data.dropoffTerminalLocation}<br/>
<strong>Pickup Flight Number:</strong> ${data.pickupFlightNumber}<br/>
<strong>Dropoff Flight Number:</strong> ${data.dropoffFlightNumber}<br/>
<strong>Pickup Address:</strong> ${data.pickupAddress}<br/>
<strong>Dropoff Address:</strong> ${data.dropoffAddress}<br/>
<strong>Pickup Date:</strong> ${data.pickupDateOutFormatted}<br/>
<strong>Pickup Time:</strong> ${data.pickupTimeOutFormatted}<br/>
<strong>Return Date:</strong> ${data.pickupDateReturnFormatted}<br/>
<strong>Return Time:</strong> ${data.pickupTimeReturnFormatted}
</td>
</tr>

<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:25px;">
Passenger Information
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;line-height:22px;">
<strong>Name:</strong> ${data.fullName}<br/>
<strong>Phone:</strong> ${data.phoneNumber}<br/>
<strong>Email:</strong> ${data.email}<br/>
<strong>Passengers:</strong> ${data.passengers}<br/>
<strong>Suitcases:</strong> ${data.suitcases}<br/>
<strong>Hand Luggage:</strong> ${data.handLuggage}<br/>
<strong>Strollers:</strong> ${data.strollers}<br/>
<strong>Baby Seats:</strong> ${data.babySeats}<br/>
<strong>Booster Seats:</strong> ${data.boosterSeats}<br/>
<strong>Child Seats:</strong> ${data.childSeats}
</td>
</tr>

<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:25px;">
Vehicle
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;line-height:22px;">
<strong>Transport Class:</strong> ${data.vehicle}<br/>
<strong>Booking Type:</strong> ${data.vehicleBookingType}<br/>
<strong>Vehicle Type:</strong> ${data.vehicleType}<br/>
<strong>Max Passenger:</strong> ${data.vehicleMaxPassenger}<br/>
<strong>Max Unit:</strong> ${data.vehicleMaxUnit}<br/>
<strong>Max Stroller:</strong> ${data.vehicleMaxStroller}
</td>
</tr>

<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:25px;">
Payment
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;line-height:22px;">
<strong>Method:</strong> ${data.paymentMethod}<br/>
<strong>Amount:</strong> ${data.totalPrice}
</td>
</tr>

<tr>
<td style="color:#f87171;font-size:13px;padding-top:20px;">
*Please note that payment for your trip will be made upon arrival at your destination.
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
  generateBookingEmailCustomer,
};