"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  student_number: string;
  address?: string;
  created_at: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    student_number: "",
    address: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchStudents();
    }
  }, [status, router]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/students");
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data.students);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await fetch(`/api/students/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to update student");
        await fetchStudents();
        setEditingId(null);
      } else {
        const response = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to create student");
        await fetchStudents();
      }
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        student_number: "",
        address: "",
      });
      setShowForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      phone: student.phone || "",
      date_of_birth: student.date_of_birth || "",
      student_number: student.student_number,
      address: student.address || "",
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete student");
      await fetchStudents();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Student Management System</h1>
            <p className="text-blue-100">Welcome, {session?.user?.name}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Students</h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (editingId) setEditingId(null);
              if (!showForm)
                setFormData({
                  first_name: "",
                  last_name: "",
                  email: "",
                  phone: "",
                  date_of_birth: "",
                  student_number: "",
                  address: "",
                });
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition font-semibold"
          >
            {showForm ? "Cancel" : "Add Student"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "Edit Student" : "Add New Student"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Student Number"
                  value={formData.student_number}
                  onChange={(e) =>
                    setFormData({ ...formData, student_number: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded"
                />
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded"
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded"
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition font-semibold"
              >
                {editingId ? "Update Student" : "Add Student"}
              </button>
            </form>
          </div>
        )}

        {/* Students Table */}
        {loading ? (
          <div className="text-center py-8">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No students yet. Add one to get started!
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Student #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-6 py-3">{student.email}</td>
                    <td className="px-6 py-3">{student.student_number}</td>
                    <td className="px-6 py-3">{student.phone || "-"}</td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleEdit(student)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
