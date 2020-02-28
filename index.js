var express = require("express");
var router = require("express").Router()
var http = require("http");
var ServiceRegistry = require("./registry").ServiceRegistry
var app = express();
var bodyParser = require("body-parser");

process.on("uncaughtException", function(err) {
    console.error("uncaughtException: " + err)
});

class PornService {
    search(term) {
        console.log("hello, " + term)
        return { msg: "hello, " + term }
    }
}

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use("/", express.static("./"));

const registry = new ServiceRegistry()
registry.register('/porn', new PornService())
registry.serve()
app.use(registry.router)

const port = 808

const httpServer = http.createServer(app).listen(port, () => console.log("started http server on port: ", port));