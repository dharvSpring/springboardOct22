import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './DeckOfCards.css';

import Card from "./Card";

const DECK_API = 'https://deckofcardsapi.com/api/deck/';
const rotations = [0, 5, 10, 15, 20, 25, 335, 340, 345, 350, 355];

function DeckOfCards() {
    const [deck, setDeck] = useState(null);
    const [drawnCards, setDrawnCards] = useState([]);
    const [stopDraw, setStopDraw] = useState(false);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        async function fetchDeck() {
            try {
                const {data} = await axios.get(`${DECK_API}new/shuffle`);
                setDeck(data);
            } catch(e) {
                console.error(e);
            }
        }
        fetchDeck();
    }, [setDeck]);

    useEffect(() => {
        async function fetchCard() {
            const {deck_id} = deck;

            try {
                const drawResult = await axios.get(`${DECK_API}${deck_id}/draw`);

                if (drawResult.data.remaining === 0) {
                    setStopDraw(true);
                    setAutoDraw(false);
                    throw new Error("no cards remaining!");
                }

                const card = drawResult.data.cards[0];
                const rotClass = rotations[Math.floor(Math.random() * rotations.length)];

                setDrawnCards(d => [
                    ...d,
                    {
                        id: card.code,
                        image: card.image, 
                        rotClass: `rotate-${rotClass}`,
                    },
                ]);
            } catch(e) {
                alert(e);
            }
        }
        // fetchCard();

        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await fetchCard();
            }, 500);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    };

    const cardComps = drawnCards.map(card => (
        <Card key={card.id} imgUrl={card.image} rotClass={card.rotClass} />
    ));

    return (
        <div className="DeckOfCards">
            {!stopDraw ? (
                    <button
                        className="DeckOfCards-draw"
                        onClick={toggleAutoDraw}>
                            {autoDraw ? "Stop" : "Keep"} Drawing Cards!
                    </button>
                ) : (
                    <button
                        className="DeckOfCards-draw"
                        disabled>
                            No More Cards 😭
                    </button>
                )
            }
            {cardComps}
        </div>
    )
}

export default DeckOfCards;