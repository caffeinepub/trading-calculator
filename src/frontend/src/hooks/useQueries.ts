import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TradingSetup } from "../backend.d";
import { useActor } from "./useActor";

const LS_KEY = "trading_setups_local";

function getLocalSetups(): Array<[bigint, TradingSetup]> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<[string, TradingSetup]>;
    return parsed.map(([id, s]) => [BigInt(id), s]);
  } catch {
    return [];
  }
}

function saveLocalSetup(setup: TradingSetup): bigint {
  const existing = getLocalSetups();
  const newId = BigInt(Date.now());
  existing.push([newId, setup]);
  localStorage.setItem(
    LS_KEY,
    JSON.stringify(existing.map(([id, s]) => [id.toString(), s])),
  );
  return newId;
}

function deleteLocalSetup(id: bigint): void {
  const existing = getLocalSetups();
  const filtered = existing.filter(([sid]) => sid !== id);
  localStorage.setItem(
    LS_KEY,
    JSON.stringify(filtered.map(([sid, s]) => [sid.toString(), s])),
  );
}

export function useGetSetups(isAuthenticated: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[bigint, TradingSetup]>>({
    queryKey: ["setups", isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated || !actor) {
        return getLocalSetups();
      }
      try {
        return await actor.getSetups();
      } catch {
        return getLocalSetups();
      }
    },
    enabled: !isFetching,
  });
}

export function useSaveSetup(isAuthenticated: boolean) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (setup: TradingSetup) => {
      if (!isAuthenticated || !actor) {
        return saveLocalSetup(setup);
      }
      try {
        return await actor.saveSetup(setup);
      } catch {
        return saveLocalSetup(setup);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["setups"] });
      toast.success("Setup saved successfully");
    },
    onError: () => {
      toast.error("Failed to save setup");
    },
  });
}

export function useDeleteSetup(isAuthenticated: boolean) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!isAuthenticated || !actor) {
        deleteLocalSetup(id);
        return;
      }
      try {
        await actor.deleteSetup(id);
      } catch {
        deleteLocalSetup(id);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["setups"] });
      toast.success("Setup deleted");
    },
  });
}
