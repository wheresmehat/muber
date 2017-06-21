const mongoose = require("mongoose");

before(done => {

    mongoose.connect('mongodb://localhost/muber_test');

    mongoose.connection
        .once("open", () => done())
        .on("error", err => console.warn("Warning:", err));
});

beforeEach(done => {

    const { drivers } = mongoose.connection.collections;

    drivers.drop()
        .then(() => drivers.ensureIndex({ "geometry.coordinates": "2dsphere" }))
        .then(() => done())
        .catch(() => done());   // first time ever out tests run we don't have a collection to drop so catch calls done and our tests run anyway
});
