import { ArrowLeft, ExternalLink, Github, Star } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { determineSkillLevel, formatDate, type GitHubRepo } from "@/lib/github"

async function searchGitHubProjects(searchParams: { [key: string]: string | string[] | undefined }) {
  const query = typeof searchParams.q === "string" ? searchParams.q : ""
  const level = typeof searchParams.level === "string" ? searchParams.level : "any"
  const category = typeof searchParams.category === "string" ? searchParams.category : "any"
  const page = typeof searchParams.page === "string" ? searchParams.page : "1"

  // Build the API URL with search parameters
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (level !== "any") params.set("level", level)
  if (category !== "any") params.set("category", category)
  params.set("page", page)

  // Use relative URL for API route
  const apiUrl = `/api/github?${params.toString()}`

  try {
    const response = await fetch(apiUrl, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      items: data.items || [],
      totalCount: data.total_count || 0,
      error: null,
    }
  } catch (error) {
    console.error("Error fetching GitHub projects:", error)
    return {
      items: [],
      totalCount: 0,
      error: "Failed to fetch projects. Please try again.",
    }
  }
}

export default async function SearchPage({
  searchParams:rawSearchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const searchParams = await rawSearchParams;
  const query = typeof searchParams.q === "string" ? searchParams.q : ""
  const level = typeof searchParams.level === "string" ? searchParams.level : "any"
  const category = typeof searchParams.category === "string" ? searchParams.category : "any"

  const { items: projects, totalCount, error } = await searchGitHubProjects(searchParams)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {query ? `Search results for "${query}"` : "All Projects"}
              </h1>
              <p className="text-muted-foreground">
                Found {totalCount > 1000 ? "1000+" : totalCount} projects matching your criteria
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select defaultValue="stars">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stars">Stars</SelectItem>
                    <SelectItem value="updated">Recently Updated</SelectItem>
                    <SelectItem value="issues">Open Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filters:</span>
                {level !== "any" && (
                  <Badge variant="outline" className="capitalize">
                    {level}
                  </Badge>
                )}
                {category !== "any" && (
                  <Badge variant="outline" className="capitalize">
                    {category.replace("-", " ")}
                  </Badge>
                )}
              </div>
            </div>
            <Separator />

            {error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-lg font-medium text-destructive">{error}</div>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid gap-6">
                {projects.map((project: GitHubRepo) => {
                  const skillLevel = determineSkillLevel(project)
                  const topics = project.topics || []

                  return (
                    <Card key={project.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{project.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {project.description || "No description available"}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span>{project.stargazers_count.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {project.language && (
                            <Badge variant="secondary" className="capitalize">
                              {project.language}
                            </Badge>
                          )}
                          <Badge variant="outline" className="capitalize">
                            {skillLevel}
                          </Badge>
                          {topics.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="outline" className="capitalize">
                              {tag.replace(/-/g, " ")}
                            </Badge>
                          ))}
                          {topics.length > 5 && <Badge variant="outline">+{topics.length - 5} more</Badge>}
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{project.open_issues_count}</span> open issues
                          </div>
                          <div>Updated {formatDate(project.updated_at)}</div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="text-sm text-muted-foreground">
                          By <span className="font-medium">{project.owner.login}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={project.html_url} target="_blank" className="flex items-center gap-1">
                              <Github className="h-4 w-4" />
                              <span>View Repo</span>
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link
                              href={`${project.html_url}/issues`}
                              target="_blank"
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Contribute</span>
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-lg font-medium">No projects found</div>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search criteria or explore different categories.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 OpenSourceFinder. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
