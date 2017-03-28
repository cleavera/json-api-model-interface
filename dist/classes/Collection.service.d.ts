import { Model } from "./Model.service";
import { ModelMeta } from "./ModelMeta.service";
export declare class Collection {
    private _apiRoot;
    private _selfLink;
    private _meta;
    $resolved: boolean;
    $promise: Promise<any>;
    data: [Model];
    description: string;
    link: any;
    constructor(promise: Promise<any>, root: string, url: string);
    getTemplate(): Model;
    getMeta(): ModelMeta;
    get(id: string, type?: string): Model;
    reload(): void;
    private parseResponse(promise);
    static list(url: string, root: string): Collection;
}
