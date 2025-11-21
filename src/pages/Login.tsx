import "./Login.css";

function Login() {
	return (
		<div className="login-container">
			<h2 className="title-login">Login</h2>
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
					<p className="login-labels">Password</p>
					<input
						type="password"
						className="login-input"
						placeholder="Enter password"
						name="password"
						required
					/>
				</div>

				<button className="login-submit" type="submit">
					Login
				</button>
			</form>

			<p>
				<a href="/register">No account yet? Click here to sign up.</a>
			</p>
		</div>
	);
}

export default Login;
