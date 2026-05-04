import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchResult from "./pages/SearchResult";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header/Header";
import { AuthProvider } from "./context/authProvider";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancelled from "./pages/BookingCancelled";
import UserBookings from "./pages/UserBookings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	return (
		<AuthProvider>
			<div className="app">
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/search" element={<SearchResult />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="/booking"
						element={
							<ProtectedRoute>
								<Booking />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/booking/success"
						element={
							<ProtectedRoute>
								<BookingSuccess />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/booking/cancelled"
						element={
							<ProtectedRoute>
								<BookingCancelled />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/my-bookings"
						element={
							<ProtectedRoute>
								<UserBookings />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</div>
		</AuthProvider>
	);
}

export default App;
