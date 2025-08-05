# JP Precinct Finder - North Texas

## Overview

The JP Precinct Finder is a web application designed to help users locate which Justice of the Peace (JP) precinct an address belongs to across four North Texas counties: Collin, Dallas, Denton, and Tarrant. The application provides both an interactive map interface and address search functionality to identify precinct boundaries and display relevant demographic and statistical information for each precinct.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built as a React single-page application using modern React patterns and TypeScript. The application uses a component-based architecture with clearly separated concerns:

- **React Router**: Uses Wouter for lightweight client-side routing
- **State Management**: Leverages React hooks and context for local state management, with TanStack Query for server state management
- **UI Components**: Built with shadcn/ui component library providing a consistent design system
- **Styling**: Uses Tailwind CSS with CSS custom properties for theming and responsive design
- **Map Integration**: Implements Leaflet for interactive map functionality with GeoJSON data visualization

### Backend Architecture
The backend follows a RESTful API design pattern with Express.js:

- **API Structure**: RESTful endpoints for precinct data retrieval and address search functionality
- **Data Storage**: In-memory storage implementation with interfaces for future database integration
- **Middleware**: Express middleware for request logging, JSON parsing, and error handling
- **Development Setup**: Vite integration for hot module replacement and development server

### Data Storage Solutions
The application currently uses an in-memory storage system for development purposes:

- **Precinct Data**: GeoJSON format storing precinct boundaries, demographics, and administrative information
- **Geocoding**: Mock geocoding service for address-to-coordinate conversion
- **Database Schema**: Defined using Drizzle ORM schemas with PostgreSQL dialect configuration for future production deployment

### Authentication and Authorization
Currently, the application does not implement authentication or authorization mechanisms, as it serves public geographic data. The architecture is prepared for future implementation if user-specific features are required.

### External Dependencies

- **Neon Database**: PostgreSQL database service configured for production deployment
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL interactions
- **Leaflet**: Open-source mapping library for interactive map functionality
- **North Texas Evictions Project**: Data source for JP precinct boundary information via GeoJSON files
- **Radix UI**: Headless UI components for accessible interface elements
- **TanStack Query**: Server state management and caching library
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Build tool and development server for fast development experience
- **shadcn/ui**: Component library built on Radix UI and Tailwind CSS

The application architecture is designed to be scalable and maintainable, with clear separation between data, business logic, and presentation layers. The modular design allows for easy extension of functionality and integration with additional external services as needed.