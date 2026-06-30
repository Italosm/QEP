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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ChevronDown, Search } from "lucide-react";

interface PoliticiansTableProps {
  politicians: Politician[];
}

const ufsByRegion = {
  Norte: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
  Nordeste: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"],
  Sudeste: ["ES", "MG", "RJ", "SP"],
  Sul: ["PR", "RS", "SC"],
};

export function PoliticiansTable({ politicians }: PoliticiansTableProps) {
  const data = useMemo(() => politicians, [politicians]);

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
  const ufFilter = table.getColumn("ufs")?.getFilterValue() as string;

  const legislatureSort = table.getColumn("legislaturas")?.getIsSorted();

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Filtrar por nome..."
              value={
                (table.getColumn("nome")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("nome")?.setFilterValue(event.target.value)
              }
              className="pl-10 w-full h-10"
            />
          </div>

          <Select
            value={legislatureFilter ?? ""}
            onValueChange={(value) =>
              table
                .getColumn("legislaturas")
                ?.setFilterValue(value === "" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a Legislatura" />
            </SelectTrigger>
            <SelectContent>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-between gap-1.5 rounded-lg border border-slate-300 bg-white py-2 pr-2 pl-3 text-sm whitespace-nowrap transition-colors outline-none select-none hover:border-slate-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground h-10">
                {ufFilter || "Filtrar por UF"}
                <ChevronDown className="pointer-events-none size-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() =>
                  table.getColumn("ufs")?.setFilterValue(undefined)
                }
              >
                Todos os UFs
              </DropdownMenuItem>
              {Object.entries(ufsByRegion).map(([region, regionUfs]) => {
                const availableUfs = regionUfs.filter((uf) => ufs.includes(uf));
                if (availableUfs.length === 0) return null;
                return (
                  <DropdownMenuSub key={region}>
                    <DropdownMenuSubTrigger>{region}</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {availableUfs.map((uf) => (
                        <DropdownMenuItem
                          key={uf}
                          onSelect={() =>
                            table.getColumn("ufs")?.setFilterValue(uf)
                          }
                        >
                          {uf}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select
            value={
              legislatureSort === "desc"
                ? "desc"
                : legislatureSort === "asc"
                  ? "asc"
                  : "false"
            }
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
