import { Link } from "react-router-dom";

function BookingCancelled() {
	return (
		<div style={{ textAlign: "center", marginTop: "60px" }}>
			<h2>❌ Payment Cancelled</h2>
			<p>Your booking was not completed. No charges were made.</p>
			<Link to="/">Return to Home</Link>
		</div>
	);
}

export default BookingCancelled;
