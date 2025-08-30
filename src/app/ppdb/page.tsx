// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

import PPDBPageClient from './PPDBPageClient';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  FileText,
  CreditCard,
  CheckCircle,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Download,
  School,
  Baby,
  Home,
} from 'lucide-react';

export default function PPDBPage() {
  return <PPDBPageClient />;
}