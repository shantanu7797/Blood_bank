import React from "react";
import { BiDonateBlood, BiUserCircle } from "react-icons/bi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  // logout handler
  const handleLogout = () => {
    localStorage.clear();
    alert("Logout Successfully");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-test">
        <div className="container-fluid navbar-test">
          <div className="navbar-test h1">
            <BiDonateBlood color="white" /> Blood Bank
          </div>
          <ul className="navbar-nav flex-row navbar-test">
            <li className="nav-item mx-3">
              <p className="nav-link">
                <BiUserCircle /> Welcome{" "}
                {user?.name || user?.hospitalName || user?.organisationName}
                &nbsp;
                <span className="badge bg-light text-dark">{user?.role}</span>
              </p>
            </li>
            {location.pathname === "/" ||
            location.pathname === "/donar" ||
            location.pathname === "/hospital" ? (
              <li className="nav-item mx-3">
                <Link to="/analytics" className="nav-link">
                  Analytics
                </Link>
              </li>
            ) : (
              <li className="nav-item mx-3">
                {user?.role !== "admin" && (<Link to="/" className="nav-link bg-dark text-white px-3 py-2 rounded">
                  Home
                </Link>)}
              </li>
            )}
            <li className="nav-item mx-3">
              <button className="btn btn-dark" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
