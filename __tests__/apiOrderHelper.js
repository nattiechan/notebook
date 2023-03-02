const order1 = {
    "date_in": "2023-02-28T21:50:09.598Z",
    "due_timestamp": "2023-02-28T22:14:38.399Z",
    "firstName": "Joe",
    "lastName": "Smith",
    "isOnCourt": false,
    "orders": [{
        "num_of_racquets": 3,
        "racquet_name": "Boom",
        "main_string": "Babolat Vs Touch 16",
        "main_tension": 28,
        "main_pre_stretch": "10%",
        "cross_string": "Babolat RPM Blast 17",
        "cross_tension": 27,
        "cross_pre_stretch": "",
        "tension_measuring_unit": "kg",
        "num_of_knots": 4,
        "logo": "black"
    }],
    "notes": "String AM",
    "stringer": "Nate",
    "total_cost": 75,
    "isPaid": false,
    "payment_method": ""
};

const badOrderMissingRequiredTimestamp = {
    "date_in": "2023-02-29T21:50:09.598Z",
    "due_timestamp": "",
    "firstName": "Emily",
    "lastName": "Far",
    "isOnCourt": false,
    "orders": [{
        "num_of_racquets": 1,
        "racquet_name": "Pure Drive",
        "main_string": "Babolat Vs Touch 16",
        "main_tension": 28,
        "main_pre_stretch": "10%",
        "cross_string": "Babolat RPM Blast 17",
        "cross_tension": 27,
        "cross_pre_stretch": "",
        "tension_measuring_unit": "kg",
        "num_of_knots": 4,
        "logo": "black"
    }, {
        "num_of_racquets": 2,
        "racquet_name": "Pure Strike",
        "main_string": "Babolat Vs Touch 16",
        "main_tension": 28,
        "main_pre_stretch": "10%",
        "cross_string": "Tour Bite 16L",
        "cross_tension": 27,
        "cross_pre_stretch": "",
        "tension_measuring_unit": "kg",
        "num_of_knots": 4,
        "logo": "black"
    }],
    "notes": "",
    "stringer": "VN",
    "total_cost": 75,
    "isPaid": false,
    "payment_method": ""
}

const order2 = {
    "date_in": "2023-02-29T21:50:09.598Z",
    "due_timestamp": "2023-03-04T22:14:38.399Z",
    "firstName": "Emily",
    "lastName": "Far",
    "isOnCourt": false,
    "orders": [{
        "num_of_racquets": 1,
        "racquet_name": "Pure Drive",
        "main_string": "Babolat Vs Touch 16",
        "main_tension": 28,
        "main_pre_stretch": "10%",
        "cross_string": "Babolat RPM Blast 17",
        "cross_tension": 27,
        "cross_pre_stretch": "",
        "tension_measuring_unit": "kg",
        "num_of_knots": 4,
        "logo": "black"
    }, {
        "num_of_racquets": 2,
        "racquet_name": "Pure Strike",
        "main_string": "Babolat Vs Touch 16",
        "main_tension": 28,
        "main_pre_stretch": "10%",
        "cross_string": "Tour Bite 16L",
        "cross_tension": 27,
        "cross_pre_stretch": "",
        "tension_measuring_unit": "kg",
        "num_of_knots": 4,
        "logo": "black"
    }],
    "notes": "",
    "stringer": "VN",
    "total_cost": 75,
    "isPaid": false,
    "payment_method": ""
}

module.exports = {
    order1,
    order2,
    badOrderMissingRequiredTimestamp
};