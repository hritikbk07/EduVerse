# EduVerse - Empowering Learning Everywhere
* A complete full-stack Learning Management System (LMS)*

## About EduVerse
EduVerse is a modern, full-stack Learning Management System (LMS) designed to bridge the gap between instructors and students. Its purpose is to provide a seamless platform where educators can create and manage courses, and learners can easily enroll, track their progress, and acquire new skills. With an intuitive interface and secure payment gateways, EduVerse makes online education accessible and efficient.

## Features
- **Role-Based Access Control:** Separate dashboards and functionalities for Students, Instructors, and Admins.
- **Course Management:** Instructors can create, update, and manage courses with rich multimedia lessons.
- **Secure Payments:** Integrated Stripe (and eSewa) for reliable and seamless course enrollment.
- **Progress Tracking:** Students can monitor their learning progress and access enrolled courses anytime.
- **Admin Dashboard:** Centralized management of users, courses, and platform analytics.
- **Responsive Design:** Optimized for both desktop and mobile viewing.

## Technologies Used
- **Frontend:** Next.js (React), Tailwind CSS, Zustand (State Management), Axios
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Media Management:** Cloudinary (Image & Video Upload)
- **Payments:** Stripe integration

## Project Structure
The repository is structured as a monorepo containing both the frontend and backend applications.

```text
EduVerse/
├── backend/                # Node.js & Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers (e.g., payment, user, course)
│   │   ├── models/         # Mongoose schemas (e.g., User, Course, Enrollment)
│   │   ├── routes/         # Express API routes
│   │   ├── middleware/     # Custom middlewares (auth, upload, etc.)
│   │   └── app.ts          # Main Express application setup
│   └── .env                # Backend environment variables
│
├── frontend/               # Next.js application
│   ├── app/                # Next.js App Router (pages & layouts)
│   │   ├── (public)/       # Publicly accessible pages
│   │   ├── admin/          # Admin dashboard pages
│   │   └── ...             # Student/Instructor specific routes
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Utility functions (Axios setup)
│   │   └── store/          # Zustand state management (authStore)
│   └── .env.local          # Frontend environment variables
│
└── README.md               # Project documentation
```

## Installation Instructions
Follow these steps to get the project running locally.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI
- Stripe Account (for payment testing)

### 1. Clone the Repository
```bash
git clone https://github.com/hritikbk07/EduVerse.git
cd EduVerse
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=http://localhost:3000
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage Examples

### Enrolling in a Course (Stripe Integration)
The platform uses Stripe for processing payments. Here is how the checkout flow is initiated from the frontend:

```typescript
// frontend/src/lib/axios.ts
import axios from 'axios';

export const createCheckoutSession = async (courseId: string) => {
  const response = await axios.post('/api/payments/create-checkout-session', { courseId });
  // Redirect to Stripe Checkout URL returned from the backend
  window.location.href = response.data.url;
};
```

### Role-Based Route Protection
The frontend ensures only authorized users can access certain areas:
```tsx
// Example of accessing protected state
import { useAuthStore } from '@/store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  
  if (user?.role !== 'student') {
    return <p>Access Denied</p>;
  }

  return <div>Welcome to your Student Dashboard!</div>;
}
```

## Contribution Guidelines
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
**Hritik BK**  
GitHub: [@hritikbk07](https://github.com/hritikbk07)  
Project Link: [https://github.com/hritikbk07/EduVerse](https://github.com/hritikbk07/EduVerse)
