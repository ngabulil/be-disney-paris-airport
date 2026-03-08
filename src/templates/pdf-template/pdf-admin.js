// utils/bookingAdminPdf.template.js

const generateAdminBookingPdf = (data) => {
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
<strong>Booking ID:</strong> ${data.bookingId}<br/>
<strong>Received:</strong> ${data.receivedDate}<br/>
<strong>Status Payment:</strong> 
<span class="highlight">${data.statusPayment ? "PAID" : "UNPAID"}</span>
</div>

<div class="section">
<h2>Customer</h2>
<div class="content">
Name: ${data.fullName}<br/>
Phone: ${data.phoneNumber}<br/>
Email: ${data.email}
</div>
</div>

<div class="section">
<h2>Transfer Details</h2>
<div class="content">
From: ${data.from}<br/>
To: ${data.to}<br/><br/>
Pickup date: ${data.pickupDate}<br/>
Pickup time: ${data.pickupTime}<br/>
Flight number: ${data.flightNumber}<br/>
Arrival terminal: ${data.terminal}
</div>
</div>

<div class="section">
<h2>Passengers</h2>
<div class="content">
Total: ${data.passengers}<br/>
Child Seats: ${data.childSeats}<br/>
Baby Seats: ${data.babySeats}<br/>
Booster Seats: ${data.boosterSeats}
</div>
</div>

<div class="section">
<h2>Luggage</h2>
<div class="content">
Hand Luggage: ${data.handLuggage}<br/>
Suitcases: ${data.suitcases}
</div>
</div>

<div class="section">
<h2>Vehicle</h2>
<div class="content">
Transport class: ${data.vehicle}
</div>
</div>

<div class="section">
<h2>Payment</h2>
<div class="content">
Method: ${data.paymentMethod}<br/>
Amount: ${data.totalPrice}
</div>
</div>

<div class="section">
<h2>Notes</h2>
<div class="content">
${data.notes || "-"}
</div>
</div>

</div>

</body>
</html>
`
}

module.exports = { generateAdminBookingPdf }