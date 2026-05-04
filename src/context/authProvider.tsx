import React, { useEffect, useState, useCallback } from "react";
import {
	loginUser,
	logoutUser,
	registerUser,
	initAuth,
} from "../lib/authApi.ts";
import { AuthContext } from "./authContext";
import type { AuthContextValue } from "./authContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthContextValue["user"] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		initAuth()
			.then((data) => {
				setUser(data?.user ?? null);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		const data = await loginUser(email, password);
		setUser(data.user);
	}, []);

	const register = useCallback(async (email: string, password: string) => {
		const data = await registerUser(email, password);
		setUser(data.user);
	}, []);

	const logout = useCallback(async () => {
		await logoutUser();
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, isLoading, login, register, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}
