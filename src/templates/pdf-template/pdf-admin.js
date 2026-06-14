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
<strong>Created At:</strong> ${data.createdAt}<br/>
<strong>Updated At:</strong> ${data.updatedAt}<br/>
<strong>Status Payment:</strong> <span class="highlight">${data.statusPayment ? "PAID" : "UNPAID"}</span><br/>
<strong>Status Trip:</strong> ${data.statusTrip}<br/>
<strong>Roundtrip:</strong> ${data.roundtrip ? "Yes" : "No"}<br/>
<strong>Deleted:</strong> ${data.isDeleted ? "Yes" : "No"}<br/>
<strong>Deleted At:</strong> ${data.deletedAt}
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
<h2>Passengers & Luggage</h2>
<div class="content">
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

</div>

</body>
</html>
`;
};

module.exports = { generateAdminBookingPdf };