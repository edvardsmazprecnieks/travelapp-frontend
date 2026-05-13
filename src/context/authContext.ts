import type { User } from "../lib/authApi";
import { createContext } from "react";

export interface AuthContextValue {
	user: User | null;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
