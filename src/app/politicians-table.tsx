"use client";
"use no memo";

import { useState, useMemo } from "react";
import { Politician } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PoliticiansTableProps {
  politicians: Politician[];
}

export function PoliticiansTable({ politicians }: PoliticiansTableProps) {
  const data = useMemo(() => politicians, [politicians]);

  // Build a list of all distinct legislatures present in the dataset.
  // Some politician records may not have the optional `legislaturas` field
  // (it is defined as `legislaturas?: number[]` in the type definition).
  // Using `p.legislaturas ?? []` guarantees we always flatten an array and
  // prevents a TypeError when the field is undefined.
  const allLegislatures = useMemo(
    () =>
      [...new Set(politicians.flatMap((p) => p.legislaturas ?? []))].sort(
        (a, b) => b - a,
      ),
    [politicians],
  );

            const [sorting, setSorting] = useState<SortingState>([
      { id: "legislaturas", desc: true },
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  // Extract distinct UF codes. The `ufs` field can be a string, a CSV string, or an array of strings.
  // We normalize it to an array of trimmed strings and then remove duplicates.
  const ufs = useMemo(
    () =>
      [
        ...new Set(
          data.flatMap((d) => d.ufs.map((s) => s.trim()).filter(Boolean)),
        ),
      ].sort(),
    [data],
  );

  const houseFilter = table.getColumn("casa")?.getFilterValue() as string;
  const legislatureFilter = table
    .getColumn("legislaturas")
    ?.getFilterValue() as string;

  const legislatureSort = table.getColumn("legislaturas")?.getIsSorted();

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Filtrar por nome..."
              value={
                (table.getColumn("nome")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("nome")?.setFilterValue(event.target.value)
              }
              className="pl-10 w-full"
            />
          </div>

          <Select
            value={legislatureFilter ?? ""}
            onValueChange={(value) =>
              // Empty value means no filter (Todas as legislaturas)
              table
                .getColumn("legislaturas")
                ?.setFilterValue(value === "" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a Legislatura" />
            </SelectTrigger>
            <SelectContent>
              {/* Option to show all legislaturas */}
              <SelectItem value="">Todas as Legislaturas</SelectItem>
              {allLegislatures.map((leg) => (
                <SelectItem key={leg} value={leg.toString()}>
                  {leg}ª Legislatura
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={houseFilter ?? "todas"}
            onValueChange={(value) =>
              table
                .getColumn("casa")
                ?.setFilterValue(value === "todas" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por casa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Casas</SelectItem>
              <SelectItem value="Câmara dos Deputados">Câmara</SelectItem>
              <SelectItem value="Senado Federal">Senado</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={
              (table.getColumn("ufs")?.getFilterValue() as string) ?? "todas"
            }
            onValueChange={(value) =>
              table
                .getColumn("ufs")
                ?.setFilterValue(value === "todas" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por UF" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todos os UFs</SelectItem>
              {ufs.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={legislatureSort === "desc" ? "desc" : legislatureSort === "asc" ? "asc" : "false"}
                                    onValueChange={(value) => {
              if (value === "false") {
                setSorting([{ id: "tenure", desc: true }]);
              } else {
                setSorting([{ id: "legislaturas", desc: value === "desc" }]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Geral</SelectItem>
              <SelectItem value="desc">Mais Recente</SelectItem>
              <SelectItem value="asc">Mais Antiga</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable table={table} columns={columns} />
    </div>
  );
}
