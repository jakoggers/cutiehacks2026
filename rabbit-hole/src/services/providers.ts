import type { IAuthProvider } from "./auth/IAuthProvider";
import type { IDatabase } from "./database/IDatabase";

import { SupabaseAuthProvider } from "./auth/SupabaseAuthProvider";

import { SupabaseDatabase } from "./database/SupabaseDatabase";

export function createAuthProvider(): IAuthProvider {
    return new SupabaseAuthProvider();
}

export function createDatabase(): IDatabase {
    return new SupabaseDatabase();
}