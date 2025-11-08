# LegalEase

> *Your intelligent legal services marketplace - Connecting clients with the right legal professionals through AI-powered matching*

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![HeroUI](https://img.shields.io/badge/HeroUI-Components-purple?style=for-the-badge)](https://www.heroui.com/)

---

## Overview

**LegalEase** is a modern, full-stack legal services platform that bridges the gap between clients seeking legal assistance and qualified legal service providers. Using advanced AI-powered vector search, the platform intelligently matches clients with the most relevant legal professionals based on their specific needs.

### Key Features

- **AI-Powered Search** - Semantic search using HuggingFace embeddings to find the perfect legal match
- **Real-Time Chat** - Built-in messaging system for seamless client-provider communication
- **Provider Analytics** - Comprehensive dashboard with request statistics and trends
- **Secure Authentication** - Powered by Supabase with role-based access control
- **Responsive Design** - Beautiful, modern UI that works on all devices
- **Lightning Fast** - Built with Next.js 15 for optimal performance

---

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- A Supabase account
- A HuggingFace API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/satvikvirmani/legalease.git
   cd legalease
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## How to Use

### For Clients

1. **Sign Up** - Create an account and select "Client" as your role
2. **Complete Your Profile** - Fill in basic information and address details
3. **Search for Providers** - Describe your legal issue in natural language
4. **Review Matches** - Browse AI-matched legal professionals
5. **Submit Requests** - Send service requests to providers you're interested in
6. **Communicate** - Once approved, use the built-in chat to discuss your case
7. **Manage Requests** - Track all your requests through different statuses

### For Legal Service Providers

1. **Sign Up** - Register as a "Provider" 
2. **Build Your Profile** - Add credentials, specializations, and experience
3. **Write a Description** - Describe your services (this powers the AI matching!)
4. **Receive Requests** - Get notified when clients match with you
5. **Accept or Decline** - Review and respond to client requests
6. **Collaborate** - Use real-time chat to work with clients
7. **Track Performance** - Monitor your request statistics on the dashboard

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** HeroUI (NextUI fork)
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **Icons:** Heroicons

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-Time:** Supabase Realtime
- **Storage:** Supabase Storage
- **Vector Search:** PostgreSQL with pgvector

### AI/ML
- **Embeddings:** HuggingFace Inference API
- **Model:** sentence-transformers/all-MiniLM-L6-v2

### DevOps
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics
- **Version Control:** Git/GitHub

---

## Project Structure

```
legalease/
├── app/
│   ├── api/
│   │   └── generateEmbedding/          # AI embedding generation
│   ├── auth/
│   │   └── signout/                    # Authentication routes
│   ├── dashboard/
│   │   ├── account/                    # Profile management
│   │   ├── client-home/                # Client dashboard & search
│   │   ├── provider-home/              # Provider analytics
│   │   ├── approvedrequests/           # Approved requests + chat
│   │   ├── pendingrequests/            # Pending requests
│   │   ├── rejectedrequests/           # Rejected requests
│   │   ├── closedrequests/             # Closed requests
│   │   └── profile/[slug]/             # Dynamic provider profiles
│   ├── login/                          # Login page
│   ├── register/                       # Registration page
│   └── utils/
│       └── supabase/                   # Supabase client utilities
├── components/
│   └── ui/                             # Reusable UI components
└── public/                             # Static assets
```

---

## Key Features Explained

### AI-Powered Matching

LegalEase uses cutting-edge vector similarity search to match clients with providers:

1. Provider descriptions are converted to 384-dimensional vectors using HuggingFace's sentence transformers
2. Client queries are similarly vectorized
3. PostgreSQL's pgvector extension finds the closest semantic matches
4. Results are ranked by relevance, not just keyword matching

### Real-Time Communication

Built on Supabase Realtime, the chat system provides:
- Instant message delivery
- Connection state management
- Message history with date grouping
- Typing indicators (coming soon!)

### Advanced Analytics

Providers get insights into their business with:
- Request status distribution (pie chart)
- Week-over-week trend analysis
- Status counts for quick overview
- Historical data tracking

---

## Security Features

- **Row Level Security (RLS)** - Database-level access control
- **Secure Authentication** - JWT-based session management
- **Environment Variables** - Sensitive data never exposed to client
- **Middleware Protection** - Route guards for authenticated areas
- **Input Validation** - Server-side validation on all forms

---

## Database Schema

### Core Tables

- **profiles** - User profile information
- **addresses** - User location data
- **providers** - Provider-specific details and embeddings
- **requests** - Service request lifecycle
- **messages** - Real-time chat messages

### Vector Search

Uses PostgreSQL's `pgvector` extension with cosine similarity for semantic search.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

**Satvik Virmani**

- GitHub: [@satvikvirmani](https://github.com/satvikvirmani)
- Project Link: [https://github.com/satvikvirmani/legalease](https://github.com/satvikvirmani/legalease)

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [HuggingFace](https://huggingface.co/) - AI model hosting and inference
- [HeroUI](https://www.heroui.com/) - Beautiful React UI components
- [Vercel](https://vercel.com/) - Deployment and hosting platform

---

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/satvikvirmani/legalease/issues) on GitHub.

---

<div align="center">

### Star this repository if you find it helpful!

Made with ❤️ by Satvik Virmani

</div>
