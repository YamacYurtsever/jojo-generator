import { useState, useEffect } from 'react'
import './App.css'
import diceImage from './assets/dice.png';

function App() {
  const [chapters, setChapters] = useState([]);
  const [nations, setNations] = useState([]);
  const [chapterQuery, setChapterQuery] = useState("Chapter");
  const [nationQuery, setNationQuery] = useState("Nation");
  const [livingQuery, setLivingQuery] = useState(true);
  const [characters, setCharacters] = useState([]);

  // Determine all possible chapters and nations in the data
  useEffect(() => {
    fetch("https://stand-by-me.herokuapp.com/api/v1/characters")
      .then(response => response.json())
      .then(data => {
        const chaptersSet = new Set();
        const nationsSet = new Set();

        data.forEach((character) => {
          character.chapter.split(',').forEach(chapter => chaptersSet.add(chapter.trim()));
          nationsSet.add(character.nationality);
        });

        setChapters(Array.from(chaptersSet));
        setNations(Array.from(nationsSet));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Change queries
  function changeChapter() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * chapters.length);
    } while (chapters[randomIndex] == chapterQuery);
    setChapterQuery(chapters[randomIndex]);
  }

  function changeNation() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * nations.length);
    } while (nations[randomIndex] == nationQuery);
    setNationQuery(nations[randomIndex]);
  }
  
  function changeLiving() {
    setLivingQuery(!livingQuery);
  }

  function generateRandomQueries() {
    changeChapter();
    changeNation();
    changeLiving();
  }

  // Fetch the characters that meet the queries
  function getCharacters() {
    fetch(`https://stand-by-me.herokuapp.com/api/v1/characters/query/query?
      chapter=${chapterQuery}&nationality=${nationQuery}&living=${livingQuery}`)
      .then(response => response.json())
      .then(data => {
        setCharacters(data);
      })
  }
  
  return (
    <div id="container">
      <h1>Jojo Generator</h1>
      <QueryContainer
        generateRandomQueries={generateRandomQueries}
        chapterQuery={chapterQuery}
        nationQuery={nationQuery}
        livingQuery={livingQuery}
        changeChapter={changeChapter}
        changeNation={changeNation}
        changeLiving={changeLiving}
      />
      <CardContainer characters={characters}/>
      <button onClick={getCharacters}>Generate</button>
    </div>
  )
}

const QueryContainer = (props) => {
  return (
    <div id="queries-container">
      <img src={diceImage} id="dice" onClick={props.generateRandomQueries}/>
      <div id="queries">
        <Query query={props.chapterQuery} onClick={props.changeChapter}/>
        <Query query={props.nationQuery} onClick={props.changeNation}/>
        <Query query={props.livingQuery == true ? "Living" : "Not Living"} onClick={props.changeLiving}/>
      </div>
    </div>
  )
}

const Query = (props) => {
  return (
    <div className="query" onClick={props.onClick}>{props.query}</div>
  )
}

const CardContainer = (props) => {
  // Chose 3 random characters
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const shuffledCharacters = shuffleArray(props.characters);
  const charactersToShow = shuffledCharacters.slice(0, 3);

  // Diplay the characters
  if (charactersToShow.length == 0) {
    return (
      <div id="card-container">
        <h2>No Characters Found With Those Queries!</h2>
      </div>
    )
  } else {
    return (
      <div id="card-container">
        {charactersToShow.map(character => (
          <Card key={character.id} character={character} />
        ))}
      </div>
    )
  }
}

const Card = ({ character }) => {
  const cardStyle = {
    background: `url(https://jojos-bizarre-api.netlify.app/assets/${character.image}) 
                 no-repeat fixed center, rgb(96, 45, 96) `,
    backgroundSize: 'contain',
  };

  return (
    <div className="card" style={cardStyle}>
      <h2>{character.name}</h2>
    </div>
  );
};


export default App