import { createClient } from "./prismic.ts";
import type { HomapageDocument } from "../types/prismic.ts";
import type { HomepageData } from "../types/homepage.ts";

export async function getHomepage(): Promise<HomepageData> {
  const client = createClient();
  const doc = await client.getSingle<HomapageDocument>("homapage");
  const data = doc.data;

  return {
    hero: {
      title: data.title ?? "",
      text: data.text,
      backgroundImage: data.background_image,
    },
    tesuena: {
      title: data.tesuena_title ?? "",
      cards: data.cards.map((card) => ({
        titleLine1: card.title_line_1 ?? "",
        titleLine2: card.title_line_2 ?? "",
        text: card.texto,
      })),
      endPhrase1: data.end_phrase_1,
      endPhrase2: data.end_phrase_2,
    },
    hacemos: {
      label: data.hacemos_label ?? "",
      title: data.hacemos_title ?? "",
      subtitle: data.hacemos_subtitle ?? "",
      items: data.hacemos_items.map((item) => ({
        titulo: item.titulo ?? "",
        description: item.description,
      })),
      endText: data["hacemos_end-text"],
    },
    servicios: {
      label: data.services_label ?? "",
      title: data.services_title ?? "",
      lines: data.lines_items.map((line) => ({
        title: line.line_title ?? "",
        description: line.service_description ?? "",
        text: line.service_text,
      })),
    },
  };
}
