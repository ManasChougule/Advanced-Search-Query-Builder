import './App.css';
import {useEffect, useState, useRef} from 'react';
function App() {
  const [searchText, setSearchText] = useState("");
  const [advancedSearchMode, setAdvancedSearchMode] = useState(false); // replaces showAdvancedDiv and buttonLabel
  const [suggestions, setSuggestions] = useState([]);
  const [showAdvSuggestions, setShowAdvSuggestions] = useState(false);
  const [tabOnSuggestion, setTabOnSuggestion] = useState(false); 
  return (
    <div className="App">

    </div>
  );
}

export default App;
