const Driver = require("../models/driver");

module.exports = {

    greeting(req, res) {    // ES6 syntax for methods in objects

        res.send({ greet: "Welcome to muber" });
    },

    create(req, res, next) {

        const driverProps = req.body;

        Driver.create(driverProps)
            .then(driver => res.send(driver))
            .catch(next);     // same as .catch((err) => next(err));
            
    },

    edit(req, res, next) {

        const driverId = req.params.id;
        const driverProps = req.body;

        Driver.findByIdAndUpdate({ _id: driverId }, driverProps, { new: true }) 
            //.then(() => Driver.findById({ _id: driverId }))
            .then(driver => res.send(driver))
            .catch(next);
    },

    remove(req, res, next) {

        const driverId = req.params.id;

        Driver.findByIdAndRemove({ _id: driverId })
            .then(driver => res.send(driver))
            .catch(next);
    },

    index(req, res, next) {

        const { lng, lat } = req.query;     // express stores the query in an object; http://google.com?lng=80&lat=20; req.query = { lng: 80, lat: 20 }

        Driver.geoNear(

            { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] }, // lng and lat are strings so we have to convert them to numbers
            { spherical: true, maxDistance: 5000 }
        )
            .then(drivers => res.send(drivers))
            .catch(next);
    }

};