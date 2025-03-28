
# SportyWear - E-Commerce Platform

A modern, fully-functional e-commerce website for selling premium sportswear and athletic apparel.

## 🚀 Features

- Responsive design optimized for all devices
- Product browsing with filtering and search
- Product detail pages with image galleries
- Shopping cart and wishlist functionality
- User authentication and profiles
- Secure checkout process
- Admin dashboard for product management

## 📋 Implementation Guide

### 1. Getting Started

#### Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd sportywear
npm install
npm run dev
```

### 2. Authentication Setup

This project uses Supabase for authentication. After connecting to Supabase:

1. Enable Email/Password authentication in Supabase Auth settings
2. Set up social providers (optional): Google, Facebook
3. Configure email templates for verification, password reset, etc.

### 3. Database Setup

#### Database Schema

The project uses the following database tables:

| Table Name | Description |
|------------|-------------|
| products | Store product information (name, description, price, etc.) |
| categories | Product categories and subcategories |
| inventory | Track product stock and availability |
| orders | Store order information |
| order_items | Individual items in each order |
| users | Extended user profile information |
| reviews | Product reviews and ratings |

#### Setting Up Supabase Tables

1. Connect to your Supabase project
2. Create the tables according to the schema in the `database/schema.sql` file
3. Set up Row Level Security (RLS) policies for each table
4. Create necessary database functions and triggers

### 4. Local Development

```bash
# Start the development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 5. Testing

This project uses Vitest for testing. To run tests:

```bash
# Run all tests
npm test

# Run specific tests
npm test -- --testNamePattern="product"
```

Key testing areas:
- User authentication flows
- Shopping cart functionality
- Checkout process
- API integration

### 6. Deployment

1. Build the project: `npm run build`
2. Deploy to your hosting provider of choice
3. Configure environment variables for production

### 7. Admin Dashboard Access

To access the admin dashboard:
1. Create an admin user in Supabase
2. Assign the "admin" role to this user
3. Access the dashboard at `/admin` route

## 📦 Project Structure

```
src/
├── assets/          # Static assets and images
├── components/      # Reusable UI components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── layouts/         # Page layout components
├── lib/             # Utility functions and helpers
├── pages/           # Page components
├── services/        # API and service integrations
└── styles/          # Global styles and Tailwind config
```

## 📝 Future Enhancements

- Advanced filtering and search functionality
- Product recommendations
- User reviews and ratings
- Wish list functionality
- Multiple payment gateways
- Order tracking
- Email notifications
- Multi-language support

## ⚙️ Environment Variables

For local development, create a `.env.local` file with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔐 Connecting to GitHub

1. Create a new repository on GitHub
2. Add the remote to your local repository:
   ```bash
   git remote add origin https://github.com/yourusername/sportywear.git
   ```
3. Push your code:
   ```bash
   git push -u origin main
   ```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
