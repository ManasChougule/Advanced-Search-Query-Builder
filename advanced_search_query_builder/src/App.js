import './App.css';
import {useEffect, useState, useRef} from 'react';
import ListBox from './ListBox';

function App() {
  const [searchingText, setSearchingText] = useState("");
  const [advancedSearchMode, setAdvancedSearchMode] = useState(true); // replaces showAdvancedDiv and buttonLabel
  const [suggestions, setSuggestions] = useState([
    "Saving Private Ryan (1998)",
    "Dunkirk (2017)",
    "1917 (2019)",
    "Black Hawk Down (2001)",
    "Apocalypse Now (1979)",
    "Platoon (1986)",
    "The Thin Red Line (1998)",
    "Full Metal Jacket (1987)",
    "Hacksaw Ridge (2016)",
    "Fury (2014)",
    "The Pianist (2002)",
    "Inglourious Basterds (2009)",
    "Schindler's List (1993)",
    "Letters from Iwo Jima (2006)",
    "The Hurt Locker (2008)",
    "Enemy at the Gates (2001)",
    "We Were Soldiers (2002)",
    "Jarhead (2005)",
    "A Bridge Too Far (1977)",
    "Flags of Our Fathers (2006)"
  ]);
  const [showAdvSuggestions, setShowAdvSuggestions] = useState(true);
  const [tabOnSuggestion, setTabOnSuggestion] = useState(false); 

  const [queryComplete,setQueryComplete] = useState(true);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [showFirstuggestions, setShowFirstSuggestions] = useState(true);

  const onInputTextChange = (e) => {
    setSearchingText(e.target.value);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
        setSelectedItemIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
        );
    } else if (event.key === 'ArrowUp') {
      setSelectedItemIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    }
  };

  return (
    <div className="App">
        {
        advancedSearchMode ? 
        <div className="appContainer">
          <div className="inputContainer">
            <div id="kqlerrormsg" title="KQL Error">
              {queryComplete ? <img className="icon kqlgood" src="https://alm-report.corp.knorr-bremse.com/s/xp7u7d/9120004/znomsy/1.0/_/images/icons/accept.png" alt="accept"/>:
              <img class="icon kqlerror" src='https://alm-report.corp.knorr-bremse.com/s/xp7u7d/9120004/znomsy/1.0/_/images/icons/error.png' alt='error'/>}
            </div>
            <input
              className="searchInput"
              placeholder="Type your query here..."
              onKeyDown={handleKeyDown} 
              onChange={onInputTextChange}
              // onClick={onInputBoxClick} 
              // onKeyUp={updateCursorPosition}
            />
            {(showAdvSuggestions && (showFirstuggestions || searchingText !== "")) ? (
              <ListBox className="listBox" data={suggestions} selectedItemIndex={selectedItemIndex} 
              selectedField={suggestions[selectedItemIndex]}  
              // onItemClick={handleTabOrClickOnSuggestion}
              ></ListBox>
            ):null}
    
          </div>
        </div>
        :
        <input className='searchInput'
        style={{width: "54vw", boxShadow: "1px 2px 5px black", outline: "none", height: "4vh", border: "none",
        borderRadius: "6px"}} value={searchingText} placeholder={"Search..."} 
        onKeyDown={handleKeyDown} 
        // onChange={onInputTextChange} 
        ></input>
        }

    </div>
  );
}

export default App;
