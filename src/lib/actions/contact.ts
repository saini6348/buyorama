"use server";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message: string;
}

export async function submitContactForm(_prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email.includes("@") || !message) {
    return { status: "error", message: "Please fill in your name, a valid email, and a message." };
  }

  // Mock — no support inbox is wired up yet; a real integration (Resend, Zendesk, etc.) goes here.
  await new Promise((resolve) => setTimeout(resolve, 350));

  return { status: "success", message: "Thanks — we typically reply within one business day." };
}
