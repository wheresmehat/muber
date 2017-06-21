const assert = require("assert");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../app");
const Driver = mongoose.model("driver");

describe("Drivers controller", () => {

    it("POST request to /api/drivers creates a new driver", (done) => {

        Driver.count()
            .then(count => {

                request(app)
                    .post("/api/drivers")
                    .send({ email: "test@test.com" })
                    .end(() => {
                        
                        Driver.count()
                            .then(newCount => {

                                assert(count + 1 === newCount)
                                done();
                            });

                    });

            });       

    });

    it("PUT request to /api/drivers/id edits an existing driver", (done) => {

        const driver = new Driver({ email: "t@t.com", driving: false });

        driver.save().then(() => {

            request(app)
                .put(`/api/drivers/${driver._id}`)
                .send({ driving: true })
                .end(() => {

                    Driver.findOne({ email: "t@t.com" })
                        .then(driver => {

                            assert(driver.driving === true);
                            done();
                        })
                });


        });    

    });

    it("DELETE request to /api/drivers/id removes the driver", (done) => {

        const driver = new Driver({ email: "test@test.com", driving: false });

        driver.save().then(() => {

            request(app)
                .delete(`/api/drivers/${driver._id}`)
                .end(() => {

                    Driver.findById({_id: driver._id})
                        .then(driver => {

                            assert(driver === null);
                            done();
                        });
                });


        });    

    });

    it("GET request to /api/drivers returns drivers near location", (done) => {

        const driverNear = new Driver({ 
            email: "testNear@test.com", 
            geometry: { type: "Point", coordinates: [15.985, 45.812] } 
        });
        const driverFar = new Driver({ 
            email: "testFar@test.com", 
            geometry: { type: "Point", coordinates: [19.041, 47.497] } 
        });

        const myLocation = [15.991, 45.815]

        Promise.all([driverNear.save(), driverFar.save()])
            .then(() => {

                request(app)
                    .get(`/api/drivers?lng=${myLocation[0]}&lat=${myLocation[1]}`)
                    .end((err, response) => {
                        
                        assert(response.body.length === 1);
                        assert(response.body[0].obj.email === "testNear@test.com");
                        done();
                    });
            })
            .catch(err => console.log("My error:", err));

        

    });

});