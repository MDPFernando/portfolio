"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

/**
 * A robust, lightweight custom markdown parser to avoid heavy external JS libraries.
 * Parses headings, paragraphs, lists, bold formatting, inline code, and block quotes.
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split content by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-6 text-text-primary/90 leading-relaxed font-sans text-sm md:text-base selection:bg-accent-violet/30 selection:text-white">
      {parts.map((part, index) => {
        // Render Code Blocks
        if (part.startsWith("```")) {
          const lines = part.split("\n");
          // Extract language from first line (e.g. ```glsl or ```typescript)
          const firstLine = lines[0].replace("```", "").trim();
          const language = firstLine || "code";
          // Joined code body (ignoring first and last backtick lines)
          const codeBody = lines.slice(1, lines.length - 1).join("\n");

          return (
            <div
              key={index}
              className="border border-surface-border bg-black/60 rounded-xl overflow-hidden font-mono text-xs my-6 shadow-inner"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-surface-border bg-white/[0.02]">
                <span className="text-[10px] uppercase text-text-muted tracking-widest font-bold">
                  {language}
                </span>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
              </div>
              <pre className="p-4 overflow-x-auto text-text-primary whitespace-pre scrollbar-thin">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        // Render inline elements & line-by-line blocks
        const lines = part.split("\n");
        return lines.map((line, lineIdx) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={`empty-${lineIdx}`} className="h-2" />;
          }

          // H3 Heading
          if (trimmed.startsWith("### ")) {
            return (
              <h3
                key={lineIdx}
                className="text-lg md:text-xl font-bold font-heading text-white mt-6 mb-3 uppercase tracking-wide"
              >
                {parseInline(trimmed.substring(4))}
              </h3>
            );
          }

          // H2 Heading
          if (trimmed.startsWith("## ")) {
            return (
              <h2
                key={lineIdx}
                className="text-xl md:text-2xl font-bold font-heading text-white mt-8 mb-4 border-b border-surface-border pb-2 uppercase tracking-wide"
              >
                {parseInline(trimmed.substring(3))}
              </h2>
            );
          }

          // H1 Heading
          if (trimmed.startsWith("# ")) {
            return (
              <h1
                key={lineIdx}
                className="text-2xl md:text-4xl font-extrabold font-heading text-white mt-10 mb-6 uppercase tracking-tight"
              >
                {parseInline(trimmed.substring(2))}
              </h1>
            );
          }

          // Unordered Lists
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            return (
              <ul key={lineIdx} className="list-disc pl-6 my-2 space-y-1">
                <li className="text-text-primary/95">
                  {parseInline(trimmed.substring(2))}
                </li>
              </ul>
            );
          }

          // Blockquotes
          if (trimmed.startsWith("> ")) {
            return (
              <blockquote
                key={lineIdx}
                className="border-l-4 border-accent-cyan bg-accent-cyan/5 px-4 py-2.5 rounded-r-lg my-4 italic text-text-muted font-serif"
              >
                {parseInline(trimmed.substring(2))}
              </blockquote>
            );
          }

          // Standard Paragraph
          return (
            <p key={lineIdx} className="mb-4 text-text-muted/95 leading-relaxed font-sans font-normal">
              {parseInline(line)}
            </p>
          );
        });
      })}
    </div>
  );
}

/**
 * Parses inline elements like bold (**text**) and inline code (`code`)
 */
function parseInline(text: string) {
  // Regex pattern matching bold (**text**) and inline code (`text`)
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    // Bold text
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="text-white font-extrabold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Inline code block
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="bg-white/5 border border-surface-border px-1.5 py-0.5 rounded text-accent-cyan font-mono text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    // Plain text
    return part;
  });
}
