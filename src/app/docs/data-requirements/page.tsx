'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  FileText, 
  Copy, 
  Check, 
  Download,
  Upload,
  Database,
  Users,
  School,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  BookOpen,
  Camera,
  Globe,
  Building,
  Award,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Info,
  Image,
  FileSpreadsheet,
  FolderOpen,
  Settings,
  UserPlus,
  GraduationCap,
  Home,
  DollarSign
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function DataRequirementsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('institution');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCheck = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const CodeBlock = ({ code, id, language = 'json' }: { 
    code: string; 
    id: string; 
    language?: string;
  }) => (
    <div className="relative bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto group">
      <button
        onClick={() => handleCopy(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 transition opacity-0 group-hover:opacity-100"
      >
        {copiedId === id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="text-sm font-mono">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

  const DataSection = ({ 
    icon: Icon, 
    title, 
    items 
  }: { 
    icon: any; 
    title: string; 
    items: { id: string; label: string; required: boolean; example?: string; format?: string }[] 
  }) => (
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-4 flex items-center">
        <Icon className="h-6 w-6 text-blue-600 mr-2" />
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <input
              type="checkbox"
              className="mt-1 mr-3"
              checked={checkedItems.has(item.id)}
              onChange={() => toggleCheck(item.id)}
            />
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium">{item.label}</span>
                {item.required && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded">Required</span>
                )}
              </div>
              {item.example && (
                <p className="text-sm text-gray-600 mt-1">Example: {item.example}</p>
              )}
              {item.format && (
                <p className="text-sm text-gray-500 mt-1">Format: {item.format}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const dataCategories = {
    institution: {
      title: 'Institution Data',
      icon: Building,
      sections: [
        {
          icon: Home,
          title: 'Basic Information',
          items: [
            { id: 'inst-1', label: 'Institution Name', required: true, example: 'Pondok Pesantren Imam Syafi\'i' },
            { id: 'inst-2', label: 'NPSN (Nomor Pokok Sekolah Nasional)', required: true, example: '20514842' },
            { id: 'inst-3', label: 'Foundation Name', required: true, example: 'Yayasan Imam Syafi\'i' },
            { id: 'inst-4', label: 'Establishment Date', required: true, format: 'YYYY-MM-DD' },
            { id: 'inst-5', label: 'Operational Permit Number', required: true },
            { id: 'inst-6', label: 'Accreditation Status', required: true, example: 'A (Excellent)' },
            { id: 'inst-7', label: 'Institution Logo', required: true, format: 'PNG/JPG (min 500x500px)' },
            { id: 'inst-8', label: 'Vision Statement', required: true },
            { id: 'inst-9', label: 'Mission Statement', required: true },
            { id: 'inst-10', label: 'Motto/Tagline', required: false }
          ]
        },
        {
          icon: MapPin,
          title: 'Contact & Location',
          items: [
            { id: 'loc-1', label: 'Complete Address', required: true, example: 'Jl. Imam Syafi\'i No. 123, Blitar' },
            { id: 'loc-2', label: 'Province', required: true, example: 'Jawa Timur' },
            { id: 'loc-3', label: 'City/Regency', required: true, example: 'Kota Blitar' },
            { id: 'loc-4', label: 'District', required: true, example: 'Sananwetan' },
            { id: 'loc-5', label: 'Village', required: true },
            { id: 'loc-6', label: 'Postal Code', required: true, example: '66137' },
            { id: 'loc-7', label: 'Phone Number', required: true, example: '(0342) 801234' },
            { id: 'loc-8', label: 'WhatsApp Number', required: true, example: '081234567890' },
            { id: 'loc-9', label: 'Email Address', required: true, example: 'info@imamsyafii-blitar.sch.id' },
            { id: 'loc-10', label: 'Website', required: false, example: 'https://imamsyafii-blitar.sch.id' },
            { id: 'loc-11', label: 'Google Maps Link', required: true },
            { id: 'loc-12', label: 'GPS Coordinates', required: false, format: 'Latitude, Longitude' }
          ]
        },
        {
          icon: Users,
          title: 'Social Media',
          items: [
            { id: 'soc-1', label: 'Facebook Page', required: false, example: 'facebook.com/imamsyafiiblitar' },
            { id: 'soc-2', label: 'Instagram Account', required: false, example: '@imamsyafii_blitar' },
            { id: 'soc-3', label: 'YouTube Channel', required: false },
            { id: 'soc-4', label: 'Twitter/X Account', required: false },
            { id: 'soc-5', label: 'TikTok Account', required: false }
          ]
        }
      ]
    },
    academic: {
      title: 'Academic Data',
      icon: GraduationCap,
      sections: [
        {
          icon: School,
          title: 'Educational Levels',
          items: [
            { id: 'edu-1', label: 'TK (Kindergarten) Available', required: true, example: 'Yes/No' },
            { id: 'edu-2', label: 'SD (Elementary) Available', required: true, example: 'Yes/No' },
            { id: 'edu-3', label: 'SMP (Junior High) Available', required: true, example: 'Yes/No' },
            { id: 'edu-4', label: 'Pondok (Boarding) Available', required: true, example: 'Yes/No' },
            { id: 'edu-5', label: 'Total Classes per Level', required: true, example: 'TK: 2, SD: 12, SMP: 6' },
            { id: 'edu-6', label: 'Curriculum Type', required: true, example: 'Kurikulum Merdeka + Pesantren' },
            { id: 'edu-7', label: 'Academic Calendar', required: true, format: 'PDF file' },
            { id: 'edu-8', label: 'School Hours', required: true, example: '07:00 - 15:30' }
          ]
        },
        {
          icon: BookOpen,
          title: 'Programs & Activities',
          items: [
            { id: 'prog-1', label: 'Tahfidz Program Details', required: true },
            { id: 'prog-2', label: 'Extracurricular List', required: true },
            { id: 'prog-3', label: 'Special Programs', required: false },
            { id: 'prog-4', label: 'Achievement List', required: false },
            { id: 'prog-5', label: 'Competition Participations', required: false }
          ]
        },
        {
          icon: ClipboardList,
          title: 'Facilities',
          items: [
            { id: 'fac-1', label: 'Classroom Count', required: true, example: '30 rooms' },
            { id: 'fac-2', label: 'Laboratory Facilities', required: true, example: 'Science Lab, Computer Lab' },
            { id: 'fac-3', label: 'Library Description', required: true },
            { id: 'fac-4', label: 'Mosque Capacity', required: true, example: '500 people' },
            { id: 'fac-5', label: 'Dormitory Capacity', required: true, example: '200 students' },
            { id: 'fac-6', label: 'Sports Facilities', required: true },
            { id: 'fac-7', label: 'Health Clinic', required: true },
            { id: 'fac-8', label: 'Canteen/Kitchen', required: true },
            { id: 'fac-9', label: 'Parking Area', required: false },
            { id: 'fac-10', label: 'Facility Photos', required: true, format: 'JPG/PNG (min 10 photos)' }
          ]
        }
      ]
    },
    personnel: {
      title: 'Personnel Data',
      icon: Users,
      sections: [
        {
          icon: UserPlus,
          title: 'Leadership',
          items: [
            { id: 'lead-1', label: 'Foundation Chairman', required: true, example: 'Name, Title, Photo' },
            { id: 'lead-2', label: 'Head of Institution', required: true },
            { id: 'lead-3', label: 'TK Principal', required: false },
            { id: 'lead-4', label: 'SD Principal', required: false },
            { id: 'lead-5', label: 'SMP Principal', required: false },
            { id: 'lead-6', label: 'Pondok Director', required: false },
            { id: 'lead-7', label: 'Organizational Structure Chart', required: true, format: 'Image file' }
          ]
        },
        {
          icon: Users,
          title: 'Staff Information',
          items: [
            { id: 'staff-1', label: 'Total Teachers', required: true, example: '45 teachers' },
            { id: 'staff-2', label: 'Teacher List', required: true, format: 'Name, Subject, Qualification' },
            { id: 'staff-3', label: 'Administrative Staff', required: true, example: '10 staff' },
            { id: 'staff-4', label: 'Support Staff', required: true, example: 'Security, Cleaning, etc.' },
            { id: 'staff-5', label: 'Staff Photos', required: false, format: 'Optional group photo' }
          ]
        }
      ]
    },
    financial: {
      title: 'Financial Data',
      icon: DollarSign,
      sections: [
        {
          icon: CreditCard,
          title: 'Fee Structure',
          items: [
            { id: 'fee-1', label: 'Registration Fee (PPDB)', required: true, example: 'Rp 500.000' },
            { id: 'fee-2', label: 'Monthly SPP - TK', required: false, example: 'Rp 250.000' },
            { id: 'fee-3', label: 'Monthly SPP - SD', required: false, example: 'Rp 350.000' },
            { id: 'fee-4', label: 'Monthly SPP - SMP', required: false, example: 'Rp 450.000' },
            { id: 'fee-5', label: 'Monthly SPP - Pondok', required: false, example: 'Rp 750.000' },
            { id: 'fee-6', label: 'Development Fee', required: true },
            { id: 'fee-7', label: 'Uniform Fee', required: true },
            { id: 'fee-8', label: 'Book Fee', required: true },
            { id: 'fee-9', label: 'Other Fees', required: false },
            { id: 'fee-10', label: 'Scholarship Information', required: false }
          ]
        },
        {
          icon: Building,
          title: 'Bank Information',
          items: [
            { id: 'bank-1', label: 'Primary Bank Name', required: true, example: 'Bank Mandiri' },
            { id: 'bank-2', label: 'Account Number', required: true },
            { id: 'bank-3', label: 'Account Name', required: true, example: 'Yayasan Imam Syafi\'i' },
            { id: 'bank-4', label: 'Alternative Bank', required: false },
            { id: 'bank-5', label: 'Payment Methods Accepted', required: true, example: 'Transfer, Cash' }
          ]
        }
      ]
    },
    media: {
      title: 'Media Assets',
      icon: Image,
      sections: [
        {
          icon: Camera,
          title: 'Photos & Videos',
          items: [
            { id: 'med-1', label: 'Institution Logo', required: true, format: 'PNG with transparency' },
            { id: 'med-2', label: 'Building Photos', required: true, format: 'Min 10 photos' },
            { id: 'med-3', label: 'Classroom Photos', required: true },
            { id: 'med-4', label: 'Activity Photos', required: true, example: 'Learning, Sports, Events' },
            { id: 'med-5', label: 'Facility Photos', required: true },
            { id: 'med-6', label: 'Profile Video', required: false, format: 'MP4, max 5 minutes' },
            { id: 'med-7', label: 'Virtual Tour', required: false }
          ]
        },
        {
          icon: FileText,
          title: 'Documents',
          items: [
            { id: 'doc-1', label: 'Institution Profile', required: true, format: 'PDF' },
            { id: 'doc-2', label: 'Brochure', required: false, format: 'PDF' },
            { id: 'doc-3', label: 'Annual Report', required: false },
            { id: 'doc-4', label: 'Accreditation Certificate', required: true, format: 'PDF/JPG' },
            { id: 'doc-5', label: 'Operational Permit', required: true, format: 'PDF/JPG' }
          ]
        }
      ]
    },
    students: {
      title: 'Student Data',
      icon: GraduationCap,
      sections: [
        {
          icon: Users,
          title: 'Current Students',
          items: [
            { id: 'stud-1', label: 'Student List (Excel)', required: true, format: 'Excel with template' },
            { id: 'stud-2', label: 'Total Students per Level', required: true },
            { id: 'stud-3', label: 'Class Distribution', required: true },
            { id: 'stud-4', label: 'Gender Distribution', required: true },
            { id: 'stud-5', label: 'Parent Contact List', required: true, format: 'Excel' }
          ]
        },
        {
          icon: Award,
          title: 'Alumni',
          items: [
            { id: 'alum-1', label: 'Alumni Database', required: false, format: 'Excel' },
            { id: 'alum-2', label: 'Success Stories', required: false },
            { id: 'alum-3', label: 'Alumni Testimonials', required: false }
          ]
        }
      ]
    }
  };

  const currentCategory = dataCategories[activeTab as keyof typeof dataCategories];

  // Calculate progress
  const totalItems = Object.values(dataCategories).reduce((acc, cat) => 
    acc + cat.sections.reduce((secAcc, sec) => secAcc + sec.items.length, 0), 0
  );
  const checkedCount = checkedItems.size;
  const progressPercentage = (checkedCount / totalItems) * 100;

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
          <div className="container mx-auto px-6">
            <Link
              href="/docs"
              className="inline-flex items-center text-green-100 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
            <div className="flex items-center mb-4">
              <FileText className="h-12 w-12 mr-4" />
              <h1 className="text-4xl font-bold">Website Data Requirements</h1>
            </div>
            <p className="text-xl text-green-100">
              Complete checklist of data needed to launch your Pondok Imam Syafi\'i website
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Data Collection Progress</h2>
              <span className="text-2xl font-bold text-blue-600">
                {checkedCount} / {totalItems} items
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {progressPercentage.toFixed(1)}% complete - Keep going!
            </p>
          </div>

          {/* Download Templates */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="font-bold mb-2">Download Data Templates</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Use our templates to organize your data before uploading to the system.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    <Download className="h-4 w-4 mr-2" />
                    Student Data Template
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    <Download className="h-4 w-4 mr-2" />
                    Staff Data Template
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                    <Download className="h-4 w-4 mr-2" />
                    Complete Checklist PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="flex overflow-x-auto border-b">
              {Object.entries(dataCategories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition flex items-center ${
                    activeTab === key
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <cat.icon className="h-5 w-5 mr-2" />
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <currentCategory.icon className="h-8 w-8 text-blue-600 mr-3" />
                {currentCategory.title}
              </h2>

              {currentCategory.sections.map((section, idx) => (
                <DataSection
                  key={idx}
                  icon={section.icon}
                  title={section.title}
                  items={section.items}
                />
              ))}
            </div>
          </div>

          {/* Data Format Examples */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Data Format Examples</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-3">Student Data Excel Format</h3>
                <CodeBlock
                  code={`NISN | NIS | Full Name | Grade | Gender | Birth Date | Parent Name | Phone | Address
1234567890 | 2024001 | Ahmad Ibrahim | 7A | L | 2010-05-15 | Ibrahim Ahmad | 081234567890 | Jl. Merdeka No. 1
1234567891 | 2024002 | Fatimah Zahra | 7A | P | 2010-08-20 | Abdullah Zahra | 081234567891 | Jl. Pahlawan No. 2`}
                  id="student-format"
                  language="text"
                />
              </div>

              <div>
                <h3 className="font-bold mb-3">Teacher Data Format</h3>
                <CodeBlock
                  code={`{
  "teachers": [
    {
      "nip": "197001011990031001",
      "name": "Dr. Ahmad Fauzi, M.Pd",
      "position": "Guru Matematika",
      "education": "S2 Pendidikan Matematika",
      "certifications": ["Sertifikat Pendidik", "Pelatihan K13"],
      "phone": "081234567890",
      "email": "ahmad.fauzi@example.com"
    }
  ]
}`}
                  id="teacher-format"
                />
              </div>

              <div>
                <h3 className="font-bold mb-3">Fee Structure Format</h3>
                <CodeBlock
                  code={`{
  "fees": {
    "registration": {
      "TK": 500000,
      "SD": 750000,
      "SMP": 1000000,
      "PONDOK": 1500000
    },
    "monthly": {
      "TK": { "amount": 250000, "description": "SPP Bulanan TK" },
      "SD": { "amount": 350000, "description": "SPP Bulanan SD" },
      "SMP": { "amount": 450000, "description": "SPP Bulanan SMP" },
      "PONDOK": { "amount": 750000, "description": "SPP + Asrama" }
    },
    "additional": [
      { "name": "Seragam", "amount": 500000, "required": true },
      { "name": "Buku Paket", "amount": 300000, "required": true },
      { "name": "Ekstrakurikuler", "amount": 150000, "required": false }
    ]
  }
}`}
                  id="fee-format"
                />
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600 mr-3" />
              Important Guidelines
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Data Privacy</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Ensure parent consent for student photos</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Redact sensitive personal information</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Use secure methods for data transfer</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-3">File Requirements</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Images: High resolution (min 1920x1080)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Documents: PDF format preferred</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Excel: Use provided templates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Upload className="h-8 w-8 text-green-600 mr-3" />
              Ready to Upload Your Data?
            </h2>
            
            <p className="text-gray-700 mb-6">
              Once you have collected all required data, you can upload it through the admin panel.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <FileSpreadsheet className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold mb-1">Step 1</h3>
                <p className="text-sm text-gray-600">Prepare data using templates</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold mb-1">Step 2</h3>
                <p className="text-sm text-gray-600">Verify data completeness</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <Upload className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold mb-1">Step 3</h3>
                <p className="text-sm text-gray-600">Upload via admin panel</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                href="/login"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Go to Admin Panel
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}