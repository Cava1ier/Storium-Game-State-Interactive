import React, { createContext, useMemo } from 'react';
import { GameScaffold } from '../services/gameScaffold';
import { Game, Scene, Character, Challenge, UICard, Player, PlayerCharacterOwnership, EditingState, Card, CardType, Act, NewCharacterPayload } from '../types';
import { useGameState } from './handlers/useGameState';
import { useModalState } from './handlers/useModalState';
import { useAppHandlers } from './handlers/useAppHandlers';
import { useCrudHandlers } from './handlers/useCrudHandlers';
import { useCardHandlers } from './handlers/useCardHandlers';

// This interface defines the final shape of the context value
// that all components will consume.
export interface GameStateContextType {
    scaffold: GameScaffold;
    
    // State from useGameState
    games: Game[];
    players: Player[];
    allCards: Card[];
    allCardTypes: CardType[];
    ownerships: PlayerCharacterOwnership[];
    acts: Act[];
    scenes: Scene[];
    characters: Character[];
    challenges: Challenge[];
    cards: UICard[];
    selectedGameId: number | null;
    selectedActId: number | null;
    selectedSceneId: number | null;
    selectedCharacterId: number | null;
    selectedChallengeId: number | null;
    scenePips: { used: number; max: number };
    editingState: EditingState;
    rawData: string;
    setRawData: (data: string) => void;
    setEditingState: React.Dispatch<React.SetStateAction<EditingState>>;

    // State from useModalState
    isAddCardModalOpen: boolean;
    openAddCardModal: () => void;
    closeAddCardModal: () => void;
    isCreateCharacterModalOpen: boolean;
    openCreateCharacterModal: () => void;
    closeCreateCharacterModal: () => void;
    
    // Handlers from useAppHandlers
    refresh: () => void;
    handleParse: () => void;
    handleBuild: () => void;
    handleGameChange: (id: number | null) => void;
    handleActChange: (id: number | null) => void;
    handleSceneChange: (id: number | null) => void;
    handleSelectCharacter: (id: number | null) => void;
    handleSelectChallenge: (id: number | null) => void;
    handleEditingChange: (field: string, value: any) => void;
    handleCancelEdit: () => void;
    
    // Handlers from useCrudHandlers
    handleSave: () => void;
    handleAddGame: () => void;
    handleDeleteGame: (id: number) => void;
    handleAddAct: () => void;
    handleDeleteAct: (id: number) => void;
    handleAddScene: () => void;
    handleDeleteScene: (id: number) => void;
    handleAddCharacter: () => void;
    handleCreateCharacter: (payload: NewCharacterPayload) => void;
    handleDeleteCharacter: (id: number) => void;
    handleAddChallenge: () => void;
    handleEditChallenge: (challenge: Challenge) => void;
    handleDeleteChallenge: (id: number) => void;
    handleAddPlayer: () => void;
    handleDeletePlayer: (id: number) => void;
    handleAddMasterCard: () => void;
    handleDeleteMasterCard: (id: number) => void;

    // Handlers from useCardHandlers
    handleAddCardToCharacter: (cardId: number, cardTypeId: number) => void;
    handleDeleteCharacterCard: (characterCardId: number) => void;
    handleEditCard: (characterCardId: number) => void;
    handlePlayCardOnChallenge: (challengeId: number, characterCardId: number) => void;
    handleRemoveCardFromChallenge: (playedCardId: number) => void;
}

export const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const scaffold = useMemo(() => new GameScaffold(), []);
    
    // Delegate state management to specialized hooks
    const gameState = useGameState();
    const modalState = useModalState();
    
    const appHandlers = useAppHandlers({
        scaffold,
        gameState,
    });
    
    const crudHandlers = useCrudHandlers({
        scaffold,
        gameState,
        appHandlers,
        modalState,
    });

    const cardHandlers = useCardHandlers({
        scaffold,
        gameState,
        appHandlers,
        modalState,
    });

    // Compose the final context value from all the hooks
    const value: GameStateContextType = {
        scaffold,
        ...gameState,
        ...modalState,
        ...appHandlers,
        ...crudHandlers,
        ...cardHandlers,
    };

    return (
        <GameStateContext.Provider value={value}>
            {children}
        </GameStateContext.Provider>
    );
};