const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

class MusicEmitter extends EventEmitter {}
const musicEmitter = new MusicEmitter();

// Read JSON file
function getData() {
    const data = fs.readFileSync("./data.json", "utf-8");
    return JSON.parse(data);
}

//  One-Time Listener
musicEmitter.once("welcome", () => {
    console.log("Welcome Event Triggered (Only Once)");
});

//  newListener Event
musicEmitter.on("newListener", (event) => {
    console.log(`New Listener Added For: ${event}`);
});

// Custom Events for all 8 modules
musicEmitter.on("getMusicData", () => {
    console.log("Music Data Requested");
});

//  Inspecting Event Listeners
console.log("Registered Events:", musicEmitter.eventNames());

//  listeners() method
console.log("Listeners for getMusicData:", musicEmitter.listeners("getMusicData"));

const server = http.createServer((req, res) => {

    if (req.url === "/") {
        musicEmitter.emit("welcome");

        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream(path.join(__dirname, "index.html")).pipe(res);
    }

    else if (req.url === "/style.css") {
        res.writeHead(200, { "Content-Type": "text/css" });
        fs.createReadStream(path.join(__dirname, "style.css")).pipe(res);
    }

    else if (req.url === "/trigger") {

        musicEmitter.emit("getMusicData");

        const data = getData();

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(data));
    }

    else {
        res.writeHead(404);
        res.end("404 Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
