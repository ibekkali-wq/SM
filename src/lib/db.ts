import fs from "fs";
import path from "path";

interface Database {
  users: any[];
  students: any[];
}

let db: Database | null = null;

function getDbPath() {
  return path.join(process.cwd(), "db", "data.json");
}

export function getDatabase() {
  if (!db) {
    const dbPath = getDbPath();

    // Create db directory if it doesn't exist
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Load or create database file
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8");
      db = JSON.parse(data);
    } else {
      db = { users: [], students: [] };
      initializeDatabase();
    }
  }
  return db;
}

function initializeDatabase() {
  if (!db) return;

  const dbPath = getDbPath();

  // Create admin user if not exists
  const adminExists = db.users.some((u) => u.email === "admin@example.com");
  if (!adminExists) {
    db.users.push({
      id: 1,
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
      created_at: new Date().toISOString(),
    });
  }

  saveDatabase();
}

export function saveDatabase() {
  if (!db) return;
  const dbPath = getDbPath();
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function closeDatabase() {
  db = null;
}

// Helper functions to mimic database query methods
export function createQueryInterface(db: Database) {
  return {
    prepare: (sql: string) => ({
      get: (param: any) => {
        if (sql.includes("SELECT * FROM users WHERE email")) {
          return db.users.find((u) => u.email === param);
        }
        if (sql.includes("SELECT * FROM students WHERE")) {
          if (sql.includes("user_id = ?")) {
            return db.students.find((s) => s.user_id === param);
          }
          if (sql.includes("WHERE id = ? AND user_id")) {
            return null; // Handled in route
          }
        }
        return null;
      },
      all: (param: any) => {
        if (sql.includes("SELECT * FROM students WHERE user_id")) {
          return db.students.filter((s) => s.user_id === param);
        }
        return [];
      },
      run: (params: any[]) => {
        let lastInsertRowid = 0;
        if (sql.includes("INSERT INTO users")) {
          const id =
            Math.max(...db.users.map((u) => u.id || 0), 0) + 1;
          db.users.push({
            id,
            email: params[0],
            password: params[1],
            name: params[2],
            created_at: new Date().toISOString(),
          });
          lastInsertRowid = id;
        } else if (sql.includes("INSERT INTO students")) {
          const id =
            Math.max(...db.students.map((s) => s.id || 0), 0) + 1;
          db.students.push({
            id,
            user_id: params[0],
            first_name: params[1],
            last_name: params[2],
            email: params[3],
            phone: params[4],
            date_of_birth: params[5],
            student_number: params[6],
            address: params[7],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          lastInsertRowid = id;
        } else if (sql.includes("UPDATE students")) {
          const idx = db.students.findIndex((s) => s.id === params[6]);
          if (idx !== -1) {
            db.students[idx] = {
              ...db.students[idx],
              first_name: params[0],
              last_name: params[1],
              email: params[2],
              phone: params[3],
              date_of_birth: params[4],
              address: params[5],
              updated_at: new Date().toISOString(),
            };
          }
        } else if (sql.includes("DELETE FROM students")) {
          db.students = db.students.filter(
            (s) => !(s.id === params[0] && s.user_id === params[1])
          );
        }
        saveDatabase();
        return { lastInsertRowid };
      },
    }),
    exec: () => {},
    pragma: () => {},
  };
}

