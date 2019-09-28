const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/?page=24';


const getData = async api => {
  const response = await fetch(api);
  return await response.json();
}

const loadData = async () => {
  try {
    let apiRequest = sessionStorage.getItem("next_fetch");
    if (!apiRequest) {
      sessionStorage.setItem("next_fetch", API);
      apiRequest = sessionStorage.getItem("next_fetch");
    }
    const responseData = await getData(apiRequest);
    const characters = responseData.results;
    const nexRequest = responseData.info.next;
    sessionStorage.setItem("next_fetch", nexRequest);
    let output = characters.map(character => {
      return `
    <article class="Card">
      <img src="${character.image}" />
      <h2>${character.name}<span>${character.species}</span></h2>
    </article>
  `
    }).join('');
    let newItem = document.createElement('section');
    newItem.classList.add('Items');
    newItem.innerHTML = output;
    $app.appendChild(newItem);

    if (!nexRequest) {
      debugger
      const itemMessage = document.createElement("h3");
      itemMessage.innerText = `Ya no hay personajes...`
      $app.appendChild(itemMessage);
      intersectionObserver.disconnect();
    }

  }
  catch (error) {
    console.log(error);
  }

}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);