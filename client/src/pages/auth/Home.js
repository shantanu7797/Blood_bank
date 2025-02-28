import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiDonateBlood } from "react-icons/bi";
import API from "../../services/API";
import { useSelector } from "react-redux";

function Home() {

    const navigate = useNavigate();

    const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [checker, setChecker] = useState(false);

    const getAllBloodRecords = async () => {

        setChecker(true);
        setLoading(true);
        try {

            const { data: orgData } = await API.post("inventory/blood-stock-by-organisation", { bloodGroup: selectedBloodGroup });

            const { data: hospData } = await API.post("inventory/blood-stock-by-hospital", { bloodGroup: selectedBloodGroup });

            if (orgData?.success && hospData?.success) {

                const updatedOrgData = orgData.data.map(item => ({
                    ...item,
                    Name: item.Name || "Organisation",
                }));

                const updatedHospData = hospData.data.map(item => ({
                    ...item,
                    Name: item.Name || "Hospital",
                }));

                const combinedData = [...updatedOrgData, ...updatedHospData];
                setData(combinedData);
                // console.log(combinedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    };




    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <div className="navbar-test h1">
                        <BiDonateBlood color="white" /> Blood Bank
                    </div>
                    <div className="ms-auto">
                        <button className="btn btn-danger me-2" onClick={() => navigate('/login')}>Login</button>
                        <button className="btn btn-danger" onClick={() => navigate('/register')}>Signup</button>
                    </div>
                </div>
            </nav>

            {/* Header Section */}
            <header className="bg-success text-white text-center py-5">
                <div className="container">
                    <h1>Welcome to Blood Bank</h1>
                    <p className="lead mt-3">
                        Donate blood, save lives. Join our mission to make a difference.
                    </p>
                    <div>
                        <button type="button" className="btn btn-danger btn-lg" onClick={() => navigate('/register')}>Donate Now</button>
                    </div>
                </div>
            </header>

            {/* Search Section */}
            <section className="py-5 bg-light">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 className="text-center mb-4">Search Blood Availability</h2>
                    <form>
                        <div className="row justify-content-center">
                            {/* Dropdown for Blood Groups */}
                            <div className="col-md-6 mb-3">
                                <label htmlFor="bloodGroup" className="form-label">Select Blood Group:</label>
                                <select
                                    className="form-select"
                                    id="bloodGroup"
                                    aria-label="Select Blood Group"
                                    value={selectedBloodGroup}
                                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Blood Group
                                    </option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            {/* Search Button */}
                            <div className="col-md-3 d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-danger w-100  "
                                    style={{ marginTop: '25px', marginBottom: '15px' }}
                                    onClick={() => getAllBloodRecords()}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Placeholder for Results */}
                    {<div id="results" className="mt-4">
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" >
                                <p>Loading...</p>
                            </div>
                        ) : data.length > 0 ? (
                            data.map((hospital, index) => (
                                <div className="card mb-3" key={index}>
                                    <div className="card-body">
                                        <h5 className="card-title">{hospital.Name || "Not Provided"}</h5>
                                        <p className="card-text">
                                            <strong>Address:</strong> {hospital.address || "Not Provided"}<br />
                                            <strong>Website:</strong>{" "}
                                            <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                                                {hospital.website || "Not Provided"}
                                            </a>
                                            <br />
                                            <strong>Email:</strong> {hospital.email || "Not Provided"}<br />
                                            <strong>Phone No:</strong> {hospital.phone || "Not Provided"}<br />
                                            <strong>Blood Group:</strong> {hospital.bloodGroup || "Unknown"}<br />
                                            <strong>Remaining Blood Quantity:</strong>{" "}
                                            {hospital.remainingBlood ? `${hospital.remainingBlood} ml` : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="d-flex justify-content-center align-items-center" >
                                <p className="m-auto w-auto">{checker && "No matching record found !!!!"}</p>
                            </div>
                        )}
                    </div>}

                </div>
            </section>


            {/* Advantages Section */}
            <section className="py-5 bg-light">
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <h2 className="text-center mb-4">Advantages of Blood Donation</h2>
                    <ul className="list-group gap-3">
                        <li className="list-group-item">
                            <strong>Helps save lives in emergencies and surgeries:</strong> Blood transfusions are critical in medical emergencies, such as accidents, surgeries, and childbirth. Donated blood is often needed for individuals undergoing major surgeries or treatments like cancer treatment.
                        </li>
                        <li className="list-group-item">
                            <strong>Promotes the production of new blood cells:</strong> When you donate blood, your body replenishes the lost blood, stimulating the production of new red blood cells. This can help improve overall blood circulation and energy levels.
                        </li>
                        <li className="list-group-item">
                            <strong>Reduces harmful iron stores in the body:</strong> Regular blood donation helps reduce excess iron in the blood, which may decrease the risk of heart disease and other complications caused by iron overload.
                        </li>
                        <li className="list-group-item">
                            <strong>Keeps donors engaged with their communities:</strong> Blood donation is a meaningful way to contribute to your community, providing a sense of accomplishment and social responsibility.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Blood Types Section */}
            <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 className="text-center mb-4">Types of Blood</h2>
                    <div className="row">
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-center">A+</h5>
                                    <p className="card-text text-center">A+ blood is one of the most common types and is vital for emergency transfusions and ongoing care for patients.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-center">A-</h5>
                                    <p className="card-text text-center">A- blood is less common and is often needed for specific patient requirements in hospitals.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-center">B+</h5>
                                    <p className="card-text text-center">B+ blood is frequently used in surgeries and emergencies.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-center">B-</h5>
                                    <p className="card-text text-center">B- blood is rare and crucial for patients with the same type during urgent care.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-center">AB+</h5>
                                    <p className="card-text text-center">AB+ is the universal recipient and is essential in critical care scenarios.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-center">AB-</h5>
                                    <p className="card-text text-center">AB- blood is rare and highly needed in specialized medical treatments.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-center">O+</h5>
                                    <p className="card-text text-center">O+ is the most common blood type, used extensively in transfusions and surgeries.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-center">O-</h5>
                                    <p className="card-text text-center">O- is the universal donor, crucial for emergencies when blood type is unknown.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blood Group Compatibility Section */}
            <section className="py-5 bg-light">
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <h2 className="text-center mb-4">Blood Group Compatibility</h2>
                    <p className="lead text-center">
                        Understanding blood group compatibility is essential for safe blood transfusions.
                    </p>
                    <table className="table table-bordered text-center">
                        <thead>
                            <tr>
                                <th>Donor Blood Type</th>
                                <th>Recipient Blood Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>O-</td>
                                <td>All blood types</td>
                            </tr>
                            <tr>
                                <td>O+</td>
                                <td>O+, A+, B+, AB+</td>
                            </tr>
                            <tr>
                                <td>A-</td>
                                <td>A-, A+, AB-, AB+</td>
                            </tr>
                            <tr>
                                <td>A+</td>
                                <td>A+, AB+</td>
                            </tr>
                            <tr>
                                <td>B-</td>
                                <td>B-, B+, AB-, AB+</td>
                            </tr>
                            <tr>
                                <td>B+</td>
                                <td>B+, AB+</td>
                            </tr>
                            <tr>
                                <td>AB-</td>
                                <td>AB-, AB+</td>
                            </tr>
                            <tr>
                                <td>AB+</td>
                                <td>AB+</td>
                            </tr>
                        </tbody>
                    </table>
                    <ul className="list-group gap-2">
                        <li className="list-group-item">
                            <strong>Note:</strong> Type O- is the universal donor, meaning anyone can receive it, regardless of their blood type.
                        </li>
                        <li className="list-group-item">
                            <strong>Note:</strong> Type AB+ is the universal recipient, meaning they can receive blood from any type.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Precautions Section */}
            <section className="py-5 bg-light">
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <h2 className="text-center mb-4">Precautions for Blood Donation</h2>
                    <ol className="list-group list-group-numbered gap-3">
                        <li className="list-group-item">
                            <strong>Ensure you are healthy and hydrated before donating:</strong> It is important to be in good health, hydrated, and not suffering from any infections or illnesses before you donate blood. This ensures that your body can handle the donation process.
                        </li>
                        <li className="list-group-item">
                            <strong>Avoid heavy physical activity post-donation:</strong> After donating blood, your body needs time to replenish the lost volume. Avoid strenuous exercise or heavy lifting for at least 24 hours.
                        </li>
                        <li className="list-group-item">
                            <strong>Consume iron-rich foods to replenish your blood:</strong> Blood donation can lower your iron levels. Eating iron-rich foods, such as spinach, red meat, beans, and fortified cereals, can help restore your iron levels.
                        </li>
                        <li className="list-group-item">
                            <strong>Rest adequately after donating blood:</strong> Give your body time to recover. Sit for a while after donation, and make sure you have a healthy meal and enough fluids.
                        </li>
                    </ol>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-dark text-white py-4">
                <div className="container text-center">
                    <div className="row">
                        {/* About Us Section */}
                        <div className="col-md-4 mb-3">
                            <h5>About Us</h5>
                            <p className="small">
                                We strive to save lives through blood donations. Be a part of our mission to bring hope and health to those in need.
                            </p>
                        </div>

                        {/* Quick Links Section */}
                        <div className="col-md-4 mb-3">
                            <h5>Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><a href="/home" className="text-white text-decoration-none">Home</a></li>
                                <li><a href="/login" className="text-white text-decoration-none">Donate Blood</a></li>
                                <li><a href="/home" className="text-white text-decoration-none">Contact Us</a></li>
                            </ul>
                        </div>

                        {/* Social Media Section */}
                        <div className="col-md-4">
                            <h5>Follow Us</h5>
                            <p className="small">Stay connected with us on social media.</p>
                            <a href="#" className="text-primary me-3"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="text-info me-3"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-danger"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>

                    {/* Footer Bottom Text */}
                    <div className="mt-4">
                        <p className="mb-0 small">Blood Bank &copy; 2024. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>

        </div>


    );
}

export default Home;
