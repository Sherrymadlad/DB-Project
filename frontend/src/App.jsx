import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CustomerLayout from "./components/Customer/CustomerLayout";
import CustomerRestaurants from "./components/Customer/Restaurants";
import CustomerReservations from "./components/Customer/Reservations"; // Existing CustomerReservations component
import CustomerReservationsPage from "./components/Customer/CustomerReservations"; // New import for the same component
import RestaurantReviews from "./components/Customer/RestaurantReviews"; // RestaurantReviews component
import Reviews from "./components/Customer/Reviews"; // New Reviews component
import PastReviews from "./components/Customer/PastReviews"; // New PastReviews component
import CustomerPayments from "./components/Customer/Payments";
import ReservationConfirmation from "./components/Customer/ReservationConfirmation";
import ReservationPayment from "./components/Customer/ReservationPayment";
import CustomerProfile from "./components/Customer/Profile";
import CurrentReservations from "./components/Customer/CurrentReservations"; // New CurrentReservations component
import PastReservations from "./components/Customer/PastReservations"; // New PastReservations component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="restaurants" element={<CustomerRestaurants />} />
          <Route path="reservations" element={<CustomerReservations />} /> {/* Original reservations route */}
          <Route path="CustomerReservations" element={<CustomerReservationsPage />} /> {/* New route */}
          <Route path="reviews" element={<Reviews />} /> {/* Reviews route */}
          <Route path="RestaurantReview" element={<RestaurantReviews />} /> {/* Updated path to match the URL you want */}
          <Route path="past-reviews" element={<PastReviews />} /> {/* Added PastReviews route */}
          <Route path="payments" element={<CustomerPayments />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="reservation-confirmation" element={<ReservationConfirmation />} />
          <Route path="reservation-payment" element={<ReservationPayment />} />
          <Route path="currentreservations" element={<CurrentReservations />} /> {/* New CurrentReservations route */}
          <Route path="pastreservations" element={<PastReservations />} /> {/* New PastReservations route */}
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
