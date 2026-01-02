export enum SnapshotStatusEnum {
    Active = 1,   // Latest and valid
    Obsolete = 2, // Not latest anymore
    Cancelled = 3 // Plan was cancelled
}