"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AcademicYear {
  id: string;
  name: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  description?: string;
}

export default function YearsPage() {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [formData, setFormData] = useState<AcademicYear>({
    id: "",
    name: "",
    isActive: true,
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);

      const mockAcademicYears: AcademicYear[] = [
        {
          id: "1",
          name: "2023/2024",
          startDate: new Date("2023-08-01"),
          endDate: new Date("2024-06-30"),
          isActive: true,
          description: "Tahun ajaran 2023/2024",
        },
        {
          id: "2",
          name: "2025/2026",
          startDate: new Date("2025-08-01"),
          endDate: new Date("2026-06-30"),
          isActive: false,
          description: "Tahun ajaran 2025/2026",
        },
      ];

      setAcademicYears(mockAcademicYears);

      const response = await fetch("/api/academic/years");
      if (response.ok) {
        // const data = await response.json();
        // setAcademicYears(data);
      }
    } catch (error) {
      console.error("Error fetching academic years:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      isActive: true,
      startDate: new Date(),
      endDate: new Date(),
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/academic/years";

      const method = editingYear ? "PUT" : "POST";
      const payload = editingYear ? { ...formData } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success(
          `Akademik berhasil ${editingYear ? "diperbarui" : "ditambahkan"}`
        );
        fetchAcademicYears();
        resetForm();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error: any) {
      toast.error("Error");
    }
  };

  const handleEdit = (academicYear: AcademicYear) => {
    setFormData({
      id: academicYear.id,
      name: academicYear.name,
      description: academicYear.description,
      isActive: academicYear.isActive,
      startDate: academicYear.startDate,
      endDate: academicYear.endDate,
    });
    setEditingYear(academicYear);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus akademik ini?")) {
      return;
    }
    try {
      const response = await fetch(`/api/academic/years?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.info("Berhasil: Tahun akademik berhasil dihapus");
        fetchAcademicYears();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error: any) {
      toast.error("Error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Kelola Tahun Akademik
          </h1>
          <p className="text-gray-600 mt-2">Manajemen Tahun Akademik</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tahun Akademik</span>
        </Button>
      </div>

      {/* Academic Years List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-4 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-12 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </Card>
            ))
          : academicYears.map((academicYear) => (
              <Card key={academicYear.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {academicYear.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {academicYear.description}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(academicYear)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(academicYear.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant={academicYear.isActive ? "default" : "secondary"}
                  >
                    {academicYear.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
              </Card>
            ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Tambah Tahun Akademik
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tahun *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="contoh: 2023/2024"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Keterangan
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Keterangan tambahan..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1">
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
