'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, BookOpen, Search } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function APIDocPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('authentication');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Table of contents
  const sections = [
    { id: 'authentication', title: 'Authentication', icon: '🔐' },
    { id: 'students', title: 'Student Management', icon: '👨‍🎓' },
    { id: 'billing', title: 'SPP & Billing', icon: '💰' },
    { id: 'hafalan', title: 'Hafalan', icon: '📖' },
    { id: 'academic', title: 'Academic', icon: '📚' },
    { id: 'ppdb', title: 'PPDB Registration', icon: '📝' },
    { id: 'payments', title: 'Payments', icon: '💸' },
    { id: 'notifications', title: 'Notifications', icon: '📧' },
    { id: 'reports', title: 'Reports & Analytics', icon: '📊' },
    { id: 'public', title: 'Public Endpoints', icon: '🌐' },
  ];

  const CodeBlock = ({ code, language = 'json', id }: { code: string; language?: string; id: string }) => (
    <div className="relative bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
      <button
        onClick={() => handleCopy(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 transition"
      >
        {copied === id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

  const Endpoint = ({ 
    method, 
    path, 
    description, 
    request, 
    response,
    auth = true 
  }: { 
    method: string; 
    path: string; 
    description: string; 
    request?: string; 
    response?: string;
    auth?: boolean;
  }) => {
    const methodColors: any = {
      GET: 'bg-green-500',
      POST: 'bg-blue-500',
      PUT: 'bg-orange-500',
      DELETE: 'bg-red-500',
      PATCH: 'bg-purple-500'
    };

    return (
      <div className="border border-gray-200 rounded-lg p-6 mb-6 hover:shadow-lg transition">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className={`${methodColors[method]} text-white px-3 py-1 rounded font-bold text-sm`}>
              {method}
            </span>
            <code className="text-lg font-mono">{path}</code>
          </div>
          {auth && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
              Auth Required
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4">{description}</p>
        
        {request && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Request Body:</h4>
            <CodeBlock code={request} id={`${method}-${path}-request`} />
          </div>
        )}
        
        {response && (
          <div>
            <h4 className="font-semibold mb-2">Response:</h4>
            <CodeBlock code={response} id={`${method}-${path}-response`} />
          </div>
        )}
      </div>
    );
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="container mx-auto px-6">
            <Link
              href="/docs"
              className="inline-flex items-center text-blue-100 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
            <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
            <p className="text-xl text-blue-100">
              Complete REST API reference for Pondok Imam Syafi'i System
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <div className="sticky top-4">
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="font-bold mb-4">Contents</h3>
                  
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search endpoints..."
                      className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Navigation */}
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-2">{section.icon}</span>
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Base URL */}
                <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
                  <h4 className="font-semibold mb-2">Base URL</h4>
                  <CodeBlock 
                    code="Production: https://imam-syafii-blitar.vercel.app/api
Development: http://localhost:3030/api" 
                    language="text"
                    id="base-url"
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Authentication Section */}
                {activeSection === 'authentication' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <span className="mr-3">🔐</span>
                      Authentication
                    </h2>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                      <p className="text-sm">
                        All protected endpoints require JWT token in Authorization header:
                        <code className="bg-blue-100 px-2 py-1 rounded ml-2">
                          Authorization: Bearer &lt;token&gt;
                        </code>
                      </p>
                    </div>

                    <Endpoint
                      method="POST"
                      path="/api/auth/signin"
                      description="Login to system and receive JWT token"
                      auth={false}
                      request={`{
  "username": "admin",
  "password": "admin123"
}`}
                      response={`{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "username": "admin",
      "name": "Administrator",
      "role": "SUPER_ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400
  }
}`}
                    />

                    <Endpoint
                      method="POST"
                      path="/api/auth/signout"
                      description="Logout from system and invalidate token"
                      response={`{
  "success": true,
  "message": "Logged out successfully"
}`}
                    />

                    <Endpoint
                      method="POST"
                      path="/api/auth/change-password"
                      description="Change current user password"
                      request={`{
  "currentPassword": "old123",
  "newPassword": "new123"
}`}
                      response={`{
  "success": true,
  "message": "Password changed successfully"
}`}
                    />

                    <Endpoint
                      method="POST"
                      path="/api/auth/2fa/enable"
                      description="Enable two-factor authentication and get QR code"
                      response={`{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,...",
    "backupCodes": [
      "ABC123",
      "DEF456",
      "GHI789"
    ]
  }
}`}
                    />
                  </div>
                )}

                {/* Students Section */}
                {activeSection === 'students' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <span className="mr-3">👨‍🎓</span>
                      Student Management
                    </h2>

                    <Endpoint
                      method="GET"
                      path="/api/students"
                      description="Get all students with pagination and filtering"
                      response={`{
  "success": true,
  "data": {
    "students": [
      {
        "id": "123",
        "nisn": "1234567890",
        "fullName": "Ahmad Ibrahim",
        "grade": "7A",
        "institutionLevel": "SMP",
        "status": "ACTIVE"
      }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
}`}
                    />

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold mb-2">Query Parameters:</h4>
                      <ul className="space-y-1 text-sm">
                        <li><code className="bg-gray-200 px-2 py-1 rounded">page</code> - Page number (default: 1)</li>
                        <li><code className="bg-gray-200 px-2 py-1 rounded">limit</code> - Items per page (default: 10)</li>
                        <li><code className="bg-gray-200 px-2 py-1 rounded">search</code> - Search by name or NISN</li>
                        <li><code className="bg-gray-200 px-2 py-1 rounded">institutionLevel</code> - Filter by TK|SD|SMP|PONDOK</li>
                        <li><code className="bg-gray-200 px-2 py-1 rounded">grade</code> - Filter by grade</li>
                        <li><code className="bg-gray-200 px-2 py-1 rounded">status</code> - Filter by ACTIVE|GRADUATED|INACTIVE</li>
                      </ul>
                    </div>

                    <Endpoint
                      method="POST"
                      path="/api/students"
                      description="Create new student"
                      request={`{
  "nisn": "1234567890",
  "nis": "2024001",
  "fullName": "Ahmad Ibrahim",
  "nickname": "Ahmad",
  "birthPlace": "Blitar",
  "birthDate": "2010-05-15",
  "gender": "MALE",
  "institutionLevel": "SMP",
  "grade": "7A",
  "address": "Jl. Imam Syafi'i No. 123",
  "phone": "081234567890",
  "fatherName": "Ibrahim",
  "motherName": "Fatimah"
}`}
                      response={`{
  "success": true,
  "data": {
    "id": "456",
    "nisn": "1234567890",
    "fullName": "Ahmad Ibrahim",
    "createdAt": "2024-12-05T10:00:00Z"
  }
}`}
                    />

                    <Endpoint
                      method="POST"
                      path="/api/students/bulk-import"
                      description="Import multiple students from Excel/CSV file"
                      request={`Form Data:
- file: Excel/CSV file
- institutionLevel: TK|SD|SMP|PONDOK`}
                      response={`{
  "success": true,
  "data": {
    "imported": 50,
    "failed": 2,
    "errors": [
      "Row 15: Invalid NISN",
      "Row 23: Duplicate student"
    ]
  }
}`}
                    />
                  </div>
                )}

                {/* Billing Section */}
                {activeSection === 'billing' && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                      <span className="mr-3">💰</span>
                      SPP & Billing
                    </h2>

                    <Endpoint
                      method="POST"
                      path="/api/bills/generate"
                      description="Generate monthly SPP bills for all students"
                      request={`{
  "month": 12,
  "year": 2024,
  "institutionLevel": "SMP",
  "grade": "7A",
  "amount": 500000
}`}
                      response={`{
  "success": true,
  "data": {
    "generated": 30,
    "total": 15000000
  }
}`}
                    />

                    <Endpoint
                      method="PUT"
                      path="/api/bills/:id/pay"
                      description="Mark bill as paid"
                      request={`{
  "paymentMethod": "CASH",
  "paidAmount": 500000,
  "paymentDate": "2024-12-05",
  "receiptNumber": "RCP2024120001"
}`}
                      response={`{
  "success": true,
  "data": {
    "id": "789",
    "status": "PAID",
    "paidAt": "2024-12-05T10:00:00Z"
  }
}`}
                    />

                    <Endpoint
                      method="POST"
                      path="/api/bills/send-reminders"
                      description="Send payment reminders via WhatsApp"
                      request={`{
  "billIds": ["123", "456", "789"],
  "message": "Custom reminder message (optional)"
}`}
                      response={`{
  "success": true,
  "data": {
    "sent": 3,
    "failed": 0
  }
}`}
                    />
                  </div>
                )}

                {/* Add more sections as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}