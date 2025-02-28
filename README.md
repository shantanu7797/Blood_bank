# Blood Bank Management System

## 🩸 Introduction
The **Blood Bank Management System** is a web-based application designed to efficiently manage blood donations, donor information, and blood requests. This system facilitates seamless interaction between donors, recipients, and blood bank administrators.

## 🚀 Features
### 🔴 **Donor Management**
- Register as a donor
- Update personal and donation details
- Check eligibility for donation

### 🏥 **Blood Bank Inventory Management**
- Maintain records of available blood groups
- Track blood stock levels in real time
- Generate reports on blood availability

### 🏥 **Blood Requests & Recipients**
- Users can request blood based on availability
- Emergency blood request handling
- Notifications for request approvals/rejections

### 🔐 **Authentication & Authorization**
- Secure login system for donors, recipients, and admins
- Role-based access control
- Password encryption and authentication

### 📊 **Admin Dashboard**
- View and manage donors, recipients, and blood stock
- Approve/reject blood donation requests
- Generate reports and statistics

### 📡 **Notifications & Alerts**
- Email notifications for donors and recipients
- Alerts for low blood stock
- Automatic reminders for eligible donors

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Email Service:** Nodemailer (for sending notifications)

## ⚙️ Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/shantanu7797/Blood_bank.git
cd Blood_Bank
```


### 4️⃣ Environment Variables (Create `.env` file in `backend/`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.your-email.com
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

## 🎯 How to Use
1. **Donors**: Register and log in to donate blood.
2. **Recipients**: Search for blood availability and request for blood.
3. **Admins**: Approve donations and manage blood stock.


## 💡 Contributing
Contributions are welcome! Feel free to open issues and submit pull requests.

