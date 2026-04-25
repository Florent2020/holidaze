import React from "react";
import { useEffect, useContext } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";
import HomePage from "./components/home/HomePage";
import AccommodationsDetail from "./components/home/AccommodationsDetail";
import BookingEnquiry from "./components/booking/BookingEnquary";
import AdminPage from "./components/admin/AdminPage";
import AccommodationsPage from "./components/accomodations/AccommodationsPage";
import Contact from "./components/contact/Contact";
import LoginPage from "./components/login/LoginPage";
import FavoriteTripsPage from "./components/home/TripsPage";
import AddAccommodation from "./components/admin/Add";
import MessagesAdmin from "./components/admin/messages/MessagesAdmin";
import ViewMessages from "./components/admin/messages/ViewMessages";
import EnquiriesAdmin from "./components/admin/enquiries/EnquiriesAdmin";
import ViewEnquiries from "./components/admin/enquiries/ViewEnquiries";
import EditAccommodation from "./components/admin/Edit";
import Footer from "./components/layout/Footer";
import "./sass/style.scss";
import Header from "./components/layout/Header";
import ScrollToTop from "./components/layout/ScrollToTop";

function AutoLogoutOutsideAdmin() {
  const location = useLocation();
  const [, setAuth] = useContext(AuthContext);

  useEffect(() => {
    const isAdminPage = location.pathname.includes("/admin");
    const isLoginPage = location.pathname.includes("/login");

    if (!isAdminPage && !isLoginPage) {
      setAuth(null);
    }
  }, [location.pathname, setAuth]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <AutoLogoutOutsideAdmin />
      <div className="bg">
        <div className="wrapper">
          <ScrollToTop />
          <Header />
          <Switch>
            <Route path="/" exact>
              <HomePage />
            </Route>
            <Route path="/accommodation/detail/:id">
              <AccommodationsDetail />
            </Route>
            <Route path="/accommodation/booking/:id">
              <BookingEnquiry />
            </Route>
            <Route path="/accommodations">
              <AccommodationsPage />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/favoriteTrips">
              <FavoriteTripsPage />
            </Route>
            <Route path="/admin/dashboard" exact>
              <AdminPage />
            </Route>
            <Route path="/admin/add">
              <AddAccommodation />
            </Route>
            <Route path="/admin/messages">
              <MessagesAdmin />
            </Route>
            <Route path="/admin/viewMessages/:id">
              <ViewMessages />
            </Route>
            <Route path="/admin/enquiries">
              <EnquiriesAdmin />
            </Route>
            <Route path="/admin/viewEnquiries/:id">
              <ViewEnquiries />
            </Route>
            <Route path="/admin/accommodation/edit/:id">
              <EditAccommodation />
            </Route>
          </Switch>
        </div>
      </div>
      <Footer />
    </AuthProvider>
  );
}

export default App;
