import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CustomerLayout from "./components/Customer/CustomerLayout";
import CustomerRestaurants from "./components/Customer/Restaurants";
import CustomerReservations from "./components/Customer/Reservations";
import CustomerReviews from "./components/Customer/Reviews";
import CustomerPayments from "./components/Customer/Payments";
import CustomerProfile from "./components/Customer/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/customer" element={<CustomerLayout />}>
          <Route path="restaurants" element={<CustomerRestaurants />} />
          <Route path="reservations" element={<CustomerReservations />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route path="payments" element={<CustomerPayments />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
