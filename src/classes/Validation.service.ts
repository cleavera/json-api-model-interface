import {ValidationIssue} from "../constants/ValidationIssue.constant";

export class Validation {
  private _issues: any;

  constructor() {
    this._issues = [];
  }

  addIssue(validationIssue: any): void {
    if (!ValidationIssue[validationIssue]) {
      throw new Error('No such validation issue exists: ' + validationIssue);
    }

    this._issues.push(validationIssue);
  }

  removeIssue(validationIssue: any): void {
    if (!ValidationIssue[validationIssue]) {
      throw new Error('No such validation issue exists: ' + validationIssue);
    }

    this._issues.splice(this._issues.indexOf(validationIssue), 1);
  }

  getValidationIssues(): any[] {
    return this._issues;
  }

  hasValidationIssues(): boolean {
    return !!this._issues.length;
  }
}
