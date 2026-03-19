const generateAdminBookingEmail = (data) => {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#061a2f;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#061a2f">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="max-width:600px;background:#0c223a;border-radius:12px;border:1px solid #1f3a5c;padding:30px;">

<tr>
<td align="center" style="padding-bottom:15px;">
<img src="https://yourdomain.com/logo.png" width="120" style="display:block;border:0;" />
</td>
</tr>

<tr>
<td align="center" style="color:#ffffff;font-size:22px;font-weight:bold;">
New Booking Received
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;padding:15px 0;line-height:20px;">
<strong>Booking ID:</strong> ${data.bookingId}<br/>
<strong>Received:</strong> ${data.receivedDate}<br/>
<strong>Source:</strong> Website
</td>
</tr>

<!-- Customer -->
<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:10px;">
Customer
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;line-height:22px;">
• Name: ${data.fullName}<br/>
• Phone: ${data.phoneNumber}<br/>
• Email: ${data.email}
</td>
</tr>

<!-- Transfer -->
<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:20px;">
Transfer Details
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;line-height:22px;">
<strong>From:</strong> ${data.from}<br/>
<strong>To:</strong> ${data.to}<br/><br/>
• Pickup date: ${data.pickupDate}<br/>
• Pickup time: ${data.pickupTime}<br/>
• Flight number: ${data.flightNumber}<br/>
• Arrival terminal: ${data.terminal}
</td>
</tr>

<!-- Passenger -->
<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:20px;">
Passengers
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;line-height:22px;">
• Total: ${data.passengers}<br/>
• Child seats: ${data.childSeats}<br/>
• Baby seats: ${data.babySeats}<br/>
• Booster seats: ${data.boosterSeats}
</td>
</tr>

<!-- Luggage -->
<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:20px;">
Luggage
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;">
• Hand luggage: ${data.handLuggage}<br/>
• Suitcases: ${data.suitcases}
</td>
</tr>

<!-- Vehicle -->
<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:20px;">
Vehicle
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;">
Transport class: ${data.vehicle}
</td>
</tr>

<!-- Payment -->
<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:20px;">
Payment
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;">
• Method: ${data.paymentMethod}<br/>
• Amount: ${data.totalPrice}<br/>
• Status: ${data.statusPayment ? "Paid" : "Unpaid"}
</td>
</tr>

<!-- Notes -->
<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:20px;">
Notes
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;">
${data.notes || "-"}
</td>
</tr>

</table>
</td>
</tr>
</table>

</body>
</html>
`
}

module.exports = {
  generateAdminBookingEmail,
}