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
        <ArrowDown className="h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowUpDown className="h-4 w-4 text-slate-300" />
      )}
    </div>
  </Button>
);

export const columns: ColumnDef<Politician>[] = [
  {
    accessorKey: "url_foto",
    header: "",
    enableSorting: false,
    cell: ({ row }) => {
      const src = row.original.url_foto || "/avatar-padrao.png";
      return (
        <PoliticianImage
          className="rounded-full"
          src={src}
          alt={`Foto de ${row.original.nome}`}
          width={40}
          height={40}
        />
      );
    },
  },
  {
    accessorKey: "nome",
    header: ({ column }) => <SortingHeader column={column}>Nome</SortingHeader>,
    cell: ({ row }) => {
      // Debug: log id_unico
      console.log("row.id_unico:", row.original.id_unico);
      return (
        <Link
          href={`/politico/${row.original.id_unico}`}
          className="font-medium text-slate-800 hover:underline"
        >
          {row.original.nome}
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
        ? "bg-emerald-100 text-emerald-800"
        : "bg-sky-100 text-sky-800";

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
      const ufs = Array.isArray(row.original.ufs)
        ? row.original.ufs
        : typeof row.original.ufs === "string"
          ? row.original.ufs
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
    // Typed row to avoid any lint errors
    cell: ({ row }: { row: Row<Politician> }) => row.original.tenure,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original;
      const b = rowB.original;
      // Compare by years, then months, then days for accurate sorting
      if (a.tempo_anos !== b.tempo_anos) {
        return a.tempo_anos - b.tempo_anos;
      }
      if (a.tempo_meses !== b.tempo_meses) {
        return a.tempo_meses - b.tempo_meses;
      }
      return a.tempo_dias - b.tempo_dias;
    },
  },
  // Column for filtering by legislatura (now visible)
  {
    accessorKey: "legislaturas",
    // keep visible so filter UI can access it
    enableHiding: false,
    filterFn: (row, id, value) => {
      const legislaturas: number[] = row.getValue(id);
      return legislaturas.includes(Number(value));
    },
  },
];
