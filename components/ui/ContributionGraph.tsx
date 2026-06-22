"use client";

import { useEffect, useRef } from "react";

interface ContributionGraphProps {
  calendarData: { date: string; count: number; color: string }[];
}

/**
 * ContributionGraph draws a pixel-perfect replica of GitHub's commit heatmap.
 * Uses high-DPR canvas drawing to ensure lines and border-radii are crisp,
 * and maps standard git-greens to the site's cyan/violet color scale.
 */
export default function ContributionGraph({ calendarData }: ContributionGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !calendarData || calendarData.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cellSide = 10;
    const gap = 2.5;
    const padLeft = 30;
    const padTop = 20;

    const cols = 53;
    const rows = 7;
    const width = padLeft + cols * (cellSide + gap);
    const height = padTop + rows * (cellSide + gap) + 24;

    // Set dimensions factoring in DPR for HD display support
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw weekday headings (Mon, Wed, Fri)
    ctx.font = "500 9px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#64748B"; // Slate-500
    ctx.textBaseline = "middle";
    ctx.fillText("Mon", 2, padTop + 1 * (cellSide + gap) + cellSide / 2);
    ctx.fillText("Wed", 2, padTop + 3 * (cellSide + gap) + cellSide / 2);
    ctx.fillText("Fri", 2, padTop + 5 * (cellSide + gap) + cellSide / 2);

    const firstDate = new Date(calendarData[0].date);
    const startDay = firstDate.getDay(); // 0 = Sunday, 1 = Mon...

    let col = 0;
    let row = startDay;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let lastMonth = -1;

    calendarData.forEach((day) => {
      const curDate = new Date(day.date + "T00:00:00"); // Avoid timezone shifting
      const curMonth = curDate.getMonth();

      // Render month headings when columns roll over to row 0
      if (curMonth !== lastMonth && row === 0) {
        ctx.fillStyle = "#94A3B8";
        ctx.fillText(monthNames[curMonth], padLeft + col * (cellSide + gap), 8);
        lastMonth = curMonth;
      }

      // Draw grid item
      const x = padLeft + col * (cellSide + gap);
      const y = padTop + row * (cellSide + gap);

      // Color mapping: Empty -> Low -> Medium -> High -> Ultra
      let cellColor = "rgba(255, 255, 255, 0.04)"; // Base grid empty color
      if (day.count > 0 && day.count <= 2) cellColor = "#0f324d";
      else if (day.count > 2 && day.count <= 4) cellColor = "#0e6b8c";
      else if (day.count > 4 && day.count <= 6) cellColor = "#06b6d4"; // Cyan
      else if (day.count > 6) cellColor = "#7c3aed"; // Violet

      ctx.fillStyle = cellColor;
      
      // Draw rounded grid cell
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, cellSide, cellSide, 1.5);
      } else {
        ctx.rect(x, y, cellSide, cellSide);
      }
      ctx.fill();

      row++;
      if (row > 6) {
        row = 0;
        col++;
      }
    });

    // Draw Legend at bottom right
    const legendX = width - 130;
    const legendY = height - 12;
    ctx.fillStyle = "#64748B";
    ctx.fillText("Less", legendX - 26, legendY + 5);

    const legendColors = [
      "rgba(255, 255, 255, 0.04)",
      "#0f324d",
      "#0e6b8c",
      "#06b6d4",
      "#7c3aed",
    ];

    legendColors.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(legendX + idx * 14, legendY, 9, 9, 1.5);
      } else {
        ctx.rect(legendX + idx * 14, legendY, 9, 9);
      }
      ctx.fill();
    });

    ctx.fillStyle = "#64748B";
    ctx.fillText("More", legendX + legendColors.length * 14 + 4, legendY + 5);
  }, [calendarData]);

  return (
    <div className="overflow-x-auto w-full py-4 scrollbar-none">
      <div className="min-w-[720px] flex justify-center">
        <canvas ref={canvasRef} className="opacity-80 hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
}
