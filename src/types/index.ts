// Interface representing a politician record as stored in the SQLite database via Prisma.
export interface Politician {
  id_unico: string; // primary key
  id_original: number;
  nome: string;
  casa: string;
  cargo: string;
  url_foto: string;
  total_legislaturas: number;
  tempo_anos: number;
  tempo_meses: number;
  tempo_dias: number;
  // Pode ser string (CSV) ou array de strings; usamos array internamente
  ufs: string[]; // Changed to always be an array
  partidos: string;
  historico_legislaturas: string;
  // Legacy fields used elsewhere in the UI – keep them for compatibility
  legislaturas?: number[]; // may be empty when sourced from DB
  quantidadeLegislaturas?: number; // alias of total_legislaturas
  // Human readable tenure string (e.g., "1 - 58")
  // Human readable tenure string (e.g., "1 - 58")
  tenureString?: string;
  // New field used by the table for display
  tenure?: string;
}

export interface RawPolitician {
  nome: string;
  nomeCivil?: string;
  siglaUf: string;
}

export interface Legislature {
  NumeroLegislatura?: string;
  id?: string;
  idLegislatura?: number;
  DataInicio: string;
  DataFim: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface Legislatures {
  senado: Legislature[];
  camara: Legislature[];
}
