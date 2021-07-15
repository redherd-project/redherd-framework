export enum ServiceType {
    http_proxy = 'HTTP_PROXY',
    tcp_proxy = 'TCP_PROXY',
    udp_proxy = 'UDP_PROXY',
    rtsp_redirector = 'RTSP_REDIRECTOR',
    terminal = 'TERMINAL'
}

export enum ServiceOperation {
    enable = 'ENABLE',
    disable = 'DISABLE'
}

export interface ServiceRequest<T> {
    type: ServiceType;
    params?: T;
}

export interface ServiceRequestEnvelope<T> {
    operation: ServiceOperation;
    service: ServiceRequest<T>;
}

export interface ServiceResponse {
    enabled: boolean;
    ports?: {};
}