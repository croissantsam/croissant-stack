import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AppRouter } from "../lib/router";
import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";
import { useORPC } from "./context";

type Inputs = InferRouterInputs<AppRouter>;
type Outputs = InferRouterOutputs<AppRouter>;

export function usePlanets(
  options?: Omit<UseQueryOptions<Outputs["planets"]["getPlanets"]>, "queryKey" | "queryFn">,
) {
  const orpc = useORPC();
  return useQuery({
    ...options,
    queryKey: ["planets"],
    queryFn: () => orpc.planets.getPlanets(),
  });
}

export function useCreatePlanet(
  options?: Omit<
    UseMutationOptions<
      Outputs["planets"]["createPlanet"],
      Error,
      Inputs["planets"]["createPlanet"]
    >,
    "mutationFn"
  >,
) {
  const orpc = useORPC();
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (input: Inputs["planets"]["createPlanet"]) => orpc.planets.createPlanet(input),
    onSuccess: (data, variables, context, extra) => {
      queryClient.invalidateQueries({ queryKey: ["planets"] });
      options?.onSuccess?.(data, variables, context, extra);
    },
  });
}

export function useUpdatePlanet(
  options?: Omit<
    UseMutationOptions<
      Outputs["planets"]["updatePlanet"],
      Error,
      Inputs["planets"]["updatePlanet"]
    >,
    "mutationFn"
  >,
) {
  const orpc = useORPC();
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (input: Inputs["planets"]["updatePlanet"]) => orpc.planets.updatePlanet(input),
    onSuccess: (data, variables, context, extra) => {
      queryClient.invalidateQueries({ queryKey: ["planets"] });
      options?.onSuccess?.(data, variables, context, extra);
    },
  });
}

export function useDeletePlanet(
  options?: Omit<
    UseMutationOptions<
      Outputs["planets"]["deletePlanet"],
      Error,
      Inputs["planets"]["deletePlanet"]
    >,
    "mutationFn"
  >,
) {
  const orpc = useORPC();
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (input: Inputs["planets"]["deletePlanet"]) => orpc.planets.deletePlanet(input),
    onSuccess: (data, variables, context, extra) => {
      queryClient.invalidateQueries({ queryKey: ["planets"] });
      options?.onSuccess?.(data, variables, context, extra);
    },
  });
}
