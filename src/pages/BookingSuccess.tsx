import { useSearchParams, Link } from "react-router-dom";

function BookingSuccess() {
	const [searchParams] = useSearchParams();
	const bookingId = searchParams.get("bookingId");

	return (
		<div style={{ textAlign: "center", marginTop: "60px" }}>
			<h2>🎉 Payment Successful!</h2>
			<p>Your booking #{bookingId} has been confirmed.</p>
			<Link to="/">Return to Home</Link>
		</div>
	);
}

export default BookingSuccess;
