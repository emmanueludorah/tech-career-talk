import type { Metadata } from "next";
import RegistrationForm from "@/components/registration/RegistrationForm";

export const metadata: Metadata = {
  title: "Register — Tech & Career Talk 0.1",
};

export default function RegisterPage() {
  return <RegistrationForm />;
}
