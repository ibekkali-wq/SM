import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDatabase, saveDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDatabase();
    const user = db.users.find((u) => u.email === session.user!.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const students = db.students.filter((s) => s.user_id === user.id);

    return NextResponse.json({ students });
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching students" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDatabase();
    const user = db.users.find((u) => u.email === session.user!.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      student_number,
      address,
    } = body;

    if (!first_name || !last_name || !email || !student_number) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if student_number already exists
    const exists = db.students.some((s) => s.student_number === student_number);
    if (exists) {
      return NextResponse.json(
        { error: "Student number already exists" },
        { status: 400 }
      );
    }

    const id = Math.max(...db.students.map((s) => s.id || 0), 0) + 1;
    const student = {
      id,
      user_id: user.id,
      first_name,
      last_name,
      email,
      phone: phone || null,
      date_of_birth: date_of_birth || null,
      student_number,
      address: address || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.students.push(student);
    saveDatabase();

    return NextResponse.json({ student }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: error.message || "Error creating student" },
      { status: 500 }
    );
  }
}

