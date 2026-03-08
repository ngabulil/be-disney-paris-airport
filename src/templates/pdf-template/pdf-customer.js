// utils/bookingCustomerPdf.template.js

const generateCustomerBookingPdf = (data) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Booking Confirmation</title>
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
    margin-bottom: 5px;
  }

  .subtitle {
    text-align: center;
    color: #cbd5e1;
    margin-bottom: 25px;
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

  .warning {
    color: #f87171;
    margin-top: 25px;
    font-size: 13px;
  }
</style>
</head>
<body>

<div class="container">

<h1>Booking Confirmation</h1>
<div class="subtitle">
Thank you for choosing our service.
</div>

<div class="section">
<h2>Transfer Details</h2>
<div class="content">
<strong>From:</strong> ${data.from}<br/>
<strong>To:</strong> ${data.to}<br/><br/>
Pickup date: ${data.pickupDate}<br/>
Pickup time: ${data.pickupTime}<br/>
Flight number: ${data.flightNumber}<br/>
Arrival terminal: ${data.terminal}
</div>
</div>

<div class="section">
<h2>Passenger Information</h2>
<div class="content">
Name: ${data.fullName}<br/>
Phone: ${data.phoneNumber}<br/>
Email: ${data.email}<br/>
Passengers: ${data.passengers}<br/>
Child Seats: ${data.childSeats}<br/>
Baby Seats: ${data.babySeats}<br/>
Booster Seats: ${data.boosterSeats}<br/>
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

<div class="warning">
*Payment will be made upon arrival at your destination.
</div>

</div>

</body>
</html>
`
}

module.exports = { generateCustomerBookingPdf }