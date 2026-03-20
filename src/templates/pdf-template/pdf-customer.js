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
<h2>Booking Information</h2>
<div class="content">
Booking ID: ${data.bookingId}<br/>
Received: ${data.receivedDate}<br/>
Status Trip: ${data.statusTrip}<br/>
Status Payment: ${data.statusPayment ? "Paid" : "Unpaid"}<br/>
Roundtrip: ${data.roundtrip ? "Yes" : "No"}
</div>
</div>

<div class="section">
<h2>Transfer Details</h2>
<div class="content">
Pickup Location: ${data.pickupLocation} (${data.pickupLocationType})<br/>
Dropoff Location: ${data.dropoffLocation} (${data.dropoffLocationType})<br/>
Pickup Hotel: ${data.pickupHotel}<br/>
Dropoff Hotel: ${data.dropoffHotel}<br/>
Pickup Terminal: ${data.pickupTerminal}<br/>
Pickup Terminal Location: ${data.pickupTerminalLocation}<br/>
Dropoff Terminal: ${data.dropoffTerminal}<br/>
Dropoff Terminal Location: ${data.dropoffTerminalLocation}<br/>
Pickup Flight Number: ${data.pickupFlightNumber}<br/>
Dropoff Flight Number: ${data.dropoffFlightNumber}<br/>
Pickup Address: ${data.pickupAddress}<br/>
Dropoff Address: ${data.dropoffAddress}<br/>
Pickup Date: ${data.pickupDateOutFormatted}<br/>
Pickup Time: ${data.pickupTimeOutFormatted}<br/>
Return Date: ${data.pickupDateReturnFormatted}<br/>
Return Time: ${data.pickupTimeReturnFormatted}
</div>
</div>

<div class="section">
<h2>Passenger Information</h2>
<div class="content">
Name: ${data.fullName}<br/>
Phone: ${data.phoneNumber}<br/>
Email: ${data.email}<br/>
Passengers: ${data.passengers}<br/>
Suitcases: ${data.suitcases}<br/>
Hand Luggage: ${data.handLuggage}<br/>
Strollers: ${data.strollers}<br/>
Child Seats: ${data.childSeats}<br/>
Baby Seats: ${data.babySeats}<br/>
Booster Seats: ${data.boosterSeats}
</div>
</div>

<div class="section">
<h2>Vehicle</h2>
<div class="content">
Transport Class: ${data.vehicle}<br/>
Booking Type: ${data.vehicleBookingType}<br/>
Vehicle Type: ${data.vehicleType}<br/>
Max Passenger: ${data.vehicleMaxPassenger}<br/>
Max Unit: ${data.vehicleMaxUnit}<br/>
Max Stroller: ${data.vehicleMaxStroller}
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
`;
};

module.exports = { generateCustomerBookingPdf };