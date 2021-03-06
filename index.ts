import { createWriteStream } from "fs";

import LineByLineReader from "line-by-line";

import { isAcceptableLoadRequest } from "./lib";
import {
  getCustomerProcessedLoadRequests,
  saveProcessedLoadRequest,
} from "./customer-service";

const INPUT_FILE = "./input.txt";
const OUTPUT_FILE = "./compare-output.txt";

const output = createWriteStream(OUTPUT_FILE, {
  flags: "w",
});

new LineByLineReader(INPUT_FILE)
  .on("line", (line: string) => {
    try {
      const loadRequest: LoadRequest = JSON.parse(line);
      const processedLoadRequests = getCustomerProcessedLoadRequests(
        loadRequest.customer_id
      );
      if (
        processedLoadRequests.some(
          (processedLoadRequest) => processedLoadRequest.id === loadRequest.id
        )
      ) {
        return;
      }

      const isAcceptable = isAcceptableLoadRequest(processedLoadRequests, loadRequest);
      const processedLoadRequest: ProcessedLoadRequest = { ...loadRequest, accepted: isAcceptable };

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
