import { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiClient";
import { Link } from "react-router-dom";

type TicketStatus = "ISSUED" | "VOIDED" | "REFUNDED" | "FAILED";

type Ticket = {
	id: number;
	bookingId: number;
	status: TicketStatus;
	ticketNumbers: string[] | null;
	ticketProvider: string | null;
	issuedAt: string;
	notes: string | null;
};

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "FAILED";

type Booking = {
	id: number;
	status: BookingStatus;
	originIata: string;
	destinationIata: string;
	departureAt: string;
	arrivalAt: string;
	totalPriceCents: number;
	createdAt: string;
	tickets: Ticket[];
};

function UserBookings() {
	const [bookings, setBookings] = useState<Booking[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiFetch("/bookings")
			.then(async (res) => {
				if (!res.ok) {
					const err = (await res.json()) as { message?: string };
					throw new Error(err.message ?? "Failed to load bookings");
				}
				return res.json() as Promise<Booking[]>;
			})
			.then((data) => {
				setBookings(data);
			})
			.catch((err: Error) => {
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading)
		return <p className="bookings-loading">Loading your bookings...</p>;
	if (error) return <p className="error-container">{error}</p>;

	if (!bookings || bookings.length === 0) {
		return (
			<div className="bookings-empty-container">
				<h2 className="bookings-empty-title">No bookings yet</h2>
				<p>You have not booked any travels yet.</p>
				<Link to="/">Search for flights</Link>
			</div>
		);
	}

	return (
		<div className="bookings-container">
			<h2 className="bookings-title">My Bookings</h2>
			{bookings.map((booking) => {
				const price = (booking.totalPriceCents / 100).toFixed(2);
				const departure = new Date(booking.departureAt);
				const arrival = new Date(booking.arrivalAt);
				const travelFrom = booking.originIata;
				const travelTo = booking.destinationIata;
				const issuedTickets = booking.tickets.filter(
					(ticket) => ticket.status === "ISSUED"
				);
				const hasTickets = issuedTickets.length > 0;
				const awaitingTicket =
					booking.status === "CONFIRMED" && !hasTickets;

				return (
					<div key={booking.id} className="booking-container">
						<div className="booking-title-container">
							<h2 className="booking-title">
								Booking #{booking.id}
							</h2>
						</div>

						<p className="travel-route">
							{travelFrom} {">"} {travelTo}
						</p>
						<p className="travel-date">
							Departure: {departure.toLocaleString()}
						</p>
						<p className="travel-date">
							Arrival: {arrival.toLocaleString()}
						</p>
						<p className="booking-price">Price: {price} Euros</p>

						<div className="tickets">
							<h3 className="tickets-title">Tickets</h3>
							{awaitingTicket && (
								<p className="ticket-not-issued">
									Your ticket is being processed and will be
									issued shortly.
								</p>
							)}

							{hasTickets &&
								booking.tickets.map((ticket) => (
									<div
										key={ticket.id}
										className="ticket-container"
									>
										<p className="ticket-status">
											{ticket.status}
										</p>

										{ticket.ticketNumbers &&
											ticket.ticketNumbers.length > 0 && (
												<>
													<p className="ticket-number-title">
														Ticket number(s):
													</p>
													{ticket.ticketNumbers.map(
														(number) => (
															<p
																key={number}
																className="ticket-number"
															>
																{number}
															</p>
														)
													)}
													<p className="ticket-info">
														You can use the ticket
														numbers above on the
														airline website to
														retrieve them.
													</p>
												</>
											)}
									</div>
								))}
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default UserBookings;
