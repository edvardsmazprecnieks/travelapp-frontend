import "./Login.css";

function Register() {
	return (
		<div className="login-container">
			<h2 className="title-login">Register</h2>
			<form>
				<div className="login-input-container">
					<p className="login-labels">E-mail address</p>
					<input
						type="text"
						className="login-input"
						placeholder="Enter e-mail address"
						name="email"
						required
					/>
				</div>

				<div className="login-input-container">
					<p className="login-labels">Confirm e-mail address</p>
					<input
						type="text"
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

				<button className="login-submit" type="submit">
					Sign up
				</button>
			</form>

			<p>
				<a href="/login">
					Already have an account? Click here to sign in.
				</a>
			</p>
		</div>
	);
}

export default Register;
