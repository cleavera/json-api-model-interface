import {IHttpResponse} from '../interfaces/IHttpResponse.interface';
import {$fetch, Http as http} from 'webworker-http/dist';

export class $Http {
    public errorHandlers: Array<(response: IHttpResponse) => Promise<IHttpResponse>>;
    public headers: any;

    constructor() {
        this.errorHandlers = [];

        this.headers = {
            'Content-Type': 'application/json'
        }
    }

    public addHeader(key: string, value: any): void {
        this.headers[key] = value;
    }

    public addErrorHandler(handler: (response: IHttpResponse) => Promise<IHttpResponse>): void {
        this.errorHandlers.push(handler);
    }

    public get(url): Promise<IHttpResponse> {
        return this.errorHandlers.reduce((promise: Promise<IHttpResponse>, handler: (response: IHttpResponse) => Promise<IHttpResponse>) => {
            return promise.catch(handler);
        }, $fetch(url, this.headers))
    }

    public put(url, body): Promise<IHttpResponse> {
        return http.getHttpWorker().put(url, body, this.headers)
    }

    public post(url, body): Promise<IHttpResponse> {
        return http.getHttpWorker().post(url, body, this.headers)
    }

    public remove(url): Promise<IHttpResponse> {
        return http.getHttpWorker().remove(url, this.headers);
    }

    public options(url): Promise<IHttpResponse> {
        return http.getHttpWorker().options(url, this.headers)
    }
}

export const Http = new $Http();