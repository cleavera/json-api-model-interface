import { FieldMeta } from "./FieldMeta.service";
export declare class ModelMeta {
    $resolved: boolean;
    $promise: Promise<any>;
    attributes: Map<string, FieldMeta>;
    headers: any;
    links: any;
    type: string;
    constructor(promise: Promise<any>);
    getLabelField(): string;
    static get(url: string): ModelMeta;
    private static parseAttributes(attributes);
}
