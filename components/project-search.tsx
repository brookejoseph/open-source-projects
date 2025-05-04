"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProjectSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [skillLevel, setSkillLevel] = useState("any")
  const [category, setCategory] = useState("any")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    const searchParams = new URLSearchParams()

    if (query) searchParams.set("q", query)
    if (skillLevel !== "any") searchParams.set("level", skillLevel)
    if (category !== "any") searchParams.set("category", category)

    router.push(`/search?${searchParams.toString()}`)

    // Reset searching state after navigation
    setTimeout(() => setIsSearching(false), 500)
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Find ML open source projects for beginners in computer vision..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="skill-level" className="text-sm font-medium">
              Skill Level
            </label>
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger id="skill-level">
                <SelectValue placeholder="Any skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any skill level</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Any category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any category</SelectItem>
                <SelectItem value="machine-learning">Machine Learning</SelectItem>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-development">Mobile Development</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="computer-vision">Computer Vision</SelectItem>
                <SelectItem value="nlp">Natural Language Processing</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search Projects"}
        </Button>
      </div>
    </form>
  )
}
