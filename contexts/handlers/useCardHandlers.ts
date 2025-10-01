import { GameScaffold } from '../../services/gameScaffold';
import { useGameState } from './useGameState';
import { useAppHandlers } from './useAppHandlers';
import { useModalState } from './useModalState';

type GameState = ReturnType<typeof useGameState>;
type AppHandlers = ReturnType<typeof useAppHandlers>;
type ModalState = ReturnType<typeof useModalState>;

interface CardHandlersProps {
    scaffold: GameScaffold;
    gameState: GameState;
    appHandlers: AppHandlers;
    modalState: ModalState;
}

export const useCardHandlers = ({ scaffold, gameState, appHandlers, modalState }: CardHandlersProps) => {
    const { selectedCharacterId, setEditingState, selectedActId, cards } = gameState;
    const { refresh } = appHandlers;
    const { closeAddCardModal } = modalState;

    const handleAddCardToCharacter = (cardId: number, cardTypeId: number) => {
        if (!selectedCharacterId) return;
        scaffold.addCardToCharacter(selectedCharacterId, {
            card_id: cardId,
            card_type_id: cardTypeId,
            count: 1
        });
        refresh();
        closeAddCardModal();
    };

    const handleDeleteCharacterCard = (characterCardId: number) => {
        if (window.confirm("Remove this card from the character?")) {
            try {
                scaffold.removeCardFromCharacter(characterCardId);
                refresh();
            } catch (e: any) {
                alert(`Error: ${e.message}`);
            }
        }
    };

    const handleEditCard = (characterCardId: number) => {
        const cardToEdit = cards.find(c => c.characterCardId === characterCardId);
        if (cardToEdit) {
            setEditingState({ 
                type: 'character_card', 
                data: { 
                    characterCardId: cardToEdit.characterCardId, 
                    count: cardToEdit.count,
                    card_id: cardToEdit.card.id,
                    card_type_id: cardToEdit.cardType.id
                } 
            });
        }
    };

    const handlePlayCardOnChallenge = (challengeId: number, characterCardId: number) => {
        if (!selectedActId) {
            alert("An act must be selected to provide context for playing a card.");
            return;
        };
        try {
            scaffold.playCardOnChallenge(challengeId, characterCardId);
            refresh();
        } catch (e: any) {
            alert(`Error: ${e.message}`);
        }
    };

    const handleRemoveCardFromChallenge = (playedCardId: number) => {
        try {
            scaffold.removeCardFromChallenge(playedCardId);
            refresh();
        } catch (e: any) {
            alert(`Error: ${e.message}`);
        }
    };

    return {
        handleAddCardToCharacter,
        handleDeleteCharacterCard,
        handleEditCard,
        handlePlayCardOnChallenge,
        handleRemoveCardFromChallenge,
    };
};