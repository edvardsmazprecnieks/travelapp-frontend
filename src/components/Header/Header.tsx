import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./Header.css";

function Header() {
	const { user, logout, isLoading } = useAuth();
	const navigate = useNavigate();
	const handleSignOut = async () => {
		await logout();
		navigate("/");
	};

	return (
		<header className="main-header">
			<div className="all-content">
				<div className="title-container">
					<h1 className="main-title">
						<Link to="/">Travel App</Link>
					</h1>
				</div>
				<div className="login-button-container">
					{isLoading ?
						null
					: user ?
						<>
							{user.firstName ?
								<p className="user-name">
									Welcome, {user.firstName}!
								</p>
							:	<p className="user-name">You are logged in!</p>}
							<div className="buttons">
								<div className="link-container">
									<Link
										to="/my-bookings"
										className="user-bookings-link"
									>
										My Bookings
									</Link>
								</div>
								<button
									className="sign-out-button"
									onClick={handleSignOut}
								>
									Sign Out
								</button>
							</div>
						</>
					:	<Link to="/login">Login</Link>}
				</div>
			</div>
		</header>
	);
}

export default Header;
