const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe("Recipes List", function() {
    before(function() {
        return runServer;
    });
    after(function() {
        return closeServer;
    });

    it("should list recipes on GET", function() {
        return chai.request(app)
        .get("/recipes")
        .then(function(res) {
            expect(res).to.be.json;
            expect(res.body).to.be.a("array");
            expect(res.body).to.have.length(2);
            expect(res).to.have.status(200);
        })
    });

    it("Should add item on POST", function() {
        const newItem = {
            name: "salsa",
            ingredients: ["tomatoes", "salt", "onions", "cilantro"]
        }
        return chai.request(app)
        .post("/recipes")
        .send(newItem)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.include.keys("id", "name", "ingredients");
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(
                Object.assign(newItem, {id: res.body.id})
            );
        });
    });

    it("Should give error if key missing in item on POST", function() {
        const newItem = {
            ingredients: ["tomatoes", "salt", "onions", "cilantro"]
        }
        return chai.request(app)
        .post("/recipes")
        .send(newItem)
        .then(function(res){
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
        });
    });

    it("Should update item on PUT", function() {
        // create item to be new item 
        const updateItem = {
            name: "salsa",
            ingredients: ["tomatoes", "salt", "onions", "cilantro"]
        }
        // get item from list to get item id
        return (
            chai.request(app)
            .get("/recipes")
            .then(function(res) {
                updateItem.id = res.body[0].id;
                return chai.request(app)
                .put(`/recipes/${updateItem.id}`)
                .send(updateItem)
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.be.deep.equal(updateItem);    
            })
        );
    });
    
    it("Should give error if key missing in updated item on PUT", function() {
        // create item to be new item 
        const updateItem = {
            ingredients: ["tomatoes", "salt", "onions", "cilantro"]
        }
        // get item from list to get item id
        return (
            chai.request(app)
            .get("/recipes")
            .then(function(res) {
                updateItem.id = res.body[0].id;
                return chai.request(app)
                .put(`/recipes/${updateItem.id}`)
                .send(updateItem)
            })
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a("object");   
            })
        );
    });

    it("Should give error if id's don't match on PUT", function() {
        // create item to be new item 
        const updateItem = {
            name: "salsa",
            ingredients: ["tomatoes", "salt", "onions", "cilantro"]
        }
        // get item from list to get item id
        return (
            chai.request(app)
            .get("/recipes")
            .then(function(res) {
                updateItem.id = res.body[0].id;
                return chai.request(app)
                .put("/recipes/1234")
                .send(updateItem)
            })
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a("object");   
            })
        );
    });

    it("Should delete item on DELETE", function() {
        return (
            chai.request(app)
            .get("/recipes")
            .then(function(res) {
                return chai.request(app)
                .delete(`/recipes/${res.body[0].id}`)
                .then(function(res) {
                    expect(res).to.have.status(204);
                })            
            })
        );
    });






})
