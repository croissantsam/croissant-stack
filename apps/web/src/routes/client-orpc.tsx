import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Check, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"

import { orpc } from "../lib/orpc"

const planetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  distance: z.string().refine((val) => !isNaN(parseFloat(val)), "Must be a number"),
  diameter: z.string().refine((val) => !isNaN(parseFloat(val)), "Must be a number"),
})

export const Route = createFileRoute("/client-orpc")({
  component: ClientORPC,
})

function ClientORPC() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = React.useState<number | null>(null)
  
  const { data: planets = [], isLoading } = useQuery({
    queryKey: ["planets"],
    queryFn: () => orpc.getPlanets(),
  })

  const form = useForm({
     defaultValues: {
        name: "",
        description: "",
        distance: "0",
        diameter: "0",
      },
      validators: {
        onChange: planetSchema,
      },
      onSubmit: async ({ value }) => {
      if (editingId) {
        updateMutation.mutate({
          id: editingId,
          name: value.name,
          description: value.description,
          distanceFromSun: parseFloat(value.distance),
          diameter: parseFloat(value.diameter),
          hasRings: false,
        })
      } else {
        createMutation.mutate({
          name: value.name,
          description: value.description,
          distanceFromSun: parseFloat(value.distance),
          diameter: parseFloat(value.diameter),
          hasRings: false,
        })
      }
    },
  })

  const resetForm = () => {
    form.reset()
    setEditingId(null)
  }

  const createMutation = useMutation({
    mutationFn: (newPlanet: any) => orpc.createPlanet(newPlanet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planets"] })
      resetForm()
      toast.success("Planet added successfully")
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add planet")
    },
  })

  const updateMutation = useMutation({
    mutationFn: (updatedPlanet: any) => orpc.updatePlanet(updatedPlanet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planets"] })
      resetForm()
      toast.success("Planet updated successfully")
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update planet")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => orpc.deletePlanet({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planets"] })
      toast.success("Planet deleted successfully")
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete planet")
    },
  })

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this planet?")) return
    deleteMutation.mutate(id)
  }

  const startEdit = (planet: any) => {
    setEditingId(planet.id)
    form.setFieldValue("name", planet.name)
    form.setFieldValue("description", planet.description || "")
    form.setFieldValue("distance", planet.distanceFromSun.toString())
    form.setFieldValue("diameter", planet.diameter.toString())
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Client + oRPC CRUD</h1>
        <p className="text-muted-foreground">Manage planets directly from the client using TanStack Query, TanStack Form and oRPC.</p>
      </div>

      <div className="rounded-lg border p-6 bg-muted/30">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Edit Planet" : "Add New Planet"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="name"
              children={(field) => (
                <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Mars"
                  />
                  {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )}
            />
            <form.Field
              name="description"
              children={(field) => (
                <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="The red planet"
                  />
                  {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )}
            />
            <form.Field
              name="distance"
              children={(field) => (
                <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>Distance (M km)</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )}
            />
            <form.Field
              name="diameter"
              children={(field) => (
                <Field data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}>
                  <FieldLabel htmlFor={field.name}>Diameter (km)</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )}
            />
          </div>
          <div className="mt-6 flex gap-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <>
                  {editingId ? (
                    <>
                      <Button 
                        type="submit"
                        className="flex items-center gap-2"
                        disabled={!canSubmit || isSubmitting || updateMutation.isPending}
                      >
                        <Check className="h-4 w-4" /> {isSubmitting || updateMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" type="button" onClick={resetForm} disabled={isSubmitting || updateMutation.isPending}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={!canSubmit || isSubmitting || createMutation.isPending}
                    >
                      <Plus className="h-4 w-4" /> {isSubmitting || createMutation.isPending ? "Adding..." : "Add Planet"}
                    </Button>
                  )}
                </>
              )}
            />
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Current Planets</h2>
        {isLoading ? (
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
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDelete(planet.id)}
                    disabled={deleteMutation.isPending}
                  >
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
