import "./SearchResult.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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

	const travelFrom = searchParams.get("travel-from");
	const travelTo = searchParams.get("travel-to");
	const travelDate = searchParams.get("travel-date");

	useEffect(() => {
		setLoading(true);
		const link = `/api/flightsearch?originLocationCode=${travelFrom}&destinationLocationCode=${travelTo}&departureDate=${travelDate}&adults=1`;
		console.log(link);
		fetch(link)
			.then((res) => {
				if (!res.ok) {
					throw new Error("Network response was not ok");
				}
				console.log(res);
				return res.json();
			})
			.then((jsonData) => {
				console.log(jsonData);
				setData(jsonData);
				setLoading(false);
			})
			.catch((error) => {
				setError(error.message);
				setLoading(false);
			});
	}, [travelFrom, travelTo, travelDate]);

	if (loading) return <div className="loading">Loading...</div>;
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
																	segment.departure.at
																).toLocaleTimeString()}{" "}
																-{" "}
																{new Date(
																	segment.arrival.at
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
