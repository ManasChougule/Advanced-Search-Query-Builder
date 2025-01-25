import './App.css';
import {useEffect, useState, useRef} from 'react';
import ListBox from './ListBox';

function App() {
  const [searchingText, setSearchingText] = useState("");
  const [advancedSearchMode, setAdvancedSearchMode] = useState(true); // replaces showAdvancedDiv and buttonLabel
  const [suggestions, setSuggestions] = useState([]);
  const [allPossibleValues,setAllPossibleValues] = useState([]);
  const [allPossibleFields, setAllPossibleFields] = useState([]); 
  const [showAdvSuggestions, setShowAdvSuggestions] = useState(true);
  const [tabOnSuggestion, setTabOnSuggestion] = useState(false); 

  const [queryComplete,setQueryComplete] = useState(true);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [showFirstuggestions, setShowFirstSuggestions] = useState(true);
  const [Network, setNetwork] = useState(["STR"]);
  const [isField, setIsField] = useState(true);
  const [action,setAction] = useState("None");

  const abortControllerRef = useRef(null); // to abort previous ongoing api calls

  const onInputTextChange = (e) => {
    setSearchingText(e.target.value);
  }

  const handleButtonToggle = () => {
    if (advancedSearchMode){
      if(isField){
        fetchSuggestions().then();
      }
    }
};

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

  function checkTrueFalse(input) {
    const trueSubstrings = ["t", "tr", "tru", "true"];
    const falseSubstrings = ["f", "fa", "fal", "fals", "false"];
    const lowerInput = input.toLowerCase();
    if (trueSubstrings.includes(lowerInput)) {
        return "true";
    } else if (falseSubstrings.includes(lowerInput)) {
        return "false";
    } else {
        return null; 
    }
  }

  const fetchSuggestions = async (text, prefix_value="") => {
    text = text ? text.trim() : "";
      
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      let data;
      if(text !== "Order"){
        const response = await fetch(process.env.REACT_APP_SUGGESTION_API_URL + 'getsuggestions' , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "searchText": text, "is_field": isField,
              "network_locations": Network,"prefix_value":prefix_value }),
            signal
        });
        data = await response.json();
      }else{
        data = {"data":["Ascending", "Descending"]}
        data["data"] = data["data"].filter((suggestion)=>suggestion.toLowerCase().includes(prefix_value.toLowerCase()));
      }
        if (data["data"] !== 'no output') {
            if(text==="isConverted" && data["data"].length===0){
                let flag = checkTrueFalse(prefix_value);
                if(flag !== null){
                    data["data"]=[flag];
                    setSuggestions(data["data"]) 
                }
            }else{
                setSuggestions(data["data"]) 
            }
          if(allPossibleFields.length===0){
            setAllPossibleFields([...data["data"], "Order"])
          }else if(!isField ){
            const allIntegers = data["data"].length > 0 && data["data"].every(item => {
                const trimmedItem = item.trim();
                const parsed = Number(trimmedItem);
                return Number.isInteger(parsed) && String(parsed) === trimmedItem && !isNaN(parsed);
            });

            if (allIntegers) {
            const integerList = data["data"].map(item => parseInt(item, 10));
                const formatSize = (size) => {
                const units = ["bytes", "KB", "MB", "GB", "TB"];
                let unitIndex = 0;
                while (size >= 1024 && unitIndex < units.length - 1) {
                  size /= 1024;
                  unitIndex++;
                }
                return `${size.toFixed(2)} ${units[unitIndex]}`;
              };
              const formattedSizes = integerList.map(size => formatSize(size));
              setAllPossibleValues(['1.00 KB', '1.00 MB', '1.00 GB', '1.00 TB'])
            }else{
                setAllPossibleValues(data["data"])
            }
            setAction("filter");
          }
        }
    } catch (error) { 
        if (error.name !== 'AbortError') {
            console.error('Error fetching suggestions:', error);
        } 
    }
  };

  useEffect(()=>{
    handleButtonToggle();
  },[])

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
