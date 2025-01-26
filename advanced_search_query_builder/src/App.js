import './App.css';
import {useEffect, useState, useRef} from 'react';
import ListBox from './ListBox';
import Switch from '@mui/material/Switch';
import { BINARY_OPERATORS } from './constants';
import { LOGICAL_OPERATORS } from './constants';

function App() {
  const [searchingText, setSearchingText] = useState("");
  const [advancedSearchMode, setAdvancedSearchMode] = useState(true); // replaces showAdvancedDiv and buttonLabel
  const [suggestions, setSuggestions] = useState([]);
  const [queryBuilder,setQueryBuilder]=useState([[]]);
  const [queryBuilderComplete,setQueryBuilderComplete]=useState([[]]);
  const [allPossibleValues,setAllPossibleValues] = useState([]);
  const [allPossibleFields, setAllPossibleFields] = useState([]); 
  const [showAdvSuggestions, setShowAdvSuggestions] = useState(true);

  const [queryComplete,setQueryComplete] = useState(true);
  const [endQuery, setEndQuery] = useState([]);
  const [endValue, setEndValue] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [showFirstuggestions, setShowFirstSuggestions] = useState(true);
  const [Network, setNetwork] = useState(["STR"]);
  const [isField, setIsField] = useState(true);
  const [isValue,setIsValue]=useState(false);
  const [quotesCount, setQuotesCount]=useState(-1);
  const [action,setAction] = useState("None");

  const [cursorPosition, setCursorPosition]=useState(null);
  const [subStringBasedOnCursorPosition,setSubStringBasedOnCursorPosition]=useState("");
  const [kqlTitle, setKqlTitle] = useState("");
  const [stringUptoBreakingPointIndex , setStringUptoBreakingPointIndex] = useState("");
  const [breakingPointIndex,setBreakingPointIndex] = useState(-1);
  const [breakingPointOnEntireQuery,setBreakingPointOnEntireQuery] = useState(-1);
  const [wordCorrespondingToCursorPosition, setWordCorrespondingToCursorPosition] = useState("");
  const [tabOrClickOnSuggestion,setTabOrClickOnSuggestion] = useState(false);
  const [lastFieldForValues, setLastFieldForValues] = useState("");
  const [change,setChange]=useState(false);
  const [tabOnSuggestion, setTabOnSuggestion] = useState(false); 

  const [clickOnSuggestion, setClickOnSuggestion] = useState(false);

  const inputRef = useRef(null); 
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

  const  replaceWordAtCursor = (prevSearchText, cursorPosition, selectedSuggestion)=>{
    let words = prevSearchText.trim().match(/"[^"]*$|"[^"]*"|\s+|\S+/g);
    let currentCharPos = 0;
    let wordEndPos=0;
    for (let i = 0; i < words.length; i++) {
        const word = words[i];

        if(word.trim().length!==0){
            wordEndPos = currentCharPos + word.length;
            if (cursorPosition >= currentCharPos && cursorPosition <= wordEndPos) {
                let isFieldSelected = allPossibleFields.includes(selectedSuggestion);
                if(isValue && !isFieldSelected){ selectedSuggestion='"'+selectedSuggestion+'"'; }
                
                words[i] = selectedSuggestion;
                const updatedText = words.join('')+' ';
                const newCursorPosition = currentCharPos + selectedSuggestion.length+1;
                return { updatedText, newCursorPosition };    
            }else{
                if(cursorPosition<currentCharPos || cursorPosition>searchingText.trim().length){
                let isFieldSelected = allPossibleFields.includes(selectedSuggestion);
                if(isValue && !isFieldSelected){ selectedSuggestion='"'+selectedSuggestion+'"'; }
                let updatedText = searchingText.substring(0,cursorPosition).trim()+' ';
                updatedText+=selectedSuggestion+' ';
                const newCursorPosition = updatedText.length;
                updatedText+=searchingText.substring(cursorPosition).trim();
                return { updatedText, newCursorPosition };    
                }
            }
        }else{ currentCharPos = wordEndPos + word.length; }
    }
    return { updatedText: prevSearchText, newCursorPosition: cursorPosition };
  }

  const handleTabOrClickOnSuggestion = (index,type) => {
    const length = searchingText.length;
    const selectedSuggestion = suggestions[index];
    let flag = false;
    if (selectedSuggestion !== undefined && length === cursorPosition && !isValue) {
      setSuggestions([]);
      if(searchingText.startsWith(' ')){
        flag = true;
      }
      if(type==='click'){setClickOnSuggestion(true);}
      setSearchingText((prevSearchText) => {
        let words = prevSearchText.trim().split(' ');
        if (selectedSuggestion.toLowerCase().includes(words[words.length - 1].toLowerCase())) { words.pop(); }
        if(quotesCount===1){ words.pop(); }
        let lastPart;
        if(isValue){ lastPart=' "' + selectedSuggestion + '" '}
        else{ lastPart=' ' + selectedSuggestion + ' '; }

        let updatedText= words.join(' ') + lastPart;
        let newCursorPosition = updatedText.length;
        if(flag){
            newCursorPosition-=1;
        }
        else if(updatedText.startsWith(' ')){
            updatedText=updatedText.trimStart();
            newCursorPosition-=1;
        }
        console.log('scp1')
        setCursorPosition(newCursorPosition);
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        inputRef.current.focus();
        setTimeout(() => {
            if(newCursorPosition===updatedText.length){
                inputRef.current.scrollLeft = inputRef.current.scrollWidth;  
            }
        }, 0);
        setSubStringBasedOnCursorPosition(updatedText.substring(0,newCursorPosition));
        return updatedText;
      });
    } else if (selectedSuggestion !== undefined && (length > cursorPosition || (length===cursorPosition && isValue))) {
      setSuggestions([]);
      if(type==='click'){setClickOnSuggestion(true);}
      setSearchingText((prevSearchText) => {
        const { updatedText, newCursorPosition } = replaceWordAtCursor(prevSearchText, cursorPosition, selectedSuggestion);
        if (inputRef.current) {
          setTimeout(() => {
            inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
            console.log('scp2')
            setCursorPosition(newCursorPosition);
            inputRef.current.focus();
            if(newCursorPosition===updatedText.length){
                inputRef.current.scrollLeft = inputRef.current.scrollWidth;
            }
            setSubStringBasedOnCursorPosition(updatedText.substring(0,newCursorPosition));
          },500); 
        }
        return updatedText;
      });
    }

  };

  const countQuotes = (text)=>{
    let totalDoubleQuotes=0;
    if(!text){ setQuotesCount(0); return 0; }
    for (let i = 0; i<text.length; i++){
        if(text[i]==='"'){ totalDoubleQuotes+=1; }
    }
    setQuotesCount(totalDoubleQuotes);
    return totalDoubleQuotes;
  }

  const findWordCorrespondingToCursor =(startIndex)=>{
    if(startIndex===-1){
        startIndex = cursorPosition;
        while (startIndex > 0 && searchingText[startIndex - 1] !== ' ') { startIndex--; }
    }
    let endIndex = cursorPosition;
    while(endIndex<searchingText.length && searchingText[endIndex]!==' '){ endIndex++; }
    let word = searchingText.substring(startIndex,endIndex);
    return {word:word,startIndex:startIndex};
  }

  const checkWhereOperatorBreaking=(subSequence,startIndex,type)=>{
    let potentialMatches;
    if(type==='binary'){ potentialMatches = BINARY_OPERATORS; }
    else{ potentialMatches = LOGICAL_OPERATORS; }
    for (let i = 0; i < subSequence.length; i++) {
        potentialMatches = potentialMatches.filter(op => op.toLowerCase().startsWith(subSequence.slice(0, i + 1).toLowerCase()));
        if (potentialMatches.length === 0) { return {isValid:false,invalidIndex:startIndex+i}; }
    }
    let isPresent = potentialMatches.some((match) => match.toLowerCase().includes(subSequence.toLowerCase()));
    if(isPresent){ return {isValid:true,invalidIndex:-1};}
    else{ return {isValid:true,invalidIndex:startIndex+subSequence.length} }
}

  const checkValidText = (subSequence, startIndex) => {
    let isInQuotes = false; 
    for (let i = 0; i < subSequence.length; i++) {
        let char = subSequence[i];
        if (char === '"') {isInQuotes = !isInQuotes;}
        if (!isInQuotes) { if (!/[a-zA-Z0-9".]/.test(char)) {return {isValid:false,invalidIndex:startIndex + i};}}
    }
    return {isValid:true,invalidIndex:-1};
  };  

  const checkValidOperator = (subSequence, startIndex, type) => {
    let potentialMatches;
    if(type==='binary'){ potentialMatches = BINARY_OPERATORS;}
    else{ potentialMatches = LOGICAL_OPERATORS; }
    for (let i = 0; i < subSequence.length; i++) {
        potentialMatches = potentialMatches.filter(op => op.toLowerCase().startsWith(subSequence.slice(0, i + 1).toLowerCase()));
        if (potentialMatches.length === 0) { return {isValid:false,invalidIndex:startIndex+i}; }
    }
    let isPresent = potentialMatches.includes(subSequence);
    let stringEndsWithSpace = /\s$/.test(searchingText);
    if(isPresent){ return {isValid:true,invalidIndex:-1}; }
    else{
        if(cursorPosition!==searchingText.length || stringEndsWithSpace){
            let operator_obj = findWordCorrespondingToCursor(startIndex);
            let obj= checkWhereOperatorBreaking(operator_obj.word,startIndex,type);
            let breakingPoint = obj.invalidIndex;
            return {isValid:true,invalidIndex:breakingPoint};
        }else{ return {isValid:true,invalidIndex:-1}; }
    }
};

  const breakString = (text) => {
    let isInQuotes = false;
    let currentSegment = "";
    let result = [];
    let indicesArray = [];
    let currentIndex = 0;

    // Regex pattern for special characters (excluding . and ")
    const specialCharPattern = /[^a-zA-Z0-9"._]/;
    const checkEmptySpace = /^\s$/;
    let currentCharIsSpecial;
    let lastCharWasSpecialAndInQuotes = false;
    let lastCharWasSpace = false;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char === '"') {
          if(lastCharWasSpecialAndInQuotes && !isInQuotes){
              if(!lastCharWasSpace){  
              result.push(currentSegment.trim());
              indicesArray.push(currentIndex)
              currentIndex = currentIndex+currentSegment.trim().length;
              currentSegment='"'
              }else{currentSegment += char;}
          }else{currentSegment += char;}
          isInQuotes = !isInQuotes;
          lastCharWasSpecialAndInQuotes=false;
          continue;
        }
        currentCharIsSpecial = specialCharPattern.test(char);
        if(currentCharIsSpecial && !isInQuotes){
          if(lastCharWasSpecialAndInQuotes){
              if(char.trim().length!==0){ currentSegment+=char;
              }else{
                  if(currentSegment.trim().length!==0){
                      result.push(currentSegment.trim());
                      indicesArray.push(currentIndex)
                  }
                  currentSegment="";
                  currentIndex=i+1;
              }
          }else{
              if(currentSegment.length!==0){
                  result.push(currentSegment.trim());
                  indicesArray.push(currentIndex); 
              }
              currentSegment=char;
              if(char.trim().length===0){ currentIndex=i+1 }else{ currentIndex=i; }
          }
        }else{
            if(currentSegment.trim().length !==0 && lastCharWasSpecialAndInQuotes){
                result.push(currentSegment.trim());
                indicesArray.push(currentIndex);
                currentSegment="";
                currentIndex=i;
            }
            currentSegment+=char;
        }
        lastCharWasSpecialAndInQuotes = specialCharPattern.test(char) && !isInQuotes;
        lastCharWasSpace = checkEmptySpace.test(char);
    }

    if (currentSegment.trim() !== "") {
        result.push(currentSegment.trim());
        indicesArray.push(currentIndex);
    }
    return { result, indicesArray };
  };

  const handleUpdateQueryBuilder = ()=>{
    let output = breakString(subStringBasedOnCursorPosition); 
    let result = output.result;
    let indicesArray = output.indicesArray;
    let length = result.length;
    let invalidIndex=-1;
    let updatedQueryBuilder=[];
    let query=[];
    for (let i=0; i<length; i++){
        let ans;
        if(i%4===0){ ans = checkValidText(result[i],indicesArray[i]); }
        else if(i%4===2){ ans = checkValidText(result[i],indicesArray[i]); }
        else if(i%4===1){ ans = checkValidOperator(result[i],indicesArray[i],'binary') }
        else{ ans = checkValidOperator(result[i],indicesArray[i],'logical') }

        if(ans.isValid){
            query.push(result[i]);
            if(ans.invalidIndex!==-1){ invalidIndex=ans.invalidIndex; break; }
            }else{
            invalidIndex=ans.invalidIndex;
            setTimeout(()=>{setSuggestions([])},[0])
            break; }

            if(i%4===3){
                updatedQueryBuilder.push(query);
                query=[];
            }
    }
    let temp = searchingText.substring(0, cursorPosition);
    if (breakingPointIndex!==-1 && invalidIndex === -1){
        if (temp.length>=stringUptoBreakingPointIndex.length){
            setBreakingPointIndex(invalidIndex);
            setStringUptoBreakingPointIndex("");
        }
    }else if(breakingPointIndex!==-1 && invalidIndex!==-1){
        if (temp.length<=stringUptoBreakingPointIndex.length){
            setBreakingPointIndex(invalidIndex);
            setStringUptoBreakingPointIndex(searchingText.substring(0, invalidIndex));
        }
    }else{
        setBreakingPointIndex(invalidIndex);
        if(invalidIndex!==-1){ setStringUptoBreakingPointIndex(searchingText.substring(0, invalidIndex));}
        else{ setStringUptoBreakingPointIndex(""); }
    }
    if(query.length!==0){ updatedQueryBuilder.push(query); }
    if(updatedQueryBuilder.length===0){ updatedQueryBuilder=[[]]; }
    setQueryBuilder(updatedQueryBuilder);
    let final_query = updatedQueryBuilder ? updatedQueryBuilder[updatedQueryBuilder.length-1]?  updatedQueryBuilder[updatedQueryBuilder.length-1] : [] : [];
    if(final_query){
        if(final_query[2]){
            let last_query_value = final_query.pop();
            last_query_value = last_query_value.replace(/^"|"$/g, ''); 
            final_query.push(last_query_value);
            setEndValue(last_query_value)
        }else{
            setEndValue("");
        }
    }
    setEndQuery(final_query);
    if(cursorPosition===searchingText.length || cursorPosition===searchingText.trim().length){
        setQueryBuilderComplete(updatedQueryBuilder);
    }
  }

  const handleUpdateQueryBuilderComplete = ()=>{
    let output = breakString(searchingText); 
    let result = output.result;
    let indicesArray = output.indicesArray;
    let length = result.length;
    let invalidIndex=-1;
    let updatedQueryBuilder=[];
    let query=[];
    for (let i=0; i<length; i++){
        let ans;
        if(i%4===0){ ans = checkValidText(result[i],indicesArray[i]) }
        else if(i%4===2){ ans = checkValidText(result[i],indicesArray[i]);}
        else if(i%4===1){ ans = checkValidOperator(result[i],indicesArray[i],'binary')}
        else{ ans = checkValidOperator(result[i],indicesArray[i],'logical'); }

        if(ans.isValid){
            query.push(result[i]);
            if(ans.invalidIndex!==-1){ invalidIndex=ans.invalidIndex; break; }
        }else{
            invalidIndex=ans.invalidIndex;
            setTimeout(()=>{setSuggestions([])},[0])
            break;
        }
        if(i%4===3){
            updatedQueryBuilder.push(query);
            query=[];
        }
    }

    if(query.length!==0){ updatedQueryBuilder.push(query); }
    if(updatedQueryBuilder.length===0){ updatedQueryBuilder=[[]]; }
    setQueryBuilderComplete(updatedQueryBuilder);
    let final_query = updatedQueryBuilder ? updatedQueryBuilder[updatedQueryBuilder.length-1]?  updatedQueryBuilder[updatedQueryBuilder.length-1] : [] : [];
    if(final_query){
        if(final_query[2]){
            let last_query_value = final_query.pop();
            last_query_value = last_query_value.replace(/^"|"$/g, ''); 
            final_query.push(last_query_value);
            setEndValue(last_query_value);
        }else{
            setEndValue("");
        }
    }
    setEndQuery(final_query)
    if(invalidIndex!==-1){
        setBreakingPointIndex(invalidIndex);
        setStringUptoBreakingPointIndex(searchingText.substring(0,invalidIndex));
        setQueryComplete(false);
    }else{ setQueryComplete(updatedQueryBuilder[updatedQueryBuilder.length-1].length===3); }
    setBreakingPointOnEntireQuery(invalidIndex);
  }

  const handleKeyDown = (event) => {
    if (event.keyCode === 40) { //  event.key === 'ArrowDown'
      console.log("ArrowDown")
      event.preventDefault();
      setSelectedItemIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.keyCode === 38) { // event.key === 'ArrowUp'
      console.log("ArrowUp")
      event.preventDefault();
      setSelectedItemIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (event.keyCode === 9 && selectedItemIndex !== -1) {
      console.log("tab clicked")
      event.preventDefault();
      setTabOnSuggestion(true);
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
    console.log("fetchSuggestions called")
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

  const checkCursorInMiddleOfText = ()=>{
    let arr1 = searchingText.split(' ');
    let arr2 = subStringBasedOnCursorPosition.split(' ');
    arr1 = arr1.filter(item => item !== "");
    arr2 = arr2.filter(item => item !== "");
    if(arr2.length===arr1.length-1){ return false; }
    if(arr1.length>0 && arr2.length>0 && arr1[arr1.length-1] && arr2[arr2.length-1] && arr1.length===arr2.length){
        let a = arr1[arr2.length-1];
        let b = arr2[arr2.length-1];
        if(a[0]==='"'){a=a.substring(1);}
        if(a[a.length-1]==='"'){a=a.slice(0,-1);}
        if(b[0]==='"'){b=b.substring(1);}
        if(b[b.length-1]==='"'){b=b.slice(0,-1);}
        if(a.length!==b.length || a===b){return true;}
    }
    return arr1.length!==arr2.length;
  }

  const updateCursorPosition = (e) => {
    let afterCursorTextExists = checkCursorInMiddleOfText();
    if((!afterCursorTextExists && tabOnSuggestion) || !tabOnSuggestion){
        const newCursorPosition = e.target.selectionStart; 
        const subString = searchingText.substring(0, newCursorPosition); 
        console.log('scp3');
        setCursorPosition(newCursorPosition);
        setSubStringBasedOnCursorPosition(subString);
    }
    setTabOnSuggestion(false);
  };

  const onInputBoxClick = (e) => {
    setShowAdvSuggestions(true)
    const cursorPositionOnClick = e.target.selectionStart; 
    const subString = searchingText.substring(0, cursorPositionOnClick); 
    console.log('scp4')
    setCursorPosition(cursorPositionOnClick)
    setSubStringBasedOnCursorPosition(subString);
  }

  useEffect(() => {
    handleButtonToggle();
  }, []);

  useEffect(()=>{
    if(subStringBasedOnCursorPosition){
        if(breakingPointIndex===-1 || cursorPosition<=breakingPointIndex){
            handleUpdateQueryBuilder(); 
            let obj = findWordCorrespondingToCursor(-1);
            setWordCorrespondingToCursorPosition(obj.word);
        }else{
            if(cursorPosition!==0){ setSuggestions([]); }
        }
    }
    if(cursorPosition===0){ console.log('11'); setSuggestions(allPossibleFields); }
  },[cursorPosition])

  useEffect(()=>{
    if (inputRef.current) {
    let afterCursorTextExists = checkCursorInMiddleOfText(); 
    if(!afterCursorTextExists && (tabOnSuggestion || clickOnSuggestion)){ inputRef.current.focus(); }
    if(!tabOnSuggestion && !clickOnSuggestion ){ inputRef.current.focus(); }
    if(tabOnSuggestion || clickOnSuggestion){setTabOrClickOnSuggestion(true); } else{ setTabOrClickOnSuggestion(false); }

    handleUpdateQueryBuilderComplete();

    let newCursorPosition;
    if(breakingPointIndex===-1){ 
        newCursorPosition = searchingText.length;
        if(!afterCursorTextExists){
          console.log('scp5')
            setCursorPosition(newCursorPosition)
            setSubStringBasedOnCursorPosition(searchingText.substring(0, newCursorPosition));
        }
    }else{
        newCursorPosition = subStringBasedOnCursorPosition.length;
        setBreakingPointIndex(-1);
        if(afterCursorTextExists){
          console.log('scp6')
            setCursorPosition(newCursorPosition)
            setSubStringBasedOnCursorPosition(subStringBasedOnCursorPosition.substring(0, newCursorPosition));
        }
    }

    setClickOnSuggestion(false);
    if(searchingText.trim().length===0){ setQueryComplete(true) } }
  },[searchingText])

  useEffect(()=>{
    let title="";
    let isQueryComplete = queryComplete;
    if(breakingPointOnEntireQuery!==-1){ isQueryComplete = false; }
    if(breakingPointOnEntireQuery===-1){ setBreakingPointOnEntireQuery(searchingText.length) }
    if(!isQueryComplete){
        if(breakingPointOnEntireQuery>8){ title+='...'; }
        if(breakingPointOnEntireQuery===-1){ title+=searchingText.substring(searchingText.length-8) + '^';
        }else{ title+=searchingText.substring(breakingPointOnEntireQuery-8,breakingPointOnEntireQuery) +'^'+searchingText.substring(breakingPointOnEntireQuery+1); }
    }
    console.log("title==",title)
    setKqlTitle(title);
  },[queryComplete,breakingPointOnEntireQuery])

  useEffect(()=>{
    if(tabOnSuggestion){ handleTabOrClickOnSuggestion(selectedItemIndex,'tab'); }
  },[tabOnSuggestion])

  useEffect(()=>{
    if(showAdvSuggestions && subStringBasedOnCursorPosition && queryBuilder[0]){
    let newQueryBuilder = queryBuilder;
    let last_query = newQueryBuilder.pop();
    let endsWithWhiteSpace = /\s$/.test(subStringBasedOnCursorPosition);
    let length = last_query.length%4;
    let last_query_length = last_query.length;
    let last_element = last_query.pop();
    let updatedSuggestions = [];
    let totalDoubleQuotes=-1;
    if(wordCorrespondingToCursorPosition.trim.length===0){ totalDoubleQuotes = countQuotes(last_element); }
    else{ totalDoubleQuotes = countQuotes(wordCorrespondingToCursorPosition); }
    let addSpace=false;
    if(totalDoubleQuotes===1 && endsWithWhiteSpace){ endsWithWhiteSpace=false; addSpace=true; }
    let changeIt=false;
    if (last_query_length==0 || (length==0 && endsWithWhiteSpace )){ console.log('22');setSuggestions(allPossibleFields); }
    else if(length==0 && !endsWithWhiteSpace){
        updatedSuggestions = LOGICAL_OPERATORS.filter((suggestion)=>suggestion.includes(last_element));
        if(!updatedSuggestions){ updatedSuggestions=LOGICAL_OPERATORS; }
        setSuggestions(updatedSuggestions);
    }else if(length==1 && endsWithWhiteSpace){
        let updated_suggestions = BINARY_OPERATORS;
        if(last_element && last_element.toLowerCase()==='order'){
            updated_suggestions = ["==","!="];
        }
        setIsField(false);
        if(tabOrClickOnSuggestion && cursorPosition<searchingText.trim().length){
            setTimeout(()=>{setSuggestions(updated_suggestions);},[500])
        }else{setSuggestions(updated_suggestions);}
        if(tabOrClickOnSuggestion){setTabOrClickOnSuggestion(false);}
    }else if(length==1){
        updatedSuggestions=allPossibleFields.filter((suggestion)=>suggestion.toLowerCase().includes(last_element.toLowerCase()));
        setSuggestions(updatedSuggestions)
    }else if(length==2 && endsWithWhiteSpace){
        setIsField(false);
        setLastFieldForValues(last_query[0]);
        changeIt=true;
        fetchSuggestions(last_query[0]);
    }else if(length==2){
        let updated_suggestions = BINARY_OPERATORS;
        if(last_query[0] && last_query[0].toLowerCase()==='order'){
            updated_suggestions = ["==","!="];
        }
        updatedSuggestions = updated_suggestions.filter((suggestion)=>suggestion.toLowerCase().includes(last_element.toLowerCase()))
        if(updatedSuggestions.length===0){ updatedSuggestions = BINARY_OPERATORS; }
        setSuggestions(updatedSuggestions);
    }else if(length==3 && endsWithWhiteSpace){
        if(tabOrClickOnSuggestion && cursorPosition<searchingText.trim().length){
            setTimeout(()=>{setSuggestions(LOGICAL_OPERATORS); },[500])
        }else{setSuggestions(LOGICAL_OPERATORS); }
        if(tabOrClickOnSuggestion){setTabOrClickOnSuggestion(false);}
    }else if(length==3){
        changeIt=true;
        if(lastFieldForValues===last_query[0]){
            if(last_element[0]==='"'){
                last_element=last_element.substring(1);
                if(last_element[last_element.length-1]==='"'){
                last_element=last_element.slice(0,-1)
                }
            }
            if(addSpace){ last_element+=" "; }
            changeIt=true;
            fetchSuggestions(last_query[0],last_element);
        }else{
            setLastFieldForValues(last_query[0]);
            setIsField(false);
            if(last_element[0]==='"'){ last_element=last_element.substring(1); }
            if(addSpace){ last_element+=" "; }
            changeIt=true;
            fetchSuggestions(last_query[0],last_element);
        }
    }else if(length==4 && endsWithWhiteSpace){ console.log('33');setSuggestions(allPossibleFields);
    }else if(length==4){
        updatedSuggestions = LOGICAL_OPERATORS.filter((suggestion)=>suggestion.includes(last_element));
        if(updatedSuggestions.length===0){ updatedSuggestions=LOGICAL_OPERATORS; }
        setSuggestions(updatedSuggestions);
    }

    if(length==2 && endsWithWhiteSpace){ setIsValue(true); }
    else if(length==3){ setIsValue(!endsWithWhiteSpace); }
    else{ setIsValue(false); } setChange(changeIt);}
  },[queryBuilder])

  return (
    <div className="App">
      <div className="toggleButton">
      <Switch defaultChecked size="large" onClick={() => handleButtonToggle()} onChange={handleButtonToggle}/>
      </div>
        {
        advancedSearchMode ? 
        <div className="appContainer">
          <div className="inputContainer">
            <div id="kqlerrormsg" title={kqlTitle}>
              {queryComplete ? <img className="icon kqlgood" src="https://alm-report.corp.knorr-bremse.com/s/xp7u7d/9120004/znomsy/1.0/_/images/icons/accept.png" alt="accept"/>:
              <img class="icon kqlerror" src='https://alm-report.corp.knorr-bremse.com/s/xp7u7d/9120004/znomsy/1.0/_/images/icons/error.png' alt='error'/>}
            </div>
            <input
              className="searchInput"
              value={searchingText}
              ref={inputRef}
              placeholder="Type your query here..."
              onKeyDown={handleKeyDown} 
              onChange={onInputTextChange}
              onClick={onInputBoxClick} 
              onKeyUp={updateCursorPosition}
              spellcheck="false" 
            />
            {(showAdvSuggestions && (showFirstuggestions || searchingText !== "")) ? (
              <ListBox className="listBox" data={suggestions} selectedItemIndex={selectedItemIndex} 
              selectedField={suggestions[selectedItemIndex]}  
              onItemClick={handleTabOrClickOnSuggestion}
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
