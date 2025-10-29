import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises"; // Use fs/promises for async file operations
import path from "path";
import ExcelJS from "exceljs";

const dateExport = new Date();
const saveDir = path.join(process.cwd(), "exports");
const filename = `students_${dateExport.toISOString().split("T")[0]}.xlsx`;
const filePath = path.join(saveDir, filename);

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const institutionType = searchParams.get("institutionType");
    const status = searchParams.get("status");
    const enrollmentYear = searchParams.get("enrollmentYear");
    const grade = searchParams.get("grade");
    const format = searchParams.get("format") || "json";

    // Build where clause
    const where: any = {};

    if (institutionType && institutionType !== "all") {
      where.institutionType = institutionType;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (enrollmentYear && enrollmentYear !== "all") {
      where.enrollmentYear = enrollmentYear;
    }

    if (grade && grade !== "all") {
      where.grade = grade;
    }

    // Fetch students data
    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        nisn: true,
        nis: true,
        fullName: true,
        nickname: true,
        birthPlace: true,
        birthDate: true,
        gender: true,
        bloodType: true,
        religion: true,
        nationality: true,
        address: true,
        village: true,
        district: true,
        city: true,
        province: true,
        postalCode: true,
        phone: true,
        email: true,
        fatherName: true,
        fatherJob: true,
        fatherPhone: true,
        fatherEducation: true,
        motherName: true,
        motherJob: true,
        motherPhone: true,
        motherEducation: true,
        guardianName: true,
        guardianJob: true,
        guardianPhone: true,
        guardianRelation: true,
        institutionType: true,
        grade: true,
        enrollmentDate: true,
        enrollmentYear: true,
        previousSchool: true,
        specialNeeds: true,
        status: true,
        graduationDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { institutionType: "asc" },
        { grade: "asc" },
        { fullName: "asc" },
      ],
    });

    // if (format === 'json') {
    //   return NextResponse.json({
    //     success: true,
    //     data: students,
    //     total: students.length
    //   });
    // }

    // For export formats, return processed data
    const exportData = students.map((student) => ({
      NISN: student.nisn || "",
      NIS: student.nis,
      "Nama Lengkap": student.fullName,
      "Nama Panggilan": student.nickname || "",
      "Tempat Lahir": student.birthPlace,
      "Tanggal Lahir": student.birthDate.toISOString().split("T")[0],
      "Jenis Kelamin": student.gender === "MALE" ? "Laki-laki" : "Perempuan",
      "Golongan Darah": student.bloodType || "",
      Agama: student.religion,
      Kewarganegaraan: student.nationality,
      Alamat: student.address,
      "Desa/Kelurahan": student.village || "",
      Kecamatan: student.district || "",
      "Kota/Kabupaten": student.city,
      Provinsi: student.province,
      "Kode Pos": student.postalCode || "",
      Telepon: student.phone || "",
      Email: student.email || "",
      "Nama Ayah": student.fatherName,
      "Pekerjaan Ayah": student.fatherJob || "",
      "Telepon Ayah": student.fatherPhone || "",
      "Pendidikan Ayah": student.fatherEducation || "",
      "Nama Ibu": student.motherName,
      "Pekerjaan Ibu": student.motherJob || "",
      "Telepon Ibu": student.motherPhone || "",
      "Pendidikan Ibu": student.motherEducation || "",
      "Nama Wali": student.guardianName || "",
      "Pekerjaan Wali": student.guardianJob || "",
      "Telepon Wali": student.guardianPhone || "",
      "Hubungan Wali": student.guardianRelation || "",
      "Jenis Institusi": student.institutionType,
      Kelas: student.grade || "",
      "Tanggal Masuk": student.enrollmentDate.toISOString().split("T")[0],
      "Tahun Ajaran": student.enrollmentYear,
      "Sekolah Asal": student.previousSchool || "",
      "Kebutuhan Khusus": student.specialNeeds || "",
      Status: student.status,
      "Tanggal Lulus": student.graduationDate
        ? student.graduationDate.toISOString().split("T")[0]
        : "",
      "Tanggal Dibuat": student.createdAt.toISOString().split("T")[0],
    }));

    const columnsData = [
      { key: "NISN", header: "NISN", width: 15 },
      { key: "NIS", header: "NIS", width: 15 },
      { key: "NamaLengkap", header: "Nama Lengkap", width: 25 },
      { key: "NamaPanggilan", header: "Nama Panggilan", width: 15 },
      { key: "TempatLahir", header: "Tempat Lahir", width: 15 },
      {
        key: "TanggalLahir",
        header: "Tanggal Lahir",
        width: 15,
        type: "date",
      },
      { key: "JenisKelamin", header: "Jenis Kelamin", width: 15 },
      { key: "GolonganDarah", header: "Golongan Darah", width: 10 },
      { key: "Agama", header: "Agama", width: 10 },
      { key: "Kewarganegaraan", header: "Kewarganegaraan", width: 15 },
      { key: "Alamat", header: "Alamat", width: 30 },
      { key: "DesaKelurahan", header: "Desa/Kelurahan", width: 15 },
      { key: "Kecamatan", header: "Kecamatan", width: 15 },
      { key: "KotaKabupaten", header: "Kota/Kabupaten", width: 15 },
      { key: "Provinsi", header: "Provinsi", width: 15 },
      { key: "Kode Pos", header: "Kode Pos", width: 10 },
      { key: "Telepon", header: "Telepon", width: 15 },
      { key: "Email", header: "Email", width: 25 },
      { key: "NamaAyah", header: "Nama Ayah", width: 20 },
      { key: "Pekerjaan Ayah", header: "Pekerjaan Ayah", width: 20 },
      { key: "TeleponAyah", header: "Telepon Ayah", width: 15 },
      { key: "PendidikanAyah", header: "Pendidikan Ayah", width: 15 },
      { key: "NamaIbu", header: "Nama Ibu", width: 20 },
      { key: "PekerjaanIbu", header: "Pekerjaan Ibu", width: 20 },
      { key: "TeleponIbu", header: "Telepon Ibu", width: 15 },
      { key: "PendidikanIbu", header: "Pendidikan Ibu", width: 15 },
      { key: "NamaWali", header: "Nama Wali", width: 20 },
      { key: "Pekerjaan Wali", header: "Pekerjaan Wali", width: 20 },
      { key: "TeleponWali", header: "Telepon Wali", width: 15 },
      { key: "HubunganWali", header: "Hubungan Wali", width: 15 },
      { key: "JenisInstitusi", header: "Jenis Institusi", width: 15 },
      { key: "Kelas", header: "Kelas", width: 10 },
      {
        key: "TanggalMasuk",
        header: "Tanggal Masuk",
        width: 15,
        type: "date",
      },
      { key: "TahunAjaran", header: "Tahun Ajaran", width: 15 },
      { key: "SekolahAsal", header: "Sekolah Asal", width: 25 },
      { key: "KebutuhanKhusus", header: "Kebutuhan Khusus", width: 20 },
      { key: "Status", header: "Status", width: 15 },
      {
        key: "TanggalLulus",
        header: "Tanggal Lulus",
        width: 15,
        type: "date",
      },
      {
        key: "TanggalDibuat",
        header: "Tanggal Dibuat",
        width: 15,
        type: "date",
      },
    ];

    await fs.mkdir(saveDir, { recursive: true });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    worksheet.columns = columnsData;

    students.forEach((student) => {
      worksheet.addRow({
        NISN: student.nisn,
        NIS: student.nis,
        NamaLengkap: student.fullName,
        NamaPanggilan: student.nickname || "",
        TempatLahir: student.birthPlace,
        TanggalLahir: student.birthDate.toISOString().split("T")[0],
        JenisKelamin: student.gender === "MALE" ? "Laki-laki" : "Perempuan",
        GolonganDarah: student.bloodType || "",
        Agama: student.religion,
        Kewarganegaraan: student.nationality,
        Alamat: student.address,
        DesaKelurahan: student.village || "",
        Kecamatan: student.district || "",
        KotaKabupaten: student.city,
        Provinsi: student.province,
        KodePos: student.postalCode || "",
        Telepon: student.phone || "",
        Email: student.email || "",
        NamaAyah: student.fatherName,
        PekerjaanAyah: student.fatherJob || "",
        TeleponAyah: student.fatherPhone || "",
        PendidikanAyah: student.fatherEducation || "",
        NamaIbu: student.motherName,
        PekerjaanIbu: student.motherJob || "",
        TeleponIbu: student.motherPhone || "",
        PendidikanIbu: student.motherEducation || "",
        NamaWali: student.guardianName || "",
        PekerjaanWali: student.guardianJob || "",
        TeleponWali: student.guardianPhone || "",
        HubunganWali: student.guardianRelation || "",
        JenisInstitusi: student.institutionType,
        Kelas: student.grade || "",
        TanggalMasuk: student.enrollmentDate.toISOString().split("T")[0],
        TahunAjaran: student.enrollmentYear,
        SekolahAsal: student.previousSchool || "",
        KebutuhanKhusus: student.specialNeeds || "",
        Status: student.status,
        TanggalLulus: student.graduationDate
          ? student.graduationDate.toISOString().split("T")[0]
          : "",
        TanggalDibuat: student.createdAt.toISOString().split("T")[0],
      });
    });

    await workbook.xlsx.writeFile(filePath);

    return NextResponse.json({
      success: true,
      data: exportData,
      total: exportData.length,
    });
  } catch (error) {
    console.error("Export students error:", error);
    return NextResponse.json(
      { error: "Failed to export students data" },
      { status: 500 }
    );
  }
}
