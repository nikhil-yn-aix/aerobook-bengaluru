<<<<<<< HEAD
# SkyTaxi - Flying Taxi Booking
=======
# SkyTaxi - Flying Taxi Booking in Bengaluru
>>>>>>> main

SkyTaxi is a futuristic web application for booking autonomous flying taxis in Bengaluru. Built with React, Vite, and Tailwind CSS, it features an interactive map for route selection, fare estimation, and real-time booking simulation powered by Supabase.

## Features

-   **Interactive Map**: Select pickup and destination locations using a Leaflet-based map.
-   **Route Visualization**: Visualizes the flight path between selected points.
-   **Fare & Time Estimation**: Automatically calculates distance, estimated flight time, and fare based on the selected tier.
-   **Multiple Service Tiers**:
    -   **Solo Pod**: Quick personal commute (1 Passenger).
    -   **Standard Pod**: Efficient and affordable (4 Passengers).
    -   **Premium Pod**: Comfort with faster response (6 Passengers).
    -   **Executive Pod**: Luxury experience (4 Passengers).
-   **Booking System**: Simulates booking requests and stores them in a Supabase database.
-   **Responsive Design**: Fully responsive UI built with Tailwind CSS and shadcn/ui.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS, shadcn/ui
-   **Map**: React Leaflet, Leaflet
-   **Backend/Database**: Supabase
-   **State Management**: React Hooks
-   **Icons**: Lucide React

## Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v18 or higher) or [Bun](https://bun.sh/)
-   A [Supabase](https://supabase.com/) account

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd aerobook-bengaluru
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory (if it doesn't exist) and add your Supabase credentials:
    ```env
    VITE_SUPABASE_PROJECT_ID="your-project-id"
    VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
    VITE_SUPABASE_URL="your-supabase-url"
    ```

4.  **Database Setup**
    You need to create the `bookings` table in your Supabase project. Run the following SQL query in your Supabase SQL Editor:

    ```sql
    create table public.bookings (
      id uuid not null default gen_random_uuid (),
      created_at timestamp with time zone not null default now(),
      pickup_lat double precision not null,
      pickup_lng double precision not null,
      destination_lat double precision not null,
      destination_lng double precision not null,
      distance_km double precision not null,
      fare double precision not null,
      tier text not null,
      pod_id text not null,
      estimated_arrival_minutes integer not null,
      estimated_flight_minutes integer not null,
      user_name text null,
      user_contact text null,
      status text not null,
      constraint bookings_pkey primary key (id)
    ) tablespace pg_default;
    ```
    *(Alternatively, check `supabase/migrations` for the migration file)*

## Running the Project

Start the development server:

```bash
npm run dev
# or
bun dev
```

Open your browser and navigate to `http://localhost:8080` (or the port shown in your terminal).

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── BookingMap.tsx  # Map component with route visualization
│   ├── TierSelector.tsx# Taxi tier selection logic
│   └── ...
├── pages/
│   └── Index.tsx       # Main landing page and booking flow
├── lib/                # Utilities
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations (Supabase)
```

## License

This project is open source and available under the [MIT License](LICENSE).
