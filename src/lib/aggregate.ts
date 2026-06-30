import { Politician } from "@/types";

type House = "Deputados" | "Senado";

// Define interfaces for the raw politician data structure
interface RawDeputado {
  id: string;
  nome: string;
  nomeCivil?: string;
  siglaUf?: string;
  urlFoto: string;
}

interface MandatoItem {
  // New interface for mandate items
  UfParlamentar: string;
}

interface RawSenador {
  IdentificacaoParlamentar: {
    CodigoParlamentar: string;
    NomeParlamentar: string;
    NomeCompletoParlamentar?: string;
    UrlFotoParlamentar: string;
  };
  Mandatos: {
    Mandato: MandatoItem[] | MandatoItem; // Use MandatoItem
  };
}

type RawPolitician = RawDeputado | RawSenador;

interface LegislaturesData {
  house: House;
  legislature: number;
  data: RawPolitician[]; // Changed from any[] to a more specific type
}

export function aggregateData(
  legislaturesData: LegislaturesData[],
): Politician[] {
  // Now returns full Politician objects
  const politiciansMap = new Map<
    string,
    Politician // Now stores full Politician objects
  >();

  for (const { house, legislature, data } of legislaturesData) {
    for (const rawPolitician of data) {
      if (!rawPolitician) {
        continue;
      }

      let originalId: string;
      let nome: string,
        nomeCivil: string | undefined,
        ufs: string[],
        urlFoto: string;
      let id: string;

      if (house === "Deputados") {
        const deputado = rawPolitician as RawDeputado;
        originalId = String(deputado.id);
        id = `deputado-${originalId}`;
        nome = deputado.nome;
        nomeCivil = deputado.nomeCivil;
        ufs = deputado.siglaUf ? [deputado.siglaUf] : [];
        urlFoto = deputado.urlFoto;
      } else {
        const senador = rawPolitician as RawSenador;
        originalId = senador.IdentificacaoParlamentar.CodigoParlamentar;
        id = `senador-${originalId}`;
        nome = senador.IdentificacaoParlamentar.NomeParlamentar;
        nomeCivil = senador.IdentificacaoParlamentar.NomeCompletoParlamentar;
        const mandatos = Array.isArray(senador.Mandatos.Mandato)
          ? senador.Mandatos.Mandato
          : [senador.Mandatos.Mandato];
        ufs = mandatos.map((m) => m.UfParlamentar); // No more 'any'
        urlFoto = senador.IdentificacaoParlamentar.UrlFotoParlamentar;
      }

      if (!nome) {
        continue;
      }

      if (politiciansMap.has(id)) {
        const existingPolitician = politiciansMap.get(id)!;
        const legislaturas = existingPolitician.legislaturas ?? [];
        if (!legislaturas.includes(legislature)) {
          existingPolitician.legislaturas = [...legislaturas, legislature];
        }
        for (const uf of ufs) {
          // existingPolitician.ufs is already string[] after the type definition change
          if (uf && !existingPolitician.ufs.includes(uf)) {
            existingPolitician.ufs.push(uf);
          }
        }
        existingPolitician.url_foto = urlFoto; // Update photo URL
      } else {
        politiciansMap.set(id, {
          id_unico: id,
          nome,
          nomeCivil,
          url_foto: urlFoto,
          casa: house,
          legislaturas: [legislature],
          ufs: ufs.filter(Boolean),
          // Other optional properties are implicitly undefined, which is allowed by the updated Politician interface.
        });
      }
    }
  }

  return Array.from(politiciansMap.values());
}
