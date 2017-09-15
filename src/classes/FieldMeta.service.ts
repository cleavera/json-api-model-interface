import {IFieldMeta} from "../interfaces/IFieldMeta.interface";
import {FieldType} from "../constants/FieldType.constant";
import {Validation} from "./Validation.service";
import {ValidationIssue} from "../constants/ValidationIssue.constant";

export class FieldMeta {
  private type: FieldType;
  private required: boolean;

  description: string;
  options: any[];
  maxLength: number;
  label: boolean;

  constructor({type, description, required, label, maxLength, options}: IFieldMeta) {
    if (!FieldType[type]) {
      throw new Error(`Unknown type field type ${type}`);
    }

    this.type = FieldType[type];
    this.description = description;
    this.maxLength = maxLength;
    this.required = required;
    this.options = options;
    this.label = label;
  }

  isString() {
    return this.type === FieldType.string;
  }

  isNumber() {
    return this.type === FieldType.decimal || this.type === FieldType.integer;
  }

  isBoolean() {
    return this.type === FieldType.boolean;
  }

  isPassword() {
    return this.type === FieldType.password;
  }

  isJSON() {
    return this.type === FieldType.json;
  }

  isForeignKey() {
    return this.type === FieldType.foreignKey;
  }

  validate(value: any): Validation {
    let validation: Validation = new Validation();

    if (!this.validateType(value)) {
      validation.addIssue(ValidationIssue.TYPE);
    }

    if (!this.validateRequired(value)) {
      validation.addIssue(ValidationIssue.REQUIRED);
    }

    if (!this.validateMaxLength(value)) {
      validation.addIssue(ValidationIssue.MAXLENGTH);
    }

    if (!this.validateOptions(value)) {
      validation.addIssue(ValidationIssue.OPTIONS);
    }

    if (!this.validateJSON(value)) {
      validation.addIssue(ValidationIssue.JSON);
    }

    return validation;
  }

  viewValue(value: any): string {
    if (this.options) {
      return this.options.reduce((a, b) => {
        if (a.value === value) {
          return a.label;
        }

        if (b.value === value) {
          return b.label;
        }
      })
    }

    return value;
  }

  private validateType(value: any): boolean {
    if (this.isBoolean()) {
      return typeof value === 'boolean';
    }

    if (this.isString() || this.isPassword() || this.isJSON()) {
      return typeof value === 'string';
    }

    if (this.isNumber()) {
      return !isNaN(value);
    }
  }

  private validateOptions(value: any): boolean {
    if (!this.options) {
      return true;
    }

    return this.options.map(option => option.value).indexOf(value) > -1;
  }

  private validateMaxLength(value: any): boolean {
    if (!this.isString() || !this.maxLength) {
      return true;
    }

    return value.length <= this.maxLength;
  }

  private validateJSON(value: any): boolean {
    if (!this.isJSON()) {
      return true;
    }

    let isSuccess: boolean = true;

    try {
      JSON.parse(value);
    } catch (e) {
      isSuccess = false;
    }

    return isSuccess;
  }

  private validateRequired(value: any): boolean {
    if (this.isNumber()) {
      return !!value || value === 0;
    }

    return !!value;
  }
}
