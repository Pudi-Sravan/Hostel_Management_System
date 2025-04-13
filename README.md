# Hostel Management System (HMS)

Welcome to the **Hostel Management System (HMS)**! This system helps manage hostel operations efficiently, including student management, room allocations, and payment tracking. It has a backend built with Node.js, Express, and MySQL, and a frontend using React.js.

---

## Features

- **Student Management**: Admin can view, update, and manage student details.
- **Room Allocation**: Admin can allocate rooms to students and track room occupancy.
- **Payment Status**: Track payment status of students for room allocation.
- **Frontend Interface**: A clean and user-friendly interface for students and administrators.

---

## Tech Stack

- **Frontend**: React.js, Axios
- **Backend**: Node.js, Express
- **Database**: MySQL

---

## Installation

### Backend Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/hostel-management-system.git
    cd Hostel-Management-System
    ```

2. **Navigate to the backend directory**:

    ```bash
    cd hostel-management-system-backend
    ```

3. **Install required dependencies**:

    ```bash
    npm install
    ```

4. **Set up your database**:
   - Create a MySQL database named `hostel_management` (or use any name).
   - Configure the database connection in `db.js`:

    ```js
    const db = mysql.createConnection({
      host: 'localhost',
      user: 'your_db_user',
      password: 'your_db_password',
      database: 'hostel_management'
    });
    ```

5. **Start the backend server**:

    ```bash
    node server.js
    ```

    The backend API will be running at `http://localhost:3000`.

---

### Frontend Setup

1. **Navigate to the frontend directory**:

    ```bash
    cd hostel-management-system-frontend
    ```

2. **Install required dependencies**:

    ```bash
    npm install
    ```

3. **Start the frontend server**:

    ```bash
    npm run dev
    ```

    The frontend will be running on `http://localhost:3000`.

---

## Usage

### Dashboards

- **Student Dashboard**:  
  Students can view their name, email, phone, department, room number (if allocated), and payment status. They can also update their phone and department.

- **Admin Dashboard**:  
  Admin can view all students, allocate rooms, and update payment statuses.

---

## API Endpoints

## Student Endpoints

### 1. **GET `/api/student/profile`**
   - **Description**: Fetches the profile of a logged-in student.
   - **Query Parameters**: 
     - `user_id` (required): The ID of the logged-in student.
   - **Response Example**:
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "phone": "9876543210",
       "department": "Computer Science",
       "room_number": "101",
       "payment_status": "Paid"
     }
     ```
   - **Usage**: Retrieves the student's personal details, room allocation, and payment status.

---

### 2. **PUT `/api/student/update-profile`**
   - **Description**: Allows the student to update their phone number and department.
   - **Request Body**:
     ```json
     {
       "student_id": 1,
       "phone": "1234567890",
       "department": "Mechanical Engineering"
     }
     ```
   - **Response Example**:
     ```json
     {
       "message": "Profile updated successfully"
     }
     ```
   - **Usage**: Used by students to update their personal details like phone number and department.

---

## Admin Endpoints

### 1. **GET `/api/manager/students`**
   - **Description**: Fetch all students with their room allocation and payment status.
   - **Response Example**:
     ```json
     [
       {
         "student_id": 1,
         "name": "John Doe",
         "email": "john@example.com",
         "phone": "9876543210",
         "department": "Computer Science",
         "room_number": "101",
         "payment_status": "Paid"
       },
       ...
     ]
     ```
   - **Usage**: Used by the admin to view all students' details including room allocation and payment status.

---

### 2. **POST `/api/manager/allocate-room`**
   - **Description**: Allocates a room to a student.
   - **Request Body**:
     ```json
     {
       "student_id": 2,
       "roomNumber": 105
     }
     ```
   - **Response Example**:
     ```json
     {
       "message": "Room allocated successfully"
     }
     ```
   - **Usage**: Allows the admin to allocate a room to a student.

---

### 3. **PUT `/api/payment/:studentId`**
   - **Description**: Updates the payment status of a student.
   - **Request Body**:
     ```json
     {
       "student_id": 2,
       "payment_status": "Paid"
     }
     ```
   - **Response Example**:
     ```json
     {
       "message": "Payment status updated successfully"
     }
     ```
   - **Usage**: Used by the admin to update the payment status of a student (e.g., mark as "Paid").

---

### 4. **PUT `/api/manager/create-room`**
   - **Description**: Adds a new room in the database.
   - **Request Body**:
     ```json
     {
       "room_number": 102,
       "capacity": 2
     }
     ```
   - **Response Example**:
     ```json
     {
       "message": "Created room"
     }
     ```

---

### 4. **GET `/api/manager/rooms`**
   - **Description**: Gets data of all the available rooms.
---


## ⚠️ Important Notes

- **Authentication**: No authentication system like JWT is included for simplicity, but it's recommended to implement one for production.

---
