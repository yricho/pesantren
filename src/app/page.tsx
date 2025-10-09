'use client';

import AuthenticatedLayout from "@/app/(authenticated)/layout";
import {redirect} from "next/navigation";

export default function HomePage() {
    redirect('/dashboard')
}