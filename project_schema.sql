--
-- PostgreSQL database dump
--

-- Dumped from database version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)
-- Dumped by pg_dump version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.academic_years (
    id text NOT NULL,
    name text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.academic_years OWNER TO admin;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.activities (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    location text,
    photos text DEFAULT '[]'::text NOT NULL,
    status text DEFAULT 'planned'::text NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.activities OWNER TO admin;

--
-- Name: alumni; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.alumni (
    id text NOT NULL,
    nisn text,
    nis text,
    "fullName" text NOT NULL,
    nickname text,
    "birthPlace" text NOT NULL,
    "birthDate" timestamp(3) without time zone NOT NULL,
    gender text NOT NULL,
    "bloodType" text,
    religion text DEFAULT 'Islam'::text NOT NULL,
    nationality text DEFAULT 'Indonesia'::text NOT NULL,
    "currentAddress" text NOT NULL,
    "currentCity" text NOT NULL,
    "currentProvince" text,
    "currentCountry" text DEFAULT 'Indonesia'::text NOT NULL,
    phone text,
    whatsapp text,
    email text,
    facebook text,
    instagram text,
    linkedin text,
    "fatherName" text,
    "motherName" text,
    "institutionType" text NOT NULL,
    "graduationYear" text NOT NULL,
    generation text,
    "currentJob" text,
    "jobPosition" text,
    company text,
    "furtherEducation" text,
    university text,
    major text,
    achievements text DEFAULT '[]'::text NOT NULL,
    "maritalStatus" text,
    "spouseName" text,
    "childrenCount" integer DEFAULT 0 NOT NULL,
    notes text,
    photo text,
    memories text,
    message text,
    "availableForEvents" boolean DEFAULT true NOT NULL,
    "lastContactDate" timestamp(3) without time zone,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.alumni OWNER TO admin;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.announcements (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    summary text,
    "targetAudience" text DEFAULT 'ALL'::text NOT NULL,
    "targetClasses" text DEFAULT '[]'::text NOT NULL,
    "targetGrades" text DEFAULT '[]'::text NOT NULL,
    priority text DEFAULT 'NORMAL'::text NOT NULL,
    category text DEFAULT 'GENERAL'::text NOT NULL,
    tags text DEFAULT '[]'::text NOT NULL,
    attachments text DEFAULT '[]'::text NOT NULL,
    "featuredImage" text,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "publishDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiryDate" timestamp(3) without time zone,
    "isPinned" boolean DEFAULT false NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdBy" text NOT NULL,
    "approvedBy" text,
    "approvedAt" timestamp(3) without time zone,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.announcements OWNER TO admin;

--
-- Name: answers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.answers (
    id text NOT NULL,
    "questionId" text NOT NULL,
    "ustadzId" text NOT NULL,
    answer text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.answers OWNER TO admin;

--
-- Name: attendances; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.attendances (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "classId" text NOT NULL,
    "semesterId" text NOT NULL,
    date date NOT NULL,
    status text NOT NULL,
    "timeIn" timestamp(3) without time zone,
    notes text,
    "markedBy" text NOT NULL,
    "markedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.attendances OWNER TO admin;

--
-- Name: audit_trails; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.audit_trails (
    id text NOT NULL,
    "tableName" text NOT NULL,
    "recordId" text NOT NULL,
    action text NOT NULL,
    "oldValues" text,
    "newValues" text,
    "userId" text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_trails OWNER TO admin;

--
-- Name: bill_payments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.bill_payments (
    id text NOT NULL,
    "paymentNo" text NOT NULL,
    "billId" text NOT NULL,
    amount numeric(65,30) NOT NULL,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    method text NOT NULL,
    channel text,
    reference text,
    "proofUrl" text,
    "verificationStatus" text DEFAULT 'PENDING'::text NOT NULL,
    "verifiedBy" text,
    "verifiedAt" timestamp(3) without time zone,
    "rejectionReason" text,
    "externalId" text,
    "gatewayResponse" text DEFAULT '{}'::text NOT NULL,
    "reconciledAt" timestamp(3) without time zone,
    "reconciledBy" text,
    notes text,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.bill_payments OWNER TO admin;

--
-- Name: bill_types; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.bill_types (
    id text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    description text,
    "defaultAmount" numeric(65,30),
    "isRecurring" boolean DEFAULT false NOT NULL,
    frequency text,
    "priceByGrade" text DEFAULT '{}'::text NOT NULL,
    "dueDayOfMonth" integer,
    "gracePeriodDays" integer DEFAULT 7 NOT NULL,
    "latePenaltyType" text DEFAULT 'NONE'::text NOT NULL,
    "latePenaltyAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "maxPenalty" numeric(65,30),
    "allowSiblingDiscount" boolean DEFAULT false NOT NULL,
    "siblingDiscountPercent" numeric(65,30) DEFAULT 0 NOT NULL,
    "allowScholarshipDiscount" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.bill_types OWNER TO admin;

--
-- Name: billing_reports; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.billing_reports (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    parameters text DEFAULT '{}'::text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    data text,
    summary text DEFAULT '{}'::text NOT NULL,
    "pdfUrl" text,
    "excelUrl" text,
    status text DEFAULT 'GENERATING'::text NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    "generatedBy" text NOT NULL,
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "errorMessage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.billing_reports OWNER TO admin;

--
-- Name: billing_settings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.billing_settings (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    category text DEFAULT 'GENERAL'::text NOT NULL,
    description text,
    "dataType" text DEFAULT 'STRING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.billing_settings OWNER TO admin;

--
-- Name: bills; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.bills (
    id text NOT NULL,
    "billNo" text NOT NULL,
    "studentId" text NOT NULL,
    "billTypeId" text NOT NULL,
    amount numeric(65,30) NOT NULL,
    "originalAmount" numeric(65,30) NOT NULL,
    period text NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'OUTSTANDING'::text NOT NULL,
    "paidAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "remainingAmount" numeric(65,30) NOT NULL,
    discounts text DEFAULT '[]'::text NOT NULL,
    "totalDiscount" numeric(65,30) DEFAULT 0 NOT NULL,
    penalties text DEFAULT '[]'::text NOT NULL,
    "totalPenalty" numeric(65,30) DEFAULT 0 NOT NULL,
    "isOverdue" boolean DEFAULT false NOT NULL,
    "daysPastDue" integer DEFAULT 0 NOT NULL,
    "firstOverdueDate" timestamp(3) without time zone,
    "lastReminderSent" timestamp(3) without time zone,
    "reminderCount" integer DEFAULT 0 NOT NULL,
    notes text,
    metadata text DEFAULT '{}'::text NOT NULL,
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "generatedBy" text,
    "cancelledAt" timestamp(3) without time zone,
    "cancelledBy" text,
    "cancelReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.bills OWNER TO admin;

--
-- Name: budget_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.budget_items (
    id text NOT NULL,
    "budgetId" text NOT NULL,
    "categoryId" text NOT NULL,
    "budgetAmount" double precision NOT NULL,
    "actualAmount" double precision DEFAULT 0 NOT NULL,
    variance double precision DEFAULT 0 NOT NULL,
    percentage double precision DEFAULT 0 NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.budget_items OWNER TO admin;

--
-- Name: budgets; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.budgets (
    id text NOT NULL,
    name text NOT NULL,
    type text DEFAULT 'ANNUAL'::text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "totalBudget" double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    description text,
    "createdBy" text NOT NULL,
    "approvedBy" text,
    "approvedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.budgets OWNER TO admin;

--
-- Name: business_transactions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.business_transactions (
    id text NOT NULL,
    "transactionNo" text NOT NULL,
    "unitId" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    type text NOT NULL,
    category text NOT NULL,
    amount numeric(65,30) NOT NULL,
    "paymentMethod" text NOT NULL,
    "customerName" text,
    "supplierName" text,
    items text DEFAULT '[]'::text NOT NULL,
    description text,
    "receiptNo" text,
    "recordedBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.business_transactions OWNER TO admin;

--
-- Name: business_unit_reports; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.business_unit_reports (
    id text NOT NULL,
    "unitId" text NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    period text NOT NULL,
    "initialCapital" numeric(65,30) NOT NULL,
    revenue numeric(65,30) NOT NULL,
    expenses numeric(65,30) NOT NULL,
    "purchaseCost" numeric(65,30) NOT NULL,
    "operationalCost" numeric(65,30) NOT NULL,
    "salaryCost" numeric(65,30) NOT NULL,
    "maintenanceCost" numeric(65,30) NOT NULL,
    "otherCost" numeric(65,30) NOT NULL,
    "salesRevenue" numeric(65,30) NOT NULL,
    "serviceRevenue" numeric(65,30) NOT NULL,
    "otherRevenue" numeric(65,30) NOT NULL,
    "grossProfit" numeric(65,30) NOT NULL,
    "netProfit" numeric(65,30) NOT NULL,
    "profitMargin" numeric(65,30) NOT NULL,
    "inventoryValue" numeric(65,30),
    "totalTransactions" integer DEFAULT 0 NOT NULL,
    "totalCustomers" integer DEFAULT 0 NOT NULL,
    "totalItems" integer DEFAULT 0 NOT NULL,
    "revenueTarget" numeric(65,30),
    "targetAchievement" numeric(65,30),
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "submittedAt" timestamp(3) without time zone,
    "submittedBy" text,
    "approvedAt" timestamp(3) without time zone,
    "approvedBy" text,
    notes text,
    highlights text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.business_unit_reports OWNER TO admin;

--
-- Name: business_units; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.business_units (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "managerId" text,
    "managerName" text,
    "bankName" text,
    "bankAccount" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.business_units OWNER TO admin;

--
-- Name: campaign_updates; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.campaign_updates (
    id text NOT NULL,
    "campaignId" text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    images text DEFAULT '[]'::text NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.campaign_updates OWNER TO admin;

--
-- Name: classes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.classes (
    id text NOT NULL,
    name text NOT NULL,
    grade text NOT NULL,
    section text,
    "academicYearId" text NOT NULL,
    "teacherId" text,
    capacity integer DEFAULT 30 NOT NULL,
    room text,
    level text NOT NULL,
    program text,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.classes OWNER TO admin;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.courses (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    level text NOT NULL,
    schedule text NOT NULL,
    teacher text NOT NULL,
    duration text NOT NULL,
    capacity integer NOT NULL,
    enrolled integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.courses OWNER TO admin;

--
-- Name: curriculum_subjects; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.curriculum_subjects (
    id text NOT NULL,
    "curriculumId" text NOT NULL,
    "subjectId" text NOT NULL,
    grade text NOT NULL,
    semester integer,
    credits integer DEFAULT 2 NOT NULL,
    "isRequired" boolean DEFAULT true NOT NULL,
    "minScore" integer DEFAULT 60 NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.curriculum_subjects OWNER TO admin;

--
-- Name: curriculums; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.curriculums (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    level text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "validFrom" timestamp(3) without time zone NOT NULL,
    "validUntil" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.curriculums OWNER TO admin;

--
-- Name: donation_campaigns; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.donation_campaigns (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    story text,
    "categoryId" text NOT NULL,
    "targetAmount" numeric(65,30) NOT NULL,
    "currentAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone,
    "mainImage" text,
    images text DEFAULT '[]'::text NOT NULL,
    video text,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "isUrgent" boolean DEFAULT false NOT NULL,
    "allowAnonymous" boolean DEFAULT true NOT NULL,
    "shareCount" integer DEFAULT 0 NOT NULL,
    "createdBy" text NOT NULL,
    "approvedBy" text,
    "approvedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.donation_campaigns OWNER TO admin;

--
-- Name: donation_categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.donation_categories (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    icon text,
    color text,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.donation_categories OWNER TO admin;

--
-- Name: donations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.donations (
    id text NOT NULL,
    "donationNo" text NOT NULL,
    "campaignId" text,
    "categoryId" text NOT NULL,
    amount numeric(65,30) NOT NULL,
    message text,
    "donorName" text,
    "donorEmail" text,
    "donorPhone" text,
    "isAnonymous" boolean DEFAULT false NOT NULL,
    "paymentMethod" text,
    "paymentChannel" text,
    "paymentStatus" text DEFAULT 'PENDING'::text NOT NULL,
    "externalId" text,
    "vaNumber" text,
    "qrisCode" text,
    "paymentUrl" text,
    "expiredAt" timestamp(3) without time zone,
    "paidAt" timestamp(3) without time zone,
    "proofUrl" text,
    "verifiedBy" text,
    "verifiedAt" timestamp(3) without time zone,
    "certificateNo" text,
    "certificateUrl" text,
    source text DEFAULT 'WEB'::text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    referrer text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.donations OWNER TO admin;

--
-- Name: donor_profiles; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.donor_profiles (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    phone text,
    "preferredCategories" text DEFAULT '[]'::text NOT NULL,
    "allowMarketing" boolean DEFAULT true NOT NULL,
    "allowNewsletter" boolean DEFAULT true NOT NULL,
    "totalDonated" numeric(65,30) DEFAULT 0 NOT NULL,
    "donationCount" integer DEFAULT 0 NOT NULL,
    "lastDonationAt" timestamp(3) without time zone,
    "isVerified" boolean DEFAULT false NOT NULL,
    "verificationToken" text,
    "verifiedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.donor_profiles OWNER TO admin;

--
-- Name: ebooks; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ebooks (
    id text NOT NULL,
    title text NOT NULL,
    author text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    subcategory text,
    "fileUrl" text NOT NULL,
    "coverImage" text,
    "fileSize" integer,
    "pageCount" integer,
    language text DEFAULT 'id'::text NOT NULL,
    publisher text,
    "publishYear" text,
    isbn text,
    tags text DEFAULT '[]'::text NOT NULL,
    "downloadCount" integer DEFAULT 0 NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ebooks OWNER TO admin;

--
-- Name: exam_results; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.exam_results (
    id text NOT NULL,
    "examId" text NOT NULL,
    "studentId" text NOT NULL,
    score numeric(65,30) NOT NULL,
    grade text,
    point numeric(65,30),
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    notes text,
    "enteredBy" text,
    "enteredAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.exam_results OWNER TO admin;

--
-- Name: exams; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.exams (
    id text NOT NULL,
    name text NOT NULL,
    code text,
    type text NOT NULL,
    "subjectId" text NOT NULL,
    "classId" text NOT NULL,
    "semesterId" text NOT NULL,
    "teacherId" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    duration integer NOT NULL,
    room text,
    "maxScore" numeric(65,30) DEFAULT 100 NOT NULL,
    "minScore" numeric(65,30) DEFAULT 0 NOT NULL,
    "passingScore" numeric(65,30) DEFAULT 60 NOT NULL,
    instructions text,
    materials text DEFAULT '[]'::text NOT NULL,
    status text DEFAULT 'SCHEDULED'::text NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.exams OWNER TO admin;

--
-- Name: financial_accounts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.financial_accounts (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    subtype text,
    "parentId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    balance double precision DEFAULT 0 NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.financial_accounts OWNER TO admin;

--
-- Name: financial_categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.financial_categories (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    code text,
    "accountId" text NOT NULL,
    color text,
    icon text,
    "isActive" boolean DEFAULT true NOT NULL,
    description text,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.financial_categories OWNER TO admin;

--
-- Name: financial_reports; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.financial_reports (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    period text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "budgetId" text,
    data text NOT NULL,
    "fileUrl" text,
    status text DEFAULT 'GENERATED'::text NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.financial_reports OWNER TO admin;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.grades (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "subjectId" text NOT NULL,
    "semesterId" text NOT NULL,
    "classId" text,
    midterm numeric(65,30),
    final numeric(65,30),
    assignment numeric(65,30),
    quiz numeric(65,30),
    participation numeric(65,30),
    project numeric(65,30),
    daily numeric(65,30),
    total numeric(65,30),
    grade text,
    point numeric(65,30),
    akhlak text,
    "quranMemory" text,
    notes text,
    "isLocked" boolean DEFAULT false NOT NULL,
    "enteredBy" text,
    "enteredAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.grades OWNER TO admin;

--
-- Name: hafalan_achievements; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.hafalan_achievements (
    id text NOT NULL,
    "studentId" text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    data text DEFAULT '{}'::text NOT NULL,
    level text DEFAULT 'BRONZE'::text NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    icon text,
    color text DEFAULT '#10B981'::text NOT NULL,
    badge text,
    "verifiedBy" text,
    "verifiedAt" timestamp(3) without time zone,
    "isPublic" boolean DEFAULT true NOT NULL,
    celebrated boolean DEFAULT false NOT NULL,
    "shareCount" integer DEFAULT 0 NOT NULL,
    "earnedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.hafalan_achievements OWNER TO admin;

--
-- Name: hafalan_progress; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.hafalan_progress (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "totalSurah" integer DEFAULT 0 NOT NULL,
    "totalAyat" integer DEFAULT 0 NOT NULL,
    "totalJuz" numeric(65,30) DEFAULT 0 NOT NULL,
    "currentSurah" integer,
    "currentAyat" integer DEFAULT 1 NOT NULL,
    "currentTarget" text,
    level text DEFAULT 'PEMULA'::text NOT NULL,
    badge text DEFAULT '[]'::text NOT NULL,
    "juz30Progress" numeric(65,30) DEFAULT 0 NOT NULL,
    "overallProgress" numeric(65,30) DEFAULT 0 NOT NULL,
    "lastSetoranDate" timestamp(3) without time zone,
    "lastMurajaahDate" timestamp(3) without time zone,
    "lastUpdated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "currentStreak" integer DEFAULT 0 NOT NULL,
    "longestStreak" integer DEFAULT 0 NOT NULL,
    "totalSessions" integer DEFAULT 0 NOT NULL,
    "avgQuality" numeric(65,30) DEFAULT 0 NOT NULL,
    "avgFluency" numeric(65,30) DEFAULT 0 NOT NULL,
    "avgTajweed" numeric(65,30) DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.hafalan_progress OWNER TO admin;

--
-- Name: hafalan_records; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.hafalan_records (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "surahNumber" integer NOT NULL,
    "startAyat" integer DEFAULT 1 NOT NULL,
    "endAyat" integer NOT NULL,
    status text NOT NULL,
    quality text DEFAULT 'B'::text NOT NULL,
    "teacherId" text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fluency text,
    tajweed text,
    makharijul text,
    "voiceNoteUrl" text,
    notes text,
    corrections text,
    duration integer,
    method text DEFAULT 'INDIVIDUAL'::text NOT NULL,
    "previousRecord" text,
    "nextTarget" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.hafalan_records OWNER TO admin;

--
-- Name: hafalan_sessions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.hafalan_sessions (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "teacherId" text NOT NULL,
    "sessionDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type text NOT NULL,
    method text DEFAULT 'INDIVIDUAL'::text NOT NULL,
    duration integer NOT NULL,
    location text DEFAULT 'KELAS'::text NOT NULL,
    atmosphere text DEFAULT 'FORMAL'::text NOT NULL,
    content text NOT NULL,
    "totalAyat" integer DEFAULT 0 NOT NULL,
    "overallQuality" text NOT NULL,
    "overallFluency" text NOT NULL,
    improvements text,
    challenges text,
    homework text,
    "nextTarget" text,
    "reminderNote" text,
    "studentMood" text DEFAULT 'NORMAL'::text NOT NULL,
    engagement text DEFAULT 'GOOD'::text NOT NULL,
    confidence text DEFAULT 'MEDIUM'::text NOT NULL,
    "reportSent" boolean DEFAULT false NOT NULL,
    "parentFeedback" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.hafalan_sessions OWNER TO admin;

--
-- Name: hafalan_targets; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.hafalan_targets (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "targetSurah" integer NOT NULL,
    "startAyat" integer DEFAULT 1 NOT NULL,
    "endAyat" integer,
    "targetDate" timestamp(3) without time zone NOT NULL,
    priority text DEFAULT 'MEDIUM'::text NOT NULL,
    difficulty text DEFAULT 'MEDIUM'::text NOT NULL,
    "estimatedDays" integer,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    progress numeric(65,30) DEFAULT 0 NOT NULL,
    "startedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    reward text,
    motivation text,
    "parentInformed" boolean DEFAULT false NOT NULL,
    "createdBy" text NOT NULL,
    "approvedBy" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.hafalan_targets OWNER TO admin;

--
-- Name: inventory; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.inventory (
    id text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    location text NOT NULL,
    "unitCost" numeric(65,30) DEFAULT 0 NOT NULL,
    "batchNo" text,
    "expiryDate" timestamp(3) without time zone,
    "lastUpdated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedBy" text,
    notes text
);


ALTER TABLE public.inventory OWNER TO admin;

--
-- Name: inventory_transactions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.inventory_transactions (
    id text NOT NULL,
    "productId" text NOT NULL,
    type text NOT NULL,
    quantity integer NOT NULL,
    location text NOT NULL,
    "unitCost" numeric(65,30) DEFAULT 0 NOT NULL,
    "totalCost" numeric(65,30) DEFAULT 0 NOT NULL,
    reference text,
    "referenceId" text,
    "batchNo" text,
    reason text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" text
);


ALTER TABLE public.inventory_transactions OWNER TO admin;

--
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.journal_entries (
    id text NOT NULL,
    "entryNo" text NOT NULL,
    "transactionId" text,
    description text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    reference text,
    status text DEFAULT 'POSTED'::text NOT NULL,
    "totalDebit" double precision DEFAULT 0 NOT NULL,
    "totalCredit" double precision DEFAULT 0 NOT NULL,
    "isBalanced" boolean DEFAULT false NOT NULL,
    "createdBy" text NOT NULL,
    "approvedBy" text,
    "approvedAt" timestamp(3) without time zone,
    "reversedBy" text,
    "reversedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.journal_entries OWNER TO admin;

--
-- Name: journal_entry_lines; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.journal_entry_lines (
    id text NOT NULL,
    "journalId" text NOT NULL,
    "accountId" text NOT NULL,
    "debitAmount" double precision DEFAULT 0 NOT NULL,
    "creditAmount" double precision DEFAULT 0 NOT NULL,
    description text,
    "lineOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.journal_entry_lines OWNER TO admin;

--
-- Name: line_admins; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.line_admins (
    id text NOT NULL,
    "lineUserId" text NOT NULL,
    "userId" text,
    permissions text[] DEFAULT ARRAY['BASIC'::text],
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.line_admins OWNER TO admin;

--
-- Name: line_settings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.line_settings (
    id text NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    "channelId" text,
    "channelSecret" text,
    "channelAccessToken" text,
    "webhookUrl" text,
    "liffId" text,
    "richMenuId" text,
    "richMenuEnabled" boolean DEFAULT true NOT NULL,
    "flexMessagesEnabled" boolean DEFAULT true NOT NULL,
    "quickReplyEnabled" boolean DEFAULT true NOT NULL,
    "broadcastEnabled" boolean DEFAULT true NOT NULL,
    "liffEnabled" boolean DEFAULT false NOT NULL,
    "multicastEnabled" boolean DEFAULT true NOT NULL,
    "pushMessagesEnabled" boolean DEFAULT true NOT NULL,
    "messagesPerMinute" integer DEFAULT 60 NOT NULL,
    "broadcastDelay" integer DEFAULT 500 NOT NULL,
    "welcomeMessage" text DEFAULT 'Selamat datang di LINE Official Account Pondok Imam Syafii!'::text NOT NULL,
    "unknownMessage" text DEFAULT 'Maaf, pesan tidak dikenali. Ketik ''menu'' untuk bantuan.'::text NOT NULL,
    "errorMessage" text DEFAULT 'Maaf, terjadi kesalahan. Silakan coba lagi.'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.line_settings OWNER TO admin;

--
-- Name: line_user_sessions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.line_user_sessions (
    id text NOT NULL,
    "userId" text NOT NULL,
    mode text DEFAULT 'PUBLIC'::text NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL,
    permissions text[] DEFAULT ARRAY[]::text[],
    "activeFlowId" text,
    "flowType" text,
    "flowData" jsonb DEFAULT '{}'::jsonb NOT NULL,
    "currentStep" integer DEFAULT 0 NOT NULL,
    "totalSteps" integer DEFAULT 0 NOT NULL,
    "stepHistory" text[] DEFAULT ARRAY[]::text[],
    state jsonb DEFAULT '{}'::jsonb NOT NULL,
    breadcrumb text[] DEFAULT ARRAY[]::text[],
    "waitingFor" text,
    "canAbort" boolean DEFAULT true NOT NULL,
    "retryCount" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "expiresAt" timestamp(3) without time zone
);


ALTER TABLE public.line_user_sessions OWNER TO admin;

--
-- Name: line_users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.line_users (
    id text NOT NULL,
    "userId" text NOT NULL,
    "displayName" text,
    "pictureUrl" text,
    "statusMessage" text,
    language text,
    "isAdmin" boolean DEFAULT false NOT NULL,
    "canCRUD" boolean DEFAULT false NOT NULL,
    "lastActive" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "messageCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.line_users OWNER TO admin;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.messages (
    id text NOT NULL,
    "senderId" text NOT NULL,
    "receiverId" text NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    "parentMessageId" text,
    "threadId" text,
    type text DEFAULT 'NORMAL'::text NOT NULL,
    priority text DEFAULT 'NORMAL'::text NOT NULL,
    attachments text DEFAULT '[]'::text NOT NULL,
    status text DEFAULT 'SENT'::text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "repliedAt" timestamp(3) without time zone,
    "isAutoReply" boolean DEFAULT false NOT NULL,
    "scheduledFor" timestamp(3) without time zone,
    "sentAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.messages OWNER TO admin;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    data text DEFAULT '{}'::text NOT NULL,
    "actionUrl" text,
    "actionText" text,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    channels text DEFAULT '["in_app"]'::text NOT NULL,
    "emailSent" boolean DEFAULT false NOT NULL,
    "emailSentAt" timestamp(3) without time zone,
    "pushSent" boolean DEFAULT false NOT NULL,
    "pushSentAt" timestamp(3) without time zone,
    "smsSent" boolean DEFAULT false NOT NULL,
    "smsSentAt" timestamp(3) without time zone,
    "scheduledFor" timestamp(3) without time zone,
    "expiresAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.notifications OWNER TO admin;

--
-- Name: ota_programs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ota_programs (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "monthlyTarget" numeric(65,30) NOT NULL,
    "currentMonth" text NOT NULL,
    "totalCollected" numeric(65,30) DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "programStart" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastUpdate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "monthlyProgress" numeric(65,30) DEFAULT 0 NOT NULL,
    "monthsCompleted" integer DEFAULT 0 NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "showProgress" boolean DEFAULT true NOT NULL,
    "adminNotes" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ota_programs OWNER TO admin;

--
-- Name: ota_reports; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ota_reports (
    id text NOT NULL,
    month text NOT NULL,
    year text NOT NULL,
    "reportType" text NOT NULL,
    "totalTarget" numeric(65,30) NOT NULL,
    "totalCollected" numeric(65,30) NOT NULL,
    "totalDistributed" numeric(65,30) NOT NULL,
    "totalPending" numeric(65,30) DEFAULT 0 NOT NULL,
    "totalOrphans" integer NOT NULL,
    "fullyFundedCount" integer DEFAULT 0 NOT NULL,
    "partialFundedCount" integer DEFAULT 0 NOT NULL,
    "unfundedCount" integer DEFAULT 0 NOT NULL,
    "totalDonors" integer DEFAULT 0 NOT NULL,
    "newDonors" integer DEFAULT 0 NOT NULL,
    "recurringDonors" integer DEFAULT 0 NOT NULL,
    details text DEFAULT '{}'::text NOT NULL,
    "carryOverAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "surplusAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "generatedBy" text NOT NULL,
    "approvedBy" text,
    "approvedAt" timestamp(3) without time zone,
    "distributedAt" timestamp(3) without time zone,
    "distributedBy" text,
    "distributionNotes" text,
    "reportFileUrl" text,
    "proofFileUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ota_reports OWNER TO admin;

--
-- Name: ota_sponsors; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ota_sponsors (
    id text NOT NULL,
    "programId" text NOT NULL,
    "donorName" text NOT NULL,
    "donorEmail" text,
    "donorPhone" text,
    "publicName" text DEFAULT 'Hamba Allah'::text NOT NULL,
    amount numeric(65,30) NOT NULL,
    month text NOT NULL,
    "isPaid" boolean DEFAULT false NOT NULL,
    "paymentMethod" text,
    "paymentProof" text,
    "paymentDate" timestamp(3) without time zone,
    "verifiedBy" text,
    "verifiedAt" timestamp(3) without time zone,
    "externalId" text,
    "paymentStatus" text DEFAULT 'PENDING'::text NOT NULL,
    "donationType" text DEFAULT 'REGULAR'::text NOT NULL,
    "isRecurring" boolean DEFAULT false NOT NULL,
    "allowPublicDisplay" boolean DEFAULT true NOT NULL,
    "allowContact" boolean DEFAULT false NOT NULL,
    "donorMessage" text,
    "adminNotes" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ota_sponsors OWNER TO admin;

--
-- Name: parent_accounts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.parent_accounts (
    id text NOT NULL,
    "userId" text NOT NULL,
    "phoneNumber" text,
    whatsapp text,
    "emergencyContact" text,
    "notificationSettings" text DEFAULT '{"grades": true, "attendance": true, "payments": true, "announcements": true, "messages": true, "pushNotifications": true, "emailNotifications": true}'::text NOT NULL,
    "preferredLanguage" text DEFAULT 'id'::text NOT NULL,
    timezone text DEFAULT 'Asia/Jakarta'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.parent_accounts OWNER TO admin;

--
-- Name: parent_students; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.parent_students (
    id text NOT NULL,
    "parentId" text NOT NULL,
    "studentId" text NOT NULL,
    relationship text NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "canViewGrades" boolean DEFAULT true NOT NULL,
    "canViewAttendance" boolean DEFAULT true NOT NULL,
    "canViewPayments" boolean DEFAULT true NOT NULL,
    "canReceiveMessages" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.parent_students OWNER TO admin;

--
-- Name: payment_history; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.payment_history (
    id text NOT NULL,
    "billId" text NOT NULL,
    "paymentId" text,
    "studentId" text NOT NULL,
    action text NOT NULL,
    description text NOT NULL,
    "previousAmount" numeric(65,30),
    "newAmount" numeric(65,30),
    "changeAmount" numeric(65,30),
    "performedBy" text,
    metadata text DEFAULT '{}'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.payment_history OWNER TO admin;

--
-- Name: payment_reminders; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.payment_reminders (
    id text NOT NULL,
    "billId" text NOT NULL,
    "studentId" text NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    subject text,
    message text NOT NULL,
    "scheduledAt" timestamp(3) without time zone NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "deliveredAt" timestamp(3) without time zone,
    "readAt" timestamp(3) without time zone,
    "respondedAt" timestamp(3) without time zone,
    response text,
    "recipientEmail" text,
    "recipientPhone" text,
    "deliveryAttempts" integer DEFAULT 0 NOT NULL,
    "maxAttempts" integer DEFAULT 3 NOT NULL,
    "lastAttemptAt" timestamp(3) without time zone,
    "failureReason" text,
    "templateUsed" text,
    metadata text DEFAULT '{}'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payment_reminders OWNER TO admin;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.payments (
    id text NOT NULL,
    "paymentNo" text NOT NULL,
    "billId" text,
    "registrationId" text,
    "studentId" text,
    amount numeric(65,30) NOT NULL,
    "paymentType" text NOT NULL,
    description text,
    method text NOT NULL,
    channel text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "proofUrl" text,
    "verifiedBy" text,
    "verifiedAt" timestamp(3) without time zone,
    "externalId" text,
    "transactionId" text,
    "paymentUrl" text,
    "vaNumber" text,
    "qrString" text,
    deeplink text,
    "expiredAt" timestamp(3) without time zone,
    "paymentGatewayData" text DEFAULT '{}'::text NOT NULL,
    "merchantId" text,
    "fraudStatus" text,
    "cardType" text,
    "maskedCard" text,
    "approvalCode" text,
    "paidAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payments OWNER TO admin;

--
-- Name: ppdb_activities; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ppdb_activities (
    id text NOT NULL,
    "registrationId" text NOT NULL,
    activity text NOT NULL,
    description text NOT NULL,
    metadata text,
    "performedBy" text,
    "performedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.ppdb_activities OWNER TO admin;

--
-- Name: ppdb_registrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ppdb_registrations (
    id text NOT NULL,
    "registrationNo" text NOT NULL,
    level text NOT NULL,
    "academicYear" text NOT NULL,
    "fullName" text NOT NULL,
    nickname text,
    "birthPlace" text NOT NULL,
    "birthDate" timestamp(3) without time zone NOT NULL,
    gender text NOT NULL,
    "bloodType" text,
    religion text DEFAULT 'ISLAM'::text NOT NULL,
    nationality text DEFAULT 'INDONESIA'::text NOT NULL,
    nik text,
    nisn text,
    "birthCertNo" text,
    "familyCardNo" text,
    phone text,
    email text,
    address text NOT NULL,
    rt text,
    rw text,
    village text NOT NULL,
    district text NOT NULL,
    city text NOT NULL,
    province text NOT NULL,
    "postalCode" text,
    "previousSchool" text,
    "previousGrade" text,
    "previousNISN" text,
    "graduationYear" integer,
    "fatherName" text NOT NULL,
    "fatherNIK" text,
    "fatherBirth" timestamp(3) without time zone,
    "fatherEducation" text,
    "fatherOccupation" text,
    "fatherPhone" text,
    "fatherIncome" numeric(65,30),
    "motherName" text NOT NULL,
    "motherNIK" text,
    "motherBirth" timestamp(3) without time zone,
    "motherEducation" text,
    "motherOccupation" text,
    "motherPhone" text,
    "motherIncome" numeric(65,30),
    "guardianName" text,
    "guardianNIK" text,
    "guardianRelation" text,
    "guardianPhone" text,
    "guardianAddress" text,
    "hasSpecialNeeds" boolean DEFAULT false NOT NULL,
    "specialNeeds" text,
    "healthConditions" text,
    allergies text,
    documents text DEFAULT '[]'::text NOT NULL,
    "photoUrl" text,
    "birthCertUrl" text,
    "familyCardUrl" text,
    "transcriptUrl" text,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "testSchedule" timestamp(3) without time zone,
    "testScore" numeric(65,30),
    "testNotes" text,
    "interviewSchedule" timestamp(3) without time zone,
    "interviewScore" numeric(65,30),
    "interviewNotes" text,
    "acceptedAt" timestamp(3) without time zone,
    "acceptedBy" text,
    "acceptanceNo" text,
    "enrolledAt" timestamp(3) without time zone,
    "studentId" text,
    "registrationFee" numeric(65,30),
    "paymentStatus" text DEFAULT 'UNPAID'::text NOT NULL,
    "paymentProof" text,
    "internalNotes" text,
    "publicNotes" text,
    "submittedAt" timestamp(3) without time zone,
    "reviewedBy" text,
    "reviewedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ppdb_registrations OWNER TO admin;

--
-- Name: ppdb_settings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ppdb_settings (
    id text NOT NULL,
    "academicYear" text NOT NULL,
    "openDate" timestamp(3) without time zone NOT NULL,
    "closeDate" timestamp(3) without time zone NOT NULL,
    "quotaTK" integer DEFAULT 30 NOT NULL,
    "quotaSD" integer DEFAULT 60 NOT NULL,
    "quotaSMP" integer DEFAULT 40 NOT NULL,
    "quotaPondok" integer DEFAULT 50 NOT NULL,
    "registrationFeeTK" numeric(65,30) DEFAULT 100000 NOT NULL,
    "registrationFeeSD" numeric(65,30) DEFAULT 150000 NOT NULL,
    "registrationFeeSMP" numeric(65,30) DEFAULT 200000 NOT NULL,
    "registrationFeePondok" numeric(65,30) DEFAULT 250000 NOT NULL,
    "testEnabled" boolean DEFAULT true NOT NULL,
    "testPassScore" numeric(65,30) DEFAULT 60 NOT NULL,
    "interviewEnabled" boolean DEFAULT true NOT NULL,
    "interviewPassScore" numeric(65,30) DEFAULT 70 NOT NULL,
    "requiredDocs" text DEFAULT '[]'::text NOT NULL,
    "acceptanceTemplate" text,
    "rejectionTemplate" text,
    "lastRegistrationNo" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ppdb_settings OWNER TO admin;

--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.product_categories (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    icon text,
    color text,
    "isActive" boolean DEFAULT true NOT NULL,
    "parentId" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product_categories OWNER TO admin;

--
-- Name: products; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.products (
    id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    "categoryId" text NOT NULL,
    price numeric(65,30) NOT NULL,
    cost numeric(65,30) DEFAULT 0 NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "minStock" integer DEFAULT 5 NOT NULL,
    unit text DEFAULT 'pcs'::text NOT NULL,
    image text,
    "isActive" boolean DEFAULT true NOT NULL,
    brand text,
    supplier text,
    location text DEFAULT 'UMUM'::text NOT NULL,
    tags text DEFAULT '[]'::text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.products OWNER TO admin;

--
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.purchase_order_items (
    id text NOT NULL,
    "purchaseOrderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    "unitCost" numeric(65,30) NOT NULL,
    "totalCost" numeric(65,30) NOT NULL,
    "receivedQty" integer DEFAULT 0 NOT NULL,
    "remainingQty" integer NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.purchase_order_items OWNER TO admin;

--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.purchase_orders (
    id text NOT NULL,
    "orderNo" text NOT NULL,
    "supplierId" text NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "orderDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expectedDate" timestamp(3) without time zone,
    "receivedDate" timestamp(3) without time zone,
    subtotal numeric(65,30) DEFAULT 0 NOT NULL,
    "taxAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "shippingCost" numeric(65,30) DEFAULT 0 NOT NULL,
    "totalAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "paymentStatus" text DEFAULT 'UNPAID'::text NOT NULL,
    "paidAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    notes text,
    terms text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text NOT NULL
);


ALTER TABLE public.purchase_orders OWNER TO admin;

--
-- Name: push_subscriptions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.push_subscriptions (
    id text NOT NULL,
    "userId" text NOT NULL,
    endpoint text NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.push_subscriptions OWNER TO admin;

--
-- Name: questions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.questions (
    id text NOT NULL,
    question text NOT NULL,
    category text NOT NULL,
    "askerName" text,
    "isAnonymous" boolean DEFAULT false NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.questions OWNER TO admin;

--
-- Name: quran_surahs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.quran_surahs (
    id text NOT NULL,
    number integer NOT NULL,
    name text NOT NULL,
    "nameArabic" text NOT NULL,
    "nameTransliteration" text,
    "totalAyat" integer NOT NULL,
    juz integer NOT NULL,
    page integer,
    type text NOT NULL,
    revelation integer,
    "meaningId" text,
    "meaningAr" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.quran_surahs OWNER TO admin;

--
-- Name: registrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.registrations (
    id text NOT NULL,
    "registrationNo" text NOT NULL,
    "fullName" text NOT NULL,
    nickname text,
    gender text NOT NULL,
    "birthPlace" text NOT NULL,
    "birthDate" timestamp(3) without time zone NOT NULL,
    nik text,
    nisn text,
    address text NOT NULL,
    rt text,
    rw text,
    village text NOT NULL,
    district text NOT NULL,
    city text NOT NULL,
    province text DEFAULT 'Jawa Timur'::text NOT NULL,
    "postalCode" text,
    level text NOT NULL,
    "previousSchool" text,
    "gradeTarget" text,
    "programType" text,
    "boardingType" text,
    "fatherName" text NOT NULL,
    "fatherNik" text,
    "fatherJob" text,
    "fatherPhone" text,
    "fatherEducation" text,
    "fatherIncome" text,
    "motherName" text NOT NULL,
    "motherNik" text,
    "motherJob" text,
    "motherPhone" text,
    "motherEducation" text,
    "motherIncome" text,
    "guardianName" text,
    "guardianRelation" text,
    "guardianPhone" text,
    "guardianAddress" text,
    "phoneNumber" text NOT NULL,
    whatsapp text NOT NULL,
    email text,
    "bloodType" text,
    height integer,
    weight integer,
    "specialNeeds" text,
    "medicalHistory" text,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "paymentStatus" text DEFAULT 'UNPAID'::text NOT NULL,
    documents text DEFAULT '[]'::text NOT NULL,
    "testSchedule" timestamp(3) without time zone,
    "testVenue" text,
    "testScore" text,
    "testResult" text,
    ranking integer,
    "registrationFee" numeric(65,30) DEFAULT 150000 NOT NULL,
    "paymentMethod" text,
    "paymentDate" timestamp(3) without time zone,
    "paymentProof" text,
    "reregStatus" text,
    "reregDate" timestamp(3) without time zone,
    "reregPayment" text,
    notes text,
    "verifiedBy" text,
    "verifiedAt" timestamp(3) without time zone,
    "rejectionReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "submittedAt" timestamp(3) without time zone
);


ALTER TABLE public.registrations OWNER TO admin;

--
-- Name: report_cards; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.report_cards (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "semesterId" text NOT NULL,
    "classId" text NOT NULL,
    "totalScore" numeric(65,30),
    rank integer,
    "totalSubjects" integer DEFAULT 0 NOT NULL,
    "totalDays" integer DEFAULT 0 NOT NULL,
    "presentDays" integer DEFAULT 0 NOT NULL,
    "sickDays" integer DEFAULT 0 NOT NULL,
    "permittedDays" integer DEFAULT 0 NOT NULL,
    "absentDays" integer DEFAULT 0 NOT NULL,
    "lateDays" integer DEFAULT 0 NOT NULL,
    "attendancePercentage" numeric(65,30),
    behavior text,
    personality text DEFAULT '{}'::text NOT NULL,
    extracurricular text DEFAULT '[]'::text NOT NULL,
    achievements text DEFAULT '[]'::text NOT NULL,
    notes text,
    recommendations text,
    "parentNotes" text,
    "generatedAt" timestamp(3) without time zone,
    "generatedBy" text,
    "printedAt" timestamp(3) without time zone,
    "signedAt" timestamp(3) without time zone,
    "signedBy" text,
    "pdfUrl" text,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.report_cards OWNER TO admin;

--
-- Name: sale_items; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.sale_items (
    id text NOT NULL,
    "saleId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(65,30) NOT NULL,
    "unitCost" numeric(65,30) NOT NULL,
    subtotal numeric(65,30) NOT NULL,
    "discountAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "finalAmount" numeric(65,30) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sale_items OWNER TO admin;

--
-- Name: sales; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.sales (
    id text NOT NULL,
    "saleNo" text NOT NULL,
    "customerName" text,
    "customerPhone" text,
    "customerEmail" text,
    location text DEFAULT 'KOPERASI'::text NOT NULL,
    "saleDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    subtotal numeric(65,30) NOT NULL,
    "taxAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "discountAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "totalAmount" numeric(65,30) NOT NULL,
    "paymentMethod" text DEFAULT 'CASH'::text NOT NULL,
    "paidAmount" numeric(65,30) NOT NULL,
    "changeAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "paymentReference" text,
    cashier text NOT NULL,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sales OWNER TO admin;

--
-- Name: schedules; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.schedules (
    id text NOT NULL,
    "classId" text NOT NULL,
    "subjectId" text NOT NULL,
    "teacherId" text NOT NULL,
    day text NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    room text,
    period integer,
    "isActive" boolean DEFAULT true NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.schedules OWNER TO admin;

--
-- Name: security_audit_logs; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.security_audit_logs (
    id text NOT NULL,
    "userId" text NOT NULL,
    event text NOT NULL,
    metadata jsonb,
    "ipAddress" text DEFAULT 'unknown'::text NOT NULL,
    "userAgent" text DEFAULT 'unknown'::text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.security_audit_logs OWNER TO admin;

--
-- Name: semesters; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.semesters (
    id text NOT NULL,
    "academicYearId" text NOT NULL,
    name text NOT NULL,
    "shortName" text,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "gradingDeadline" timestamp(3) without time zone,
    "reportDeadline" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.semesters OWNER TO admin;

--
-- Name: setoran_schedules; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.setoran_schedules (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "teacherId" text NOT NULL,
    "dayOfWeek" text NOT NULL,
    "time" text NOT NULL,
    type text DEFAULT 'SETORAN_BARU'::text NOT NULL,
    duration integer DEFAULT 15 NOT NULL,
    location text,
    "maxStudents" integer DEFAULT 1 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone,
    "isRecurring" boolean DEFAULT true NOT NULL,
    frequency text DEFAULT 'WEEKLY'::text NOT NULL,
    "reminderMinutes" integer DEFAULT 60 NOT NULL,
    "notifyParent" boolean DEFAULT true NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.setoran_schedules OWNER TO admin;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.settings (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.settings OWNER TO admin;

--
-- Name: spp_billings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.spp_billings (
    id text NOT NULL,
    "billNo" text NOT NULL,
    "studentId" text NOT NULL,
    "classId" text NOT NULL,
    "semesterId" text NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    "sppAmount" numeric(65,30) NOT NULL,
    "booksFee" numeric(65,30),
    "uniformFee" numeric(65,30),
    "activityFee" numeric(65,30),
    "examFee" numeric(65,30),
    "otherFees" text DEFAULT '[]'::text NOT NULL,
    subtotal numeric(65,30) NOT NULL,
    discount numeric(65,30) DEFAULT 0 NOT NULL,
    "discountType" text,
    "discountReason" text,
    "totalAmount" numeric(65,30) NOT NULL,
    status text DEFAULT 'UNPAID'::text NOT NULL,
    "paidAmount" numeric(65,30) DEFAULT 0 NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "isOverdue" boolean DEFAULT false NOT NULL,
    "overdueDays" integer DEFAULT 0 NOT NULL,
    "lateFee" numeric(65,30) DEFAULT 0 NOT NULL,
    "paidAt" timestamp(3) without time zone,
    "paymentMethod" text,
    "paymentRef" text,
    notes text,
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "generatedBy" text,
    "cancelledAt" timestamp(3) without time zone,
    "cancelledBy" text,
    "cancelReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.spp_billings OWNER TO admin;

--
-- Name: spp_payments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.spp_payments (
    id text NOT NULL,
    "paymentNo" text NOT NULL,
    "billingId" text NOT NULL,
    amount numeric(65,30) NOT NULL,
    "paymentDate" timestamp(3) without time zone NOT NULL,
    "paymentMethod" text NOT NULL,
    "bankName" text,
    "accountNo" text,
    "accountName" text,
    "proofUrl" text,
    "externalId" text,
    "vaNumber" text,
    "paymentUrl" text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "verifiedBy" text,
    "verifiedAt" timestamp(3) without time zone,
    "receiptNo" text,
    "receiptUrl" text,
    notes text,
    "recordedBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.spp_payments OWNER TO admin;

--
-- Name: spp_reminders; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.spp_reminders (
    id text NOT NULL,
    "billingId" text NOT NULL,
    type text NOT NULL,
    recipient text NOT NULL,
    subject text,
    message text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "sentAt" timestamp(3) without time zone,
    "failReason" text,
    "scheduledFor" timestamp(3) without time zone NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    "maxAttempts" integer DEFAULT 3 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.spp_reminders OWNER TO admin;

--
-- Name: spp_reports; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.spp_reports (
    id text NOT NULL,
    "reportType" text NOT NULL,
    period text NOT NULL,
    filters text DEFAULT '{}'::text NOT NULL,
    data text NOT NULL,
    summary text NOT NULL,
    "pdfUrl" text,
    "excelUrl" text,
    "generatedBy" text NOT NULL,
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.spp_reports OWNER TO admin;

--
-- Name: spp_settings; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.spp_settings (
    id text NOT NULL,
    level text NOT NULL,
    "monthlyFee" numeric(65,30) NOT NULL,
    "enrollmentFee" numeric(65,30),
    "reEnrollmentFee" numeric(65,30),
    "developmentFee" numeric(65,30),
    "booksFee" numeric(65,30),
    "uniformFee" numeric(65,30),
    "activityFee" numeric(65,30),
    "examFee" numeric(65,30),
    "dueDateDay" integer DEFAULT 10 NOT NULL,
    "lateFeeType" text DEFAULT 'FIXED'::text NOT NULL,
    "lateFeeAmount" numeric(65,30) DEFAULT 10000 NOT NULL,
    "maxLateDays" integer DEFAULT 30 NOT NULL,
    "discountSibling" numeric(65,30) DEFAULT 10 NOT NULL,
    "discountOrphan" numeric(65,30) DEFAULT 50 NOT NULL,
    "discountStaff" numeric(65,30) DEFAULT 25 NOT NULL,
    "reminderDays" text DEFAULT '[7, 3, 1, -1, -3, -7]'::text NOT NULL,
    "reminderChannels" text DEFAULT '["WHATSAPP"]'::text NOT NULL,
    "billTemplate" text,
    "receiptTemplate" text,
    "reminderTemplate" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.spp_settings OWNER TO admin;

--
-- Name: student_classes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.student_classes (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "classId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "rollNumber" text,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "joinDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "leaveDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.student_classes OWNER TO admin;

--
-- Name: students; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.students (
    id text NOT NULL,
    nisn text,
    nis text NOT NULL,
    "fullName" text NOT NULL,
    nickname text,
    "birthPlace" text NOT NULL,
    "birthDate" timestamp(3) without time zone NOT NULL,
    gender text NOT NULL,
    "bloodType" text,
    religion text DEFAULT 'Islam'::text NOT NULL,
    nationality text DEFAULT 'Indonesia'::text NOT NULL,
    address text NOT NULL,
    village text,
    district text,
    city text NOT NULL,
    province text DEFAULT 'Jawa Timur'::text NOT NULL,
    "postalCode" text,
    phone text,
    email text,
    "fatherName" text NOT NULL,
    "fatherJob" text,
    "fatherPhone" text,
    "fatherEducation" text,
    "motherName" text NOT NULL,
    "motherJob" text,
    "motherPhone" text,
    "motherEducation" text,
    "guardianName" text,
    "guardianJob" text,
    "guardianPhone" text,
    "guardianRelation" text,
    "institutionType" text NOT NULL,
    grade text,
    "enrollmentDate" timestamp(3) without time zone NOT NULL,
    "enrollmentYear" text NOT NULL,
    "previousSchool" text,
    "specialNeeds" text,
    achievements text DEFAULT '[]'::text NOT NULL,
    notes text,
    photo text,
    documents text DEFAULT '[]'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "graduationDate" timestamp(3) without time zone,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "registrationId" text,
    "isOrphan" boolean DEFAULT false NOT NULL,
    "monthlyNeeds" numeric(65,30),
    "otaProfile" text
);


ALTER TABLE public.students OWNER TO admin;

--
-- Name: subjects; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.subjects (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "nameArabic" text,
    description text,
    credits integer DEFAULT 2 NOT NULL,
    type text DEFAULT 'WAJIB'::text NOT NULL,
    category text DEFAULT 'UMUM'::text NOT NULL,
    level text NOT NULL,
    "minGrade" text,
    "maxGrade" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.subjects OWNER TO admin;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.suppliers (
    id text NOT NULL,
    name text NOT NULL,
    code text,
    contact text,
    address text,
    phone text,
    email text,
    whatsapp text,
    "taxId" text,
    "bankAccount" text,
    "paymentTerms" text,
    "isActive" boolean DEFAULT true NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.suppliers OWNER TO admin;

--
-- Name: teacher_subjects; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.teacher_subjects (
    id text NOT NULL,
    "teacherId" text NOT NULL,
    "subjectId" text NOT NULL,
    "classId" text NOT NULL,
    "semesterId" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.teacher_subjects OWNER TO admin;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.teachers (
    id text NOT NULL,
    nip text,
    name text NOT NULL,
    title text,
    gender text NOT NULL,
    "birthPlace" text,
    "birthDate" timestamp(3) without time zone,
    phone text,
    email text,
    address text,
    "position" text NOT NULL,
    subjects text DEFAULT '[]'::text NOT NULL,
    education text,
    university text,
    major text,
    certifications text DEFAULT '[]'::text NOT NULL,
    "employmentType" text DEFAULT 'TETAP'::text NOT NULL,
    "joinDate" timestamp(3) without time zone,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    institution text NOT NULL,
    specialization text,
    experience integer,
    photo text,
    bio text,
    achievements text DEFAULT '[]'::text NOT NULL,
    "isUstadz" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text
);


ALTER TABLE public.teachers OWNER TO admin;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.transactions (
    id text NOT NULL,
    "transactionNo" text NOT NULL,
    type text NOT NULL,
    "categoryId" text NOT NULL,
    amount double precision NOT NULL,
    description text NOT NULL,
    reference text,
    date timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone,
    status text DEFAULT 'POSTED'::text NOT NULL,
    tags text DEFAULT '[]'::text NOT NULL,
    attachments text DEFAULT '[]'::text NOT NULL,
    notes text,
    "createdBy" text NOT NULL,
    "approvedBy" text,
    "approvedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.transactions OWNER TO admin;

--
-- Name: two_factor_verifications; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.two_factor_verifications (
    id text NOT NULL,
    "userId" text NOT NULL,
    "smsOtp" text,
    "smsOtpExpiresAt" timestamp(3) without time zone,
    "smsAttempts" integer DEFAULT 0 NOT NULL,
    "totpAttempts" integer DEFAULT 0 NOT NULL,
    "totpAttemptsResetAt" timestamp(3) without time zone,
    "smsAttemptsResetAt" timestamp(3) without time zone,
    "backupAttempts" integer DEFAULT 0 NOT NULL,
    "backupAttemptsResetAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.two_factor_verifications OWNER TO admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role text DEFAULT 'STAFF'::text NOT NULL,
    "isUstadz" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "twoFactorEnabled" boolean DEFAULT false NOT NULL,
    "twoFactorSecret" text,
    "backupCodes" text[] DEFAULT ARRAY[]::text[],
    "phoneVerified" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: videos; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.videos (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    url text NOT NULL,
    thumbnail text,
    duration text,
    category text NOT NULL,
    teacher text NOT NULL,
    "uploadDate" timestamp(3) without time zone NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.videos OWNER TO admin;

--
-- Name: zakat_calculations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.zakat_calculations (
    id text NOT NULL,
    "calculationType" text NOT NULL,
    inputs text NOT NULL,
    "zakatAmount" numeric(65,30) NOT NULL,
    "nisabAmount" numeric(65,30),
    "donorName" text,
    "donorEmail" text,
    "donorPhone" text,
    "donationId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.zakat_calculations OWNER TO admin;

--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (id);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: alumni alumni_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.alumni
    ADD CONSTRAINT alumni_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- Name: attendances attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_pkey PRIMARY KEY (id);


--
-- Name: audit_trails audit_trails_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_trails
    ADD CONSTRAINT audit_trails_pkey PRIMARY KEY (id);


--
-- Name: bill_payments bill_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bill_payments
    ADD CONSTRAINT bill_payments_pkey PRIMARY KEY (id);


--
-- Name: bill_types bill_types_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bill_types
    ADD CONSTRAINT bill_types_pkey PRIMARY KEY (id);


--
-- Name: billing_reports billing_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.billing_reports
    ADD CONSTRAINT billing_reports_pkey PRIMARY KEY (id);


--
-- Name: billing_settings billing_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.billing_settings
    ADD CONSTRAINT billing_settings_pkey PRIMARY KEY (id);


--
-- Name: bills bills_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (id);


--
-- Name: budget_items budget_items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.budget_items
    ADD CONSTRAINT budget_items_pkey PRIMARY KEY (id);


--
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (id);


--
-- Name: business_transactions business_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.business_transactions
    ADD CONSTRAINT business_transactions_pkey PRIMARY KEY (id);


--
-- Name: business_unit_reports business_unit_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.business_unit_reports
    ADD CONSTRAINT business_unit_reports_pkey PRIMARY KEY (id);


--
-- Name: business_units business_units_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.business_units
    ADD CONSTRAINT business_units_pkey PRIMARY KEY (id);


--
-- Name: campaign_updates campaign_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.campaign_updates
    ADD CONSTRAINT campaign_updates_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: curriculum_subjects curriculum_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.curriculum_subjects
    ADD CONSTRAINT curriculum_subjects_pkey PRIMARY KEY (id);


--
-- Name: curriculums curriculums_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.curriculums
    ADD CONSTRAINT curriculums_pkey PRIMARY KEY (id);


--
-- Name: donation_campaigns donation_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donation_campaigns
    ADD CONSTRAINT donation_campaigns_pkey PRIMARY KEY (id);


--
-- Name: donation_categories donation_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donation_categories
    ADD CONSTRAINT donation_categories_pkey PRIMARY KEY (id);


--
-- Name: donations donations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_pkey PRIMARY KEY (id);


--
-- Name: donor_profiles donor_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donor_profiles
    ADD CONSTRAINT donor_profiles_pkey PRIMARY KEY (id);


--
-- Name: ebooks ebooks_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ebooks
    ADD CONSTRAINT ebooks_pkey PRIMARY KEY (id);


--
-- Name: exam_results exam_results_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.exam_results
    ADD CONSTRAINT exam_results_pkey PRIMARY KEY (id);


--
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (id);


--
-- Name: financial_accounts financial_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.financial_accounts
    ADD CONSTRAINT financial_accounts_pkey PRIMARY KEY (id);


--
-- Name: financial_categories financial_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.financial_categories
    ADD CONSTRAINT financial_categories_pkey PRIMARY KEY (id);


--
-- Name: financial_reports financial_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.financial_reports
    ADD CONSTRAINT financial_reports_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: hafalan_achievements hafalan_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_achievements
    ADD CONSTRAINT hafalan_achievements_pkey PRIMARY KEY (id);


--
-- Name: hafalan_progress hafalan_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_progress
    ADD CONSTRAINT hafalan_progress_pkey PRIMARY KEY (id);


--
-- Name: hafalan_records hafalan_records_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_records
    ADD CONSTRAINT hafalan_records_pkey PRIMARY KEY (id);


--
-- Name: hafalan_sessions hafalan_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_sessions
    ADD CONSTRAINT hafalan_sessions_pkey PRIMARY KEY (id);


--
-- Name: hafalan_targets hafalan_targets_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_targets
    ADD CONSTRAINT hafalan_targets_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: inventory_transactions inventory_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_pkey PRIMARY KEY (id);


--
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (id);


--
-- Name: journal_entry_lines journal_entry_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT journal_entry_lines_pkey PRIMARY KEY (id);


--
-- Name: line_admins line_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.line_admins
    ADD CONSTRAINT line_admins_pkey PRIMARY KEY (id);


--
-- Name: line_settings line_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.line_settings
    ADD CONSTRAINT line_settings_pkey PRIMARY KEY (id);


--
-- Name: line_user_sessions line_user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.line_user_sessions
    ADD CONSTRAINT line_user_sessions_pkey PRIMARY KEY (id);


--
-- Name: line_users line_users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.line_users
    ADD CONSTRAINT line_users_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: ota_programs ota_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ota_programs
    ADD CONSTRAINT ota_programs_pkey PRIMARY KEY (id);


--
-- Name: ota_reports ota_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ota_reports
    ADD CONSTRAINT ota_reports_pkey PRIMARY KEY (id);


--
-- Name: ota_sponsors ota_sponsors_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ota_sponsors
    ADD CONSTRAINT ota_sponsors_pkey PRIMARY KEY (id);


--
-- Name: parent_accounts parent_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.parent_accounts
    ADD CONSTRAINT parent_accounts_pkey PRIMARY KEY (id);


--
-- Name: parent_students parent_students_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.parent_students
    ADD CONSTRAINT parent_students_pkey PRIMARY KEY (id);


--
-- Name: payment_history payment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_pkey PRIMARY KEY (id);


--
-- Name: payment_reminders payment_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT payment_reminders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: ppdb_activities ppdb_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ppdb_activities
    ADD CONSTRAINT ppdb_activities_pkey PRIMARY KEY (id);


--
-- Name: ppdb_registrations ppdb_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ppdb_registrations
    ADD CONSTRAINT ppdb_registrations_pkey PRIMARY KEY (id);


--
-- Name: ppdb_settings ppdb_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ppdb_settings
    ADD CONSTRAINT ppdb_settings_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: push_subscriptions push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: quran_surahs quran_surahs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.quran_surahs
    ADD CONSTRAINT quran_surahs_pkey PRIMARY KEY (id);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- Name: report_cards report_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_cards
    ADD CONSTRAINT report_cards_pkey PRIMARY KEY (id);


--
-- Name: sale_items sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_pkey PRIMARY KEY (id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: security_audit_logs security_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.security_audit_logs
    ADD CONSTRAINT security_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: semesters semesters_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_pkey PRIMARY KEY (id);


--
-- Name: setoran_schedules setoran_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.setoran_schedules
    ADD CONSTRAINT setoran_schedules_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: spp_billings spp_billings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.spp_billings
    ADD CONSTRAINT spp_billings_pkey PRIMARY KEY (id);


--
-- Name: spp_payments spp_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.spp_payments
    ADD CONSTRAINT spp_payments_pkey PRIMARY KEY (id);


--
-- Name: spp_reminders spp_reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.spp_reminders
    ADD CONSTRAINT spp_reminders_pkey PRIMARY KEY (id);


--
-- Name: spp_reports spp_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.spp_reports
    ADD CONSTRAINT spp_reports_pkey PRIMARY KEY (id);


--
-- Name: spp_settings spp_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.spp_settings
    ADD CONSTRAINT spp_settings_pkey PRIMARY KEY (id);


--
-- Name: student_classes student_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: teacher_subjects teacher_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT teacher_subjects_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: two_factor_verifications two_factor_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.two_factor_verifications
    ADD CONSTRAINT two_factor_verifications_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: zakat_calculations zakat_calculations_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.zakat_calculations
    ADD CONSTRAINT zakat_calculations_pkey PRIMARY KEY (id);


--
-- Name: academic_years_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "academic_years_isActive_idx" ON public.academic_years USING btree ("isActive");


--
-- Name: academic_years_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX academic_years_name_key ON public.academic_years USING btree (name);


--
-- Name: academic_years_startDate_endDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "academic_years_startDate_endDate_idx" ON public.academic_years USING btree ("startDate", "endDate");


--
-- Name: alumni_availableForEvents_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "alumni_availableForEvents_idx" ON public.alumni USING btree ("availableForEvents");


--
-- Name: alumni_generation_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX alumni_generation_idx ON public.alumni USING btree (generation);


--
-- Name: alumni_institutionType_graduationYear_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "alumni_institutionType_graduationYear_idx" ON public.alumni USING btree ("institutionType", "graduationYear");


--
-- Name: announcements_category_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "announcements_category_createdAt_idx" ON public.announcements USING btree (category, "createdAt");


--
-- Name: announcements_expiryDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "announcements_expiryDate_idx" ON public.announcements USING btree ("expiryDate");


--
-- Name: announcements_status_publishDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "announcements_status_publishDate_idx" ON public.announcements USING btree (status, "publishDate");


--
-- Name: announcements_targetAudience_priority_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "announcements_targetAudience_priority_idx" ON public.announcements USING btree ("targetAudience", priority);


--
-- Name: answers_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "answers_createdAt_idx" ON public.answers USING btree ("createdAt");


--
-- Name: answers_questionId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "answers_questionId_key" ON public.answers USING btree ("questionId");


--
-- Name: answers_ustadzId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "answers_ustadzId_idx" ON public.answers USING btree ("ustadzId");


--
-- Name: attendances_date_classId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "attendances_date_classId_idx" ON public.attendances USING btree (date, "classId");


--
-- Name: attendances_studentId_classId_date_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "attendances_studentId_classId_date_key" ON public.attendances USING btree ("studentId", "classId", date);


--
-- Name: attendances_studentId_semesterId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "attendances_studentId_semesterId_idx" ON public.attendances USING btree ("studentId", "semesterId");


--
-- Name: audit_trails_tableName_recordId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "audit_trails_tableName_recordId_idx" ON public.audit_trails USING btree ("tableName", "recordId");


--
-- Name: audit_trails_userId_timestamp_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "audit_trails_userId_timestamp_idx" ON public.audit_trails USING btree ("userId", "timestamp");


--
-- Name: bill_payments_billId_paymentDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bill_payments_billId_paymentDate_idx" ON public.bill_payments USING btree ("billId", "paymentDate");


--
-- Name: bill_payments_method_verificationStatus_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bill_payments_method_verificationStatus_idx" ON public.bill_payments USING btree (method, "verificationStatus");


--
-- Name: bill_payments_paymentDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bill_payments_paymentDate_idx" ON public.bill_payments USING btree ("paymentDate");


--
-- Name: bill_payments_paymentNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "bill_payments_paymentNo_key" ON public.bill_payments USING btree ("paymentNo");


--
-- Name: bill_payments_verificationStatus_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bill_payments_verificationStatus_idx" ON public.bill_payments USING btree ("verificationStatus");


--
-- Name: bill_types_category_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bill_types_category_isActive_idx" ON public.bill_types USING btree (category, "isActive");


--
-- Name: bill_types_isRecurring_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bill_types_isRecurring_idx" ON public.bill_types USING btree ("isRecurring");


--
-- Name: bill_types_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX bill_types_name_key ON public.bill_types USING btree (name);


--
-- Name: billing_reports_generatedBy_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "billing_reports_generatedBy_createdAt_idx" ON public.billing_reports USING btree ("generatedBy", "createdAt");


--
-- Name: billing_reports_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX billing_reports_status_idx ON public.billing_reports USING btree (status);


--
-- Name: billing_reports_type_startDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "billing_reports_type_startDate_idx" ON public.billing_reports USING btree (type, "startDate");


--
-- Name: billing_settings_category_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX billing_settings_category_idx ON public.billing_settings USING btree (category);


--
-- Name: billing_settings_key_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX billing_settings_key_key ON public.billing_settings USING btree (key);


--
-- Name: bills_billNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "bills_billNo_key" ON public.bills USING btree ("billNo");


--
-- Name: bills_billTypeId_period_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bills_billTypeId_period_idx" ON public.bills USING btree ("billTypeId", period);


--
-- Name: bills_isOverdue_dueDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bills_isOverdue_dueDate_idx" ON public.bills USING btree ("isOverdue", "dueDate");


--
-- Name: bills_period_billTypeId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bills_period_billTypeId_idx" ON public.bills USING btree (period, "billTypeId");


--
-- Name: bills_status_dueDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bills_status_dueDate_idx" ON public.bills USING btree (status, "dueDate");


--
-- Name: bills_studentId_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "bills_studentId_status_idx" ON public.bills USING btree ("studentId", status);


--
-- Name: budget_items_budgetId_categoryId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "budget_items_budgetId_categoryId_key" ON public.budget_items USING btree ("budgetId", "categoryId");


--
-- Name: budgets_status_startDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "budgets_status_startDate_idx" ON public.budgets USING btree (status, "startDate");


--
-- Name: business_transactions_transactionNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "business_transactions_transactionNo_key" ON public.business_transactions USING btree ("transactionNo");


--
-- Name: business_transactions_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX business_transactions_type_idx ON public.business_transactions USING btree (type);


--
-- Name: business_transactions_unitId_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "business_transactions_unitId_date_idx" ON public.business_transactions USING btree ("unitId", date);


--
-- Name: business_unit_reports_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX business_unit_reports_status_idx ON public.business_unit_reports USING btree (status);


--
-- Name: business_unit_reports_unitId_period_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "business_unit_reports_unitId_period_idx" ON public.business_unit_reports USING btree ("unitId", period);


--
-- Name: business_unit_reports_unitId_year_month_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "business_unit_reports_unitId_year_month_key" ON public.business_unit_reports USING btree ("unitId", year, month);


--
-- Name: business_units_code_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX business_units_code_idx ON public.business_units USING btree (code);


--
-- Name: business_units_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX business_units_code_key ON public.business_units USING btree (code);


--
-- Name: campaign_updates_campaignId_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "campaign_updates_campaignId_createdAt_idx" ON public.campaign_updates USING btree ("campaignId", "createdAt");


--
-- Name: classes_academicYearId_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "classes_academicYearId_name_key" ON public.classes USING btree ("academicYearId", name);


--
-- Name: classes_grade_level_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX classes_grade_level_idx ON public.classes USING btree (grade, level);


--
-- Name: classes_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "classes_isActive_idx" ON public.classes USING btree ("isActive");


--
-- Name: curriculum_subjects_curriculumId_grade_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "curriculum_subjects_curriculumId_grade_idx" ON public.curriculum_subjects USING btree ("curriculumId", grade);


--
-- Name: curriculum_subjects_curriculumId_subjectId_grade_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "curriculum_subjects_curriculumId_subjectId_grade_key" ON public.curriculum_subjects USING btree ("curriculumId", "subjectId", grade);


--
-- Name: curriculums_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX curriculums_code_key ON public.curriculums USING btree (code);


--
-- Name: curriculums_level_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "curriculums_level_isActive_idx" ON public.curriculums USING btree (level, "isActive");


--
-- Name: donation_campaigns_categoryId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "donation_campaigns_categoryId_idx" ON public.donation_campaigns USING btree ("categoryId");


--
-- Name: donation_campaigns_endDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "donation_campaigns_endDate_idx" ON public.donation_campaigns USING btree ("endDate");


--
-- Name: donation_campaigns_slug_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX donation_campaigns_slug_key ON public.donation_campaigns USING btree (slug);


--
-- Name: donation_campaigns_status_isFeatured_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "donation_campaigns_status_isFeatured_idx" ON public.donation_campaigns USING btree (status, "isFeatured");


--
-- Name: donation_categories_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX donation_categories_name_key ON public.donation_categories USING btree (name);


--
-- Name: donations_campaignId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "donations_campaignId_idx" ON public.donations USING btree ("campaignId");


--
-- Name: donations_categoryId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "donations_categoryId_idx" ON public.donations USING btree ("categoryId");


--
-- Name: donations_donationNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "donations_donationNo_key" ON public.donations USING btree ("donationNo");


--
-- Name: donations_donorEmail_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "donations_donorEmail_idx" ON public.donations USING btree ("donorEmail");


--
-- Name: donations_paymentStatus_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "donations_paymentStatus_createdAt_idx" ON public.donations USING btree ("paymentStatus", "createdAt");


--
-- Name: donor_profiles_email_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX donor_profiles_email_idx ON public.donor_profiles USING btree (email);


--
-- Name: donor_profiles_email_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX donor_profiles_email_key ON public.donor_profiles USING btree (email);


--
-- Name: donor_profiles_isVerified_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "donor_profiles_isVerified_idx" ON public.donor_profiles USING btree ("isVerified");


--
-- Name: exam_results_examId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "exam_results_examId_idx" ON public.exam_results USING btree ("examId");


--
-- Name: exam_results_examId_studentId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "exam_results_examId_studentId_key" ON public.exam_results USING btree ("examId", "studentId");


--
-- Name: exam_results_studentId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "exam_results_studentId_idx" ON public.exam_results USING btree ("studentId");


--
-- Name: exams_date_classId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "exams_date_classId_idx" ON public.exams USING btree (date, "classId");


--
-- Name: exams_subjectId_semesterId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "exams_subjectId_semesterId_idx" ON public.exams USING btree ("subjectId", "semesterId");


--
-- Name: financial_accounts_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX financial_accounts_code_key ON public.financial_accounts USING btree (code);


--
-- Name: financial_accounts_type_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "financial_accounts_type_isActive_idx" ON public.financial_accounts USING btree (type, "isActive");


--
-- Name: financial_categories_name_type_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX financial_categories_name_type_key ON public.financial_categories USING btree (name, type);


--
-- Name: financial_categories_type_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "financial_categories_type_isActive_idx" ON public.financial_categories USING btree (type, "isActive");


--
-- Name: financial_reports_type_period_startDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "financial_reports_type_period_startDate_idx" ON public.financial_reports USING btree (type, period, "startDate");


--
-- Name: grades_semesterId_subjectId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "grades_semesterId_subjectId_idx" ON public.grades USING btree ("semesterId", "subjectId");


--
-- Name: grades_studentId_semesterId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "grades_studentId_semesterId_idx" ON public.grades USING btree ("studentId", "semesterId");


--
-- Name: grades_studentId_subjectId_semesterId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "grades_studentId_subjectId_semesterId_key" ON public.grades USING btree ("studentId", "subjectId", "semesterId");


--
-- Name: hafalan_achievements_earnedAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_achievements_earnedAt_idx" ON public.hafalan_achievements USING btree ("earnedAt");


--
-- Name: hafalan_achievements_level_points_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX hafalan_achievements_level_points_idx ON public.hafalan_achievements USING btree (level, points);


--
-- Name: hafalan_achievements_studentId_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_achievements_studentId_type_idx" ON public.hafalan_achievements USING btree ("studentId", type);


--
-- Name: hafalan_progress_level_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX hafalan_progress_level_idx ON public.hafalan_progress USING btree (level);


--
-- Name: hafalan_progress_studentId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "hafalan_progress_studentId_key" ON public.hafalan_progress USING btree ("studentId");


--
-- Name: hafalan_progress_totalSurah_totalAyat_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_progress_totalSurah_totalAyat_idx" ON public.hafalan_progress USING btree ("totalSurah", "totalAyat");


--
-- Name: hafalan_records_status_quality_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX hafalan_records_status_quality_idx ON public.hafalan_records USING btree (status, quality);


--
-- Name: hafalan_records_studentId_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_records_studentId_date_idx" ON public.hafalan_records USING btree ("studentId", date);


--
-- Name: hafalan_records_surahNumber_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_records_surahNumber_status_idx" ON public.hafalan_records USING btree ("surahNumber", status);


--
-- Name: hafalan_records_teacherId_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_records_teacherId_date_idx" ON public.hafalan_records USING btree ("teacherId", date);


--
-- Name: hafalan_sessions_studentId_sessionDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_sessions_studentId_sessionDate_idx" ON public.hafalan_sessions USING btree ("studentId", "sessionDate");


--
-- Name: hafalan_sessions_teacherId_sessionDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_sessions_teacherId_sessionDate_idx" ON public.hafalan_sessions USING btree ("teacherId", "sessionDate");


--
-- Name: hafalan_sessions_type_sessionDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_sessions_type_sessionDate_idx" ON public.hafalan_sessions USING btree (type, "sessionDate");


--
-- Name: hafalan_targets_createdBy_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_targets_createdBy_idx" ON public.hafalan_targets USING btree ("createdBy");


--
-- Name: hafalan_targets_studentId_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_targets_studentId_status_idx" ON public.hafalan_targets USING btree ("studentId", status);


--
-- Name: hafalan_targets_targetDate_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "hafalan_targets_targetDate_status_idx" ON public.hafalan_targets USING btree ("targetDate", status);


--
-- Name: inventory_expiryDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "inventory_expiryDate_idx" ON public.inventory USING btree ("expiryDate");


--
-- Name: inventory_productId_location_batchNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "inventory_productId_location_batchNo_key" ON public.inventory USING btree ("productId", location, "batchNo");


--
-- Name: inventory_productId_location_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "inventory_productId_location_idx" ON public.inventory USING btree ("productId", location);


--
-- Name: inventory_transactions_productId_type_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "inventory_transactions_productId_type_createdAt_idx" ON public.inventory_transactions USING btree ("productId", type, "createdAt");


--
-- Name: inventory_transactions_referenceId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "inventory_transactions_referenceId_idx" ON public.inventory_transactions USING btree ("referenceId");


--
-- Name: inventory_transactions_type_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "inventory_transactions_type_createdAt_idx" ON public.inventory_transactions USING btree (type, "createdAt");


--
-- Name: journal_entries_entryNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "journal_entries_entryNo_key" ON public.journal_entries USING btree ("entryNo");


--
-- Name: journal_entries_status_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX journal_entries_status_date_idx ON public.journal_entries USING btree (status, date);


--
-- Name: journal_entries_transactionId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "journal_entries_transactionId_key" ON public.journal_entries USING btree ("transactionId");


--
-- Name: journal_entry_lines_journalId_lineOrder_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "journal_entry_lines_journalId_lineOrder_idx" ON public.journal_entry_lines USING btree ("journalId", "lineOrder");


--
-- Name: line_admins_lineUserId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "line_admins_lineUserId_key" ON public.line_admins USING btree ("lineUserId");


--
-- Name: line_admins_userId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "line_admins_userId_key" ON public.line_admins USING btree ("userId");


--
-- Name: line_user_sessions_userId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "line_user_sessions_userId_key" ON public.line_user_sessions USING btree ("userId");


--
-- Name: line_users_userId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "line_users_userId_key" ON public.line_users USING btree ("userId");


--
-- Name: messages_parentMessageId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "messages_parentMessageId_idx" ON public.messages USING btree ("parentMessageId");


--
-- Name: messages_receiverId_isRead_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "messages_receiverId_isRead_idx" ON public.messages USING btree ("receiverId", "isRead");


--
-- Name: messages_senderId_sentAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "messages_senderId_sentAt_idx" ON public.messages USING btree ("senderId", "sentAt");


--
-- Name: messages_status_priority_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX messages_status_priority_idx ON public.messages USING btree (status, priority);


--
-- Name: messages_threadId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "messages_threadId_idx" ON public.messages USING btree ("threadId");


--
-- Name: notifications_expiresAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "notifications_expiresAt_idx" ON public.notifications USING btree ("expiresAt");


--
-- Name: notifications_scheduledFor_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "notifications_scheduledFor_idx" ON public.notifications USING btree ("scheduledFor");


--
-- Name: notifications_type_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "notifications_type_createdAt_idx" ON public.notifications USING btree (type, "createdAt");


--
-- Name: notifications_userId_isRead_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "notifications_userId_isRead_idx" ON public.notifications USING btree ("userId", "isRead");


--
-- Name: ota_programs_currentMonth_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ota_programs_currentMonth_idx" ON public.ota_programs USING btree ("currentMonth");


--
-- Name: ota_programs_isActive_displayOrder_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ota_programs_isActive_displayOrder_idx" ON public.ota_programs USING btree ("isActive", "displayOrder");


--
-- Name: ota_programs_monthlyProgress_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ota_programs_monthlyProgress_idx" ON public.ota_programs USING btree ("monthlyProgress");


--
-- Name: ota_programs_studentId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "ota_programs_studentId_key" ON public.ota_programs USING btree ("studentId");


--
-- Name: ota_reports_month_reportType_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "ota_reports_month_reportType_key" ON public.ota_reports USING btree (month, "reportType");


--
-- Name: ota_reports_reportType_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ota_reports_reportType_idx" ON public.ota_reports USING btree ("reportType");


--
-- Name: ota_reports_status_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ota_reports_status_createdAt_idx" ON public.ota_reports USING btree (status, "createdAt");


--
-- Name: ota_reports_year_month_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ota_reports_year_month_idx ON public.ota_reports USING btree (year, month);


--
-- Name: ota_sponsors_donorEmail_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ota_sponsors_donorEmail_idx" ON public.ota_sponsors USING btree ("donorEmail");


--
-- Name: ota_sponsors_isPaid_verifiedAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ota_sponsors_isPaid_verifiedAt_idx" ON public.ota_sponsors USING btree ("isPaid", "verifiedAt");


--
-- Name: ota_sponsors_month_isPaid_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ota_sponsors_month_isPaid_idx" ON public.ota_sponsors USING btree (month, "isPaid");


--
-- Name: ota_sponsors_paymentStatus_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ota_sponsors_paymentStatus_idx" ON public.ota_sponsors USING btree ("paymentStatus");


--
-- Name: ota_sponsors_programId_month_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ota_sponsors_programId_month_idx" ON public.ota_sponsors USING btree ("programId", month);


--
-- Name: parent_accounts_userId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "parent_accounts_userId_idx" ON public.parent_accounts USING btree ("userId");


--
-- Name: parent_accounts_userId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "parent_accounts_userId_key" ON public.parent_accounts USING btree ("userId");


--
-- Name: parent_students_parentId_studentId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "parent_students_parentId_studentId_key" ON public.parent_students USING btree ("parentId", "studentId");


--
-- Name: parent_students_studentId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "parent_students_studentId_idx" ON public.parent_students USING btree ("studentId");


--
-- Name: payment_history_action_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "payment_history_action_createdAt_idx" ON public.payment_history USING btree (action, "createdAt");


--
-- Name: payment_history_billId_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "payment_history_billId_createdAt_idx" ON public.payment_history USING btree ("billId", "createdAt");


--
-- Name: payment_history_studentId_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "payment_history_studentId_createdAt_idx" ON public.payment_history USING btree ("studentId", "createdAt");


--
-- Name: payment_reminders_billId_scheduledAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "payment_reminders_billId_scheduledAt_idx" ON public.payment_reminders USING btree ("billId", "scheduledAt");


--
-- Name: payment_reminders_status_scheduledAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "payment_reminders_status_scheduledAt_idx" ON public.payment_reminders USING btree (status, "scheduledAt");


--
-- Name: payment_reminders_studentId_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "payment_reminders_studentId_type_idx" ON public.payment_reminders USING btree ("studentId", type);


--
-- Name: payment_reminders_type_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX payment_reminders_type_status_idx ON public.payment_reminders USING btree (type, status);


--
-- Name: payments_externalId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "payments_externalId_idx" ON public.payments USING btree ("externalId");


--
-- Name: payments_paymentNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "payments_paymentNo_key" ON public.payments USING btree ("paymentNo");


--
-- Name: payments_paymentType_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "payments_paymentType_idx" ON public.payments USING btree ("paymentType");


--
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- Name: payments_transactionId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "payments_transactionId_idx" ON public.payments USING btree ("transactionId");


--
-- Name: ppdb_activities_registrationId_performedAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ppdb_activities_registrationId_performedAt_idx" ON public.ppdb_activities USING btree ("registrationId", "performedAt");


--
-- Name: ppdb_registrations_level_academicYear_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ppdb_registrations_level_academicYear_status_idx" ON public.ppdb_registrations USING btree (level, "academicYear", status);


--
-- Name: ppdb_registrations_registrationNo_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ppdb_registrations_registrationNo_idx" ON public.ppdb_registrations USING btree ("registrationNo");


--
-- Name: ppdb_registrations_registrationNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "ppdb_registrations_registrationNo_key" ON public.ppdb_registrations USING btree ("registrationNo");


--
-- Name: ppdb_registrations_status_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "ppdb_registrations_status_createdAt_idx" ON public.ppdb_registrations USING btree (status, "createdAt");


--
-- Name: ppdb_settings_academicYear_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "ppdb_settings_academicYear_key" ON public.ppdb_settings USING btree ("academicYear");


--
-- Name: product_categories_isActive_sortOrder_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "product_categories_isActive_sortOrder_idx" ON public.product_categories USING btree ("isActive", "sortOrder");


--
-- Name: product_categories_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX product_categories_name_key ON public.product_categories USING btree (name);


--
-- Name: products_categoryId_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "products_categoryId_isActive_idx" ON public.products USING btree ("categoryId", "isActive");


--
-- Name: products_code_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX products_code_idx ON public.products USING btree (code);


--
-- Name: products_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX products_code_key ON public.products USING btree (code);


--
-- Name: products_location_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "products_location_isActive_idx" ON public.products USING btree (location, "isActive");


--
-- Name: products_stock_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX products_stock_idx ON public.products USING btree (stock);


--
-- Name: purchase_order_items_purchaseOrderId_productId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "purchase_order_items_purchaseOrderId_productId_key" ON public.purchase_order_items USING btree ("purchaseOrderId", "productId");


--
-- Name: purchase_orders_orderNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "purchase_orders_orderNo_key" ON public.purchase_orders USING btree ("orderNo");


--
-- Name: purchase_orders_status_orderDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "purchase_orders_status_orderDate_idx" ON public.purchase_orders USING btree (status, "orderDate");


--
-- Name: purchase_orders_supplierId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "purchase_orders_supplierId_idx" ON public.purchase_orders USING btree ("supplierId");


--
-- Name: push_subscriptions_userId_endpoint_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "push_subscriptions_userId_endpoint_key" ON public.push_subscriptions USING btree ("userId", endpoint);


--
-- Name: questions_category_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX questions_category_idx ON public.questions USING btree (category);


--
-- Name: questions_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "questions_createdAt_idx" ON public.questions USING btree ("createdAt");


--
-- Name: questions_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX questions_status_idx ON public.questions USING btree (status);


--
-- Name: quran_surahs_juz_number_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX quran_surahs_juz_number_idx ON public.quran_surahs USING btree (juz, number);


--
-- Name: quran_surahs_number_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX quran_surahs_number_key ON public.quran_surahs USING btree (number);


--
-- Name: quran_surahs_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX quran_surahs_type_idx ON public.quran_surahs USING btree (type);


--
-- Name: registrations_level_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX registrations_level_idx ON public.registrations USING btree (level);


--
-- Name: registrations_paymentStatus_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "registrations_paymentStatus_idx" ON public.registrations USING btree ("paymentStatus");


--
-- Name: registrations_registrationNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "registrations_registrationNo_key" ON public.registrations USING btree ("registrationNo");


--
-- Name: registrations_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX registrations_status_idx ON public.registrations USING btree (status);


--
-- Name: registrations_testResult_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "registrations_testResult_idx" ON public.registrations USING btree ("testResult");


--
-- Name: report_cards_semesterId_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "report_cards_semesterId_status_idx" ON public.report_cards USING btree ("semesterId", status);


--
-- Name: report_cards_studentId_semesterId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "report_cards_studentId_semesterId_key" ON public.report_cards USING btree ("studentId", "semesterId");


--
-- Name: sale_items_saleId_productId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "sale_items_saleId_productId_key" ON public.sale_items USING btree ("saleId", "productId");


--
-- Name: sales_cashier_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX sales_cashier_idx ON public.sales USING btree (cashier);


--
-- Name: sales_saleDate_location_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "sales_saleDate_location_idx" ON public.sales USING btree ("saleDate", location);


--
-- Name: sales_saleNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "sales_saleNo_key" ON public.sales USING btree ("saleNo");


--
-- Name: sales_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX sales_status_idx ON public.sales USING btree (status);


--
-- Name: schedules_classId_day_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "schedules_classId_day_idx" ON public.schedules USING btree ("classId", day);


--
-- Name: schedules_classId_day_startTime_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "schedules_classId_day_startTime_key" ON public.schedules USING btree ("classId", day, "startTime");


--
-- Name: schedules_teacherId_day_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "schedules_teacherId_day_idx" ON public.schedules USING btree ("teacherId", day);


--
-- Name: security_audit_logs_event_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX security_audit_logs_event_idx ON public.security_audit_logs USING btree (event);


--
-- Name: security_audit_logs_timestamp_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX security_audit_logs_timestamp_idx ON public.security_audit_logs USING btree ("timestamp");


--
-- Name: security_audit_logs_userId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "security_audit_logs_userId_idx" ON public.security_audit_logs USING btree ("userId");


--
-- Name: semesters_academicYearId_name_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "semesters_academicYearId_name_key" ON public.semesters USING btree ("academicYearId", name);


--
-- Name: semesters_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "semesters_isActive_idx" ON public.semesters USING btree ("isActive");


--
-- Name: semesters_startDate_endDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "semesters_startDate_endDate_idx" ON public.semesters USING btree ("startDate", "endDate");


--
-- Name: setoran_schedules_dayOfWeek_time_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "setoran_schedules_dayOfWeek_time_idx" ON public.setoran_schedules USING btree ("dayOfWeek", "time");


--
-- Name: setoran_schedules_studentId_teacherId_dayOfWeek_time_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "setoran_schedules_studentId_teacherId_dayOfWeek_time_key" ON public.setoran_schedules USING btree ("studentId", "teacherId", "dayOfWeek", "time");


--
-- Name: setoran_schedules_teacherId_dayOfWeek_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "setoran_schedules_teacherId_dayOfWeek_idx" ON public.setoran_schedules USING btree ("teacherId", "dayOfWeek");


--
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- Name: spp_billings_billNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "spp_billings_billNo_key" ON public.spp_billings USING btree ("billNo");


--
-- Name: spp_billings_classId_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "spp_billings_classId_status_idx" ON public.spp_billings USING btree ("classId", status);


--
-- Name: spp_billings_status_dueDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "spp_billings_status_dueDate_idx" ON public.spp_billings USING btree (status, "dueDate");


--
-- Name: spp_billings_studentId_month_year_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "spp_billings_studentId_month_year_key" ON public.spp_billings USING btree ("studentId", month, year);


--
-- Name: spp_billings_studentId_year_month_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "spp_billings_studentId_year_month_idx" ON public.spp_billings USING btree ("studentId", year, month);


--
-- Name: spp_payments_billingId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "spp_payments_billingId_idx" ON public.spp_payments USING btree ("billingId");


--
-- Name: spp_payments_paymentDate_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "spp_payments_paymentDate_idx" ON public.spp_payments USING btree ("paymentDate");


--
-- Name: spp_payments_paymentNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "spp_payments_paymentNo_key" ON public.spp_payments USING btree ("paymentNo");


--
-- Name: spp_payments_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX spp_payments_status_idx ON public.spp_payments USING btree (status);


--
-- Name: spp_reminders_billingId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "spp_reminders_billingId_idx" ON public.spp_reminders USING btree ("billingId");


--
-- Name: spp_reminders_status_scheduledFor_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "spp_reminders_status_scheduledFor_idx" ON public.spp_reminders USING btree (status, "scheduledFor");


--
-- Name: spp_reports_generatedBy_generatedAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "spp_reports_generatedBy_generatedAt_idx" ON public.spp_reports USING btree ("generatedBy", "generatedAt");


--
-- Name: spp_reports_reportType_period_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "spp_reports_reportType_period_idx" ON public.spp_reports USING btree ("reportType", period);


--
-- Name: spp_settings_level_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX spp_settings_level_key ON public.spp_settings USING btree (level);


--
-- Name: student_classes_academicYearId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "student_classes_academicYearId_idx" ON public.student_classes USING btree ("academicYearId");


--
-- Name: student_classes_classId_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "student_classes_classId_status_idx" ON public.student_classes USING btree ("classId", status);


--
-- Name: student_classes_studentId_classId_academicYearId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "student_classes_studentId_classId_academicYearId_key" ON public.student_classes USING btree ("studentId", "classId", "academicYearId");


--
-- Name: students_enrollmentYear_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "students_enrollmentYear_idx" ON public.students USING btree ("enrollmentYear");


--
-- Name: students_institutionType_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "students_institutionType_status_idx" ON public.students USING btree ("institutionType", status);


--
-- Name: students_isOrphan_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "students_isOrphan_idx" ON public.students USING btree ("isOrphan");


--
-- Name: students_nis_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX students_nis_key ON public.students USING btree (nis);


--
-- Name: students_nisn_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX students_nisn_key ON public.students USING btree (nisn);


--
-- Name: students_registrationId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "students_registrationId_key" ON public.students USING btree ("registrationId");


--
-- Name: subjects_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX subjects_code_key ON public.subjects USING btree (code);


--
-- Name: subjects_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "subjects_isActive_idx" ON public.subjects USING btree ("isActive");


--
-- Name: subjects_level_category_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX subjects_level_category_idx ON public.subjects USING btree (level, category);


--
-- Name: suppliers_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX suppliers_code_key ON public.suppliers USING btree (code);


--
-- Name: suppliers_isActive_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "suppliers_isActive_idx" ON public.suppliers USING btree ("isActive");


--
-- Name: teacher_subjects_subjectId_classId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "teacher_subjects_subjectId_classId_idx" ON public.teacher_subjects USING btree ("subjectId", "classId");


--
-- Name: teacher_subjects_teacherId_semesterId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "teacher_subjects_teacherId_semesterId_idx" ON public.teacher_subjects USING btree ("teacherId", "semesterId");


--
-- Name: teacher_subjects_teacherId_subjectId_classId_semesterId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "teacher_subjects_teacherId_subjectId_classId_semesterId_key" ON public.teacher_subjects USING btree ("teacherId", "subjectId", "classId", "semesterId");


--
-- Name: teachers_institution_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX teachers_institution_status_idx ON public.teachers USING btree (institution, status);


--
-- Name: teachers_isUstadz_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "teachers_isUstadz_status_idx" ON public.teachers USING btree ("isUstadz", status);


--
-- Name: teachers_nip_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX teachers_nip_key ON public.teachers USING btree (nip);


--
-- Name: transactions_categoryId_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "transactions_categoryId_idx" ON public.transactions USING btree ("categoryId");


--
-- Name: transactions_transactionNo_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "transactions_transactionNo_key" ON public.transactions USING btree ("transactionNo");


--
-- Name: transactions_type_status_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX transactions_type_status_date_idx ON public.transactions USING btree (type, status, date);


--
-- Name: two_factor_verifications_userId_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "two_factor_verifications_userId_key" ON public.two_factor_verifications USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: zakat_calculations_calculationType_createdAt_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX "zakat_calculations_calculationType_createdAt_idx" ON public.zakat_calculations USING btree ("calculationType", "createdAt");


--
-- Name: activities activities_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT "activities_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: alumni alumni_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.alumni
    ADD CONSTRAINT "alumni_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: answers answers_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: answers answers_ustadzId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT "answers_ustadzId_fkey" FOREIGN KEY ("ustadzId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attendances attendances_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT "attendances_classId_fkey" FOREIGN KEY ("classId") REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attendances attendances_markedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT "attendances_markedBy_fkey" FOREIGN KEY ("markedBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attendances attendances_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT "attendances_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public.semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attendances attendances_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT "attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: audit_trails audit_trails_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_trails
    ADD CONSTRAINT "audit_trails_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bill_payments bill_payments_billId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bill_payments
    ADD CONSTRAINT "bill_payments_billId_fkey" FOREIGN KEY ("billId") REFERENCES public.bills(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bills bills_billTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "bills_billTypeId_fkey" FOREIGN KEY ("billTypeId") REFERENCES public.bill_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bills bills_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "bills_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: budget_items budget_items_budgetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.budget_items
    ADD CONSTRAINT "budget_items_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES public.budgets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: budget_items budget_items_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.budget_items
    ADD CONSTRAINT "budget_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.financial_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: budgets budgets_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT "budgets_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: business_transactions business_transactions_unitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.business_transactions
    ADD CONSTRAINT "business_transactions_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES public.business_units(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: business_unit_reports business_unit_reports_unitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.business_unit_reports
    ADD CONSTRAINT "business_unit_reports_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES public.business_units(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: campaign_updates campaign_updates_campaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.campaign_updates
    ADD CONSTRAINT "campaign_updates_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public.donation_campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: classes classes_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT "classes_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: classes classes_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT "classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: courses courses_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "courses_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: curriculum_subjects curriculum_subjects_curriculumId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.curriculum_subjects
    ADD CONSTRAINT "curriculum_subjects_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES public.curriculums(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: curriculum_subjects curriculum_subjects_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.curriculum_subjects
    ADD CONSTRAINT "curriculum_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: donation_campaigns donation_campaigns_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donation_campaigns
    ADD CONSTRAINT "donation_campaigns_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.donation_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: donation_campaigns donation_campaigns_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donation_campaigns
    ADD CONSTRAINT "donation_campaigns_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: donations donations_campaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT "donations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public.donation_campaigns(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: donations donations_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT "donations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.donation_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ebooks ebooks_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ebooks
    ADD CONSTRAINT "ebooks_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exam_results exam_results_examId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.exam_results
    ADD CONSTRAINT "exam_results_examId_fkey" FOREIGN KEY ("examId") REFERENCES public.exams(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exam_results exam_results_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.exam_results
    ADD CONSTRAINT "exam_results_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exams exams_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT "exams_classId_fkey" FOREIGN KEY ("classId") REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exams exams_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT "exams_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public.semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exams exams_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT "exams_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exams exams_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT "exams_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: financial_accounts financial_accounts_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.financial_accounts
    ADD CONSTRAINT "financial_accounts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.financial_accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: financial_categories financial_categories_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.financial_categories
    ADD CONSTRAINT "financial_categories_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public.financial_accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: financial_categories financial_categories_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.financial_categories
    ADD CONSTRAINT "financial_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.financial_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: financial_reports financial_reports_budgetId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.financial_reports
    ADD CONSTRAINT "financial_reports_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES public.budgets(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: financial_reports financial_reports_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.financial_reports
    ADD CONSTRAINT "financial_reports_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: grades grades_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT "grades_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public.semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: grades grades_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT "grades_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: grades grades_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT "grades_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hafalan_achievements hafalan_achievements_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_achievements
    ADD CONSTRAINT "hafalan_achievements_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hafalan_progress hafalan_progress_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_progress
    ADD CONSTRAINT "hafalan_progress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hafalan_records hafalan_records_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_records
    ADD CONSTRAINT "hafalan_records_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hafalan_records hafalan_records_surahNumber_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_records
    ADD CONSTRAINT "hafalan_records_surahNumber_fkey" FOREIGN KEY ("surahNumber") REFERENCES public.quran_surahs(number) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hafalan_records hafalan_records_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_records
    ADD CONSTRAINT "hafalan_records_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hafalan_sessions hafalan_sessions_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_sessions
    ADD CONSTRAINT "hafalan_sessions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hafalan_sessions hafalan_sessions_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_sessions
    ADD CONSTRAINT "hafalan_sessions_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hafalan_targets hafalan_targets_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_targets
    ADD CONSTRAINT "hafalan_targets_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hafalan_targets hafalan_targets_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_targets
    ADD CONSTRAINT "hafalan_targets_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: hafalan_targets hafalan_targets_targetSurah_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.hafalan_targets
    ADD CONSTRAINT "hafalan_targets_targetSurah_fkey" FOREIGN KEY ("targetSurah") REFERENCES public.quran_surahs(number) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: inventory inventory_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT "inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: inventory_transactions inventory_transactions_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT "inventory_transactions_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: journal_entries journal_entries_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: journal_entries journal_entries_transactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT "journal_entries_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES public.transactions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: journal_entry_lines journal_entry_lines_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT "journal_entry_lines_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public.financial_accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: journal_entry_lines journal_entry_lines_journalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT "journal_entry_lines_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES public.journal_entries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: line_admins line_admins_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.line_admins
    ADD CONSTRAINT "line_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: messages messages_parentMessageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: messages messages_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: messages messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ota_programs ota_programs_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ota_programs
    ADD CONSTRAINT "ota_programs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ota_sponsors ota_sponsors_programId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ota_sponsors
    ADD CONSTRAINT "ota_sponsors_programId_fkey" FOREIGN KEY ("programId") REFERENCES public.ota_programs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: parent_accounts parent_accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.parent_accounts
    ADD CONSTRAINT "parent_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: parent_students parent_students_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.parent_students
    ADD CONSTRAINT "parent_students_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.parent_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: parent_students parent_students_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.parent_students
    ADD CONSTRAINT "parent_students_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payment_history payment_history_billId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT "payment_history_billId_fkey" FOREIGN KEY ("billId") REFERENCES public.bills(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payment_history payment_history_paymentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT "payment_history_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES public.bill_payments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payment_history payment_history_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT "payment_history_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payment_reminders payment_reminders_billId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT "payment_reminders_billId_fkey" FOREIGN KEY ("billId") REFERENCES public.bills(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payment_reminders payment_reminders_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payment_reminders
    ADD CONSTRAINT "payment_reminders_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payments payments_registrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES public.registrations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payments payments_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ppdb_activities ppdb_activities_registrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ppdb_activities
    ADD CONSTRAINT "ppdb_activities_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES public.ppdb_registrations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ppdb_registrations ppdb_registrations_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ppdb_registrations
    ADD CONSTRAINT "ppdb_registrations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_categories product_categories_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT "product_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.product_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: products products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.product_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_order_items purchase_order_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT "purchase_order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_order_items purchase_order_items_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT "purchase_order_items_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public.purchase_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_orders purchase_orders_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT "purchase_orders_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: purchase_orders purchase_orders_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: push_subscriptions push_subscriptions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT "push_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: report_cards report_cards_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_cards
    ADD CONSTRAINT "report_cards_classId_fkey" FOREIGN KEY ("classId") REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: report_cards report_cards_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_cards
    ADD CONSTRAINT "report_cards_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public.semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: report_cards report_cards_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_cards
    ADD CONSTRAINT "report_cards_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sale_items sale_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT "sale_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sale_items sale_items_saleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT "sale_items_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES public.sales(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedules schedules_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT "schedules_classId_fkey" FOREIGN KEY ("classId") REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: schedules schedules_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT "schedules_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: schedules schedules_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT "schedules_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: security_audit_logs security_audit_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.security_audit_logs
    ADD CONSTRAINT "security_audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: semesters semesters_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT "semesters_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: setoran_schedules setoran_schedules_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.setoran_schedules
    ADD CONSTRAINT "setoran_schedules_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: setoran_schedules setoran_schedules_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.setoran_schedules
    ADD CONSTRAINT "setoran_schedules_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: spp_billings spp_billings_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.spp_billings
    ADD CONSTRAINT "spp_billings_classId_fkey" FOREIGN KEY ("classId") REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: spp_billings spp_billings_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.spp_billings
    ADD CONSTRAINT "spp_billings_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public.semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: spp_billings spp_billings_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.spp_billings
    ADD CONSTRAINT "spp_billings_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: spp_payments spp_payments_billingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.spp_payments
    ADD CONSTRAINT "spp_payments_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES public.spp_billings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: spp_reminders spp_reminders_billingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.spp_reminders
    ADD CONSTRAINT "spp_reminders_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES public.spp_billings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_classes student_classes_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT "student_classes_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_classes student_classes_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT "student_classes_classId_fkey" FOREIGN KEY ("classId") REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_classes student_classes_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT "student_classes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students students_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students students_registrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES public.registrations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teacher_subjects teacher_subjects_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT "teacher_subjects_classId_fkey" FOREIGN KEY ("classId") REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teacher_subjects teacher_subjects_semesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT "teacher_subjects_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES public.semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teacher_subjects teacher_subjects_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT "teacher_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teacher_subjects teacher_subjects_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teacher_subjects
    ADD CONSTRAINT "teacher_subjects_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teachers teachers_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT "teachers_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transactions transactions_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.financial_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: two_factor_verifications two_factor_verifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.two_factor_verifications
    ADD CONSTRAINT "two_factor_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: videos videos_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT "videos_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

