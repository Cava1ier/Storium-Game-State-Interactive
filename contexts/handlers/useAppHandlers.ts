import { useState, useCallback, useEffect } from 'react';
import { GameScaffold } from '../../services/gameScaffold';
import { EditingState } from '../../types';
import { useGameState } from './useGameState';

type GameState = ReturnType<typeof useGameState>;

interface AppHandlersProps {
    scaffold: GameScaffold;
    gameState: GameState;
}

export const useAppHandlers = ({ scaffold, gameState }: AppHandlersProps) => {
    const {
        setGames, setPlayers, setAllCards, setAllCardTypes, setOwnerships,
        setActs, setScenes, setCharacters, setChallenges, setCards, setScenePips,
        selectedGameId, setSelectedGameId,
        selectedActId, setSelectedActId,
        selectedSceneId, setSelectedSceneId,
        selectedCharacterId, setSelectedCharacterId,
        selectedChallengeId, setSelectedChallengeId,
        editingState, setEditingState,
        rawData, setRawData,
    } = gameState;

    const [refreshCounter, setRefreshCounter] = useState(0);
    const refresh = useCallback(() => setRefreshCounter(v => v + 1), []);
    
    // Initial data load effect
    useEffect(() => {
        setRawData(scaffold.initialData);
        scaffold.loadData(scaffold.initialData);
        
        const games = scaffold.getGames();
        setGames(games);
        setPlayers(scaffold.getPlayers());
        setAllCards(scaffold.getAllCards());
        setAllCardTypes(scaffold.getAllCardTypes());
        setOwnerships(scaffold.getPlayerCharacterOwnerships());
        
        if (games.length > 0) {
            setSelectedGameId(games[0].id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    // Refresh master lists when a CRUD operation happens
    useEffect(() => {
        if (refreshCounter > 0) { // Skip initial mount
            setGames(scaffold.getGames());
            setPlayers(scaffold.getPlayers());
            setAllCards(scaffold.getAllCards());
            setAllCardTypes(scaffold.getAllCardTypes());
            setOwnerships(scaffold.getPlayerCharacterOwnerships());
        }
    }, [refreshCounter, scaffold, setGames, setPlayers, setAllCards, setAllCardTypes, setOwnerships]);

    // Effect for when the selected game changes OR data refreshes
    useEffect(() => {
        if (selectedGameId) {
            const currentActs = scaffold.getActs(selectedGameId);
            setActs(currentActs);

            setSelectedActId(prevActId => {
                if (!currentActs.some(a => a.id === prevActId)) {
                    return currentActs[0]?.id ?? null;
                }
                return prevActId;
            });
        } else {
            setActs([]);
            setSelectedActId(null);
        }
    }, [selectedGameId, refreshCounter, scaffold, setActs, setSelectedActId]);

    // Effect for when the selected act changes OR data refreshes
    useEffect(() => {
        if (selectedActId) {
            const currentScenes = scaffold.getScenes(selectedActId);
            setScenes(currentScenes);

            setSelectedSceneId(prevSceneId => {
                if (!currentScenes.some(s => s.id === prevSceneId)) {
                    return currentScenes[0]?.id ?? null;
                }
                return prevSceneId;
            });
        } else {
            setScenes([]);
            setSelectedSceneId(null);
        }
    }, [selectedActId, refreshCounter, scaffold, setScenes, setSelectedSceneId]);

    // Effect for when the selected scene changes OR data refreshes
    useEffect(() => {
        if (selectedSceneId) {
            const currentCharacters = scaffold.getCharacters(selectedSceneId);
            const currentChallenges = scaffold.getChallenges(selectedSceneId);
            setCharacters(currentCharacters);
            setChallenges(currentChallenges);

            const max = scaffold.getSceneMaxPips(selectedSceneId);
            const used = scaffold.getCurrentScenePipsUsed(selectedSceneId);
            setScenePips({ used, max });

            setSelectedCharacterId(prevCharId => {
                if (!currentCharacters.some(c => c.id === prevCharId)) {
                    return currentCharacters[0]?.id ?? null;
                }
                return prevCharId;
            });
            setSelectedChallengeId(prevChallengeId => {
                if (!currentChallenges.some(c => c.id === prevChallengeId)) {
                    return currentChallenges[0]?.id ?? null;
                }
                return prevChallengeId;
            });
        } else {
            setCharacters([]);
            setChallenges([]);
            setScenePips({ used: 0, max: 0 });
            setSelectedCharacterId(null);
            setSelectedChallengeId(null);
        }
    }, [selectedSceneId, refreshCounter, scaffold, setCharacters, setChallenges, setScenePips, setSelectedCharacterId, setSelectedChallengeId]);

    // Effect for when the selected character changes OR data refreshes
    useEffect(() => {
        if (selectedCharacterId) {
            setCards(scaffold.getCardsForCharacter(selectedCharacterId));
        } else {
            setCards([]);
        }
    }, [selectedCharacterId, refreshCounter, scaffold, setCards]);

    const handleParse = useCallback(() => {
        scaffold.loadData(rawData);
        setEditingState(null);
        const games = scaffold.getGames();
        setGames(games);
        setSelectedGameId(games[0]?.id ?? null); // This triggers the effect chain
        refresh(); // To update master lists like players
    }, [scaffold, rawData, setEditingState, setGames, setSelectedGameId, refresh]);
    
    const handleBuild = () => setRawData(scaffold.getRawData());

    const handleGameChange = (id: number | null) => {
        if (id !== selectedGameId) {
            setSelectedGameId(id);
        }
    };

    const handleActChange = (id: number | null) => {
        if (id !== selectedActId) {
            setSelectedActId(id);
        }
    };

    const handleSceneChange = (id: number | null) => {
        if (id !== selectedSceneId) {
            setSelectedSceneId(id);
        }
    };

    const handleSelectCharacter = (id: number | null) => {
        setSelectedCharacterId(id);
    };

    const handleSelectChallenge = (id: number | null) => {
        setSelectedChallengeId(id);
    };
    
    const handleEditingChange = (field: string, value: any) => {
        if (!editingState) return;
        setEditingState(prevState => {
            if (!prevState) return null;
            return { ...prevState, data: { ...prevState.data, [field]: value } } as EditingState;
        });
    };

    const handleCancelEdit = () => setEditingState(null);

    return {
        refresh,
        handleParse,
        handleBuild,
        handleGameChange,
        handleActChange,
        handleSceneChange,
        handleSelectCharacter,
        handleSelectChallenge,
        handleEditingChange,
        handleCancelEdit,
    };
};