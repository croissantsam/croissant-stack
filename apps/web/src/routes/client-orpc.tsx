import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { toast } from "sonner"
import { orpc } from "../lib/orpc"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"

export const Route = createFileRoute("/client-orpc")({
  component: ClientORPC,
})

function ClientORPC() {
  const [planets, setPlanets] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  
  // Form states
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [distance, setDistance] = React.useState("0")
  const [diameter, setDiameter] = React.useState("0")

  const fetchPlanets = async () => {
    try {
      const res = await orpc.getPlanets()
      setPlanets(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPlanets()
  }, [])

  const resetForm = () => {
    setName("")
    setDescription("")
    setDistance("0")
    setDiameter("0")
    setEditingId(null)
  }

  const handleAdd = async () => {
    const toastId = toast.loading("Adding planet...")
    try {
      await orpc.createPlanet({
        name,
        description,
        distanceFromSun: parseFloat(distance),
        diameter: parseFloat(diameter),
        hasRings: false,
      })
      await fetchPlanets()
      resetForm()
      toast.success("Planet added successfully", { id: toastId })
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to add planet", { id: toastId })
    }
  }

  const handleUpdate = async (id: number) => {
    const toastId = toast.loading("Updating planet...")
    try {
      await orpc.updatePlanet({
        id,
        name,
        description,
        distanceFromSun: parseFloat(distance),
        diameter: parseFloat(diameter),
        hasRings: false,
      })
      await fetchPlanets()
      resetForm()
      toast.success("Planet updated successfully", { id: toastId })
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to update planet", { id: toastId })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this planet?")) return
    const toastId = toast.loading("Deleting planet...")
    try {
      await orpc.deletePlanet({ id })
      await fetchPlanets()
      toast.success("Planet deleted successfully", { id: toastId })
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to delete planet", { id: toastId })
    }
  }

  const startEdit = (planet: any) => {
    setEditingId(planet.id)
    setName(planet.name)
    setDescription(planet.description || "")
    setDistance(planet.distanceFromSun.toString())
    setDiameter(planet.diameter.toString())
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Client + oRPC CRUD</h1>
        <p className="text-muted-foreground">Manage planets directly from the client using oRPC mutations.</p>
      </div>

      <div className="rounded-lg border p-6 bg-muted/30">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Edit Planet" : "Add New Planet"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mars" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="The red planet" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Distance (M km)</label>
            <Input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Diameter (km)</label>
            <Input type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)} />
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          {editingId ? (
            <>
              <Button onClick={() => handleUpdate(editingId)} className="flex items-center gap-2">
                <Check className="h-4 w-4" /> Save Changes
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Planet
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Current Planets</h2>
        {loading ? (
          <p>Loading planets...</p>
        ) : planets.length === 0 ? (
          <p className="text-gray-500 italic">No planets found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {planets.map((planet) => (
              <div key={planet.id} className="flex items-center justify-between rounded-lg border p-4 bg-background shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{planet.name}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">ID: {planet.id}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{planet.description || "No description provided."}</p>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground font-mono">
                    <span>Distance: {planet.distanceFromSun} M km</span>
                    <span>Diameter: {planet.diameter} km</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="icon" onClick={() => startEdit(planet)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(planet.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
