"use server";

export interface NewsletterState {
  status: "idle" | "success" | "error";
  message: string;
}

export async function subscribeNewsletter(_prevState: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { status: "error", message: "Enter a valid email address." };
  }

  // Mock — no email service is wired up yet; this is where a real
  // provider call (Resend, Mailchimp, etc.) would go.
  await new Promise((resolve) => setTimeout(resolve, 350));

  return { status: "success", message: "You're on the list — watch your inbox." };
}
