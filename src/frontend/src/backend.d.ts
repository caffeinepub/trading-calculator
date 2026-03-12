import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface TradingSetup {
    pairSymbol: string;
    name: string;
    takeProfitPrice: number;
    accountBalance: number;
    stopLossPrice: number;
    riskPercentage: number;
    notes?: string;
    entryPrice: number;
    accountCurrency: string;
    lotSize: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteSetup(setupId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSetup(setupId: bigint): Promise<TradingSetup>;
    getSetups(): Promise<Array<[bigint, TradingSetup]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveSetup(setup: TradingSetup): Promise<bigint>;
}
