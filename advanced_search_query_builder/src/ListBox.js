import {useEffect, useState, useRef} from 'react';
import './ListBox.css'
const  ListBox = ({ data, selectedItemIndex, onItemClick})=>{
    const listBoxRef = useRef(null);

    useEffect(() => {
      if (listBoxRef.current && listBoxRef.current.children[selectedItemIndex]) {
        const listBox = listBoxRef.current;
        const selectedElement = listBox.children[selectedItemIndex];
        const listBoxHeight = listBox.clientHeight;
        const selectedElementHeight = selectedElement.offsetHeight;
        const selectedElementTop = selectedElement.offsetTop;

        listBox.scrollTop = selectedElementTop - (listBoxHeight - selectedElementHeight) / 2;
      }
    }, [selectedItemIndex]);

    const handleItemClick = (index) => { onItemClick(index,'click'); }


    return (
        <div 
            ref={listBoxRef} 
            className="listBox"
            tabIndex="0"
            >
            {data.map((item, index) => (
                <div
                    key={index}
                    onClick={() => handleItemClick(index)}
                    className={index === selectedItemIndex ? "listBoxItem selected" : "listBoxItem"}
                >
                    {item}
                </div>
            ))}
        </div>
    );
      
}

export default ListBox;