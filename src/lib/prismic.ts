import * as prismic from "@prismicio/client";

export const repositoryName = "umbral";

export const createClient = () => {
  return prismic.createClient(repositoryName, {
    accessToken: import.meta.env.PRISMIC_ACCESS_TOKEN,
  });
};
