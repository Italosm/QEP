"use client";

import { Politician } from "@/types";
import { ColumnDef, Column, Row } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { PoliticianImage } from "@/components/politician-image";
import { Button } from "@/components/ui/button";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 mr-1">
    {children}
  </span>
);

const SortingHeader = ({
  column,
  children,
}: {
  column: Column<Politician, unknown>;
  children: React.ReactNode;
}) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="-ml-4 h-8"
  >
    {children}
    <div className="ml-2">
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="h-4 w-4 text-gray-700" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="h-4 w-4 text-gray-700" />
      ) : (
        <ArrowUpDown className="h-4 w-4 text-gray-500" />
      )}
    </div>
  </Button>
);

export const columns: ColumnDef<Politician>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => <SortingHeader column={column}>Nome</SortingHeader>,
    cell: ({ row }) => {
      const src = row.original.url_foto || "/avatar-padrao.png";
      return (
        <Link
          href={`/politico/${row.original.id_unico}`}
          className="flex items-center gap-3 group"
        >
          <PoliticianImage
            className="rounded-full"
            src={src}
            alt={`Foto de ${row.original.nome}`}
            width={40}
            height={40}
          />
          <span className="font-medium text-slate-800 group-hover:underline">
            {row.original.nome}
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: "casa",
    header: ({ column }) => <SortingHeader column={column}>Casa</SortingHeader>,
    cell: ({ row }) => {
      const casa = row.original.casa;
      const isSenado = casa === "Senado";
      const badgeClass = isSenado
        ? "bg-sky-100 text-sky-800"
        : "bg-emerald-100 text-emerald-800";

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
        >
          {isSenado ? "Senado" : "Câmara"}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "ufs",
    header: ({ column }) => <SortingHeader column={column}>UFs</SortingHeader>,
    cell: ({ row }) => {
      const ufsData = row.original.ufs;

      const ufs = Array.isArray(ufsData)
        ? ufsData
        : typeof ufsData === "string"
          ? (ufsData as string) // <-- Forçamos o TypeScript a aceitar que é string
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

      return (
        <div className="flex flex-wrap max-w-xs">
          {ufs.map((uf) => (
            <Badge key={uf}>{uf}</Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const ufs = row.getValue(id);
      if (Array.isArray(ufs)) {
        return ufs.some((uf) => uf === value);
      }
      return ufs === value;
    },
  },
  {
    accessorKey: "total_legislaturas",
    header: ({ column }) => (
      <SortingHeader column={column}>Qtd. Legislaturas</SortingHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center w-full">
        {row.original.total_legislaturas}
      </div>
    ),
  },
  {
    accessorKey: "tenure",
    header: ({ column }) => (
      <SortingHeader column={column}>Tempo no Poder</SortingHeader>
    ),
    cell: ({ row }: { row: Row<Politician> }) => row.original.tenure,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original;
      const b = rowB.original;

      // Garantimos um valor numérico para a ordenação usando "?? 0"
      const aAnos = a.tempo_anos ?? 0;
      const bAnos = b.tempo_anos ?? 0;

      const aMeses = a.tempo_meses ?? 0;
      const bMeses = b.tempo_meses ?? 0;

      const aDias = a.tempo_dias ?? 0;
      const bDias = b.tempo_dias ?? 0;

      // Comparamos pelos valores garantidos
      if (aAnos !== bAnos) {
        return aAnos - bAnos;
      }
      if (aMeses !== bMeses) {
        return aMeses - bMeses;
      }
      return aDias - bDias;
    },
  },
  // Column for filtering by legislatura (now visible)
  {
    accessorKey: "legislaturas",
    header: ({ column }) => (
      <SortingHeader column={column}>Legislaturas</SortingHeader>
    ),
    cell: ({ row }) => {
      const legislaturas = row.original.legislaturas ?? [];
      return (
        <div className="flex flex-wrap max-w-xs">
          {legislaturas.map((leg) => (
            <Badge key={leg}>{leg}</Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const legislaturas: number[] = row.getValue(id) ?? [];
      return legislaturas.includes(Number(value));
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.legislaturas ?? [];
      const b = rowB.original.legislaturas ?? [];
      const latestA = Math.max(...a);
      const latestB = Math.max(...b);
      return latestA - latestB;
    },
  },
];
