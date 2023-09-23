"use strict";

const moviesContainer = document.querySelector(".content__films-list");
const genresContainer = document.querySelector(".content__list");
let moviesData = null; //  Переменная для записи данных о топ-100 фильмах
const genresBtns = document.querySelectorAll(".content__link");
let activeGenre = "";

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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

const writingDataToVaribale = async function () {
  try {
    moviesData = await getMovies(); // получаню данные из асинхронной функции и заисываю в переменную
    gettingAllGenres(moviesData);
    displayMovies(moviesData); // Отрисовываю все фильмы на странице
  } catch (e) {
    console.log(`${e}(((`);
  }
};

const programStart = async function () {
  try {
    await writingDataToVaribale();
    document
      .querySelector(".content__filters")
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("content__link")) {
          removeActiveClass(document.querySelectorAll(".content__link"));
          e.target.classList.add("active");
          activeGenre = e.target.textContent;
          Object.values(moviesData[0].genres).map((elem) =>
            console.log(...Object.values(elem))
          );
          let sortedByGenreData = moviesData[0].genres.filter(
            (elem) => elem.name.toLowerCase() === activeGenre.toLowerCase()
          );
          console.log(sortedByGenreData);
        }
      });
  } catch (e) {
    console.error(`${e}!!!`);
  }
};

//Запуск скрипта
// programStart();

// ! TEST
// итерировать все элементы массива и проверить есть ли у объекта в свойстве жанры объект со значением выделенного жанра

const arr = [
  { genres: [{ name: "c" }, { name: "d" }, { name: "h" }] },
  { genres: [{ name: "h" }, { name: "d" }] },
  { genres: [{ name: "d" }, { name: "c" }, { name: "h" }] },
  { genres: [{ name: "h" }, { name: "c" }] },
];

const newArr = [];

console.log(newArr);
