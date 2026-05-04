import { useNavigate } from "react-router-dom";
import "./Search.css";

function Search() {
	const navigate = useNavigate();
	const todayStr = new Date().toLocaleDateString("fr-ca");

	const maxDate = new Date();
	maxDate.setDate(maxDate.getDate() + 330);
	const maxDateStr = maxDate.toLocaleDateString("fr-ca");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const travelFrom = form.get("travel-from") as string;
		const travelTo = form.get("travel-to") as string;
		const travelDate = form.get("travel-date") as string;
		navigate(
			`/search?travel-from=${encodeURIComponent(travelFrom)}&travel-to=${encodeURIComponent(travelTo)}&travel-date=${encodeURIComponent(travelDate)}`
		);
	};

	return (
		<div className="search-holder">
			<div className="search-row">
				<form onSubmit={handleSubmit} className="search-form">
					<div className="search-text-holder">
						<input
							type="text"
							id="travel-from"
							name="travel-from"
							placeholder="Where from? (airport code)"
							className="search-text"
							required
						/>
					</div>
					<div className="search-text-holder">
						<input
							type="text"
							id="travel-to"
							name="travel-to"
							placeholder="Where to? (airport code)"
							className="search-text"
							required
						/>
					</div>
					<div className="search-date-holder">
						<input
							type="date"
							id="travel-date"
							name="travel-date"
							className="search-date"
							min={todayStr}
							max={maxDateStr}
							required
						/>
					</div>
					<div className="search-submit-holder">
						<button type="submit" className="search-submit">
							Search
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Search;
