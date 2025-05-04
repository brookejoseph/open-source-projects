// GitHub API integration

export type GitHubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string
  stargazers_count: number
  language: string
  topics: string[]
  open_issues_count: number
  updated_at: string
  owner: {
    login: string
    avatar_url: string
  }
}

export type SearchResponse = {
  items: GitHubRepo[]
  total_count: number
}

// Helper to format the date in a human-readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "today"
  } else if (diffDays === 1) {
    return "yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} ${years === 1 ? "year" : "years"} ago`
  }
}

// Map skill levels to GitHub search parameters
export function getSkillLevelQuery(level: string): string {
  switch (level) {
    case "beginner":
      return 'good-first-issue label:"good first issue" label:"beginner friendly"'
    case "intermediate":
      return 'help-wanted label:"help wanted"'
    case "advanced":
      return 'label:"advanced"'
    default:
      return ""
  }
}

// Determine skill level based on repository properties
export function determineSkillLevel(repo: GitHubRepo): string {
  const topics = repo.topics || []
  const description = repo.description?.toLowerCase() || ""

  if (
    topics.some((topic) =>
      ["beginner", "beginner-friendly", "good-first-issue", "first-timers-only"].includes(topic),
    ) ||
    description.includes("beginner") ||
    description.includes("getting started")
  ) {
    return "beginner"
  } else if (topics.some((topic) => ["intermediate", "help-wanted"].includes(topic))) {
    return "intermediate"
  } else if (topics.some((topic) => ["advanced", "expert"].includes(topic)) || description.includes("advanced")) {
    return "advanced"
  }

  // Default based on stars and issues
  if (repo.stargazers_count > 5000 || repo.open_issues_count > 100) {
    return "advanced"
  } else if (repo.stargazers_count > 1000 || repo.open_issues_count > 30) {
    return "intermediate"
  }

  return "beginner"
}
