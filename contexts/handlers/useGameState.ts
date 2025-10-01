import { useState } from 'react';
import { Game, Scene, Character, UICard, Player, PlayerCharacterOwnership, EditingState, Card, CardType, Act, UIChallenge } from '../../types';

export const useGameState = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [allCards, setAllCards] = useState<Card[]>([]);
    const [allCardTypes, setAllCardTypes] = useState<CardType[]>([]);
    const [ownerships, setOwnerships] = useState<PlayerCharacterOwnership[]>([]);
    const [acts, setActs] = useState<Act[]>([]);
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [challenges, setChallenges] = useState<UIChallenge[]>([]);
    const [cards, setCards] = useState<UICard[]>([]);
    
    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
    const [selectedActId, setSelectedActId] = useState<number | null>(null);
    const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
    const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
    
    const [scenePips, setScenePips] = useState({ used: 0, max: 0 });

    const [editingState, setEditingState] = useState<EditingState>(null);
    const [rawData, setRawData] = useState('');

    return {
        games, setGames,
        players, setPlayers,
        allCards, setAllCards,
        allCardTypes, setAllCardTypes,
        ownerships, setOwnerships,
        acts, setActs,
        scenes, setScenes,
        characters, setCharacters,
        challenges, setChallenges,
        cards, setCards,
        selectedGameId, setSelectedGameId,
        selectedActId, setSelectedActId,
        selectedSceneId, setSelectedSceneId,
        selectedCharacterId, setSelectedCharacterId,
        selectedChallengeId, setSelectedChallengeId,
        scenePips, setScenePips,
        editingState, setEditingState,
        rawData, setRawData,
    };
};