const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const inputEl = document.getElementById('word__input');
const formEl = document.getElementById('form');
const containerWordEl = document.getElementById('results__word');
const soundBtnEl = document.getElementById('results__sound');
const resultsWrapperEl = document.getElementById('results');
const resultsListEl = document.getElementById('results__list');
const errorContainerEl = document.getElementById('error');

let state = {
    word: '',
    meanings: [],
    phonetics: [],
}

const handleKeyup = e => {
    const value = e.target.value;
    state.word = value;
}

const handleSubmit = async e => {
    e.preventDefault();

    errorContainerEl.style.display = 'none';

    if(!state.word.trim()) return;

    try {
        const response = await fetch(`${url}${state.word}`);
        const data = await response.json();

        if(response.ok && data.length) {
            const item = data[0];
            state = {
                ...state,
                meanings: item.meanings,
                phonetics: item.phonetics,
            }
            insertWord();
            showResults();
        } else {
            showError(data);
        }

    } catch (error) {
        console.log(error);
    }

}

const insertWord = () => {
    containerWordEl.innerText = state.word;
}

const handleSound = () => {
    if(state.phonetics.length) {
        const sound = state.phonetics[0];
        if(sound.audio) {
            new Audio(sound.audio).play();
        }
    }
}

const renderItem = (item) => {
    return `
    <div class="results__item">
        <div class="results__item-part">${item.partOfSpeech}</div>
        <div class="results__item-definitions">
            ${getDefinitions(item.definitions)}
        </div>
    </div>
    `;
}

const getDefinitions = definitions => definitions.map(renderDefinition).join('');

const renderDefinition = itemDefinition => {
    const example = itemDefinition.example 
        ? `<div class="results__item-example">
                <p>Example: <span>${itemDefinition.example}</span></p>
            </div>`
        : ''

    return `
    <div class="results__item-definitions">
        <div class="results__item-definition">
            <p>${itemDefinition.definition}</p>
            ${example}
        </div>
    </div>
    `;
}

const showResults = () => {
    inputEl.value = '';

    resultsWrapperEl.style.display = 'block';
    resultsListEl.innerHTML = '';

    state.meanings.forEach((item) => resultsListEl.innerHTML += renderItem(item));
}

const showError = error => {
    errorContainerEl.style.display = 'block';
    resultsWrapperEl.style.display = 'none';
    errorContainerEl.innerHTML = error.message;
}

inputEl.addEventListener('keyup', handleKeyup);
formEl.addEventListener('submit', handleSubmit);
soundBtnEl.addEventListener('click', handleSound);