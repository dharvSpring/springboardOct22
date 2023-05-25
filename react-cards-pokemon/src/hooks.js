import { useState, useEffect } from "react";
import axios from "axios";

function useFlip(initialUp = true) {
    const [isFacingUp, setIsFacingUp] = useState(initialUp);

    const flipCard = () => {
        setIsFacingUp(isUp => !isUp);
    }

    return [isFacingUp, flipCard];
}

function useAxios(storageKey, baseUrl) {
    const [response, setResponse] = useLocalStorage(storageKey, []);

    const addResponse = async (dataFormat, theRest = '') => {
        const response = await axios.get(baseUrl + theRest);
        setResponse(cards => [...cards, dataFormat(response.data)]);
    };

    const clearResponse = () => {
        setResponse([]);
    }

    return [response, addResponse, clearResponse];
}

function useLocalStorage(key, initVal = []) {
    if (localStorage.getItem(key)) {
        initVal = JSON.parse(localStorage.getItem(key));
    }

    const [value, setValue] = useState(initVal);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}

export { useAxios, useFlip, useLocalStorage };