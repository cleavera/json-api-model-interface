import { IHttpResponse } from '../interfaces/IHttpResponse.interface';
export declare class $Http {
    errorHandlers: Array<(response: IHttpResponse) => Promise<IHttpResponse>>;
    headers: any;
    constructor();
    addHeader(key: string, value: any): void;
    addErrorHandler(handler: (response: IHttpResponse) => Promise<IHttpResponse>): void;
    get(url: any): Promise<IHttpResponse>;
    put(url: any, body: any): Promise<IHttpResponse>;
    post(url: any, body: any): Promise<IHttpResponse>;
    remove(url: any): Promise<IHttpResponse>;
    options(url: any): Promise<IHttpResponse>;
}
export declare const Http: $Http;
