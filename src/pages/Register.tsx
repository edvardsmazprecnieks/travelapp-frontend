import "./Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { registerUser } from "../lib/authApi";

function Register() {
	const navigate = useNavigate();
	const location = useLocation();
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const redirectTo: string = location.state?.redirectTo ?? "/";
	const flightState = location.state?.flightState ?? undefined;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const form = new FormData(event.currentTarget);
		try {
			// add email verification and password verification (repeated email and password in form)
			await registerUser(
				form.get("email") as string,
				form.get("password") as string
			);
			navigate("/login", {
				state: { redirectTo, flightState },
				replace: true,
			});
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="login-container">
			<h2 className="title-login">Register</h2>
			<form onSubmit={handleSubmit}>
				<div className="error-container">
					{error && <p className="error-message">{error}</p>}
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
					<p className="login-labels">Confirm e-mail address</p>
					<input
						type="email"
						className="login-input"
						placeholder="Enter e-mail address once more"
						name="email-confirm"
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

				<div className="login-input-container">
					<p className="login-labels">Confirm password</p>
					<input
						type="password"
						className="login-input"
						placeholder="Enter password once more"
						name="password-confirm"
						required
					/>
				</div>

				<button
					className="login-submit"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Registering.." : "Sign up"}
				</button>
			</form>

			<p>
				<Link to="/login">
					Already have an account? Click here to sign in.
				</Link>
			</p>
		</div>
	);
}

export default Register;
