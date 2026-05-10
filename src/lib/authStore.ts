let accessToken: string | null = null;
let csrfToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
	accessToken = token;
};

export const getCsrfToken = (): string | null => csrfToken;

export const setCsrfToken = (token: string | null): void => {
	csrfToken = token;
};
