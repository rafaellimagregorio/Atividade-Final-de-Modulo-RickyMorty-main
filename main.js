const api = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});
const listCharacters = document.getElementById("list");
let nextUrl = null;
let prevUrl = null;
let page = 1;
let pages = 1;
const cardsPerPage = 6;
let response;
let statusColor = "";
let statusColorClass = "";
let statusText = "";

function getCharacters(url, name = "") {
  api
    .get(url)
    .then((response) => {
      const data = response.data;
      nextUrl = data.info.next;
      prevUrl = data.info.prev;
      const characters = data.results;

      if (name !== "") {
        response = `${url}?name=${name}`;
      } else {
        response = url;
      }

      render(characters);
    })
    .catch((err) => {
      alert(err);
    });
}

function searchCharacters(event) {
  event.preventDefault();
  const name = document.getElementById("search-bar").value;
  const url = name !== "" ? `/character/?name=${name}` : "/character";
  getCharacters(url);
}

function render(characters) {
  const paginatedCharacters = paginateCharacters(
    characters,
    page,
    cardsPerPage
  );

  listCharacters.innerHTML = "";
  let cardsCounter = 0;

  paginatedCharacters.forEach((character) => {
    if (character.status === "Alive") {
      statusColorClass = "green-status";
    } else if (character.status === "Dead") {
      statusColorClass = "red-status";
    } else {
      statusColorClass = "gray-status";
    }

    // ---------------------------
    const characterUrl = `https://rickandmortyapi.com/api/character/${character.id}`;
    api
      .get(characterUrl)
      .then((response) => {
        const character = response.data;

        // ---------------------------
        const episodeUrl = character.episode[character.episode.length - 1];
        api
          .get(episodeUrl)
          .then((response) => {
            const episode = response.data;
            listCharacters.innerHTML += `
              <div class="card mt-4">
                <div class="card border-success size-card">
                  <a onclick="characterDetails('${character.id}')" data-bs-toggle="modal" data-bs-target="#characterInformation">
                    <img class="img-fluid rounded mx-auto d-block" id="size-img"
                      src="${character.image}" alt="${character.name}" />
                  </a>
                  <div class="card-body ms-3">
                    <h4>
                      <small class="card-title text-bg-dark">${character.name}</small>
                    </h4>
                    <div class="status">
                      <li class="statusColor ${statusColorClass}"></li>
                      <small>
                        <strong class="text-bg-dark">
                          ${statusText} ${character.species}
                        </strong>
                      </small>
                    </div>
                    <small style="color: white;">Última localização conhecida</small>
                    <small>
                      <strong class="text-bg-dark">${character.location.name}</strong>
                    </small>
                    <small style="color: white;">Visto a última vez em</small>
                    <small>
                      <strong class="text-bg-dark">${episode.name}</strong>
                    </small>
                  </div>
                </div>
              </div>`;
            cardsCounter++;
          })
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => {
        alert(err);
      });
  });
}


function paginateCharacters(characters, currentPage, cardsPerPage) {
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const paginatedCharacters = characters.slice(startIndex, endIndex);
  return paginatedCharacters;
}

function changePage(url) {
  if (url != null) {
    getCharacters(url);
  }
}

const buttonPrevPage = document.getElementById("prev");
buttonPrevPage.addEventListener("click", () => {
  changePage(prevUrl);
  console.log("clicou!");
});

const buttonNextPage = document.getElementById("next");
buttonNextPage.addEventListener("click", () => {
  changePage(nextUrl);
  console.log("deu certo");
});

getCharacters("/character");


function characterDetails(characterId) {
  const characterUrl = `https://rickandmortyapi.com/api/character/${characterId}`;

  //  -----------------------------

  api
    .get(characterUrl)
    .then((response) => {
      const character = response.data;
      const modalBody = document.getElementById("modal-body");
      const episodeUrl = character.episode[character.episode.length - 1];
      api
        .get(episodeUrl)
        .then((response) => {
          const episode = response.data;
          modalBody.innerHTML = `
            <img src="${character.image}" />
            <h3>${character.name}</h3>
            <p>Gênero: ${character.gender}</p>
            <p>Espécie: ${character.species}</p>
            <p>Status: ${character.status}</p>
            <p>Localização: ${character.location.name}</p>
            <p>Visto a última vez em: ${episode.name}</p>
          `;

          // Abre o modal
          const modal = new bootstrap.Modal(
            document.getElementById("characterInformation")
          );
          modal.show();
        })
        .catch((err) => {
          alert(err);
        });
    })
    .catch((err) => {
      alert(err);
    });
}
