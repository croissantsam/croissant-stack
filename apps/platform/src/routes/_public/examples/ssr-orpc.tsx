import * as React from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";

import type { router } from "@workspace/orpc/router";
import type { InferRouterOutputs } from "@orpc/server";
import { orpc } from "@/lib/orpc";

type Outputs = InferRouterOutputs<typeof router>;
type Planet = Outputs["planets"]["getPlanets"][number];

const planetSchema = type({
  name: "string>0",
  description: "string",
  distance: "string",
  diameter: "string",
}).narrow((data, ctx) => {
  if (isNaN(parseFloat(data.distance))) {
    ctx.error({ message: "Must be a number", path: ["distance"] });
  }
  if (isNaN(parseFloat(data.diameter))) {
    ctx.error({ message: "Must be a number", path: ["diameter"] });
  }
  return true;
});

const getPlanets = createServerFn({ method: "GET" }).handler(async () => {
  const planets = await orpc.planets.getPlanets();
  return { planets };
});

export const Route = createFileRoute("/_public/examples/ssr-orpc")({
  head: () => ({
    meta: [
      {
        title: "SSR + oRPC Example | Croissant Stack",
      },
      {
        name: "description",
        content: "Learn how to use Server-Side Rendering (SSR) with oRPC in Croissant Stack.",
      },
    ],
  }),
  loader: () => getPlanets(),
  component: SSRORPC,
});

function SSRORPC() {
  const { planets } = Route.useLoaderData();
  const router = useRouter();
  const [editingId, setEditingId] = React.useState<number | null>(null);

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
      const toastId = toast.loading(editingId ? "Updating planet..." : "Adding planet...");
      try {
        if (editingId) {
          await orpc.planets.updatePlanet({
            id: editingId,
            name: value.name,
            description: value.description,
            distanceFromSun: parseFloat(value.distance),
            diameter: parseFloat(value.diameter),
            hasRings: false,
          });
          toast.success("Planet updated successfully", { id: toastId });
        } else {
          await orpc.planets.createPlanet({
            name: value.name,
            description: value.description,
            distanceFromSun: parseFloat(value.distance),
            diameter: parseFloat(value.diameter),
            hasRings: false,
          });
          toast.success("Planet added successfully", { id: toastId });
        }
        await router.invalidate();
        resetForm();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Operation failed", { id: toastId });
      }
    },
  });

  const resetForm = () => {
    form.reset();
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this planet?")) return;
    const toastId = toast.loading("Deleting planet...");
    try {
      await orpc.planets.deletePlanet({ id });
      await router.invalidate();
      toast.success("Planet deleted successfully", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete planet", { id: toastId });
    }
  };

  const startEdit = (planet: Planet) => {
    setEditingId(planet.id);
    form.setFieldValue("name", planet.name);
    form.setFieldValue("description", planet.description || "");
    form.setFieldValue("distance", planet.distanceFromSun.toString());
    form.setFieldValue("diameter", planet.diameter.toString());
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">SSR + oRPC CRUD</h1>
        <p className="text-muted-foreground">
          Manage planets using SSR loaders for fetching and oRPC mutations for actions.
        </p>
      </div>

      <div className="rounded-lg border p-6 bg-muted/30">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {editingId ? "Edit Planet (SSR)" : "Add New Planet (SSR)"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="name"
              children={(field) => (
                <Field
                  data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                >
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
                <Field
                  data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                >
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
                <Field
                  data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                >
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
                <Field
                  data-invalid={field.state.meta.isTouched && field.state.meta.errors.length > 0}
                >
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
                        disabled={!canSubmit || isSubmitting}
                      >
                        <Check className="h-4 w-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={resetForm}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={!canSubmit || isSubmitting}
                    >
                      <Plus className="h-4 w-4" /> {isSubmitting ? "Adding..." : "Add Planet"}
                    </Button>
                  )}
                </>
              )}
            />
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Current Planets (SSR Fetched)</h2>
        {planets.length === 0 ? (
          <p className="text-gray-500 italic">No planets found in the database.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {planets.map((planet) => (
              <div
                key={planet.id}
                className="flex items-center justify-between rounded-lg border p-4 bg-background shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{planet.name}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      ID: {planet.id}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {planet.description || "No description provided."}
                  </p>
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
  );
}
