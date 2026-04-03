import worldCountries from "world-countries";

const getLanguage = () => {
  return localStorage.getItem("language") || "en";
};

export const getAllCountries = () => {
  const language = getLanguage();

  const regionNames = new Intl.DisplayNames([language], {
    type: "region",
  });

  return worldCountries
    .map((country) => {
      let label: string;

      try {
        label = regionNames.of(country.cca2) || country.name.common;
      } catch {
        label = country.name.common;
      }

      return {
        value: country.cca3,
        label,
        cca2: country.cca2.toLowerCase(),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, language));
};

export const getCountryMap = (language: string) => {
  const regionNames = new Intl.DisplayNames([language], {
    type: "region",
  });

  return new Map(
    worldCountries.map((country) => {
      let label: string;

      try {
        label = regionNames.of(country.cca2) || country.name.common;
      } catch {
        label = country.name.common;
      }

      return [country.cca3, label];
    }),
  );
};
