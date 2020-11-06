const fs = require("fs");

const readline = require("linebyline");

const { isAcceptableLoad } = require("./lib");

const INPUT_FILE = "./input.txt";
const OUTPUT_FILE = "./compare-output.txt";

const output = fs.createWriteStream(OUTPUT_FILE, {
  flags: "w",
});

const customerAccounts = {};

readline(INPUT_FILE)
  .on("line", function (line) {
    try {
      const loadRequest = JSON.parse(line);

      if (!customerAccounts[loadRequest.customer_id]) {
        customerAccounts[loadRequest.customer_id] = [];
      }

      const isAcceptable = isAcceptableLoad(
        customerAccounts[loadRequest.customer_id],
        loadRequest
      );

      output.write(
        JSON.stringify({
          id: loadRequest.id,
          customer_id: loadRequest.customer_id,
          accepted: isAcceptable,
        }) + "\n"
      );

      if (isAcceptable) {
        customerAccounts[loadRequest.customer_id].push(loadRequest);
      }
    } catch (err) {
      console.error(err);
    }
  })
  .on("error", (err) => {
    console.error(err);
  });
