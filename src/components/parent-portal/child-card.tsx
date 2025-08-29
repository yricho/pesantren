'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Calendar, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface ChildData {
  id: string;
  nis: string;
  fullName: string;
  nickname?: string;
  photo?: string;
  institutionType: string;
  grade?: string;
  relationship: string;
  isPrimary: boolean;
  currentClass?: {
    name: string;
    level: string;
    program?: string;
    teacher?: {
      name: string;
    };
  };
  attendance: {
    totalDays: number;
    presentDays: number;
    percentage: number;
    absentDays: number;
    sickDays: number;
    permittedDays: number;
    lateDays: number;
  };
  grades: {
    totalSubjects: number;
    average: number;
    subjects: any[];
  };
  payments: {
    pendingAmount: number;
    pendingCount: number;
    totalAmount: number;
    paidAmount: number;
  };
}

interface ChildCardProps {
  child: ChildData;
  showDetails?: boolean;
}

export default function ChildCard({ child, showDetails = false }: ChildCardProps) {
  // Determine status colors based on performance
  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (average: number) => {
    if (average >= 85) return 'text-green-600';
    if (average >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const hasAlerts = child.attendance.percentage < 80 || 
                   child.grades.average < 70 || 
                   child.payments.pendingCount > 0;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${showDetails ? 'p-6' : 'p-4'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            {child.photo ? (
              <Image
                src={child.photo}
                alt={child.fullName}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {child.fullName.charAt(0)}
                </span>
              </div>
            )}
            {child.isPrimary && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                Utama
              </span>
            )}
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-gray-900">
              {child.nickname || child.fullName}
            </h3>
            <div className="flex items-center text-sm text-gray-600 space-x-2">
              <span>{child.nis}</span>
              <span>•</span>
              <span>{child.relationship}</span>
            </div>
            {child.currentClass && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <GraduationCap className="w-4 h-4 mr-1" />
                <span>{child.currentClass.name}</span>
                {child.currentClass.program && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{child.currentClass.program}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {hasAlerts && (
          <div className="flex items-center text-red-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Attendance */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${getAttendanceColor(child.attendance.percentage)}`}>
            {child.attendance.percentage}%
          </div>
          <div className="text-xs text-gray-600">Kehadiran</div>
          {child.attendance.totalDays > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {child.attendance.presentDays}/{child.attendance.totalDays} hari
            </div>
          )}
        </div>

        {/* Grades */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${getGradeColor(child.grades.average)}`}>
            {child.grades.average.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600">Rata-rata</div>
          {child.grades.totalSubjects > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {child.grades.totalSubjects} mata pelajaran
            </div>
          )}
        </div>

        {/* Payments */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${child.payments.pendingCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {child.payments.pendingCount}
          </div>
          <div className="text-xs text-gray-600">Tagihan</div>
          {child.payments.pendingAmount > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Rp {child.payments.pendingAmount.toLocaleString('id-ID')}
            </div>
          )}
        </div>
      </div>

      {/* Additional Details */}
      {showDetails && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Attendance Breakdown */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Detail Kehadiran</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hadir:</span>
                  <span className="text-green-600">{child.attendance.presentDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sakit:</span>
                  <span className="text-yellow-600">{child.attendance.sickDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Izin:</span>
                  <span className="text-blue-600">{child.attendance.permittedDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alpha:</span>
                  <span className="text-red-600">{child.attendance.absentDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Terlambat:</span>
                  <span className="text-orange-600">{child.attendance.lateDays}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Ringkasan Pembayaran</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span>Rp {child.payments.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dibayar:</span>
                  <span className="text-green-600">Rp {child.payments.paidAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="text-red-600">Rp {child.payments.pendingAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href={`/parent-portal/child/${child.id}`}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium text-center block"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}