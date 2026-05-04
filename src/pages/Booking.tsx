import "./Booking.css";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import { apiFetch } from "../lib/apiClient";

type Segment = {
	departure: { iataCode: string; at: string };
	arrival: { iataCode: string; at: string };
	carrierCode: string;
	number: string;
	id?: string;
};

type Itinerary = {
	duration: string;
	segments: Segment[];
	id?: string;
};

type FlightOffer = {
	id: number;
	itineraries: Itinerary[];
	price: { grandTotal: string };
};

type FlightState = {
	itineraryId: string;
	offer: FlightOffer;
	travelFrom: string;
	travelTo: string;
	travelDate: string;
};

function Booking() {
	const location = useLocation();
	const flightState = location.state as FlightState | null;

	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const yearInDays = 365;

	const minAgeDate = new Date();
	const minAge = 16;
	minAgeDate.setDate(minAgeDate.getDate() - minAge * yearInDays);
	const minBirthDateStr = minAgeDate.toLocaleDateString("fr-ca");

	const maxAgeDate = new Date();
	const maxAge = 100;
	maxAgeDate.setDate(maxAgeDate.getDate() - maxAge * yearInDays);
	const maxBirthDateStr = maxAgeDate.toLocaleDateString("fr-ca");

	if (!flightState) {
		return (
			<div className="error-container">
				<p>
					No flight selected. Please <a href="/">go back</a> and
					select a flight.
				</p>
			</div>
		);
	}

	const selectedItinerary = flightState.offer.itineraries.find(
		(itinerary) => itinerary.id === flightState.itineraryId
	);

	const travelFrom = flightState.travelFrom;
	const travelTo = flightState.travelTo;
	const travelDate = flightState.travelDate;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const form = new FormData(event.currentTarget);

		try {
			const res = await apiFetch("/bookings", {
				method: "POST",
				body: JSON.stringify({
					passengerFirstName: form.get("first_name") as string,
					passengerSurname: form.get("surname") as string,
					passengerDateOfBirth: form.get(
						"passenger-date-of-birth"
					) as string,
					offer: flightState.offer,
					itineraryId: flightState.itineraryId,
					travelFrom,
					travelTo,
				}),
			});

			if (!res.ok) {
				const err = (await res.json()) as { message?: string };
				throw new Error(err.message ?? "Booking failed.");
			}
			const data = (await res.json()) as { checkoutUrl: string };
			window.location.href = data.checkoutUrl;
		} catch (err) {
			setError((err as Error).message);
			setIsSubmitting(false);
		}
	};

	return (
		<div className="booking-page">
			<div className="booking-form">
				<div className="data-title-container">
					<h2 className="passenger-data-title">Passenger data</h2>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="error-container">
						{error && <p className="error-message">{error}</p>}
					</div>
					<div className="passenger-text-input-container">
						<p className="input-labels">First name</p>
						<input
							type="text"
							className="booking-text-input"
							placeholder="Enter your first name"
							name="first_name"
							required
						/>
					</div>
					<div className="passenger-text-input-container">
						<p className="input-labels">Surname</p>
						<input
							type="text"
							className="booking-text-input"
							placeholder="Enter your surname"
							name="surname"
							required
						/>
					</div>
					<div className="passenger-birth-date-holder">
						<p className="input-labels">Date of Birth</p>
						<input
							type="date"
							id="passenger-date-of-birth"
							name="passenger-date-of-birth"
							className="booking-date-input"
							min={maxBirthDateStr}
							max={minBirthDateStr}
							required
						/>
					</div>

					<button
						className="login-submit"
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ?
							"Processing..."
						:	"Continue to payment page"}
					</button>
				</form>
			</div>
			<div className="booking-info">
				{selectedItinerary && travelFrom && travelTo && travelDate && (
					<>
						<div className="flight-title-container">
							<h3 className="flight-title">
								Flight from {travelFrom} to {travelTo} on{" "}
								{travelDate}
							</h3>
						</div>
						<div className="segments">
							{selectedItinerary.segments.map((segment) => (
								<div key={segment.id} className="segment">
									<div className="segment-row">
										<div className="segment-route-container">
											<p className="segment-route-from">
												{segment.departure.iataCode}
											</p>
											<p className="segment-time">
												{new Date(
													segment.departure.at
												).toLocaleTimeString()}{" "}
												-{" "}
												{new Date(
													segment.arrival.at
												).toLocaleTimeString()}
											</p>
											<p className="segment-route-to">
												{segment.arrival.iataCode}
											</p>
										</div>
										<div className="segment-number-container">
											<p className="segment-number">
												{segment.carrierCode}{" "}
												{segment.number}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="selected-price-container">
							<p>
								Price: {flightState.offer.price.grandTotal}{" "}
								Euros
							</p>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default Booking;
