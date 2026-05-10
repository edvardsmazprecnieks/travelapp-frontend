import {
	getAccessToken,
	setAccessToken,
	setCsrfToken,
	getCsrfToken,
} from "./authStore";

const baseUrl = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const onRefreshed = (token: string | null): void => {
	refreshSubscribers.forEach((callback) => callback(token));
	refreshSubscribers = [];
};

const addRefreshSubscriber = (
	callback: (token: string | null) => void
): void => {
	refreshSubscribers.push(callback);
};

const protectMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function fetchCsrfToken(): Promise<void> {
	const res = await fetch(`${baseUrl}/user/csrf-token`, {
		credentials: "include",
	});
	if (res.ok) {
		const data = (await res.json()) as { csrfToken: string };
		setCsrfToken(data.csrfToken);
	}
}

async function refreshAccessToken(): Promise<string | null> {
	const res = await fetch(`${baseUrl}/user/refresh`, {
		method: "POST",
		credentials: "include",
	});

	if (!res.ok) {
		setAccessToken(null);
		setCsrfToken(null);
		return null;
	}

	const data = (await res.json()) as { accessToken: string };
	setAccessToken(data.accessToken);
	await fetchCsrfToken();
	return data.accessToken;
}

export async function apiFetch(
	path: string,
	options: RequestInit = {}
): Promise<Response> {
	const token = getAccessToken();
	const method = (options.method ?? "GET").toUpperCase();

	const headers = new Headers(options.headers);
	headers.set("Content-Type", "application/json");
	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}
	if (protectMethods.has(method)) {
		const csrf = getCsrfToken();
		if (csrf) {
			headers.set("x-csrf-token", csrf);
		}
	}

	const response = await fetch(`${baseUrl}${path}`, {
		...options,
		headers,
		credentials: "include",
	});

	if (response.status !== 401) {
		return response;
	}

	if (isRefreshing) {
		return new Promise<Response>((resolve) => {
			addRefreshSubscriber(async (newToken: string | null) => {
				if (!newToken) {
					resolve(response);
					return;
				}
				headers.set("Authorization", `Bearer ${newToken}`);
				const csrf = getCsrfToken();
				if (csrf && protectMethods.has(method)) {
					headers.set("x-csrf-token", csrf);
				}
				resolve(
					fetch(`${baseUrl}${path}`, {
						...options,
						headers,
						credentials: "include",
					})
				);
			});
		});
	}

	isRefreshing = true;
	const newToken = await refreshAccessToken();
	isRefreshing = false;

	if (!newToken) {
		onRefreshed(null);
		return response;
	}

	onRefreshed(newToken);

	headers.set("Authorization", `Bearer ${newToken}`);
	const newCsrf = getCsrfToken();
	if (newCsrf && protectMethods.has(method)) {
		headers.set("x-csrf-token", newCsrf);
	}
	return fetch(`${baseUrl}${path}`, {
		...options,
		headers,
		credentials: "include",
	});
}
