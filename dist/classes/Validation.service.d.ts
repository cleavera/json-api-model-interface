export declare class Validation {
    private _issues;
    constructor();
    addIssue(validationIssue: any): void;
    removeIssue(validationIssue: any): void;
    getValidationIssues(): any[];
    hasValidationIssues(): boolean;
}
