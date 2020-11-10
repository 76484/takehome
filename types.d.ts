interface LoadRequest {
    id: string;
    customer_id: string;
    load_amount: string;
    time: string;
}

interface ProcessedLoadRequest extends LoadRequest {
    accepted: boolean;
}

interface IndexedProcessedLoadRequests {
    [id: string]: ProcessedLoadRequest[]
}
