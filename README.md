# 🚀 TeamSync RE — Real Estate Team Management Platform

TeamSync RE is a full-stack real estate productivity and accountability platform designed for individual Realtors, smaller teams, and boutique brokerages that need more structure without the complexity of enterprise-level software.

The application helps teams manage users, properties, goals, commissions, announcements, events, saved AI drafts, and dashboard activity from one centralized system.

> **Core idea:** TeamSync RE is not just a CRM. It is a productivity and accountability system built to help real estate professionals stay organized, take consistent action, and improve team visibility.

---

## 📌 Project Vision

Real estate professionals often rely on disconnected tools for communication, goal tracking, commission planning, and transaction updates. This creates gaps in accountability and makes it harder for new or low-producing agents to stay consistent.

TeamSync RE is designed to solve that by providing:

- Centralized team dashboards
- Role-based access for admins and users
- Goal and commission tracking
- Property assignment visibility
- Team announcements and events
- AI-assisted draft generation for real estate communication
- Future scalability for white-label SaaS use

---

## 🧠 Capstone Requirement Alignment

This project demonstrates the following capstone-level technical requirements:

| Requirement | How TeamSync RE Meets It |
|---|---|
| Full-stack application | React frontend + Spring Boot backend |
| Backend framework | Java Spring Boot REST API |
| Frontend framework | React with Axios API communication |
| Database integration | MySQL with Spring Data JPA / Hibernate |
| CRUD operations | Users, properties, goals, announcements, events, commissions, AI drafts |
| API testing | Endpoints tested with Postman |
| Security | Spring Security, role-based access, BCrypt password handling |
| External API integration | OpenAI API integration for AI-generated drafts |
| Real-world use case | Built around real estate team operations and agent productivity |

---

## 🛠️ Tech Stack

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- MySQL
- Maven
- Lombok

### Frontend

- React
- Vite
- JavaScript
- Axios
- React Router
- CSS

### Tools

- IntelliJ IDEA
- VS Code
- MySQL Workbench
- Postman
- Git / GitHub

---

## 🏗️ Project Structure

Your local folder names may vary slightly, but the project is structured like this:

```text
TeamSyncCapstone/
├── teamsync-re-backend/        # Spring Boot backend API
│   ├── src/main/java
│   ├── src/main/resources
│   │   └── application.properties
│   └── pom.xml
│
├── teamsync-re-frontend/       # React frontend app
│   ├── src
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

If your frontend folder has a different name, use that folder name when running the frontend commands.

---

## ✅ Current Features

### Admin Dashboard

- View team summary data
- Manage users
- Manage announcements
- Manage goals
- Manage events
- Manage properties
- View commission data
- View saved AI drafts

### User / Agent Dashboard

- View assigned properties
- View goals
- View announcements
- View events
- View commission scenarios
- Submit or view AI-generated drafts

### AI Draft Feature

The AI draft feature uses structured real estate inputs to generate useful communication drafts for agents and teams.

Example use cases:

- Listing announcement
- Buyer follow-up
- Seller update
- Social media caption
- Client communication draft
- Productivity-focused real estate messaging

The AI logic is handled in the backend service layer so the API key is not exposed in the frontend.

---

## 🔐 Important Security Note

Do **not** commit real API keys, database passwords, or secrets to GitHub.

Use environment variables for sensitive values such as the OpenAI API key.

Correct example:

```properties
openai.api.key=${OPENAI_API_KEY}
```

Incorrect example:

```properties
openai.api.key=sk-your-real-key-here
```

If a key is accidentally committed, revoke it immediately and remove it from Git history before pushing again.

---

# 🚧 Local Setup Instructions

Follow these steps to run the project locally.

---

## 1. Prerequisites

Before running the project, install the following:

- Java 17
- Maven
- Node.js and npm
- MySQL Server
- MySQL Workbench
- Git
- IntelliJ IDEA or VS Code
- Postman, optional but recommended

Check versions from the terminal:

```bash
java -version
mvn -version
node -v
npm -v
mysql --version
```

---

## 2. Clone the Repository

```bash
git clone https://github.com/CeceB26/TeamSyncCapstone.git
cd TeamSyncCapstone
```

---

# ⚙️ Backend Setup — Spring Boot

## 3. Open the Backend Project

Open the backend folder in IntelliJ:

```text
teamsync-re-backend
```

Make sure IntelliJ is using **Java 17**.

In IntelliJ:

```text
File → Project Structure → Project SDK → Java 17
```

---

## 4. Create the MySQL Database

Open MySQL Workbench and run:

```sql
CREATE DATABASE teamsync_re_db;
```

Optional check:

```sql
SHOW DATABASES;
```

---

## 5. Configure `application.properties`

Open:

```text
teamsync-re-backend/src/main/resources/application.properties
```

Use this configuration:

```properties
spring.application.name=teamsync-re-backend

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/teamsync_re_db
spring.datasource.username=root
spring.datasource.password=YOUR_LOCAL_MYSQL_PASSWORD

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

# OpenAI API
openai.api.key=${OPENAI_API_KEY}
openai.model=gpt-4.1-mini

# Server
server.port=8080
```

Replace:

```text
YOUR_LOCAL_MYSQL_PASSWORD
```

with your local MySQL password.

Do **not** commit your real password to GitHub.

---

## 6. Add the OpenAI API Key as an Environment Variable

The backend expects an environment variable named:

```text
OPENAI_API_KEY
```

### IntelliJ Setup

1. Go to **Run → Edit Configurations**
2. Select the Spring Boot backend configuration
3. Find **Environment variables**
4. Add:

```text
OPENAI_API_KEY=your_openai_api_key_here
```

5. Click **Apply**
6. Restart the backend

The code reads this value through:

```properties
openai.api.key=${OPENAI_API_KEY}
```

This keeps the API key out of the codebase.

---

## 7. Install Backend Dependencies

From the backend folder:

```bash
cd teamsync-re-backend
mvn clean install
```

If you are using the Maven wrapper:

```bash
./mvnw clean install
```

On Windows PowerShell:

```powershell
.\mvnw clean install
```

---

## 8. Run the Backend

From the backend folder:

```bash
mvn spring-boot:run
```

Or with Maven wrapper:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw spring-boot:run
```

The backend should start at:

```text
http://localhost:8080
```

Successful startup usually includes:

```text
Tomcat started on port 8080
Started TeamsyncReBackendApplication
```

---

# 🎨 Frontend Setup — React

## 9. Open the Frontend Project

Open the frontend folder in VS Code or IntelliJ.

Example:

```bash
cd teamsync-re-frontend
```

If your folder name is different, use your actual frontend folder name.

---

## 10. Install Frontend Dependencies

From the frontend folder:

```bash
npm install
```

---

## 11. Confirm Backend API URL

The frontend should call the backend at:

```text
http://localhost:8080
```

If you have an API service file, confirm the base URL looks similar to this:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

Or in Axios calls:

```javascript
axios.get("http://localhost:8080/api/dashboard/admin-summary")
```

---

## 12. Run the React Frontend

For Vite React projects:

```bash
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

If your project uses Create React App instead of Vite, run:

```bash
npm start
```

---

# 🔄 Running the Full Application Locally

Use two terminals.

## Terminal 1 — Backend

```bash
cd teamsync-re-backend
mvn spring-boot:run
```

## Terminal 2 — Frontend

```bash
cd teamsync-re-frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 📡 Common API Endpoints

These endpoints may vary slightly depending on the current build, but common examples include:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard/admin-summary` | Admin dashboard summary |
| GET | `/api/dashboard/user/{userId}` | User dashboard data |
| GET | `/api/users` | Get users |
| POST | `/api/announcements` | Create announcement |
| GET | `/api/announcements` | Get announcements |
| POST | `/api/goals` | Create goal |
| GET | `/api/goals` | Get goals |
| POST | `/api/events` | Create event |
| GET | `/api/events` | Get events |
| POST | `/api/properties` | Create property |
| GET | `/api/properties` | Get properties |
| POST | `/api/commission-scenarios` | Save commission scenario |
| GET | `/api/commission-scenarios/user/{userId}` | Get user commission scenarios |
| POST | `/api/ai-drafts` | Generate and save AI draft |
| GET | `/api/ai-drafts/user/{userId}` | Get saved AI drafts by user |

---

# 🧪 Testing with Postman

## Example: Test Backend Health

Start backend and open:

```text
http://localhost:8080
```

If there is no homepage, that is okay. Test a real API endpoint instead.

## Example: Create AI Draft

Method:

```text
POST
```

URL:

```text
http://localhost:8080/api/ai-drafts
```

Headers:

```text
Content-Type: application/json
```

Body:

```json
{
  "taskType": "Social Media Post",
  "audience": "First-time buyers",
  "tone": "Professional and encouraging",
  "propertyAddress": "5388 Town Hill Dr",
  "cityState": "Canal Winchester, OH",
  "pricePoint": "$399,900",
  "bedsBaths": "4 beds / 2.5 baths",
  "propertyType": "Single-family home",
  "transactionStage": "Active listing",
  "callToAction": "Schedule a showing today",
  "context": "Highlight tax abatement and community amenities",
  "submittedByUserId": 1
}
```

Expected result:

- A saved AI draft record
- Generated `outputText`
- Draft saved in MySQL
- Only the 5 most recent drafts retained per user

---

# 🤖 AI Feature Technical Explanation

The AI feature is powered by the OpenAI API.

The application is **not training a custom AI model from scratch**. Instead, it uses prompt engineering and structured backend logic to guide the AI response.

## AI Request Flow

```text
React Form
   ↓
POST /api/ai-drafts
   ↓
AiDraftController
   ↓
AiDraftService
   ↓
Build structured real estate prompt
   ↓
OpenAI API
   ↓
Generated response saved to MySQL
   ↓
Returned to frontend
```

## Why AI Logic Is in the Backend

- Protects the OpenAI API key
- Keeps prompt logic centralized
- Prevents exposing business rules in the frontend
- Allows responses to be stored and reused
- Supports future admin review or approval workflows

---

# 🔐 Security Notes

Current security concepts include:

- Spring Security configuration
- Role-based access structure
- BCrypt password hashing
- Admin and user dashboard separation
- Environment variables for sensitive API keys

Planned production improvements:

- JWT authentication
- HTTPS enforcement
- Token expiration and refresh flow
- Stronger endpoint authorization
- Production secret manager

---

# 🧯 Troubleshooting

## Backend will not start: `Could not resolve placeholder 'openai.api.key'`

Cause:

```text
OPENAI_API_KEY is not set
```

Fix:

- Add `OPENAI_API_KEY` in IntelliJ environment variables
- Restart backend

---

## Backend will not connect to MySQL

Check:

- MySQL server is running
- Database exists:

```sql
CREATE DATABASE teamsync_re_db;
```

- Username and password are correct in `application.properties`

---

## Frontend cannot reach backend

Check:

- Backend is running on port `8080`
- Frontend is running on port `5173`
- Axios base URL points to:

```text
http://localhost:8080/api
```

- CORS allows:

```text
http://localhost:5173
```

---

## Port 8080 already in use

Either stop the process using port 8080 or change:

```properties
server.port=8081
```

Then update frontend API URLs if needed.

---

## GitHub blocks push because of OpenAI API key

Cause:

A real API key was committed.

Fix:

1. Revoke the exposed key in OpenAI
2. Remove it from `application.properties`
3. Use:

```properties
openai.api.key=${OPENAI_API_KEY}
```

4. Amend or clean the commit before pushing
5. Never approve pushing the secret to GitHub

---

# 📈 Future Enhancements

- JWT authentication
- Cloud deployment
- Docker setup
- Multi-tenant brokerage/team support
- Subscription billing
- Advanced analytics dashboard
- AI productivity scoring
- AI lead follow-up suggestions
- Admin approval workflow for user-generated content
- White-label branding for brokerages and teams

---

# 👩‍💻 Author

**CestWaila “Cece” Beck**  
Realtor | Credit Specialist | Full-Stack Developer

Focused on building tools that create ownership, structure, accountability, and generational impact.

---

# 🧠 Final Thought

TeamSync RE is more than a capstone project. It is a real-world software solution designed around the operational gaps that smaller real estate teams, boutique brokerages, and individual agents face every day.
