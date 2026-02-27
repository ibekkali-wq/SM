import { NextRequest, NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Check if user already exists
    const existingUser = db.users.find((u) => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const id = Math.max(...db.users.map((u) => u.id || 0), 0) + 1;
    const user = {
      id,
      email,
      password,
      name,
      created_at: new Date().toISOString(),
    };

    db.users.push(user);
    saveDatabase();

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id,
          email,
          name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: error.message || "Error registering user" },
      { status: 500 }
    );
  }
}
