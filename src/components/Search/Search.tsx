import "./Search.css";

function Search() {
	const todayStr = new Date().toLocaleDateString("fr-ca");

	const maxDate = new Date();
	maxDate.setDate(maxDate.getDate() + 330);
	const maxDateStr = maxDate.toLocaleDateString("fr-ca");

	return (
		<div className="search-holder">
			<div className="search-row">
				<form action="/search" className="search-form">
					<div className="search-text-holder">
						<input
							type="text"
							id="travel-from"
							name="travel-from"
							placeholder="Where from?"
							className="search-text"
						/>
					</div>
					<div className="search-text-holder">
						<input
							type="text"
							id="travel-to"
							name="travel-to"
							placeholder="Where to?"
							className="search-text"
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
