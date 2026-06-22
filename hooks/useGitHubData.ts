"use client";

import { useEffect, useState } from "react";
import { GitHubData } from "@/lib/github";

/**
 * useGitHubData pulls cached github metrics from the /api/github route handler,
 * facilitating skeleton displays during pending fetch actions.
 */
export function useGitHubData() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchStats() {
      try {
        const response = await fetch("/api/github");
        if (!response.ok) {
          throw new Error("Could not fetch user stats");
        }
        const result = await response.json();
        if (active) {
          setData(result);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Failed to load");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
