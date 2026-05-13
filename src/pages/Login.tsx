import { useNavigate, useLocation, Link } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import "./Login.css";

function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const redirectToLink: string = location.state?.redirectTo ?? "/";
	const redirectToChecked: string =
		redirectToLink.startsWith("/") && !redirectToLink.startsWith("//") ?
			redirectToLink
		:	"/";
	const flightState = location.state?.flightState ?? undefined;
	const message: string | undefined = location.state?.message;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const form = new FormData(event.currentTarget);
		try {
			await login(
				form.get("email") as string,
				form.get("password") as string
			);
			navigate(redirectToChecked, { state: flightState, replace: true });
		} catch (error) {
			setError((error as Error).message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="login-container">
			<h2 className="title-login">Login</h2>
			<form onSubmit={handleSubmit}>
				<div className="error-container">
					{error && <p className="error-message">{error}</p>}
				</div>
				<div className="error-container">
					{message && <p className="error-message">{message}</p>}
				</div>
				<div className="login-input-container">
					<p className="login-labels">E-mail address</p>
					<input
						type="email"
						className="login-input"
						placeholder="Enter e-mail address"
						name="email"
						required
					/>
				</div>

				<div className="login-input-container">
					<p className="login-labels">Password</p>
					<input
						type="password"
						className="login-input"
						placeholder="Enter password"
						name="password"
						required
					/>
				</div>

				<button
					className="login-submit"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Logging in..." : "Login"}
				</button>
			</form>

			<p>
				<Link to="/register" state={{ redirectToChecked, flightState }}>
					No account yet? Register here
				</Link>
			</p>
		</div>
	);
}

export default Login;
