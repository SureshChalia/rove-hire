# Rove Hire – Full Stack Recruitment Management Platform

## Overview

Rove Hire is a modern recruitment management platform built as part of a Full-Stack Developer take-home assignment. The application streamlines the complete hiring workflow—from job creation and candidate applications to interview management and offer generation.

The goal of this project was not only to implement the requested features but also to build a production-ready architecture with a clean codebase, secure authentication, scalable database design, and responsive user experience.

---

# Tech Stack

### Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* React Hook Form
* Zod Validation

### Backend

* Next.js Server Actions
* Prisma ORM
* PostgreSQL (Neon Database)
* NextAuth v5 Authentication

### Deployment

* Vercel
* Neon PostgreSQL

---

# Why Next.js?

Next.js was chosen because it provides a complete full-stack framework in a single codebase.

Advantages include:

* Server Components for improved performance
* Server Actions to remove the need for a separate backend API
* Built-in routing
* Authentication support
* Production-ready deployment on Vercel
* SEO-friendly public career pages

Using Next.js allows both frontend and backend logic to live in the same project while maintaining a clean architecture.

---

# Why Prisma?

Prisma was selected because it provides:

* Type-safe database queries
* Excellent developer experience
* Automatic TypeScript types
* Easy schema migrations
* Better maintainability than writing raw SQL

Prisma also keeps the data layer clean and reduces runtime database errors.

---

# Authentication

Authentication is implemented using **NextAuth v5** with Credentials Provider.

Features include:

* Secure HR Login
* Protected Dashboard Routes
* Session-based authentication
* Middleware route protection
* Unauthorized users cannot access dashboard pages directly

---

# Resume Storage Decision

Initially resumes were stored inside the local filesystem.

Example:

```
public/uploads/candidates/
```

This approach works during local development but fails on serverless platforms like Vercel because the deployment filesystem is read-only.

Instead of relying on third-party storage services, resumes are stored directly in the database.

### Why store resumes inside PostgreSQL?

For this assignment, database storage provides several advantages:

* No dependency on external storage providers
* No broken file URLs
* Easy deployment on Vercel
* Simplified backup process
* Resume and candidate data remain together
* Suitable for moderate-scale recruitment systems

This approach keeps the project self-contained and simplifies deployment while meeting the assignment requirements.

---

# Features

## HR Dashboard

* Secure Login
* Dashboard Overview
* Responsive Layout
* Protected Routes

---

## Job Management

* Create Job
* Update Job
* Delete Job
* View Jobs
* Job Status Management

---

## Candidate Management

* Add Candidate
* Update Candidate
* Delete Candidate
* Resume Upload
* Resume Download
* Candidate Timeline
* Candidate Details Page

---

## Public Career Portal

Candidates can:

* Browse available jobs
* Start application
* Receive secure application link
* Complete application form
* Upload PDF resume

---

## Interview Management

* Schedule Interview
* Interview Status Tracking
* Mark Interview Completed
* Candidate Timeline Updates

---

## Offer Management

* Generate Offer
* Store Offer Details
* Offer Dashboard

---

# Project Structure

```
src
│
├── actions
├── app
├── components
├── lib
├── services
├── types
├── prisma
└── auth.ts
```

The project follows a service-based architecture.

Business logic is separated from UI components.

---

# Validation

Form validation is implemented using:

* React Hook Form
* Zod

Validation includes:

* Required fields
* Email validation
* PDF-only resumes
* Maximum resume size
* Secure server-side validation

---

# Database

Database used:

* PostgreSQL (Neon)

ORM:

* Prisma

Entities:

* Users
* Jobs
* Candidates
* Interviews
* Timelines
* Offer Documents

Relationships are normalized and managed through Prisma.

---

# Security

Implemented security measures include:

* Protected dashboard routes
* Authentication middleware
* Server-side validation
* Secure session management
* Input validation
* Server Actions instead of exposing unnecessary APIs

---

# Performance Considerations

The application was designed with performance in mind.

Optimizations include:

* Server Components
* Server Actions
* Prisma query optimization
* Component separation
* Lazy rendering where appropriate
* Minimal client-side state

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Create an environment file

```
DATABASE_URL=

AUTH_SECRET=

AUTH_URL=
```

Run migrations

```bash
npx prisma migrate dev
```

Generate Prisma Client

```bash
npx prisma generate
```

Run the application

```bash
npm run dev
```

Application will be available at:

```
http://localhost:3000
```

---

# Login Credentials

```
Email:
hr@rove.com

Password:
Password123
```

---

# Future Improvements

Given additional development time, the following enhancements would be implemented:

* Email notifications
* Real interview scheduling integrations
* Calendar integration
* Resume parsing
* Advanced candidate search
* Role-based access control
* Audit logs
* File storage using AWS S3 or Cloudinary for large-scale production deployments
* Pagination and filtering improvements
* Unit and integration tests
* CI/CD pipeline

---

# Design Principles

During implementation, emphasis was placed on:

* Clean architecture
* Readable code
* Type safety
* Reusable components
* Scalability
* Maintainability
* Production-ready deployment

---

# Conclusion

This project demonstrates a complete recruitment workflow built using modern full-stack technologies. The implementation focuses on clean architecture, secure authentication, efficient database management, responsive user experience, and maintainable code, making it a solid foundation for a production-ready hiring platform.
