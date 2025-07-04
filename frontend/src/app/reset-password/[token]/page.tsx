"use client";

import ResetPassword from "@/components/reset-password";
import { use } from "react";

export interface Props {
  params: Promise<{
    token: string;
  }>;
}

export default function ResetPasswordPage({ params }: Props) {
  const resolvedParams = use(params);

  const decodedToken = decodeURIComponent(resolvedParams.token);

  return <ResetPassword token={decodedToken} />;
}
