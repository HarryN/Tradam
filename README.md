# Tradam

A modern multi-vendor e-commerce MVP built for the Cameroon market. Tradam is designed to be developer-friendly, modular, and focused on the essential commerce loop: seller product management, buyer discovery, cart flow, and order processing.

## Why Tradam?

Tradam is an MVP-first platform with a clean architecture and practical trade-ready features.
It is built to support:

- Buyers discovering and purchasing products
- Sellers uploading and managing listings
- Admins governing the marketplace ecosystem
- A simple recommendation layer for personalized discovery

## Core Features

- Role-based authentication for buyers, sellers, and admins
- Seller product CRUD with image and inventory support
- Buyer marketplace with search, categories, and product detail pages
- Cart management and order placement flows
- Modular architecture built for future extensibility

## Architecture Overview

Tradam is organized to keep frontend, business logic, and service code separate.
The recommended structure includes:

- `src/app/` — application shell and routes
- `src/components/` — reusable UI components
- `src/features/` — feature modules like auth, products, orders
- `src/services/` — backend and API integrations
- `src/hooks/` — shared React hooks
- `src/types/` — shared TypeScript types
- `src/utils/` — helper utilities
- `src/lib/` — platform and config helpers

## Design Principles

Tradam follows a simple, modern UI philosophy:

- Mobile-first and responsive
- Spacious layouts and clean typography
- Minimal, intentional components
- Soft neutrals with an emerald accent system
- Fast interactions and lightweight pages

## MVP Scope

The first fully-functioning version focuses on:

- Authentication: signup, login, logout, session management, and roles
- Seller dashboard: product creation, editing, deletion, and inventory
- Buyer experience: browsing, filtering, product details, cart, and checkout
- Order lifecycle: placement, status tracking, and management
- Recommendation rules: related products and category-based suggestions

## Backend Strategy

Tradam is intended to work with Supabase for core backend services:

- Authentication
- PostgreSQL database
- File storage for images
- Real-time capabilities for future extensions

## Getting Started

1. Clone the repository
2. Install dependencies
3. Configure environment variables for Supabase
4. Run the development server

> This README intentionally stays focused on practical developer setup and MVP-driven progress.

## Project Goals

Tradam is not about feature overload. It is about creating a reliable, clean commerce experience with a modern architecture and a strong foundation for future growth.

## Notes for Contributors

- Build features vertically and keep them complete
- Avoid unfinished modules or disconnected UI
- Prefer clarity over cleverness
- Keep logic modular and easy to reason about
- Use real user needs to guide implementation

---

Built with love and pain by Harry N

