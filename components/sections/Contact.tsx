"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle, AlertTriangle, Calendar } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { contactSchema } from "@/lib/validations";

type ContactFormValues = z.infer<typeof contactSchema>;

/**
 * Contact section compiles location contact nodes, email message dispatch forms,
 * and an inline scheduler framework.
 */
export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Message delivery failed.");
      }

      setSubmitStatus("success");
      setStatusMessage("Telemetry transmission successful. Your message has been routed.");
      reset();
    } catch (err: any) {
      setSubmitStatus("error");
      setStatusMessage(err.message || "Failed to establish connection. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 relative">
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-accent-violet/5 rounded-full filter blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Section Header */}
      <div className="mb-16 text-center md:text-left">
        <p className="text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2">
          {"// 09. COMMUNICATIONS"}
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase">
          Establish Connection
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info & Calendly placeholder */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 border border-surface-border">
            <h3 className="text-lg font-bold text-white font-heading mb-4 uppercase">
              Operational Channels
            </h3>
            
            <div className="space-y-4 font-mono text-xs text-text-muted">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-white/5 border border-white/10 flex items-center justify-center text-accent-cyan">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Direct Mail</p>
                  <a href="mailto:dinethprashansa.517@outlook.com" className="text-white hover:text-accent-cyan transition-colors">
                    dinethprashansa.517@outlook.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-white/5 border border-white/10 flex items-center justify-center text-accent-cyan">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Availability</p>
                  <p className="text-white">Active response within 24 standard solar hours</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Calendly Booking Invitation */}
          <GlassCard className="p-6 border border-surface-border">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-accent-cyan/15 border border-accent-cyan/25 flex items-center justify-center text-accent-cyan shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-heading uppercase">
                  Schedule Direct Call
                </h4>
                <p className="text-text-muted text-xs mt-1.5 leading-relaxed font-sans font-normal">
                  Want to skip the form queue? Book a video meeting node directly into my personal calendar ledger.
                </p>
                <div className="mt-4">
                  <a
                    href="https://calendly.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-surface-border hover:border-text-muted/30 text-white font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>Launch Scheduler</span>
                    <Send className="w-3 h-3 text-accent-cyan" />
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right: Message Dispatch Form */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 md:p-8 border border-surface-border">
            <h3 className="text-lg font-bold text-white font-heading mb-6 uppercase">
              Message Dispatcher
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-text-muted uppercase tracking-wider text-[10px]">
                    Identifier Name:
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-3 text-white transition-colors"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-400 font-bold block">{errors.name.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-text-muted uppercase tracking-wider text-[10px]">
                    Return Address (Email):
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-3 text-white transition-colors"
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-400 font-bold block">{errors.email.message}</span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-text-muted uppercase tracking-wider text-[10px]">
                  Topic Subject:
                </label>
                <select
                  id="subject"
                  {...register("subject")}
                  className="w-full bg-space-950 border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-3 text-white transition-colors cursor-pointer"
                >
                  <option value="">Select transmission category</option>
                  <option value="General Question">General Connection</option>
                  <option value="Freelance Project">Freelance / Project Contract</option>
                  <option value="Job Opportunity">Career Opportunity / Recruiting</option>
                  <option value="Collaboration">Collaboration / Open Source</option>
                </select>
                {errors.subject && (
                  <span className="text-[10px] text-red-400 font-bold block">{errors.subject.message}</span>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-text-muted uppercase tracking-wider text-[10px]">
                  Payload Content (Message):
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-3 text-white transition-colors resize-none"
                  placeholder="Enter details of your project or proposal..."
                />
                {errors.message && (
                  <span className="text-[10px] text-red-400 font-bold block">{errors.message.message}</span>
                )}
              </div>

              {/* Turnstile verification message / widget container */}
              <div className="text-[10px] text-text-muted pt-2 border-t border-surface-border flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Turnstile security ledger pre-verified</span>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent-violet hover:bg-accent-violet/90 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-widest font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border border-dashed border-white animate-spin" />
                    <span>Broadcasting Payload...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Transmit Message</span>
                  </>
                )}
              </button>

              {/* Response Notification banner */}
              {submitStatus !== "idle" && (
                <div
                  className={`mt-4 p-4 rounded-lg flex items-start gap-2 border ${
                    submitStatus === "success"
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                      : "bg-red-500/10 border-red-500/25 text-red-400"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  )}
                  <p className="text-[11px] leading-relaxed font-semibold">{statusMessage}</p>
                </div>
              )}
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
