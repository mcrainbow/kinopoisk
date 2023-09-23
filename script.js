"use strict";

const moviesContainer = document.querySelector(".content__films-list");
const genresContainer = document.querySelector(".content__list");
let moviesData = null; //  Переменная для записи данных о топ-100 фильмах
const genresBtns = document.querySelectorAll(".content__link");
let activeGenre = "";
const inputField = document.querySelector(".content__input");

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const createGenreElement = (genre) => {
  const genreHTML = `
    <li class="content__item">
      <p class="content__link">${genre[0].toUpperCase() + genre.slice(1)}</p>
    </li>
  `;
  genresContainer.insertAdjacentHTML("beforeend", genreHTML);
};

const createMovieElement = (movieData) => {
  const genres = Object.values(movieData.genres)
    .map((elem) => Object.values(elem))
    .flat()
    .map((elem) => elem[0].toUpperCase() + elem.slice(1))
    .join(", ");
  const countries = Object.values(movieData.countries)
    .map((elem) => Object.values(elem))
    .flat()
    .join(" | ");

  const movieHTML = `
      <div class="content__film">
        <img
          src="${movieData.poster.url}"
          alt=""
          class="content__film-image"
        />
        <h3 class="content__film-title">
          ${movieData.name}
        </h3>
        <span class="content__film-info"
          >${
            movieData.enNAme || movieData.alternativeName || movieData.name
          } | ${movieData.year}</span
        >
        <span class="content__film-genre">
          ${genres}
        </span>
        <span class="content__film-actors"
          >${countries}</span
        >
    </div>
  `;
  moviesContainer.insertAdjacentHTML("beforeend", movieHTML);
};

const displayMovies = async function (moviesData, genre = "") {
  try {
    await moviesData.map((film) => createMovieElement(film));
    console.log(moviesData);
  } catch (e) {
    console.log(`Error - ${e}`);
  }
};

const getMovies = async function () {
  try {
    const response = await fetch(
      "https://api.kinopoisk.dev/v1.3/movie?limit=100",
      {
        headers: { "X-API-KEY": "S1HG59D-RVT4A2Z-PDZRARW-QZ48P5V" },
      }
    );

    if (!response) throw new Error("Проблемв с получением данных о фильмах");
    const data = await response.json();
    return data.docs;
  } catch (e) {
    console.log(`${e}!!!`);
    console.log(`Что-то пошло не так: ${e}`);
  }
};

const gettingAllGenres = function (moviesData) {
  let allGeners = []; // Массив для жанров
  moviesData.map((elem) => allGeners.push(...Object.values(...elem.genres))); // Итерирую все фильмы и получаю их жанры
  allGeners = new Set(allGeners); // Удаляю дублирующиеся жанры
  allGeners.forEach((genre) => createGenreElement(genre)); // Отрисовываю все жанры на странице
};

const removeActiveClass = function (list) {
  list.forEach((elem) => elem.classList.remove("active"));
};
const clearMovieContainer = () => {
  moviesContainer.innerHTML = "";
};

// Function for DRY code
const resetMovieContainer = (movieData) => {
  clearMovieContainer();
  displayMovies(movieData);
};

const programStart = async function () {
  try {
    moviesData = await getMovies(); // получаню данные из асинхронной функции и заисываю в переменную
    gettingAllGenres(moviesData);
    displayMovies(moviesData); // Отрисовываю все фильмы на странице
    document
      .querySelector(".content__filters")
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("content__link")) {
          removeActiveClass(document.querySelectorAll(".content__link"));
          e.target.classList.add("active");
          activeGenre = e.target.textContent;
          let filteredMoviesData = [];
          moviesData.map((movie) => {
            movie.genres.find((genre) => {
              if (genre.name === activeGenre.toLowerCase())
                filteredMoviesData.push(movie);
            });
          });

          resetMovieContainer(filteredMoviesData);
        }
      });
    inputField.addEventListener("keyup", () => {
      removeActiveClass(document.querySelectorAll(".content__link"));
      const filteredData = moviesData.filter((movie) => {
        return (
          movie.name.toLowerCase().indexOf(inputField.value.toLowerCase()) !==
          -1
        );
      });

      resetMovieContainer(filteredData);
    });
  } catch (e) {
    console.error(`${e}!!!`);
  }
};

//Запуск скрипта
programStart();
