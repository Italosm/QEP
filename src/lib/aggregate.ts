import { Politician } from "@/types";
import { normalizeString } from "./normalize";

type House = "Deputados" | "Senado";

interface LegislaturesData {
  house: House;
  legislature: number;
  data: any[];
}

export function aggregateData(
  legislaturesData: LegislaturesData[]
): Omit<
  Politician,
  "quantidadeLegislaturas" | "primeiraLegislatura" | "ultimaLegislatura"
>[] {
  const politiciansMap = new Map<
    string,
    Omit<
      Politician,
      "quantidadeLegislaturas" | "primeiraLegislatura" | "ultimaLegislatura"
    >
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
        originalId = String(rawPolitician.id);
        id = `deputado-${originalId}`;
        nome = rawPolitician.nome;
        nomeCivil = rawPolitician.nomeCivil;
        ufs = rawPolitician.siglaUf ? [rawPolitician.siglaUf] : [];
        urlFoto = rawPolitician.urlFoto;
      } else {
        originalId = rawPolitician.IdentificacaoParlamentar.CodigoParlamentar;
        id = `senador-${originalId}`;
        nome = rawPolitician.IdentificacaoParlamentar.NomeParlamentar;
        nomeCivil =
          rawPolitician.IdentificacaoParlamentar.NomeCompletoParlamentar;
        const mandatos = Array.isArray(rawPolitician.Mandatos.Mandato)
          ? rawPolitician.Mandatos.Mandato
          : [rawPolitician.Mandatos.Mandato];
        ufs = mandatos.map((m: any) => m.UfParlamentar);
        urlFoto = rawPolitician.IdentificacaoParlamentar.UrlFotoParlamentar;
      }

      if (!nome) {
        continue;
      }

      if (politiciansMap.has(id)) {
        const existingPolitician = politiciansMap.get(id)!;
        if (!existingPolitician.legislaturas.includes(legislature)) {
          existingPolitician.legislaturas.push(legislature);
        }
        for (const uf of ufs) {
          if (uf && !existingPolitician.ufs.includes(uf)) {
            existingPolitician.ufs.push(uf);
          }
        }
        existingPolitician.urlFoto = urlFoto; // Update photo URL
      } else {
        politiciansMap.set(id, {
          id,
          nome,
          nomeCivil,
          urlFoto,
          casa: house,
          legislaturas: [legislature],
          ufs: ufs.filter(Boolean),
        });
      }
    }
  }

  return Array.from(politiciansMap.values());
}
