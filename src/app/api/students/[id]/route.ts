import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDatabase, saveDatabase } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDatabase();
    const user = db.users.find((u) => u.email === session.user.email);

    const student = db.students.find(
      (s) => s.id === parseInt(params.id) && s.user_id === user?.id
    );

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error: any) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDatabase();
    const user = db.users.find((u) => u.email === session.user.email);

    const studentIdx = db.students.findIndex(
      (s) => s.id === parseInt(params.id) && s.user_id === user?.id
    );

    if (studentIdx === -1) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
    } = body;

    const student = db.students[studentIdx];
    db.students[studentIdx] = {
      ...student,
      first_name: first_name || student.first_name,
      last_name: last_name || student.last_name,
      email: email || student.email,
      phone: phone !== undefined ? phone : student.phone,
      date_of_birth: date_of_birth || student.date_of_birth,
      address: address !== undefined ? address : student.address,
      updated_at: new Date().toISOString(),
    };

    saveDatabase();

    return NextResponse.json({ student: db.students[studentIdx] });
  } catch (error: any) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: error.message || "Error updating student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDatabase();
    const user = db.users.find((u) => u.email === session.user.email);

    const studentIdx = db.students.findIndex(
      (s) => s.id === parseInt(params.id) && s.user_id === user?.id
    );

    if (studentIdx === -1) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    db.students.splice(studentIdx, 1);
    saveDatabase();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: error.message || "Error deleting student" },
      { status: 500 }
    );
  }
}
