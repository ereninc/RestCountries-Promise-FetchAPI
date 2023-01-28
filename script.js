'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const input = document.querySelector('.input-country');
const searchBtn = document.querySelector('.btn-search');

///////////////////////////////////////

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src=${data.flag} />
    <div class="country__data">
    <h3 class="country__name">${data.name}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data.population / 1000000
    ).toFixed(1)}M people</p>
    <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const getJson = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  });
};

//PROMISES AND FETCH API
const getCountryData = function (country) {
  getJson(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      return getJson(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        "Country's neightbour not found"
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong:\n ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
      console.log('Finished getting country data, fulfilled or rejected');
    });
};
// getCountryData('usa');

searchBtn.addEventListener('click', function () {
  countriesContainer.innerHTML = '';
  const country = input.value;
  if (!country) return;
  getCountryData(country);
  input.value = '';
  input.focus();
});
