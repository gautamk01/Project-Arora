import { Resend } from "resend";
import LinearLoginCodeEmail from "../../../../emails";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, res: Response) {
  const { email, user } = await req.json();

  const { data, error } = await resend.emails.send({
    from: "Arora <arora@resend.dev>",
    to: [email],
    subject: "You are invited",
    html: render(LinearLoginCodeEmail({ email, user })),
  });
  if (error) {
    return Response.json(error);
  }
  return Response.json({ message: "Email send successfully" });
}
