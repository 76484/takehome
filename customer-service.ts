import { IndexedProcessedLoadRequests, ProcessedLoadRequest } from "./types";

// Saving in-memory for now
let processedLoadRequestsByCustomerId: IndexedProcessedLoadRequests = {};

const getCustomerProcessedLoadRequests = (customerId: string) => {
  return processedLoadRequestsByCustomerId[customerId] || [];
};

const saveProcessedLoadRequest = (processedLoadRequest: ProcessedLoadRequest) => {
  const customerId = processedLoadRequest.customer_id;
  let customerProcessedLoadRequests =
    processedLoadRequestsByCustomerId[customerId] ||
    (processedLoadRequestsByCustomerId[customerId] = []);

  customerProcessedLoadRequests.push(processedLoadRequest);
};

export {
  getCustomerProcessedLoadRequests,
  saveProcessedLoadRequest,
};
