"use strict";
exports.__esModule = true;
exports.saveProcessedLoadRequest = exports.getCustomerProcessedLoadRequests = void 0;
// Saving in-memory for now
var processedLoadRequestsByCustomerId = {};
var getCustomerProcessedLoadRequests = function (customerId) {
    return processedLoadRequestsByCustomerId[customerId] || [];
};
exports.getCustomerProcessedLoadRequests = getCustomerProcessedLoadRequests;
var saveProcessedLoadRequest = function (processedLoadRequest) {
    var customerId = processedLoadRequest.customer_id;
    var customerProcessedLoadRequests = processedLoadRequestsByCustomerId[customerId] ||
        (processedLoadRequestsByCustomerId[customerId] = []);
    customerProcessedLoadRequests.push(processedLoadRequest);
};
exports.saveProcessedLoadRequest = saveProcessedLoadRequest;
