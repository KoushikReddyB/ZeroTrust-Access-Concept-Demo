# **ZeroTrust Access: Concept Demo**

## **Overview**

Welcome to the **ZeroTrust Access: Concept Demo**! This project aims to demonstrate how the **Zero Trust Network Access (ZTNA)** security model can be practically applied in modern web applications. The purpose of this demo is to showcase a practical implementation of Zero Trust principles, focusing on secure authentication, device access control, and real-time security monitoring in an enterprise environment.

### **What is Zero Trust?**

The **Zero Trust Security Model** is a framework that assumes every entity—whether inside or outside an organization’s network—is untrusted until verified. This approach emphasizes strong authentication, strict access controls, and continuous monitoring to protect sensitive data and systems. Zero Trust operates on the principle of "Never Trust, Always Verify," ensuring that resources are only accessible to authenticated and authorized users and devices.

The key pillars of Zero Trust include:

- **Verification**: Every user and device must be authenticated, and their access continuously monitored and reassessed.
- **Least Privilege Access**: Grant users the minimum access they need to perform their jobs, limiting the attack surface.
- **Micro-Segmentation**: Resources are isolated from one another to limit lateral movement in case of a breach.

---

## **Project Features**

This demo project consists of both **frontend** and **backend** components that work together to illustrate how Zero Trust concepts can be implemented.

### **Frontend (Admin Dashboard)**

The **React-based admin dashboard** offers a user-friendly interface for administrators to manage the security of the system. Key features include:

- **Real-Time Security Metrics**: 
    - Track active users, devices, and network activity.
    - Monitor login attempts, failed authentications, and suspicious behaviors.

- **Security Alerts**:
    - Receive alerts about potential security threats such as unauthorized access attempts, unapproved device connections, and abnormal user behavior.

- **User and Device Management**:
    - View and manage the status of users (active/inactive).
    - Approve or deny device access based on trust levels.

- **Interactive Dashboard**:
    - Dynamic charts, graphs, and tables to visualize system activity and security metrics.
    - User-friendly navigation to quickly access security alerts, metrics, and configuration options.

### **Backend (API)**

The **Node.js-based backend** provides a robust API to handle authentication, user management, device approvals, and real-time metrics. Key features of the backend include:

- **JWT Authentication**:
    - Secure user authentication using JSON Web Tokens (JWT), enabling session management and token-based security.

- **User Management**:
    - APIs to manage users, including activation, deactivation, and role-based access control (RBAC).
    - Each user is assigned specific roles (Admin, User) to control what resources they can access.

- **Device Management**:
    - APIs to approve, deny, or revoke device access based on predefined trust parameters.
    - Track device health, behavior, and other criteria to evaluate trustworthiness.

- **Security Event Logging**:
    - Logs all significant security events such as failed logins, device connection attempts, and suspicious activity, which can be monitored and acted upon.

- **Metrics Collection**:
    - Collects data on user behavior, device access, and security events to provide actionable insights.

---

## **Zero Trust Principles in the Demo**

The project is built around the core principles of the **Zero Trust Security Model**:

1. **Never Trust, Always Verify**:
    - Every access request is validated using robust authentication and authorization mechanisms. No device or user is implicitly trusted, even if they are within the network perimeter.

2. **Least Privilege Access**:
    - Users and devices are granted access based only on the minimum necessary permissions. This reduces the risk of unauthorized access and limits the scope of damage if a breach occurs.

3. **Assume Breach**:
    - The system assumes that breaches are inevitable. Therefore, it is designed to continuously monitor and enforce security policies to minimize damage in case of an intrusion.

4. **Continuous Monitoring**:
    - All user and device activity is monitored in real-time to detect abnormal patterns, unauthorized access, or any potential security incidents.

---

## **Technologies Used**

This demo application leverages a variety of modern technologies for building secure, scalable, and maintainable systems.

### **Frontend**:
- **React.js**: A JavaScript library for building dynamic, responsive user interfaces, allowing for seamless updates and interactions.
- **Tailwind CSS**: A utility-first CSS framework to create fast, customizable, and responsive UI components.
- **Axios**: A promise-based HTTP client used to make API requests to the backend.
- **Chart.js**: Used to render interactive charts and metrics on the dashboard for real-time monitoring.

### **Backend**:
- **Node.js**: A runtime environment for executing JavaScript server-side, enabling the creation of scalable and performant backend services.
- **Express.js**: A minimalistic web application framework used to structure and simplify the backend API routes.
- **MongoDB**: A NoSQL database to store user data, device access records, security logs, and metrics.
- **JWT (JSON Web Tokens)**: Used for securely transmitting authentication data between the frontend and backend.
- **bcryptjs**: A library to hash and securely store user passwords in the database.
- **dotenv**: Manages environment variables (e.g., API keys, database URIs, JWT secrets) in a `.env` file.
- **rate-limiter-flexible**: Used to implement rate limiting on certain API routes to prevent brute force attacks.
- **helmet**: Helps secure HTTP headers to protect against common web vulnerabilities.

---

## **Project Structure**

```
/backend
  ├── /controllers         # Contains controller functions for handling requests
  ├── /models              # MongoDB data models (User, Device, Metrics, etc.)
  ├── /routes              # Express routes that define API endpoints
  ├── /middleware          # Authentication, authorization middleware
  ├── /utils               # Utility functions (e.g., email sending)
  ├── server.js            # Main entry point for the backend server
  ├── .env                 # Environment variables (MongoDB URI, JWT secret, etc.)
  └── package.json         # Backend dependencies and scripts

/frontend
  ├── /src
      ├── /components      # React components (e.g., MetricCard, Alert, etc.)
      ├── /pages           # React pages (e.g., Dashboard, DeviceApproval)
      ├── /api             # Axios API calls to interact with backend
      ├── App.js           # Main React application component
      └── index.js         # React entry point
  └── package.json         # Frontend dependencies
```

---

## **Setup & Installation**

To run this project locally, you need to set up both the **frontend** and **backend** components.

### **Frontend Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/zerotrust-access-concept-demo.git
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend application:
   ```bash
   npm start
   ```

   The frontend should now be accessible at `http://localhost:3000`.

### **Backend Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/zerotrust-access-concept-demo.git
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following keys:
   ```
   JWT_SECRET=your_jwt_secret_key
   MONGO_URI=mongodb://localhost:27017/zerotrust-db
   ```

4. Start the backend API:
   ```bash
   npm run dev
   ```

   The backend should now be accessible at `http://localhost:5000`.

---

## **Running the Application**

Once both the frontend and backend are running, open a browser and go to `http://localhost:3000`. You should see the **Zero Trust Admin Dashboard**, where administrators can manage user access, approve devices, and monitor security metrics.

---

## **Backend API Endpoints**

The backend exposes the following RESTful API endpoints:

### **Authentication**:
- **POST /api/auth/login**: Logs in a user and returns a JWT token.
- **POST /api/auth/register**: Registers a new admin user.

### **User Management**:
- **GET /api/users**: Retrieves a list of all users.
- **PATCH /api/users/:userId/status**: Updates a user's status (e.g., activate/deactivate).

### **Device Management**:
- **GET /api/devices/pending**: Retrieves a list of devices awaiting approval.
- **PUT /api/device/approve/:userId/:deviceId**: Approves a device.
- **PUT /api/device/deny/:userId/:deviceId**: Denies a device.

### **Metrics**:
- **GET /api/metrics**: Fetches real-time security metrics, including active sessions and device access attempts.

---

## **Special Thanks**

We would like to express our sincere gratitude to **Dr S Anjali Devi (4863) Ma'am** for her continuous support and guidance throughout the course of this project. She has been a great mentor, providing us with valuable feedback and ensuring that we remained on track during the development process. Her encouragement and expertise were crucial in helping us refine our approach and complete this project.

---

## **Team Members**

This project was created as part of our term paper on Zero Trust Access, and we would like to acknowledge the contributions of the following team members:

- **Bhimavarapu Koushik Reddy (2200090018)**
- **Parth Mahesh Josh (2200090254)**
- **B Gokul Krishna Sai (2200090236)**
- **Velamuri Jagannadha Dheeraj (2200090178)**

---

## **Contributions**

We welcome contributions to this project! If you'd like to add new features or fix issues, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -m 'Added new feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

---

## **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

