"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationIssue_constant_1 = require("../constants/ValidationIssue.constant");
class Validation {
    constructor() {
        this._issues = [];
    }
    addIssue(validationIssue) {
        if (!ValidationIssue_constant_1.ValidationIssue[validationIssue]) {
            throw new Error('No such validation issue exists: ' + validationIssue);
        }
        this._issues.push(validationIssue);
    }
    removeIssue(validationIssue) {
        if (!ValidationIssue_constant_1.ValidationIssue[validationIssue]) {
            throw new Error('No such validation issue exists: ' + validationIssue);
        }
        this._issues.splice(this._issues.indexOf(validationIssue), 1);
    }
    getValidationIssues() {
        return this._issues;
    }
    hasValidationIssues() {
        return !!this._issues.length;
    }
}
exports.Validation = Validation;
