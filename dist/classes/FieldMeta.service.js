"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FieldType_constant_1 = require("../constants/FieldType.constant");
const Validation_service_1 = require("./Validation.service");
const ValidationIssue_constant_1 = require("../constants/ValidationIssue.constant");
class FieldMeta {
    constructor({ type, description, required, label, maxLength, options }) {
        if (!FieldType_constant_1.FieldType[type]) {
            throw new Error(`Unknown type field type ${type}`);
        }
        this.type = FieldType_constant_1.FieldType[type];
        this.description = description;
        this.maxLength = maxLength;
        this.required = required;
        this.options = options;
        this.label = label;
    }
    isString() {
        return this.type === FieldType_constant_1.FieldType.string;
    }
    isNumber() {
        return this.type === FieldType_constant_1.FieldType.decimal || this.type === FieldType_constant_1.FieldType.integer;
    }
    isBoolean() {
        return this.type === FieldType_constant_1.FieldType.boolean;
    }
    validate(value) {
        let validation = new Validation_service_1.Validation();
        if (!this.validateType(value)) {
            validation.addIssue(ValidationIssue_constant_1.ValidationIssue.TYPE);
        }
        if (!this.validateRequired(value)) {
            validation.addIssue(ValidationIssue_constant_1.ValidationIssue.REQUIRED);
        }
        if (!this.validateMaxLength(value)) {
            validation.addIssue(ValidationIssue_constant_1.ValidationIssue.MAXLENGTH);
        }
        if (!this.validateOptions(value)) {
            validation.addIssue(ValidationIssue_constant_1.ValidationIssue.OPTIONS);
        }
        return validation;
    }
    viewValue(value) {
        if (this.options) {
            return this.options.reduce((a, b) => {
                if (a.value === value) {
                    return a.label;
                }
                if (b.value === value) {
                    return b.label;
                }
            });
        }
        return value;
    }
    validateType(value) {
        if (this.isBoolean()) {
            return typeof value === 'boolean';
        }
        if (this.isString()) {
            return typeof value === 'string';
        }
        if (this.isNumber()) {
            return !isNaN(value);
        }
    }
    validateOptions(value) {
        if (!this.options) {
            return true;
        }
        return this.options.map(option => option.value).indexOf(value) > -1;
    }
    validateMaxLength(value) {
        if (!this.isString() || !this.maxLength) {
            return true;
        }
        return value.length <= this.maxLength;
    }
    validateRequired(value) {
        if (this.isNumber()) {
            return !!value || value === 0;
        }
        return !!value;
    }
}
exports.FieldMeta = FieldMeta;
