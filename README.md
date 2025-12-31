# 🎟️ SaaS Event Backend

Hi there! 👋 Welcome to my **Event Management System**. 

I built this project to push my backend skills to the next level. Instead of a simple CRUD app, I wanted to build a real-world **SaaS (Software as a Service)** platform where different organizations can sign up, manage their own events, and sell tickets—all isolated from each other.

It’s not just a database wrapper; it handles **real-time updates**, **complex financial calculations**, and **security** at a production-ready standard.

---

## 🚀 What Makes This Special?

Most tutorials stop at "Create User." Here is what I added to make this robust:

### 🏢 **True Multi-Tenancy**
Just like Notion or Slack, one installation serves multiple companies.
* **Organization Isolation:** Data from "Google" and "Microsoft" never mix, even though they live in the same database.
* **Admin Powers:** Admins have a special dashboard to control their specific organization's events.

### ⚡ **It's Alive! (Real-Time)**
I didn't want users hitting "Refresh" to see updates.
* **Socket.io Integration:** If an Admin delays an event, every user looking at that page gets a popup notification *instantly*.

### 🛡️ **Fort Knox Security**
* **Zod Validation:** You can't crash the server with bad data. If the password is too short or the email is fake, the API rejects it before it even touches the logic.
* **JWT & Bcrypt:** Industry-standard authentication.

### 💰 **The "Business" Logic**
* **Revenue Analytics:** The system automatically calculates ticket sales and total revenue across multiple events.
* **Complex Data:** Handles nested relationships like `Events` -> `Sub-Events` -> `Teams` -> `Members`.

---

## 🛠️ The Tech Stack

I chose a modern, type-safe stack for this:

* **Language:** [TypeScript](https://www.typescriptlang.org/) (for rock-solid code)
* **Runtime:** [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
* **Database:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [Prisma](https://www.prisma.io/) (makes databases feel like magic)
* **Real-Time:** [Socket.io](https://socket.io/)
* **Security:** Zod, Bcrypt, JWT

---

## 🏃‍♂️ How to Run It Locally

Want to break it or test it? Follow these steps:

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/sagnikdatta2k6/saas-event-backend.git](https://github.com/sagnikdatta2k6/saas-event-backend.git)
    cd saas-event-backend
    ```

2.  **Install the goods:**
    ```bash
    npm install
    ```

3.  **Set up the secrets:**
    Create a `.env` file in the root folder and add your keys (you'll need a Postgres URL):
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
    JWT_SECRET="super_secret_key"
    PORT=3000
    ```

4.  **Sync the database:**
    ```bash
    npx prisma db push
    ```

5.  **Launch! 🚀**
    ```bash
    npm run dev
    ```

---

## 📡 API Quick Tour

Here are a few things you can do with the API (I use **Thunder Client** to test these):

* `POST /api/auth/register` - Create a new Organization & Admin.
* `POST /api/events` - Create a new concert or conference.
* `POST /api/announcements` - Blast a message to all attendees (Real-time!).
* `GET /api/analytics` - See how much money your event made.

---

### 🤝 Connect with Me

If you liked this project or have suggestions, feel free to reach out!
* **GitHub:** [sagnikdatta2k6](https://github.com/sagnikdatta2k6)
* **LinkedIn:** [sagnik-datta-coder](www.linkedin.com/in/sagnik-dattta-coder)
