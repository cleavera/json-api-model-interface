import { IFieldMeta } from "../interfaces/IFieldMeta.interface";
import { Validation } from "./Validation.service";
export declare class FieldMeta {
    private type;
    private required;
    description: string;
    options: any[];
    maxLength: number;
    label: boolean;
    constructor({type, description, required, label, maxLength, options}: IFieldMeta);
    isString(): boolean;
    isNumber(): boolean;
    isBoolean(): boolean;
    isPassword(): boolean;
    isJSON(): boolean;
    isForeignKey(): boolean;
    validate(value: any): Validation;
    viewValue(value: any): string;
    private validateType(value);
    private validateOptions(value);
    private validateMaxLength(value);
    private validateJSON(value);
    private validateRequired(value);
}
