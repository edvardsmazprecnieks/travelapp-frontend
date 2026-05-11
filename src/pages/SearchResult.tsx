import "./SearchResult.css";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "@/lib/apiClient.ts";

type Segment = {
	departure: {
		iataCode: string;
		at: string;
	};
	arrival: {
		iataCode: string;
		at: string;
	};
	carrierCode: string;
	number: string;
	id?: string;
};

type Itinerary = {
	duration: string;
	segments: Segment[];
	id?: string;
};

type Search = {
	id: number;
	itineraries: Itinerary[];
	price: {
		grandTotal: string;
	};
};

function SearchResult() {
	const [data, setData] = useState<Search[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { user, isLoading: authLoading } = useAuth();

	const travelFrom = searchParams.get("travel-from");
	const travelTo = searchParams.get("travel-to");
	const travelDate = searchParams.get("travel-date");

	useEffect(() => {
		if (!travelFrom || !travelTo || !travelDate) {
			setError("Invalid search parameters.");
			setLoading(false);
			setData(null);
			return;
		}
		setLoading(true);
		const link = `/flights?originLocationCode=${travelFrom}&destinationLocationCode=${travelTo}&departureDate=${travelDate}&adults=1`;
		apiFetch(link)
			.then((res) => {
				if (!res.ok) {
					return res.json().then((body) => {
						throw new Error(
							body?.message ?? "Something went wrong."
						);
					});
				}
				return res.json();
			})
			.then((jsonData) => {
				setData(jsonData);
				setLoading(false);
			})
			.catch((error) => {
				setError(error.message);
				setLoading(false);
			});
	}, [travelFrom, travelTo, travelDate]);

	const handleBooking = (
		result: Search,
		itinerary: Itinerary,
		travelFrom: string,
		travelTo: string,
		travelDate: string
	) => {
		const flightState = {
			itineraryId: itinerary.id,
			offer: result,
			travelFrom,
			travelTo,
			travelDate,
		};

		if (user) {
			navigate("/booking", { state: flightState });
		} else {
			navigate("/login", {
				state: {
					redirectTo: "/booking",
					flightState,
					message: "Please log in to purchase a flight",
				},
			});
		}
	};

	if (loading || authLoading)
		return <div className="loading">Loading...</div>;
	if (error) return <div className="error">{error}</div>;
	if (!data || data.length === 0)
		return <div className="no-data">No data found.</div>;

	return (
		<div className="search-results">
			<div className="results-container">
				<div className="search-title-container">
					<h2 className="results-title">
						Flights from {travelFrom} to {travelTo}
					</h2>
					<h3 className="results-subtitle">Departing {travelDate}</h3>
				</div>

				<div className="results-grid">
					<div className="grid-titles">
						<div className="title-duration-container">
							<h4 className="title-duration">Duration</h4>
						</div>
						<div className="title-itinerary-container">
							<h4 className="title-itinerary">Itinerary</h4>
						</div>
						<div className="title-price-container">
							<h4 className="title-price">Price</h4>
						</div>
					</div>
					{data.map((result: Search) => (
						<div key={result.id} className="result-card">
							{result.itineraries.map((itinerary: Itinerary) => (
								<div
									key={itinerary.id}
									className="result-card-body"
								>
									<div className="itinerary-duration-container">
										<p className="itinerary-duration">
											{itinerary.duration}
										</p>
									</div>

									<div className="segments">
										{itinerary.segments.map(
											(segment: Segment) => (
												<div
													key={segment.id}
													className="segment"
												>
													<div className="segment-row">
														<div className="segment-route-container">
															<p className="segment-route-from">
																{
																	segment
																		.departure
																		.iataCode
																}
															</p>
															<p className="segment-time">
																{new Date(
																	segment
																		.departure
																		.at
																).toLocaleTimeString()}{" "}
																-{" "}
																{new Date(
																	segment
																		.arrival
																		.at
																).toLocaleTimeString()}
															</p>
															<p className="segment-route-to">
																{
																	segment
																		.arrival
																		.iataCode
																}
															</p>
														</div>
														<div className="segment-number-container">
															<p className="segment-number">
																{
																	segment.carrierCode
																}{" "}
																{segment.number}
															</p>
														</div>
													</div>
												</div>
											)
										)}
									</div>

									<div className="result-card-price-container">
										<p className="result-card-price">
											{result.price.grandTotal}
										</p>
										<button
											className="buy-button"
											onClick={() => {
												if (
													!travelFrom ||
													!travelTo ||
													!travelDate
												)
													return;
												handleBooking(
													result,
													itinerary,
													travelFrom,
													travelTo,
													travelDate
												);
											}}
										>
											Buy
										</button>
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default SearchResult;
