const locationsData = [
    {
        locationId: 1,
        to: [
            {
                locationId: 2,
                vehicles: [
                    {
                        vehicleId: 1,
                        bookingType: "economy",
                        vehicle: "car",
                        maxPassenger: 4,
                        // pricePerPassenger: 10000,
                        // freeSuitcase: 2,
                        // pricePerSuitcase: 10000,
                        maxSuitcase: 2,
                        maxHandLuggage: 2,
                        maxStroller: 1,
                        price: 10000,
                        // maxBabySeat: 2,
                        // maxBoosterSeat: 2
                    },
                    {
                        vehicleId: 2,
                        bookingType: "economy",
                        vehicle: "van",
                        maxPassenger: 8,
                        // pricePerPassenger: 10000,
                        // freeSuitcase: 4,
                        // pricePerSuitcase: 10000,
                        maxSuitcase: 6,
                        maxHandLuggage: 6,
                        maxStroller: 3,
                        price: 10000,

                        // maxBabySeat: 4,
                        // maxBoosterSeat: 4
                    },
                    {
                        vehicleId: 3,
                        bookingType: "business",
                        vehicle: "car",
                        maxPassenger: 4,
                        // pricePerPassenger: 10000,
                        // freeSuitcase: 2,
                        // pricePerSuitcase: 10000,
                        price: 10000,
                        maxStroller: 1,
                        // maxBabySeat: 2,
                        // maxBoosterSeat: 2
                    },
                    {
                        vehicleId: 4,
                        bookingType: "business",
                        vehicle: "van",
                        maxPassenger: 8,
                        // pricePerPassenger: 10000,
                        // freeSuitcase: 4,
                        // pricePerSuitcase: 10000,
                        maxSuitcase: 6,
                        maxHandLuggage: 6,
                        price: 10000,
                        maxStroller: 3,
                        // maxBabySeat: 4,
                        // maxBoosterSeat: 4
                    }
                ],
            },
        ]
    }
]

const promoCodesData = [
    {
        discountAmount: 2000,
        code: "DPAT20",
        validity: {
            tripId: "nan",
            bookingType: "business",
            roundtrip: true,
            isValid: true
        }
    }
]

module.exports = {
    locationsData,
    promoCodesData
}