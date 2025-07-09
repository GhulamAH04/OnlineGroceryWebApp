"use client";

import VerifyEmail from "@/components/verify-email";
import { use } from "react";

export interface Props {
  params: Promise<{
    token: string;
  }>;
}

export default function VerifyPage({ params }: Props) {
  const resolvedParams = use(params);

  const decodedToken = decodeURIComponent(resolvedParams.token);

  return <VerifyEmail token={decodedToken} />;
}
