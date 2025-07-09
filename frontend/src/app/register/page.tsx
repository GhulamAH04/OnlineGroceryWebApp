import RegisterForm from "@/components/register/register-form";
import { clientId } from "@/config";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RegisterPage() {
  return (
    <GoogleOAuthProvider clientId={clientId as string}>
      <RegisterForm />
    </GoogleOAuthProvider>
  );
}
