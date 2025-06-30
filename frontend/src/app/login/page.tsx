import LoginForm from "@/components/login/login-form";
import { clientId } from "@/config";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function LoginPage() {
    return (
        <GoogleOAuthProvider clientId={clientId as string}>
            <LoginForm/>
        </GoogleOAuthProvider>
    )
}