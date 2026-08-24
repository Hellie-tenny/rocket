import { useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const configured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!configured) return;

    setStatus("sending");
    try {
      await emailjs.send(
        SERVICE_ID!,
        TEMPLATE_ID!,
        { from_name: name, from_email: email, message },
        { publicKey: PUBLIC_KEY! }
      );
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      setStatus("error");
    }
  };

  return (
    <section className="mx-auto max-w-xl px-6 py-24">
      <Helmet>
        <title>Contact — Rocket</title>
        <meta name="description" content="Get in touch with Rocket." />
        <link rel="canonical" href="https://rocket-technologies.web.app/contact" />
      </Helmet>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">Contact</h1>
      <p className="mt-4 text-ink-500">
        Have a project in mind, or just want to say hi? Send us a message.
      </p>

      {status === "sent" ? (
        <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
          Thanks for reaching out — we'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink-700">
              Name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink-700">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-orange-500"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-orange-600">
              Something went wrong sending your message. Please try again.
            </p>
          )}

          {!configured && (
            <p className="text-sm text-ink-500">
              Contact form isn't fully set up yet — check back soon.
            </p>
          )}

          <button
            type="submit"
            disabled={!configured || status === "sending"}
            className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
    </section>
  );
}
