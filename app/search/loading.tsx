import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-8">
        <div className="container flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Searching GitHub repositories...</h2>
          <p className="mt-2 text-muted-foreground">This may take a moment</p>
        </div>
      </main>
    </div>
  )
}
