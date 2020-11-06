import { createWriteStream } from "fs";

import * as readline from "linebyline";

import { isAcceptableLoad } from "./lib";
import {
  getCustomerProcessedLoadRequests,
  saveProcessedLoadRequest,
} from "./customer-service";

const INPUT_FILE = "./input.txt";
const OUTPUT_FILE = "./compare-output.txt";

const output = createWriteStream(OUTPUT_FILE, {
  flags: "w",
});

readline(INPUT_FILE)
  .on("line", (line) => {
    try {
      const loadRequest = JSON.parse(line);
      const processedLoadRequests = getCustomerProcessedLoadRequests(
        loadRequest.customer_id
      );
      if (
        processedLoadRequests.some(
          (loadRequest) => loadRequest.id === loadRequest.id
        )
      ) {
        return;
      }

      const isAcceptable = isAcceptableLoad(processedLoadRequests, loadRequest);
      const processedLoadRequest = { ...loadRequest, accepted: isAcceptable };

      saveProcessedLoadRequest(processedLoadRequest);

      output.write(
        JSON.stringify({
          id: processedLoadRequest.id,
          customer_id: processedLoadRequest.customer_id,
          accepted: isAcceptable,
        }) + "\n"
      );
    } catch (err) {
      console.error(err);
    }
  })
  .on("error", (err) => {
    console.error(err);
  });