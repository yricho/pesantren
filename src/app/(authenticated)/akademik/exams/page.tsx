"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Users,
  FileText,
  Award,
  AlertCircle,
} from "lucide-react";

interface Exam {
  id: string;
  name: string;
  code?: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  room?: string;
  maxScore: number;
  minScore: number;
  passingScore: number;
  instructions?: string;
  materials: string;
  status: string;
  isPublished: boolean;
  subject: {
    id: string;
    code: string;
    name: string;
    nameArabic?: string;
  };
  class: {
    id: string;
    name: string;
    grade: string;
    level: string;
  };
  semester: {
    id: string;
    name: string;
    academicYear: {
      name: string;
    };
  };
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    results: number;
  };
}

interface ExamFormData {
  name: string;
  code: string;
  type: string;
  subjectId: string;
  classId: string;
  semesterId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  room: string;
  maxScore: number;
  minScore: number;
  passingScore: number;
  instructions: string;
  materials: string[];
}

const EXAM_TYPES = {
  UTS: { label: "UTS (Ujian Tengah Semester)", color: "bg-blue-500" },
  UAS: { label: "UAS (Ujian Akhir Semester)", color: "bg-red-500" },
  QUIZ: { label: "Kuis", color: "bg-green-500" },
  PRAKTIK: { label: "Ujian Praktik", color: "bg-purple-500" },
  UJIAN_HARIAN: { label: "Ujian Harian", color: "bg-orange-500" },
};

const EXAM_STATUS = {
  SCHEDULED: { label: "Terjadwal", color: "bg-blue-500", icon: Calendar },
  ONGOING: { label: "Berlangsung", color: "bg-yellow-500", icon: Clock },
  COMPLETED: { label: "Selesai", color: "bg-green-500", icon: Award },
  CANCELLED: { label: "Dibatalkan", color: "bg-red-500", icon: AlertCircle },
};

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  const [formData, setFormData] = useState<ExamFormData>({
    name: "",
    code: "",
    type: "",
    subjectId: "",
    classId: "",
    semesterId: "",
    teacherId: "", // TODO: use mock teacher id for testing
    date: "",
    startTime: "",
    endTime: "",
    duration: 120,
    room: "",
    maxScore: 100,
    minScore: 50,
    passingScore: 60,
    instructions: "",
    materials: [],
  });

  useEffect(() => {
    fetchExams();
    fetchClasses();
    fetchSubjects();
    fetchSemesters();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType) params.append("type", selectedType);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/academic/exams?${params}`);
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Error: Gagal memuat data ujian");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/academic/subjects");
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Error: Gagal memuat data mata pelajaran");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/academic/classes");
      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Error: Gagal memuat data kelas");
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedAcademicYear)
        params.append("academicYearId", selectedAcademicYear);
      if (selectedStatus === "active") params.append("active", "true");

      const response = await fetch(`/api/academic/semesters?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSemesters(data || []);
      }
    } catch (error) {
      console.error("Error fetching semesters:", error);
      toast.error("Gagal memuat data semester");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingExam ? "/api/academic/exams" : "/api/academic/exams";

      const method = editingExam ? "PUT" : "POST";
      const payload = editingExam
        ? { id: editingExam.id, ...formData, materials: formData.materials }
        : { ...formData, materials: formData.materials };

      payload.teacherId = "cmgizoh0b0000raxnpdz68h83"; // TODO: change to teacher id

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          `Ujian berhasil ${editingExam ? "diperbarui" : "ditambahkan"}`
        );

        fetchExams();
        resetForm();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error: any) {
      toast.error("Error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ujian ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/academic/exams?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.info("Berhasil: Ujian berhasil dihapus");
        fetchExams();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error: any) {
      toast.error("Error");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      type: "UTS",
      subjectId: "",
      classId: "",
      semesterId: "",
      teacherId: "",
      date: "",
      startTime: "",
      endTime: "",
      duration: 120,
      room: "",
      maxScore: 100,
      minScore: 0,
      passingScore: 60,
      instructions: "",
      materials: [],
    });
    setEditingExam(null);
    setShowForm(false);
  };

  const handleEdit = (exam: Exam) => {
    const materials = Array.isArray(exam.materials)
      ? exam.materials
      : exam.materials
        ? JSON.parse(exam.materials)
        : [];

    setFormData({
      name: exam.name,
      code: exam.code || "",
      type: exam.type,
      subjectId: exam.subject.id,
      classId: exam.class.id,
      semesterId: exam.semester.id,
      teacherId: exam.teacher.id,
      date: exam.date.split("T")[0],
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration,
      room: exam.room || "",
      maxScore: exam.maxScore,
      minScore: exam.minScore,
      passingScore: exam.passingScore,
      instructions: exam.instructions || "",
      materials,
    });
    setEditingExam(exam);
    setShowForm(true);
  };

  const addMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, ""],
    }));
  };

  const updateMaterial = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.class.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const upcomingExams = filteredExams.filter(
    (exam) => new Date(exam.date) >= new Date() && exam.status === "SCHEDULED"
  );

  const completedExams = filteredExams.filter(
    (exam) => exam.status === "COMPLETED"
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ujian</h1>
          <p className="text-gray-600 mt-2">Kelola jadwal ujian dan hasil</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Ujian</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{filteredExams.length}</p>
              <p className="text-sm text-gray-600">Total Ujian</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingExams.length}</p>
              <p className="text-sm text-gray-600">Akan Datang</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedExams.length}</p>
              <p className="text-sm text-gray-600">Selesai</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {filteredExams.reduce(
                  (sum, exam) => sum + exam._count.results,
                  0
                )}
              </p>
              <p className="text-sm text-gray-600">Total Hasil</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Cari ujian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              fetchExams();
            }}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Jenis</option>
            {Object.entries(EXAM_TYPES).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              fetchExams();
            }}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            {Object.entries(EXAM_STATUS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>

          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter Lainnya</span>
          </Button>
        </div>
      </Card>

      {/* Exams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
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
        ) : filteredExams.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-8 text-center">
              <ClipboardCheck className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum Ada Ujian
              </h3>
              <p className="text-gray-600 mb-4">
                Belum ada ujian yang dijadwalkan
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Ujian
              </Button>
            </Card>
          </div>
        ) : (
          filteredExams.map((exam) => {
            const examType = EXAM_TYPES[exam.type as keyof typeof EXAM_TYPES];
            const examStatus =
              EXAM_STATUS[exam.status as keyof typeof EXAM_STATUS];
            const StatusIcon = examStatus?.icon;

            return (
              <Card key={exam.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{exam.name}</h3>
                    {exam.code && (
                      <p className="text-sm text-gray-600 font-mono">
                        {exam.code}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(exam)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(exam.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={`${examType?.color} text-white`}>
                    {examType?.label}
                  </Badge>

                  <Badge className={`${examStatus?.color} text-white`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {examStatus?.label}
                  </Badge>

                  {exam.isPublished && (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-700"
                    >
                      Dipublikasi
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mata Pelajaran:</span>
                    <span className="font-medium">{exam.subject.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Kelas:</span>
                    <span className="font-medium">{exam.class.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="font-medium">
                      {new Date(exam.date).toLocaleDateString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Waktu:</span>
                    <span className="font-medium">
                      {exam.startTime} - {exam.endTime}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Durasi:</span>
                    <span className="font-medium">{exam.duration} menit</span>
                  </div>

                  {exam.room && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ruangan:</span>
                      <span className="font-medium">{exam.room}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Pengawas:</span>
                    <span className="font-medium text-xs">
                      {exam.teacher.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-xs text-gray-600">Nilai Maksimal</p>
                    <p className="font-semibold text-blue-600">
                      {exam.maxScore}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-xs text-gray-600">Batas Lulus</p>
                    <p className="font-semibold text-green-600">
                      {exam.passingScore}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Detail
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    Hasil ({exam._count.results})
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingExam ? "Edit Ujian" : "Tambah Ujian Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nama Ujian *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="contoh: UTS Matematika Semester 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Kode Ujian
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, code: e.target.value }))
                    }
                    placeholder="contoh: UTS-MTK-2024-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Jenis Ujian *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, type: e.target.value }))

                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Object.entries(EXAM_TYPES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ruangan
                  </label>
                  <Input
                    value={formData.room}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, room: e.target.value }))
                    }
                    placeholder="contoh: A1, Lab IPA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kelas</label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value)

                    setFormData((prev) => ({
                      ...prev,
                      classId: e.target.value
                    }))
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Kelas</option>
                  {classes.length > 0 &&
                    classes.map((classItem: any) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subjects</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value)
                    setFormData((prev) => ({
                      ...prev,
                      subjectId: e.target.value
                    }))
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {subjects.length > 0 &&
                    subjects.map((subject: any) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                </select>
              </div>

              <select
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value)
                  setFormData((prev) => ({
                    ...prev,
                    semesterId: e.target.value
                  }))
                }}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semester</option>
                {semesters.map((semester: any) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tanggal *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Jam Mulai *
                  </label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Jam Selesai *
                  </label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Durasi (menit)
                  </label>
                  <Input
                    type="number"
                    min="15"
                    max="300"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nilai Maksimal
                  </label>
                  <Input
                    type="number"
                    min="10"
                    max="1000"
                    value={formData.maxScore}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxScore: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nilai Minimum
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.minScore}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minScore: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Batas Lulus
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={formData.maxScore}
                    value={formData.passingScore}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        passingScore: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Petunjuk Ujian
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Petunjuk dan aturan ujian..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Materi yang Diperlukan
                </label>
                <div className="space-y-2">
                  {formData.materials.map((material, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        value={material}
                        onChange={(e) => updateMaterial(index, e.target.value)}
                        placeholder="contoh: Kalkulator, Penggaris, ATK"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeMaterial(index)}
                      >
                        Hapus
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addMaterial}
                  >
                    Tambah Materi
                  </Button>
                </div>
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
                  {editingExam ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div >
      )
      }
    </div >
  );
}
