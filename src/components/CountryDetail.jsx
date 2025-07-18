import React, { useEffect, useState } from "react";
import "./CountryDetail.css";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import CountryDetailShimmer from "./CountryDetailShimmer";
import countriesData from "../countriesData";

export default function CountryDetail() {
  const [isDark] = useTheme();
  const { state } = useLocation();
  const params = useParams();
  const countryName = params.country;
  const [countryData, setCountryData] = useState(null);

  // Helper to extract and structure the country data
  function updateCountryData(data) {
    const country = {
      name: data.name.common || data.name,
      nativeName:
        Object.values(data.name.nativeName || {})[0]?.common ||
        data.name.common,
      population: data.population,
      region: data.region,
      subregion: data.subregion,
      capital: data.capital,
      flag: data.flags?.svg,
      area: data.area,
      languages: data.languages,
      currencies: Object.values(data.currencies || {})
        .map((currency) => currency.name)
        .join(", "),
      borders: data.borders || [],
    };

    setCountryData(country);
  }

  useEffect(() => {
    let country = null;

    if (state) {
      // If coming from card with state
      country = state;
    } else {
      // If accessed directly, match by name from the param
      country = countriesData.find(
        (c) => c.name.common.toLowerCase() === countryName.toLowerCase()
      );
    }

    if (country) {
      updateCountryData(country);
    } else {
      console.warn("Country not found in local data:", countryName);
    }
  }, [countryName, state]);

  return (
    <main className={`${isDark ? "dark" : ""}`}>
      <div className="country-details-container">
        <span className="back-button" onClick={() => history.back()}>
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </span>

        {countryData === null ? (
          <CountryDetailShimmer />
        ) : (
          <div className="country-details">
            <img src={countryData.flag} alt={`${countryData.name} flag`} />
            <div className="details-text-container">
              <h1>{countryData.name}</h1>
              <div className="details-text">
                <p>
                  <b>Native Name:</b> {countryData.name}
                </p>
                <p>
                  <b>Population:</b>{" "}
                  {countryData.population.toLocaleString("en")}
                </p>
                <p>
                  <b>Region:</b> {countryData.region}
                </p>
                <p>
                  <b>Sub Region:</b> {countryData.subregion}
                </p>
                <p>
                  <b>Capital:</b>{" "}
                  {Array.isArray(countryData.capital)
                    ? countryData.capital.join(", ")
                    : countryData.capital || "N/A"}
                </p>

                <p>
                  <b>Area Covers:</b> {countryData.area.toLocaleString("en")}
                </p>
                <p>
                  <b>Currencies:</b> {countryData.currencies}
                </p>
                <p>
                  <b>Languages:</b>{" "}
                  {Array.isArray(countryData.languages)
                    ? countryData.languages.map((lang) => lang.name).join(", ")
                    : "N/A"}
                </p>
              </div>

              {countryData.borders?.length > 0 && (
                <div className="border-countries">
                  <b>Border Countries:</b>&nbsp;
                  {countryData.borders.map((borderCode) => {
                    const borderCountry = countriesData.find(
                      (c) => c.cca3 === borderCode
                    );
                    return borderCountry ? (
                      <Link
                        key={borderCode}
                        to={`/${encodeURIComponent(borderCountry.name.common)}`}
                        state={borderCountry}
                      >
                        {borderCountry.name.common}
                      </Link>
                    ) : (
                      <span key={borderCode}>{borderCode}</span> // fallback if not found
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
