const generateBookingEmailCustomer = (data) => {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#061a2f;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#061a2f">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#0c223a;border-radius:12px;border:1px solid #1f3a5c;padding:30px;">

<tr>
<td align="center" style="color:#ffffff;font-size:22px;font-weight:bold;">
Thanks For Requesting Our Services
</td>
</tr>

<tr>
<td align="center" style="color:#cbd5e1;font-size:14px;padding:10px 0 20px 0;">
Your reservation is completed! We'll get back to you as soon as we can.
</td>
</tr>

<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;">Transfer Details</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;line-height:22px;padding-top:5px;">
<strong>From:</strong> ${data.from}<br/>
<strong>To:</strong> ${data.to}<br/><br/>
• Pickup date: ${data.pickupDate}<br/>
• Pickup time: ${data.pickupTime}<br/>
• Flight number: ${data.flightNumber}<br/>
• Arrival terminal: ${data.terminal}
</td>
</tr>

<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:25px;">
Passenger Information
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;line-height:22px;">
• Name: ${data.fullName}<br/>
• Phone: ${data.phoneNumber}<br/>
• Email: ${data.email}<br/>
• Passengers: ${data.passengers}<br/>
• Child Seats: ${data.childSeats}<br/>
• Baby Seats: ${data.babySeats}<br/>
• Booster Seats: ${data.boosterSeats}<br/>
• Hand Luggage: ${data.handLuggage}<br/>
• Suitcases: ${data.suitcases}
</td>
</tr>

<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:25px;">
Vehicle
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;">
Transport class: ${data.vehicle}
</td>
</tr>

<tr>
<td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:25px;">
Payment
</td>
</tr>

<tr>
<td style="color:#cbd5e1;font-size:14px;">
• Method: ${data.paymentMethod}<br/>
• Amount: ${data.totalPrice}
</td>
</tr>

<tr>
<td style="color:#f87171;font-size:13px;padding-top:20px;">
*Please note that the payment for your trip will be made upon arrival at your destination.
</td>
</tr>

<tr>
<td align="center" style="padding-top:25px;">
<a href="https://yourwebsite.com"
style="background:#1e40af;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;display:inline-block;">
Go to our website
</a>
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
  generateBookingEmailCustomer,
}