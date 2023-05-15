// Complete Events Exercise
const EventEmitter = require("events");
const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 5000;

const newsLetterEmitter = new EventEmitter();

const server = http
  .createServer((req, res) => {
    const { url, method } = req;
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (
        url == "/newsletter_signup" &&
        method == "POST" &&
        chunks.length > 0
      ) {
        const body = JSON.parse(Buffer.concat(chunks).toString());

        // const data = `${body.name}, ${body.email}`;
        // Above is useful for strings but we are doing an obj instead
        //You could send the entire data obj or send each piece as parameters
        newsLetterEmitter.emit("signup", body);
        res.writeHead(202, { "content-type": "type/html" });
        res.write("Getcha News here! Crazy stuff I tell ya!");
        res.end();
        //newsLetterEmitter.emit("sign_up", data.email, data.name)
      } else {
        res.writeHead(404, { "content-type": "type/html" });
        res.write("NO NEWS FOR YOU!");
        res.end();
      }
    });
  })
  .listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
  });

newsLetterEmitter.on("signup", (data) => {
  console.log("Responding to emitted event", data);
   const jsonData = `${JSON.stringify(data)}\n`;
// const vals = Object.values(data);
// const dataStr = vals.join(",") + "\n"
  fs.appendFile("testData.csv", jsonData, (err) => {
    if (err) console.error(err);
    console.log("YOU DID IT");
  });
});
