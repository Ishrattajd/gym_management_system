🏋️ Gym Management System

A Full Stack Gym Management System built using React + Django REST Framework.
The application allows admins, trainers, and members to manage gym activities such as class scheduling, bookings, attendance tracking, and workout suggestions.

🚀 Features

👤 Authentication

User registration
Login using JWT Authentication
Role-based access control (Admin / Trainer / Member)

🧑‍💼 Admin

Manage members
Manage trainers
Create and manage membership plans
View all class schedules

🏋️ Trainer

Create fitness classes
View and manage their own classes
Track attendance
Suggest workouts to members

🧑 Member

View available classes
Book gym classes
Track bookings and attendance
Receive workout suggestions

🛠 Tech Stack

Frontend

React
JavaScript
Bootstrap
Axios / Fetch API

Backend

Django
Django REST Framework
Simple JWT Authentication

Database

SQLite (Development)

📂 Project Structure
gym-management/
│
├── backend-drf/
│   ├── gym/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │
│   └── gym_main/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│
└── README.md

🔐 API Endpoints
Endpoint       	Method	    Description
/api/register/	POST	      Register new user
/api/login/    	POST	      Login user
/api/classes/	  GET/POST	  Manage gym classes
/api/bookings/	GET/POST  	Book classes
/api/members/  	GET	        View members
/api/trainers/	GET	        View trainers

Screenshots
<img width="1343" height="630" alt="image" src="https://github.com/user-attachments/assets/3455f8b8-4ee1-41bc-87af-17536e4c549e" />
<img width="1346" height="631" alt="image" src="https://github.com/user-attachments/assets/a23534c2-b8f3-481a-9c08-27ac59499c71" />
<img width="1342" height="633" alt="image" src="https://github.com/user-attachments/assets/41ad4eac-1bc2-4aa7-8d5a-3f7f884d6715" />
<img width="1365" height="632" alt="image" src="https://github.com/user-attachments/assets/e5d16a38-6e32-4429-9064-d82029697eab" />
<img width="1342" height="627" alt="image" src="https://github.com/user-attachments/assets/c8f64650-437d-4073-ad16-06ea5db4e55b" />
<img width="1365" height="632" alt="image" src="https://github.com/user-attachments/assets/7f177899-060b-4404-bd50-45c5fd38d97b" />
<img width="1365" height="633" alt="image" src="https://github.com/user-attachments/assets/b5078f8d-9435-4cd7-b54a-7b7a39e20d56" />
<img width="1347" height="631" alt="image" src="https://github.com/user-attachments/assets/8926e47b-1ac1-4d7b-837a-244be5800db5" />
<img width="1365" height="639" alt="image" src="https://github.com/user-attachments/assets/2c744f6d-b77f-4d8b-9781-a2c89e2d1a77" />
<img width="1365" height="634" alt="image" src="https://github.com/user-attachments/assets/9b139373-d07f-4821-922c-8f6f3ed5eab4" />
<img width="1365" height="634" alt="image" src="https://github.com/user-attachments/assets/c8c9f3b1-d1ac-49bb-b198-f3f178c8f74e" />



🔮 Future Improvements

Payment integration
Email notifications
Real-time class availability
Mobile responsive UI improvements
Deployment using Docker and AWS


