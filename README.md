# Mesto Backend — Node.js REST API

RESTful API backend for the Mesto photo-sharing application — handles authentication, user profiles, and photo cards.

## Tech Stack

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

## Features

- JWT authentication with bcrypt password hashing
- CRUD operations for users and photo cards
- Request validation with Celebrate/Joi
- Centralized error handling middleware
- Mongoose schemas with reference relationships
- Logging of requests and errors

## Getting Started

```bash
npm install
npm run dev
```

The API will run on `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## API

Main endpoints:

- `POST /signup` — register a new user
- `POST /signin` — authenticate and receive JWT
- `GET /users/me` — get current user profile
- `GET /cards` — list all photo cards
- `POST /cards` — create a new card
- `PUT /cards/:id/likes` — like a card

## About

This is a learning project from the **Web Development Master's program at NUST MISIS in partnership with Yandex Practicum**, focused on building a production-ready REST API with authentication, validation, and proper error handling.
