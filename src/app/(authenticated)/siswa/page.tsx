"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import {
  Plus,
  Search,
  Filter,
  Users,
  GraduationCap,
  Baby,
  School,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StudentEditForm } from "@/components/siswa/student-edit-form";
import BulkOperationsModal from "@/components/bulk-operations/bulk-operations-modal";
import { ValidationRules } from "@/lib/bulk-operations";
import { StudentCreateForm } from "@/components/siswa/student-create-form";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

interface Student {
  id: string;
  nisn?: string | null;
  nis: string;
  fullName: string;
  nickname?: string | null;
  birthPlace: string;
  birthDate: Date;
  gender: string;
  bloodType?: string | null;
  address: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  fatherName: string;
  motherName: string;
  institutionType: string;
  grade?: string | null;
  enrollmentYear: string;
  status: string;
  photo?: string | null;
}

export default function SiswaPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  //const [selectedType, setSelectedType] = useState<'all' | 'TK' | 'SD' | 'PONDOK'>('all')
  const [selectedType, setSelectedType] = useState<
    "all" | "TK" | "SD" | "SMP" | "SMA"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [exportData, setExportData] = useState<any[]>([]);
  const [exportColumns, setExportColumns] = useState<any[]>([]);
  const [templateColumns, setTemplateColumns] = useState<any[]>([]);
  const [importValidationRules, setImportValidationRules] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    fetchStudents();
  }, [selectedType, currentPage]);

  useEffect(() => {
    // Load template and validation rules
    fetchTemplateInfo();
  }, []);

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedType !== "all") params.set("institutionType", selectedType);

      params.set("status", "ACTIVE");
      params.set("pages", String(currentPage+1));

      const response = await fetch(`/api/students?${params}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.data);
        setTotalPages(data.meta.totalPages);
        //
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateInfo = async () => {
    try {
      const response = await fetch("/api/import/students");
      if (response.ok) {
        const data = await response.json();

        setTemplateColumns(data.templateColumns || []);

        // Convert to validation rules format
        const rules = [
          ValidationRules.required("nisn"),
          ValidationRules.required("nis"),
          ValidationRules.required("fullName"),
          ValidationRules.required("nickname"),
          ValidationRules.required("birthPlace"),
          ValidationRules.date("birthDate", true),
          ValidationRules.gender("gender"),
          ValidationRules.required("bloodType"),
          ValidationRules.required("religion"),
          ValidationRules.required("nationality"),
          ValidationRules.required("address"),
          ValidationRules.required("village"),
          ValidationRules.required("district"),
          ValidationRules.required("city"),
          ValidationRules.required("province"),
          ValidationRules.required("postalCode"),
          ValidationRules.required("phone"),
          ValidationRules.email("email"),
          ValidationRules.required("fatherName"),
          ValidationRules.required("fatherJob", false),
          ValidationRules.required("fatherPhone", false),
          ValidationRules.required("fatherEducation", false),
          ValidationRules.required("motherName"),
          ValidationRules.required("motherJob"),
          ValidationRules.required("motherPhone"),
          ValidationRules.required("motherEducation"),
          ValidationRules.required("guardianName"),
          ValidationRules.required("guardianJob"),
          ValidationRules.required("guardianPhone"),
          ValidationRules.required("guardianRelation"),
          ValidationRules.institutionType("institutionType"),
          ValidationRules.required("grade", false),
          ValidationRules.date("enrollmentDate", true),
          ValidationRules.required("enrollmentYear"),
          ValidationRules.required("previousSchool", false),
          ValidationRules.required("specialNeeds", false),
          ValidationRules.required("status", false),
          ValidationRules.date("graduationDate", true),
          ValidationRules.date("createdAt", true),
        ];
        setImportValidationRules(rules);
      }
    } catch (error) {
      console.error("Error fetching template info:", error);
    }
  };

  const handleBulkExport = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedType !== "all") params.set("institutionType", selectedType);

      const response = await fetch(`/api/export/students?${params}`);
      if (response.ok) {
        const data = await response.json();
        setExportData(data.data || []);
        setExportColumns(data.columns || []);
        setShowBulkModal(true);
      }
    } catch (error) {
      console.error("Error preparing export:", error);
      alert("Gagal menyiapkan data export");
    }
  };

  const handleImportComplete = async (importedData: any[]) => {
    try {
      const response = await fetch("/api/import/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: importedData }),
      });

      const result = await response.json();

      if (result.success && result.validRows > 0) {
        alert(`Import berhasil! ${result.validRows} siswa telah ditambahkan.`);
        fetchStudents(); // Refresh data
      } else if (result.errors?.length > 0) {
        alert(
          `Import gagal. Error: ${result.errors.slice(0, 3).join(", ")}${
            result.errors.length > 3 ? "..." : ""
          }`
        );
      }
    } catch (error) {
      console.error("Error importing students:", error);
      alert("Gagal mengimpor data siswa");
    }
  };

  const filteredStudents = (students || []).filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nis.includes(searchTerm) ||
      (student.nisn && student.nisn.includes(searchTerm));
    return matchesSearch;
  });

  const stats = {
    tk: (students || []).filter((s) => s.institutionType === "TK").length,
    sd: (students || []).filter((s) => s.institutionType === "SD").length,
    smp: (students || []).filter((s) => s.institutionType === "SMP").length,
    sma: (students || []).filter((s) => s.institutionType === "SMA").length,
    //pondok: (students || []).filter(s => s.institutionType === 'PONDOK').length,
    total: (students || []).length,
  };


  const handlePageChange = (page : number) =>{
      if (page >= 1 && page <= totalPages)  {
          setCurrentPage(page);
      }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Manajemen Siswa" />

      <main className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Siswa</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card> */}

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">TK</p>
                  <p className="text-2xl font-bold">{stats.tk}</p>
                </div>
                <Baby className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">SD</p>
                  <p className="text-2xl font-bold">{stats.sd}</p>
                </div>
                <School className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/*<Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pondok</p>
                  <p className="text-2xl font-bold">{stats.pondok}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>*/}

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">SMP</p>
                  <p className="text-2xl font-bold">{stats.smp}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">SMA</p>
                  <p className="text-2xl font-bold">{stats.sma}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari nama, NIS, atau NISN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Filter by Institution */}
              <div className="flex gap-2">
                {
                  /*(['all', 'TK', 'SD', 'PONDOK'] as const).map((type) => (*/
                  (["all", "TK", "SD", "SMP", "SMA"] as const).map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className={
                        selectedType === type
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                    >
                      {type === "all" ? "Semua" : type}
                    </Button>
                  ))
                }
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleBulkExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export / Import
              </Button>

              <Button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Siswa
              </Button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIS / NISN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institusi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    L/P
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orang Tua
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Tidak ada data siswa
                    </td>
                  </tr>
                ) : (
                  (filteredStudents || []).map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                          {/* {student.photo ? (
                            <img src={student.photo} alt={student.fullName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-gray-500" />
                          )} */}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {student.nis}
                          </p>
                          {student.nisn && (
                            <p className="text-xs text-gray-500">
                              {student.nisn}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {student.fullName}
                          </p>
                          {student.nickname && (
                            <p className="text-xs text-gray-500">
                              ({student.nickname})
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            student.institutionType === "TK"
                              ? "bg-yellow-100 text-yellow-800"
                              : student.institutionType === "SD"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {student.institutionType}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {student.grade || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {student.gender === "MALE" ? "L" : "P"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            Ayah: {student.fatherName}
                          </p>
                          <p className="text-gray-500">
                            Ibu: {student.motherName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            student.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : student.status === "GRADUATED"
                              ? "bg-blue-100 text-blue-800"
                              : student.status === "TRANSFERRED"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status === "ACTIVE"
                            ? "Aktif"
                            : student.status === "GRADUATED"
                            ? "Lulus"
                            : student.status === "TRANSFERRED"
                            ? "Pindah"
                            : "Keluar"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedStudent(student)}
                            className="h-8 w-8"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingStudent(student);
                              setShowEditForm(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {/* <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

            {/* Pagination */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) handlePageChange(currentPage - 1);
                            }}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>

                    {/* Simple page links (can be enhanced with ellipsis logic) */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(page);
                                }}
                                isActive={currentPage === page}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) handlePageChange(currentPage + 1);
                            }}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            {/* end pagination */}
        </div>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">Detail Siswa</h2>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSelectedStudent(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Photo and Basic Info */}
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                      {selectedStudent.photo ? (
                        <img
                          src={selectedStudent.photo}
                          alt={selectedStudent.fullName}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {selectedStudent.fullName}
                      </h3>
                      {selectedStudent.nickname && (
                        <p className="text-sm text-gray-600">
                          Panggilan: {selectedStudent.nickname}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        NIS: {selectedStudent.nis}
                      </p>
                      {selectedStudent.nisn && (
                        <p className="text-sm text-gray-600">
                          NISN: {selectedStudent.nisn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h4 className="font-semibold mb-2">Informasi Pribadi</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Jenis Kelamin:</span>
                        <span className="ml-2">
                          {selectedStudent.gender === "MALE"
                            ? "Laki-laki"
                            : "Perempuan"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Golongan Darah:</span>
                        <span className="ml-2">
                          {selectedStudent.bloodType || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tempat Lahir:</span>
                        <span className="ml-2">
                          {selectedStudent.birthPlace}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tanggal Lahir:</span>
                        <span className="ml-2">
                          {formatDate(selectedStudent.birthDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold mb-2">Informasi Kontak</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>
                          {selectedStudent.address}, {selectedStudent.city}
                        </span>
                      </div>
                      {selectedStudent.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{selectedStudent.phone}</span>
                        </div>
                      )}
                      {selectedStudent.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{selectedStudent.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div>
                    <h4 className="font-semibold mb-2">Informasi Orang Tua</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Nama Ayah:</p>
                        <p className="font-medium">
                          {selectedStudent.fatherName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Nama Ibu:</p>
                        <p className="font-medium">
                          {selectedStudent.motherName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h4 className="font-semibold mb-2">Informasi Akademik</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Institusi:</span>
                        <span className="ml-2">
                          {selectedStudent.institutionType}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Kelas:</span>
                        <span className="ml-2">
                          {selectedStudent.grade || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tahun Masuk:</span>
                        <span className="ml-2">
                          {selectedStudent.enrollmentYear}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className="ml-2">{selectedStudent.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setSelectedStudent(null)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Student Form Sidebar */}
        {showForm && (
          <StudentCreateForm
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
            }}
            onSubmit={async (updatedData) => {
              const response = await fetch(`/api/students`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.error || "Gagal memperbarui data siswa"
                );
              }

              setShowForm(false);
            }}
          />
        )}

        {/* Edit Student Form Sidebar */}
        {editingStudent && (
          <StudentEditForm
            student={editingStudent}
            isOpen={showEditForm}
            onClose={() => {
              setShowEditForm(false);
              setEditingStudent(null);
            }}
            onSubmit={async (updatedData) => {
              const response = await fetch(
                `/api/students/${editingStudent.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedData),
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.error || "Gagal memperbarui data siswa"
                );
              }

              const updatedStudent = await response.json();
              setStudents(
                (students || []).map((s) =>
                  s.id === editingStudent.id ? updatedStudent : s
                )
              );
              setShowEditForm(false);
              setEditingStudent(null);
            }}
          />
        )}

        {/* Bulk Operations Modal */}
        <BulkOperationsModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          title="Data Siswa"
          exportData={exportData}
          exportColumns={exportColumns}
          importValidationRules={importValidationRules}
          templateColumns={templateColumns}
          onImportComplete={handleImportComplete}
        />
      </main>
    </div>
  );
}
