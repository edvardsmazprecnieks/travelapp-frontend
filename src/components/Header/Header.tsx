import "./Header.css";

function Header() {
	return (
		<header className="main-header">
			<div className="all-content">
				<div className="title-container">
					<h1 className="main-title">
						<a href="/">Travel App</a>
					</h1>
				</div>
				<div className="login-button-container">
					<a href="/login">Login</a>
				</div>
			</div>
		</header>
	);
}

export default Header;
