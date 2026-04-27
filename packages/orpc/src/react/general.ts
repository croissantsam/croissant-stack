import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AppRouter } from "../lib/router";
import type { InferRouterOutputs } from "@orpc/server";
import { useORPC } from "./context";

type Outputs = InferRouterOutputs<AppRouter>;

export function useSecretData(
  options?: Omit<UseQueryOptions<Outputs["getSecretData"]>, "queryKey" | "queryFn">,
) {
  const orpc = useORPC();
  return useQuery({
    ...options,
    queryKey: ["secret-data"],
    queryFn: () => orpc.getSecretData(),
  });
}

export function useHello(
  name?: string,
  options?: Omit<UseQueryOptions<Outputs["hello"]>, "queryKey" | "queryFn">,
) {
  const orpc = useORPC();
  return useQuery({
    ...options,
    queryKey: ["hello", name],
    queryFn: () => orpc.hello({ name }),
  });
}
