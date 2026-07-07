# 💬 ChatSphere

> **Production-grade real-time chat application backend built with Node.js, Express.js, TypeScript, MongoDB, Redis, Socket.IO, JWT Authentication, Cloudinary, and Swagger/OpenAPI.**

ChatSphere is a scalable, production-oriented real-time chat backend designed using modern backend engineering practices. It supports private messaging, group conversations, media sharing, real-time communication, notifications, user presence, and comprehensive REST API documentation.

The project is built with a modular architecture, feature-based folder structure, reusable services, centralized error handling, request validation, and clean Git workflows to closely resemble how backend applications are developed in production environments.

> **Project Status**
>
> * ✅ Backend (Version 1) Completed
> * 🚧 Frontend Currently Under Development
> * 🚀 Deployment Coming Soon

---

# ✨ Features

## 🔐 Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Get Current Logged-in User
* Logout

---

## 👤 User Management

* Update Profile
* Update Avatar (Cloudinary)
* Search Users
* Online / Offline Status

---

## 💬 Private Conversations

* Create Private Conversation
* Fetch User Conversations
* Get Conversation Details

---

## 👥 Group Conversations

* Create Group
* Rename Group
* Update Group Avatar
* Add Members
* Remove Members
* Leave Group
* Delete Group
* Transfer Group Admin Automatically

---

## 📨 Messaging

* Send Text Messages
* Send Media Messages
* Delete Messages
* Conversation Pagination
* Mark Conversation as Read

---

## 🔔 Notifications

* Real-time Notifications
* Fetch Notifications
* Mark Single Notification as Read
* Mark All Notifications as Read

---

## ⚡ Real-Time Features

* Socket.IO Integration
* Online Presence
* Instant Message Delivery
* Read Receipts
* Real-Time Notifications

---

## 📄 API Documentation

* Swagger / OpenAPI 3.0 Documentation
* JWT Authentication Support
* Organized Request & Response Schemas
* Interactive API Testing

---

## 🏗️ Architecture Highlights

* Feature-based Architecture
* Modular Codebase
* TypeScript
* RESTful APIs
* JWT Authentication
* Request Validation
* Centralized Error Handling
* Reusable Service Layer
* Cloudinary Integration
* Socket.IO Events
* Production-style Git Workflow

---

# 🛠️ Tech Stack

## Backend

* **Node.js**
* **Express.js**
* **TypeScript**

## Database

* **MongoDB**
* **Mongoose ODM**

## Real-Time Communication

* **Socket.IO**

## Authentication & Security

* **JWT (JSON Web Token)**
* **bcrypt**
* **HTTP-only Cookies**

## Media Storage

* **Cloudinary**
* **Multer**

## Validation

* **Zod**

## API Documentation

* **Swagger (OpenAPI 3.0)**

## Development Tools

* **Git**
* **GitHub**
* **Postman**
* **ESLint**
* **Prettier**
* **Nodemon**

---

# 📁 Project Structure

```text
ChatSphere/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── docs/
│   │   │   ├── paths/
│   │   │   └── schemas/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── conversations/
│   │   │   ├── messages/
│   │   │   └── notifications/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/          (Coming Soon)
│
├── README.md
└── .gitignore
```

---

# 🏛️ System Architecture

```text
                    Frontend (Coming Soon)
                            │
                            │ REST API + Socket.IO
                            ▼
                  ┌─────────────────────┐
                  │  Express.js Server  │
                  └─────────────────────┘
                     │      │        │
                     │      │        │
                     ▼      ▼        ▼
                 MongoDB   Redis*   Cloudinary
                     │                │
                     ▼                ▼
                Application Data   Media Storage

*Redis planned for future scalability.
```

---

# 🧩 Backend Architecture

ChatSphere follows a **feature-based modular architecture**, where each module is self-contained and responsible for a single business domain.

Each feature contains its own:

* Routes
* Controllers
* Services
* Models
* Validation
* Types

This structure improves maintainability, scalability, and makes adding new features easier without affecting existing modules.

The application also uses centralized middleware for authentication, request validation, error handling, and file uploads to keep business logic clean and reusable.

---

# 🚀 Getting Started

## Prerequisites

Before running ChatSphere locally, make sure you have the following installed:

* Node.js (v20 or later recommended)
* MongoDB
* Git
* Cloudinary Account

---

## Clone the Repository

```bash
git clone https://github.com/AvinashParmar12/ChatSphere.git

cd ChatSphere/backend
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

> **Note:** The exact variables may differ depending on your local configuration. Update them to match your project's `.env` requirements.

---

## Start Development Server

```bash
npm run dev
```

Backend will start at:

```text
http://localhost:5000
```

---

# 📚 API Documentation

ChatSphere includes complete Swagger (OpenAPI 3.0) documentation.

Once the server is running, open:

```text
http://localhost:5000/api-docs
```

Swagger provides:

* Interactive API testing
* Request and response schemas
* JWT Bearer Authentication support
* Validation details
* Complete endpoint documentation

---

# 🔌 Major API Modules

### Authentication

* Register
* Login
* Get Current User
* Logout

---

### Users

* Update Profile
* Update Avatar
* Search Users
* Get Online Status

---

### Conversations

* Private Conversations
* Group Conversations
* Rename Group
* Add Members
* Remove Members
* Leave Group
* Delete Group
* Update Group Avatar

---

### Messages

* Send Text Message
* Send Media Message
* Get Conversation Messages
* Delete Message
* Mark Conversation as Read

---

### Notifications

* Get Notifications
* Mark Notification as Read
* Mark All Notifications as Read

---

# 📖 Git Workflow

The project follows a feature-branch workflow.

Each major feature was developed in its own Git branch before being reviewed and merged into the main branch.

Examples include:

* feature/authentication
* feature/messages
* feature/group-chat
* feature/media-messages
* feature/notifications
* feature/pagination
* feature/swagger

This approach keeps development organized and closely follows professional software development practices.

---

# 🗺️ Roadmap

## ✅ Version 1 (Completed)

* JWT Authentication
* User Management
* Private Conversations
* Group Conversations
* Group Administration
* Text Messaging
* Media Messaging
* Message Deletion
* Notifications
* Online Presence
* Conversation Pagination
* Swagger API Documentation
* Cloudinary Integration

---

## 🚀 Version 2 (Planned)

The following features are planned for future releases:

* Reply to Messages
* Message Reactions
* Pinned Messages
* Message Search
* Typing Indicators
* Voice Messages
* Read Receipts Improvements
* Redis Integration
* Docker Support
* CI/CD Pipeline
* Unit & Integration Tests
* Deployment
* Frontend Application

---

# 🎯 Learning Objectives

This project was built to strengthen practical backend development skills by implementing production-style software engineering concepts, including:

* Feature-based architecture
* REST API design
* Authentication & Authorization
* Real-time communication using Socket.IO
* File uploads with Cloudinary
* Request validation
* Error handling
* API documentation with Swagger
* Git feature-branch workflow
* Modular and maintainable code structure

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome.

If you have suggestions for improving ChatSphere, feel free to open an issue or submit a pull request.

---

# 📌 Current Status

| Component         | Status         |
| ----------------- | -------------- |
| Backend           | ✅ Completed    |
| API Documentation | ✅ Completed    |
| Frontend          | 🚧 In Progress |
| Deployment        | ⏳ Planned      |
| Version           | v1.0           |

---

# 👨‍💻 Author

**Avinash Parmar**

* GitHub: https://github.com/AvinashParmar12
* LinkedIn: http://www.linkedin.com/in/avinash-parmar-4b54442b7

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Feedback and suggestions are always appreciated.
