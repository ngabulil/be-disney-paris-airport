const LOGO_URL = "https://backend.disneyparisairporttransfer.com/public/image/logo.png";

const generateAdminBookingEmail = (data) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Booking Received</title>
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
            <td align="center" style="color:#ffffff;font-size:22px;font-weight:bold;padding-bottom:10px;">
              New Booking Received
            </td>
          </tr>

          <tr>
            <td style="color:#cbd5e1;font-size:14px;padding:15px 0;line-height:22px;">
              <strong>Booking ID:</strong> ${data.bookingId || "-"}<br/>
              <strong>Received:</strong> ${data.receivedDate || "-"}<br/>
              <strong>Created At:</strong> ${data.createdAt || "-"}<br/>
              <strong>Updated At:</strong> ${data.updatedAt || "-"}<br/>
              <strong>Source:</strong> Website
            </td>
          </tr>

          <tr>
            <td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:10px;padding-bottom:8px;">
              Customer
            </td>
          </tr>

          <tr>
            <td style="color:#cbd5e1;font-size:14px;line-height:22px;">
              <strong>Name:</strong> ${data.fullName || "-"}<br/>
              <strong>Phone:</strong> ${data.phoneNumber || "-"}<br/>
              <strong>Email:</strong> ${data.email || "-"}
            </td>
          </tr>

          <tr>
            <td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:20px;padding-bottom:8px;">
              Transfer Details
            </td>
          </tr>

          <tr>
            <td style="color:#cbd5e1;font-size:14px;line-height:22px;">
              <strong>Pickup Location:</strong> ${data.pickupLocation || "-"} (${data.pickupLocationType || "-"})<br/>
              <strong>Dropoff Location:</strong> ${data.dropoffLocation || "-"} (${data.dropoffLocationType || "-"})<br/>
              <strong>Pickup Hotel:</strong> ${data.pickupHotel || "-"}<br/>
              <strong>Dropoff Hotel:</strong> ${data.dropoffHotel || "-"}<br/>
              <strong>Pickup Terminal:</strong> ${data.pickupTerminal || "-"}<br/>
              <strong>Pickup Terminal Location:</strong> ${data.pickupTerminalLocation || "-"}<br/>
              <strong>Dropoff Terminal:</strong> ${data.dropoffTerminal || "-"}<br/>
              <strong>Dropoff Terminal Location:</strong> ${data.dropoffTerminalLocation || "-"}<br/>
              <strong>Pickup Flight Number:</strong> ${data.pickupFlightNumber || "-"}<br/>
              <strong>Dropoff Flight Number:</strong> ${data.dropoffFlightNumber || "-"}<br/>
              <strong>Pickup Address:</strong> ${data.pickupAddress || "-"}<br/>
              <strong>Dropoff Address:</strong> ${data.dropoffAddress || "-"}<br/>
              <strong>Pickup Date:</strong> ${data.pickupDateOutFormatted || "-"}<br/>
              <strong>Pickup Time:</strong> ${data.pickupTimeOutFormatted || "-"}<br/>
              <strong>Return Date:</strong> ${data.pickupDateReturnFormatted || "-"}<br/>
              <strong>Return Time:</strong> ${data.pickupTimeReturnFormatted || "-"}<br/>
              <strong>Roundtrip:</strong> ${data.roundtrip ? "Yes" : "No"}
            </td>
          </tr>

          <tr>
            <td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:20px;padding-bottom:8px;">
              Passengers & Luggage
            </td>
          </tr>

          <tr>
            <td style="color:#cbd5e1;font-size:14px;line-height:22px;">
              <strong>Passengers:</strong> ${data.passengers || "-"}<br/>
              <strong>Suitcases:</strong> ${data.suitcases || "-"}<br/>
              <strong>Hand Luggage:</strong> ${data.handLuggage || "-"}<br/>
              <strong>Strollers:</strong> ${data.strollers || "-"}<br/>
              <strong>Child Seats:</strong> ${data.childSeats || "-"}<br/>
              <strong>Baby Seats:</strong> ${data.babySeats || "-"}<br/>
              <strong>Booster Seats:</strong> ${data.boosterSeats || "-"}
            </td>
          </tr>

          <tr>
            <td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:20px;padding-bottom:8px;">
              Vehicle
            </td>
          </tr>

          <tr>
            <td style="color:#cbd5e1;font-size:14px;line-height:22px;">
              <strong>Transport Class:</strong> ${data.vehicle || "-"}<br/>
              <strong>Booking Type:</strong> ${data.vehicleBookingType || "-"}<br/>
              <strong>Vehicle Type:</strong> ${data.vehicleType || "-"}<br/>
              <strong>Max Passenger:</strong> ${data.vehicleMaxPassenger || "-"}<br/>
              <strong>Max Unit:</strong> ${data.vehicleMaxUnit || "-"}<br/>
              <strong>Max Stroller:</strong> ${data.vehicleMaxStroller || "-"}
            </td>
          </tr>

          <tr>
            <td style="color:#ffffff;font-size:16px;font-weight:bold;padding-top:20px;padding-bottom:8px;">
              Payment & Status
            </td>
          </tr>

          <tr>
            <td style="color:#cbd5e1;font-size:14px;line-height:22px;">
              <strong>Method:</strong> ${data.paymentMethod || "-"}<br/>
              <strong>Amount:</strong> ${data.totalPrice || "-"}<br/>
              <strong>Status Payment:</strong> ${data.statusPayment ? "Paid" : "Unpaid"}<br/>
              <strong>Status Trip:</strong> ${data.statusTrip || "-"}<br/>
              <strong>Deleted:</strong> ${data.isDeleted ? "Yes" : "No"}<br/>
              <strong>Deleted At:</strong> ${data.deletedAt || "-"}
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
  generateAdminBookingEmail,
};