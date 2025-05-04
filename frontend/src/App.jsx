import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CustomerLayout from "./components/Customer/CustomerLayout";
import CustomerRestaurants from "./components/Customer/Restaurants";
import CustomerRestaurantDetails from "./components/Customer/RestaurantDetails";
import CustomerRestaurantReserve from "./components/Customer/RestaurantReservation";
import CustomerRestaurantReviews from "./components/Customer/RestaurantReviews"; 
import CustomerCurrentReservations from "./components/Customer/CurrentReservations";
import CustomerPastReservations from "./components/Customer/PastReservations";
import CustomerReservationConfirmation from "./components/Customer/ReservationConfirmation";
import CustomerReservationPayment from "./components/Customer/ReservationPayment";
import CustomerAddReviews from "./components/Customer/AddReviews";
import CustomerPastReviews from "./components/Customer/PastReviews";
import CustomerPayments from "./components/Customer/Payments";
import CustomerProfile from "./components/Customer/Profile";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminRestaurants from "./components/Admin/Restaurants";
import AdminRestaurantDetails from "./components/Admin/RestaurantDetails";
import AdminRestaurantReviews from "./components/Admin/RestaurantReviews";
import AdminNewRestaurant from "./components/Admin/NewRestaurant";
import AdminProfile from "./components/Admin/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="restaurants" element={<CustomerRestaurants />} />
          <Route path="restaurants/details" element={<CustomerRestaurantDetails />} />
          <Route path="restaurants/reserve" element={<CustomerRestaurantReserve />} />
          <Route path="restaurants/reviews" element={<CustomerRestaurantReviews />} />
          <Route path="reservations" element={<CustomerCurrentReservations />} />
          <Route path="reservations/past" element={<CustomerPastReservations />} />
          <Route path="reservations/confirmation" element={<CustomerReservationConfirmation />} />
          <Route path="reservations/payment" element={<CustomerReservationPayment />} />
          <Route path="reviews" element={<CustomerAddReviews />} />
          <Route path="reviews/past" element={<CustomerPastReviews />} />
          <Route path="payments" element={<CustomerPayments />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="restaurants" element={<AdminRestaurants />} />
          <Route path="restaurants/details" element={<AdminRestaurantDetails />} />
          <Route path="restaurants/reviews" element={<AdminRestaurantReviews />} />
          <Route path="new/restaurant" element={<AdminNewRestaurant />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
