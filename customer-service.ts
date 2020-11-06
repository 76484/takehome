// Saving in-memory for now
let processedLoadRequestsByCustomerId = {};

const getCustomerProcessedLoadRequests = (customerId) => {
  return processedLoadRequestsByCustomerId[customerId] || [];
};

const saveProcessedLoadRequest = (processedLoadRequest) => {
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
