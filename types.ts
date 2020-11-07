export interface LoadRequest {
    id: string;
    customer_id: string;
    load_amount: string;
    time: string;
}

export interface ProcessedLoadRequest extends LoadRequest {
    accepted: boolean;
}

export interface IndexedProcessedLoadRequests {
    [id: string]: ProcessedLoadRequest[]
}