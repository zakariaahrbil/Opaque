# 🛡️ Opaque

> **Zero-Knowledge, Client-Side Encrypted Password Manager**

Opaque is a modern, high-security password management platform designed around the **Zero-Knowledge Architecture**. All encryption and decryption operations occur exclusively client-side in the browser. The server acts purely as a synchronized storage and authentication layer, with zero insight into your master password, vault keys, or encrypted credentials.

---

## 🔒 Security Architecture & Zero-Knowledge Model

Opaque is engineered to defend against network eavesdroppers, compromised databases, and rogue administrators.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                              │
│                                                                         │
│  [Master Password] ──(PBKDF2/Argon2)──┬──> [Master Key]                 │
│                                       │          │                      │
│                                       │     (Decrypts/Encrypts)         │
│                                       │          ▼                      │
│                                       │    [Vault Key]                  │
│                                       │          │                      │
│                                       │     (AES-256-GCM)               │
│                                       │          ▼                      │
│                                       │    [Plaintext Vault Data]       │
│                                       │                                 │
│                                       └──> [Login Verifier]             │
└──────────────────────────────────────────────────┬──────────────────────┘
                                                   │ HTTPS / TLS
                                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SERVER (Backend)                              │
│                                                                         │
│  • Stores BCrypt-hashed Login Verifier (Authentication only)            │
│  • Stores only Ciphertexts + Nonce/IV + Auth Tags (Zero Knowledge)      │
│  • Issues stateless short-lived JWT session tokens                      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Core Cryptographic Principles
- **PBKDF2 / Argon2 Key Splitting:** The master password is never transmitted across the wire. Instead, the client derives two distinct cryptographic artifacts:
  - **Master Key:** Stored ephemerally in client memory to decrypt the symmetric Vault Key.
  - **Login Verifier:** Sent to the server for authentication and stored as a BCrypt hash.
- **Envelope Encryption (AES-256-GCM):** Vault data is encrypted with a unique, randomly generated symmetric Vault Key. The Vault Key is stored encrypted under the Master Key.
- **Memory Hygiene & Idle Timeouts:** Decrypted vault items and master keys are automatically wiped from client memory after 15 minutes of inactivity.
- **Stateless Authorization:** Authenticated requests use short-lived JWT tokens.

For a full breakdown of threat vectors, mitigations, and cryptographic controls, see [THREAT_MODEL.md](THREAT_MODEL.md).

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (React 19), TypeScript, Tailwind CSS |
| **Backend** | [Spring Boot](https://spring.io/projects/spring-boot) (Java 21), Spring Security, Spring Data JPA |
| **Database** | [PostgreSQL 15](https://www.postgresql.org/) |
| **Cache & Sessions** | [Redis](https://redis.io/) |
| **API Documentation**| [SpringDoc OpenAPI / Swagger](https://springdoc.org/) |
| **Containerization** | [Docker](https://www.docker.com/) & Docker Compose |

---

## 📁 Project Structure

```text
Opaque/
├── backend/                       # Spring Boot Backend Application
│   ├── src/main/java/org/zalmoxis/opaque/
│   │   ├── Controllers/           # REST API Endpoints (Auth, Vault)
│   │   ├── Dtos/                  # Request/Response Data Transfer Objects
│   │   ├── Entities/              # JPA Entities (User, Role, VaultItem)
│   │   ├── Exceptions/            # Global Exception Handling
│   │   ├── Mappers/               # Entity <-> DTO Mappers
│   │   ├── Repositories/          # Spring Data Repositories
│   │   ├── Security/              # Spring Security & JWT Configuration
│   │   ├── Services/              # Business Logic & Crypto Services
│   │   └── Utils/                 # Cryptographic & Helper Utilities
│   ├── src/main/resources/        # Application configurations
│   └── pom.xml                    # Maven dependencies (Java 21)
│
├── frontend/                      # Next.js Frontend Application
│   ├── app/                       # App Router Pages & Components
│   ├── public/                    # Static Assets
│   ├── package.json               # Node dependencies & scripts
│   └── tsconfig.json              # TypeScript configuration
│
├── docker-compose.yaml            # Multi-container orchestration (DB, Redis, App)
└── THREAT_MODEL.md                # Comprehensive Security & Threat Analysis
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 21 JDK** (e.g., Eclipse Adoptium Temurin 21)
- **Node.js 20+** & **npm**
- **Docker & Docker Compose** (optional, recommended for DB & Redis)
- **Maven 3.9+**

---

### Running with Docker Compose (Recommended)

To spin up the PostgreSQL database and Redis services:

```powershell
docker compose up db redis -d
```

To run the entire stack (Frontend + DB + Redis):

```powershell
docker compose up -d
```

- **Frontend UI:** `http://localhost:3000`
- **PostgreSQL:** `localhost:5432` (User: `postgres`, Password: `password`, DB: `opaque_db`)
- **Redis:** `localhost:6379`

---

### Running Backend Locally

1. Ensure PostgreSQL and Redis are running.
2. Ensure your `JAVA_HOME` points to JDK 21:
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot"
   ```
3. Navigate to the backend directory and run:
   ```powershell
   cd backend
   mvn spring-boot:run
   ```
- **Backend API:** `http://localhost:8080`
- **Swagger UI / OpenAPI Docs:** `http://localhost:8080/swagger-ui.html`

---

### Running Frontend Locally

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

### Backend
```powershell
cd backend
mvn test
```

### Frontend
```powershell
cd frontend
npm run lint
```

---

## 📄 License

This project is licensed under the MIT License.
