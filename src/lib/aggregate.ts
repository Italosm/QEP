import { Politician } from "@/types";

type House = "Deputados" | "Senado";

interface LegislaturesData {
  house: House;
  legislature: number;
  data: any[];
}

export function aggregateData(
  legislaturesData: LegislaturesData[],
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
        const legislaturas = existingPolitician.legislaturas ?? [];
        if (!legislaturas.includes(legislature)) {
          existingPolitician.legislaturas = [...legislaturas, legislature];
        }
        const existingUfs = existingPolitician.ufs as string[]; // Assert to string[] as it's always stored as an array
        for (const uf of ufs) {
          if (uf && !existingUfs.includes(uf)) {
            existingUfs.push(uf);
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
        });
      }
    }
  }

  return Array.from(politiciansMap.values());
}
