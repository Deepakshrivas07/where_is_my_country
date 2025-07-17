import React, { useEffect, useState } from 'react'
// import countriesData from '../countriesData'
import CountryCard from './CountryCard'
import CountriesListShimmer from './CountriesListShimmer'
import countriesData from '../countriesData';

export default function CountriesList({ query }) {

  if (!countriesData.length) {
    return <CountriesListShimmer />
  }

  return (
    <>
      <div className="countries-container">
        {countriesData
          .filter((country) =>
            country.name.toLowerCase().includes(query) || country.region?.toLowerCase().includes(query)
          )
          .map((country) => {
            return (
              <CountryCard
                key={country.name}
                name={country.name}
                flag={country.flags.svg}
                population={country.population}
                region={country.region}
                capital={country.capital}
                data={country}
              />
            )
          })}
      </div>
    </>
  )
}
