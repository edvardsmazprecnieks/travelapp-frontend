import { apiFetch, fetchCsrfToken } from "./apiClient";
import { setAccessToken } from "./authStore";

export interface User {
	id: number;
	firstName: string | null;
	lastName: string | null;
	email: string;
	status: string;
}

export interface AuthResponse {
	accessToken: string;
	user: User;
}

export async function registerUser(
	email: string,
	password: string
): Promise<AuthResponse> {
	const res = await apiFetch("/user/register", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(
			(err as { message?: string }).message ?? "Registration failed"
		);
	}

	const data = (await res.json()) as AuthResponse;
	setAccessToken(data.accessToken);
	return data;
}

export async function loginUser(
	email: string,
	password: string
): Promise<AuthResponse> {
	const res = await apiFetch("/user/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(
			(err as { message?: string }).message ?? "Login failed"
		);
	}

	const data = (await res.json()) as AuthResponse;
	setAccessToken(data.accessToken);
	await fetchCsrfToken();
	return data;
}

export async function logoutUser(): Promise<void> {
	await apiFetch("/user/logout", { method: "POST" });
	setAccessToken(null);
}

export async function getMe(): Promise<User> {
	const res = await apiFetch("/user/me");

	if (!res.ok) {
		throw new Error("Not authenticated");
	}

	return (await res.json()) as User;
}

export async function initAuth(): Promise<AuthResponse | null> {
	try {
		const res = await apiFetch("/user/refresh", {
			method: "POST",
			credentials: "include",
		});

		if (!res.ok) {
			return null;
		}

		const data = (await res.json()) as AuthResponse;
		setAccessToken(data.accessToken);
		await fetchCsrfToken();
		console.log(data);

		return data;
	} catch {
		return null;
	}
}
