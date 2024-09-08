import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useUser } from "../context/userContext";

// Function to generate a shuffled deck of cards with image URLs
const generateCards = () => {
  const cardValues = [
    { id: 'A', img: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Keycap-1-3d-icon.png' },
    { id: 'B', img: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Keycap-2-3d-icon.png' },
    { id: 'C', img: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Keycap-3-3d-icon.png' },
    { id: 'D', img: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Keycap-4-3d-icon.png' },
    { id: 'E', img: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/128/Keycap-5-3d-icon.png' },
    { id: 'F', img: 'https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Keycap-6-3d-icon.png' }
  ];

  const cards = [...cardValues, ...cardValues]; // Duplicate the card values
  return shuffleArray(cards); // Shuffle the deck
};

// Function to shuffle an array
const shuffleArray = (array) => {
  let shuffledArray = array.slice(); // Create a copy of the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};

// Function to format number with commas
const formatNumber = (number) => {
  return number.toLocaleString(); // Formats number with commas
};

// Styled components
const CardContainer = styled.div`
  perspective: 1000px; /* Provides depth for the 3D effect */
  width: 100px;
  height: 100px;
`;

const CardInner = styled.div`
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  transform: ${props => props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const CardFace = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  background-color: ${props => (props.isFlipped || props.isMatched ? '#fff' : '#eee')};
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-image: ${props => `url(${props.img})`};
  background-size: cover;
  background-position: center;
  color: transparent;
  text-align: center;
  line-height: 100px; /* Center text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${props => props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;

const Card = ({ index, isFlipped, img, questionMarkImg, handleClick }) => (
  <CardContainer onClick={() => handleClick(index)}>
    <CardInner isFlipped={isFlipped}>
      <CardFace isFlipped={isFlipped} isMatched={isFlipped} img={img} />
      <CardFace isFlipped={false} img={questionMarkImg} />
    </CardInner>
  </CardContainer>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Scoreboard = styled.div`
  margin-bottom: 20px;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 100px); /* 4 columns for 12 cards */
  gap: 10px;
`;

// MemoryGame component
const Flipper = () => {
  const [cards, setCards] = useState(generateCards());
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const { balance, setBalance } = useUser(); 
  const questionMarkImg = 'https://example.com/images/questionMark.webp'; // URL to the question mark image

  // Refs for audio elements
  const flipSoundRef = useRef(null);
  const matchSoundRef = useRef(null);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
      
      // Play flip sound
      if (flipSoundRef.current) {
        flipSoundRef.current.play();
      }

      if (firstCard.id === secondCard.id) {
        setMatchedPairs(prev => [...prev, firstCard.id]);
        setBalance(prev => prev + 10); // Update balance instead of points
        
        // Play match sound
        if (matchSoundRef.current) {
          matchSoundRef.current.play();
        }
      }
      
      // Reset flipped cards after 1 second if they don't match
      setTimeout(() => {
        setFlippedIndices([]);
      }, 1000);
    }
  }, [flippedIndices, cards, setBalance]);

  useEffect(() => {
    if (matchedPairs.length === cards.length / 2) {
      // All pairs matched, reset the game
      setTimeout(() => {
        setCards(generateCards());
        setMatchedPairs([]);
        setBalance(0); // Reset balance
      }, 1000);
    }
  }, [matchedPairs, cards, setBalance]);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index)) return;
    
    // Play flip sound
    if (flipSoundRef.current) {
      flipSoundRef.current.play();
    }

    setFlippedIndices(prev => [...prev, index]);
  };

  return (
    <Container>
      <Scoreboard>
        <p>Balance: {formatNumber(balance)}</p> {/* Format balance with commas */}
      </Scoreboard>
      <CardsContainer>
        {cards.map((card, index) => (
          <Card
            key={index}
            index={index}
            isFlipped={flippedIndices.includes(index) || matchedPairs.includes(card.id)}
            img={card.img}
            questionMarkImg={questionMarkImg} // Pass the question mark image URL
            handleClick={handleCardClick}
          />
        ))}
      </CardsContainer>
      {/* Audio elements */}
      <audio ref={flipSoundRef} src="../sounds/card-flip.mp3" />
      <audio ref={matchSoundRef} src="../sounds/card-match.mp3" />
    </Container>
  );
};

export default Flipper;
