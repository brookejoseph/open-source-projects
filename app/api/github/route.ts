import { type NextRequest, NextResponse } from "next/server"
import { getSkillLevelQuery, type SearchResponse } from "@/lib/github"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const level = searchParams.get("level") || "any"
  const category = searchParams.get("category") || "any"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const perPage = 10

  try {
    // Build GitHub search query
    let githubQuery = query

    // Add skill level parameters if specified
    if (level !== "any") {
      const levelQuery = getSkillLevelQuery(level)
      if (levelQuery) {
        githubQuery += ` ${levelQuery}`
      }
    }

    // Add category/topic filter if specified
    if (category !== "any") {
      githubQuery += ` topic:${category.replace(/\s+/g, "-")}`
    }

    // Add some default parameters to find good open source projects
    githubQuery += " is:public archived:false"

    // Encode the query for URL
    const encodedQuery = encodeURIComponent(githubQuery)

    // GitHub API URL with pagination
    const url = `https://api.github.com/search/repositories?q=${encodedQuery}&sort=stars&order=desc&page=${page}&per_page=${perPage}`

    // Set up headers for GitHub API
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    }

    // Add GitHub token if available (helps with rate limits)
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`
    }

    const response = await fetch(url, { headers })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: "GitHub API error", details: error }, { status: response.status })
    }

    const data: SearchResponse = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 })
  }
}
