// Interface representing a politician record as stored in the SQLite database via Prisma.
export interface Politician {
  id_unico: string; // primary key
  id_original?: number; // Made optional as aggregateData doesn't provide it initially
  nome: string;
  nomeCivil?: string; // Added nomeCivil
  casa: string;
  cargo?: string; // Made optional as aggregateData doesn't provide it initially
  url_foto: string;
  total_legislaturas?: number; // Made optional as aggregateData calculates it later
  tempo_anos?: number; // Made optional as aggregateData calculates it later
  tempo_meses?: number; // Made optional as aggregateData calculates it later
  tempo_dias?: number; // Made optional as aggregateData calculates it later
  // Pode ser string (CSV) ou array de strings; usamos array internamente
  ufs: string[]; // Changed to always be an array
  partidos?: string[]; // Changed to string[] as it's processed as an array, and made optional
  historico_legislaturas?: string; // Made optional as aggregateData doesn't provide it initially
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
