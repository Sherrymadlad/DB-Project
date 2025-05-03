import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CustomerLayout from "./components/Customer/CustomerLayout";
import CustomerRestaurants from "./components/Customer/Restaurants";
import CustomerReservations from "./components/Customer/Reservations";
import RestaurantReviews from "./components/Customer/RestaurantReviews"; // RestaurantReviews component
import Reviews from "./components/Customer/Reviews"; // New Reviews component
import PastReviews from "./components/Customer/PastReviews"; // New PastReviews component
import CustomerPayments from "./components/Customer/Payments";
import ReservationConfirmation from "./components/Customer/ReservationConfirmation";
import ReservationPayment from "./components/Customer/ReservationPayment";
import CustomerProfile from "./components/Customer/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="restaurants" element={<CustomerRestaurants />} />
          <Route path="reservations" element={<CustomerReservations />} />
          <Route path="reviews" element={<Reviews />} /> {/* Reviews route */}
          <Route path="RestaurantReview" element={<RestaurantReviews />} /> {/* Updated path to match the URL you want */}
          <Route path="past-reviews" element={<PastReviews />} /> {/* Added PastReviews route */}
          <Route path="payments" element={<CustomerPayments />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="reservation-confirmation" element={<ReservationConfirmation />} />
          <Route path="reservation-payment" element={<ReservationPayment />} />
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
