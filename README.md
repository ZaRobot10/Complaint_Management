# University Complaint Management System

The **University Complaint Management System** is a web-based platform designed by [Radhacharan](https://github.com/Radhacharan1109) and [Ekankaar Khera](https://github.com/ZaRobot10) to streamline the handling of complaints across a university. It connects students, faculty, and administrators, ensuring efficient communication and resolution of issues.

---

## Features

1. **Login & User Authentication**  
   - Secure user login using JWT (JSON Web Tokens) for authentication, ensuring authorized access based on user roles (student, faculty, administrator).

2. **Student Complaint Submission**  
   - Students can easily submit complaints with relevant details and attachments (e.g., images or documents).  
   - Categories for complaints include academics, facilities, hygiene, and more.

3. **Faculty and Staff Assignment**  
   - Complaints are assigned to the relevant faculty or staff members for resolution by the admin.

4. **Real-Time Status Updates**  
   - Students can track the progress of their complaints (Pending, Ongoing, Resolved).  
   - Faculty can update the status of complaints as they handle them.

5. **Complaint History**  
   - Maintain a record of resolved complaints for accountability and future reference.

6. **Role-Based Access Control**  
   - **Students**: Submit and monitor complaints.  
   - **Faculty**: View and respond to complaints assigned to them.  
   - **Administrator**: Monitor and manage the assignments of complaints submitted by students.

7. **Attachment Support**  
   - Upload supporting files, such as images or documents, to provide context to complaints.

---

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **File Upload Middleware**: Multer
- **Database**: MongoDB
- **Styling**: CSS and inline styles
- **HTTP Requests**: Axios

---

## Installation And Setup

#### Clone the repository:

```git
git clone https://github.com/ZaRobot10/Complaint_Management.git
```
### Backend
#### Setup backend
```git
cd Complaint_Management/backend
```
#### Install dependencies

```git
npm install
```

### Frontend
#### Setup frontend
```git
cd Complaint_Management/frontend
```
 #### Install dependencies
 ```git
npm install
```

## Environment Variables
#### Create a .env file in the root of Backend and add the following variables:

#### Backend  
```
MONGO_URI=your_MongoDB_url
JWT_SECRET=your_jwt_secret_key
```

## Running the Project

#### Backend

##### Add dummy users using seed.js:

```git
node seed.js
```

##### Start the backend server:

```git
nodemon index.js
```

#### Frontend
##### Start the frontend server

```git
npm start
```
