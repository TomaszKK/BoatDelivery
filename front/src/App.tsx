import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-zinc-900">Hi!</h1>
        <p className="text-zinc-500">React + Tailwind + shadcn/ui init</p>
        <Button>Test shadcn/ui component</Button>
      </div>
    </div>
  )
}

export default App