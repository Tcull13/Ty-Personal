export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // For now, log the contact form submission
    // In production, integrate with an email service like Resend, SendGrid, etc.
    console.log("Contact form submission:", { name, email, subject, message });

    return Response.json({ success: true, message: "Message received!" });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
