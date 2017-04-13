import {IHttpResponse} from '../interfaces/IHttpResponse.interface';
import {$fetch, Http as http} from 'webworker-http/dist';

export class $Http {
    public errorHandlers: Array<(response: IHttpResponse) => Promise<IHttpResponse>>;

    constructor() {
        this.errorHandlers = [];
    }

    public addErrorHandler(handler: (response: IHttpResponse) => Promise<IHttpResponse>): void {
        this.errorHandlers.push(handler);
    }

    public get(url): Promise<IHttpResponse> {
        return this.errorHandlers.reduce((promise: Promise<IHttpResponse>, handler: (response: IHttpResponse) => Promise<IHttpResponse>) => {
            return promise.catch(handler);
        }, $fetch(url))
    }

    public put(url, body): Promise<IHttpResponse> {
        return http.getHttpWorker().put(url, body)
    }

    public post(url, body): Promise<IHttpResponse> {
        return http.getHttpWorker().post(url, body)
    }

    public remove(url): Promise<IHttpResponse> {
        return http.getHttpWorker().remove(url);
    }

    public options(url): Promise<IHttpResponse> {
        return http.getHttpWorker().options(url)
    }
}

export const Http = new $Http();