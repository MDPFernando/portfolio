/**
 * GitHub API helper to retrieve profile statistics, repositories,
 * and contribution calendar data for the heat map.
 */

export interface GitHubData {
  username: string;
  totalContributions: number;
  followers: number;
  following: number;
  totalRepos: number;
  totalCommits: number;
  pinnedRepos: any[];
  topRepos: any[];
  languages: { name: string; count: number; color: string }[];
  contributionCalendar: {
    date: string;
    count: number;
    color: string;
  }[];
}

/**
 * Fetches real data from the GitHub GraphQL API, or returns a premium mockup dataset
 * if variables are missing or if the request fails.
 */
export async function getGitHubData(username: string): Promise<GitHubData> {
  const token = process.env.GITHUB_TOKEN;

  if (!username) {
    return getMockGitHubData("developer");
  }

  if (!token) {
    console.warn("GITHUB_TOKEN is not configured. Returning mock data.");
    return getMockGitHubData(username);
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        repositories(first: 50, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
        followers {
          totalCount
        }
        following {
          totalCount
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                color
                contributionCount
                date
                weekday
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const json = await response.json();
    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
      throw new Error("GitHub GraphQL API query error");
    }

    const userData = json.data.user;
    if (!userData) {
      throw new Error(`GitHub user "${username}" not found.`);
    }

    // Process languages
    const langMap: Record<string, { count: number; color: string }> = {};
    const nodes = userData.repositories.nodes || [];
    nodes.forEach((repo: any) => {
      if (repo.primaryLanguage) {
        const name = repo.primaryLanguage.name;
        const color = repo.primaryLanguage.color || "#cccccc";
        if (!langMap[name]) {
          langMap[name] = { count: 0, color };
        }
        langMap[name].count += 1 + (repo.stargazerCount || 0); // factor in popularity
      }
    });

    const languages = Object.entries(langMap)
      .map(([name, val]) => ({ name, count: val.count, color: val.color }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Process contribution calendar days
    const calendarDays: { date: string; count: number; color: string }[] = [];
    const weeks = userData.contributionsCollection?.contributionCalendar?.weeks || [];
    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        calendarDays.push({
          date: day.date,
          count: day.contributionCount,
          color: day.color,
        });
      });
    });

    // Extract top repos
    const topRepos = nodes.slice(0, 6).map((repo: any) => ({
      name: repo.name,
      description: repo.description || "No description provided.",
      url: repo.url,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      language: repo.primaryLanguage ? repo.primaryLanguage.name : "TypeScript",
      languageColor: repo.primaryLanguage ? repo.primaryLanguage.color : "#3178c6",
    }));

    return {
      username,
      totalContributions: userData.contributionsCollection?.contributionCalendar?.totalContributions || 0,
      followers: userData.followers?.totalCount || 0,
      following: userData.following?.totalCount || 0,
      totalRepos: userData.repositories.totalCount || 0,
      totalCommits: userData.contributionsCollection?.contributionCalendar?.totalContributions || 0,
      pinnedRepos: topRepos.slice(0, 3), // Treat top 3 as pinned
      topRepos,
      languages,
      contributionCalendar: calendarDays,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub data:", error);
    return getMockGitHubData(username);
  }
}

/**
 * Returns mock data when API keys are not supplied.
 */
function getMockGitHubData(username: string): GitHubData {
  const contributionCalendar: { date: string; count: number; color: string }[] = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 364);

  // Generate 365 days of contributions
  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + i);
    const count = Math.random() > 0.35 ? Math.floor(Math.random() * 8) : 0;
    
    let color = "#161b22"; // Empty
    if (count > 0 && count <= 2) color = "#0e4429";
    else if (count > 2 && count <= 4) color = "#006d32";
    else if (count > 4 && count <= 6) color = "#26a641";
    else if (count > 6) color = "#39d353";

    contributionCalendar.push({
      date: currentDate.toISOString().split("T")[0],
      count,
      color,
    });
  }

  return {
    username,
    totalContributions: 77,
    followers: 2,
    following: 4,
    totalRepos: 3,
    totalCommits: 77,
    pinnedRepos: [
      {
        name: "ecommerce",
        description: "NET — Next Era Technologies. A production-ready cyberpunk e-commerce platform built with Spring Boot, Thymeleaf, MySQL and Docker. Features a full admin panel and shopper portal.",
        url: "https://github.com/MDPFernando/ecommerce",
        stars: 0,
        forks: 0,
        language: "HTML",
        languageColor: "#e34c26",
      },
      {
        name: "NEXT-ERA-TECHNOLOGIES",
        description: "Next Era Technologies — cyberpunk e-commerce platform. Spring Boot backend, futuristic dark UI, full admin panel and shopper portal with order tracking.",
        url: "https://github.com/MDPFernando/NEXT-ERA-TECHNOLOGIES",
        stars: 0,
        forks: 0,
        language: "Java",
        languageColor: "#b07219",
      },
    ],
    topRepos: [
      {
        name: "ecommerce",
        description: "NET — Next Era Technologies. A production-ready cyberpunk e-commerce platform built with Spring Boot, Thymeleaf, MySQL and Docker.",
        url: "https://github.com/MDPFernando/ecommerce",
        stars: 0,
        forks: 0,
        language: "HTML",
        languageColor: "#e34c26",
      },
      {
        name: "NEXT-ERA-TECHNOLOGIES",
        description: "Next Era Technologies — cyberpunk e-commerce platform with Spring Boot backend, futuristic dark UI, full admin panel and shopper portal.",
        url: "https://github.com/MDPFernando/NEXT-ERA-TECHNOLOGIES",
        stars: 0,
        forks: 0,
        language: "Java",
        languageColor: "#b07219",
      },
    ],
    languages: [
      { name: "Java", count: 55, color: "#b07219" },
      { name: "HTML/CSS", count: 25, color: "#e34c26" },
      { name: "JavaScript", count: 12, color: "#f1e05a" },
      { name: "SQL", count: 8, color: "#e38c00" },
    ],
    contributionCalendar,
  };
}
