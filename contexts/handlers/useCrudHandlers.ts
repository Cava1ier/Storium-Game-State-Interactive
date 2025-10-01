import { GameScaffold } from '../../services/gameScaffold';
import { Challenge, NewCharacterPayload } from '../../types';
import { useGameState } from './useGameState';
import { useAppHandlers } from './useAppHandlers';
import { useModalState } from './useModalState';

type GameState = ReturnType<typeof useGameState>;
type AppHandlers = ReturnType<typeof useAppHandlers>;
type ModalState = ReturnType<typeof useModalState>;

interface CrudHandlersProps {
    scaffold: GameScaffold;
    gameState: GameState;
    appHandlers: AppHandlers;
    modalState: ModalState;
}

export const useCrudHandlers = ({ scaffold, gameState, appHandlers, modalState }: CrudHandlersProps) => {
    const { editingState, setEditingState, selectedGameId, selectedActId, selectedSceneId, setSelectedGameId, setSelectedActId, setSelectedSceneId, setSelectedCharacterId, setSelectedChallengeId, selectedCharacterId, selectedChallengeId } = gameState;
    const { refresh } = appHandlers;
    const { openCreateCharacterModal, closeCreateCharacterModal } = modalState;

    const handleSave = () => {
        if (!editingState) return;
        try {
            switch (editingState.type) {
                case 'game': scaffold.updateGame(editingState.data.id, editingState.data); break;
                case 'act': scaffold.updateAct(editingState.data.id, editingState.data); break;
                case 'scene': scaffold.updateScene(editingState.data.id, editingState.data); break;
                case 'character': {
                    const { playerId, ...charData } = editingState.data;
                    scaffold.updateCharacter(charData.id, charData);
                    scaffold.updateCharacterOwnership(charData.id, playerId);
                    break;
                }
                case 'challenge': scaffold.updateChallenge(editingState.data.id, editingState.data); break;
                case 'player': scaffold.updatePlayer(editingState.data.id, editingState.data); break;
                case 'card': scaffold.updateCard(editingState.data.id, editingState.data); break;
                case 'character_card': {
                    const { characterCardId, ...updates } = editingState.data;
                    scaffold.updateCharacterCard(characterCardId, updates);
                    break;
                }
                case 'new_player':
                    if (editingState.data.name.trim()) {
                        scaffold.createPlayer({ name: editingState.data.name.trim() });
                    }
                    break;
                case 'new_game':
                    if (editingState.data.name.trim()) {
                        scaffold.createGame(editingState.data);
                    }
                    break;
                case 'new_act':
                    if (selectedGameId && editingState.data.name.trim()) {
                        scaffold.createAct(selectedGameId, editingState.data);
                    }
                    break;
                case 'new_scene':
                    if (selectedActId && editingState.data.name.trim()) {
                        scaffold.createScene(selectedActId, { ...editingState.data, place_card_id: 4 });
                    }
                    break;
                case 'new_challenge':
                    if (selectedSceneId && editingState.data.name.trim()) {
                        scaffold.createChallenge(selectedSceneId, editingState.data);
                    }
                    break;
                case 'new_card':
                    if (editingState.data.name.trim()) {
                        scaffold.createCard(editingState.data);
                    }
                    break;
            }
        } catch (e: any) {
            alert(`Error: ${e.message}`);
            return;
        }
        setEditingState(null);
        refresh();
    };

    const handleAddGame = () => {
        setEditingState({ type: 'new_game', data: { name: '', desc: '' } });
    };

    const handleDeleteGame = (id: number) => {
        if (window.confirm("Delete this game and all its acts, scenes, characters, and challenges?")) {
            if (id === selectedGameId) {
                setSelectedGameId(null);
            }
            scaffold.deleteGame(id);
            refresh();
        }
    };

    const handleAddAct = () => {
        if (!selectedGameId) return;
        setEditingState({ type: 'new_act', data: { name: '', desc: '' } });
    };

    const handleDeleteAct = (id: number) => {
        if (window.confirm("Delete this act and all its scenes?")) {
            if (id === selectedActId) {
                setSelectedActId(null);
            }
            scaffold.deleteAct(id);
            refresh();
        }
    };

    const handleAddScene = () => {
        if (!selectedActId) return;
        setEditingState({ type: 'new_scene', data: { name: '', desc: '' } });
    };

    const handleDeleteScene = (id: number) => {
        if (window.confirm("Delete this scene and all its contents?")) {
            if (id === selectedSceneId) {
                setSelectedSceneId(null);
            }
            scaffold.deleteScene(id);
            refresh();
        }
    };

    const handleAddPlayer = () => {
        setEditingState({ type: 'new_player', data: { name: '' } });
    };

    const handleDeletePlayer = (id: number) => {
        if (window.confirm("Are you sure you want to delete this player?")) {
            scaffold.deletePlayer(id);
            refresh();
        }
    };

    const handleAddMasterCard = () => {
        setEditingState({ type: 'new_card', data: { name: '', desc: '', is_wild: 0, default_card_type_id: null } });
    };

    const handleDeleteMasterCard = (id: number) => {
        if (window.confirm("Delete this master card? This can only be done if it's not in use by any character.")) {
            try {
                scaffold.deleteCard(id);
                refresh();
            } catch (e: any) {
                alert(`Error: ${e.message}`);
            }
        }
    };

    const handleAddCharacter = () => {
        if (!selectedGameId || !selectedSceneId) return alert("Please select a game and a scene first.");
        openCreateCharacterModal();
    };

    const handleCreateCharacter = (payload: NewCharacterPayload) => {
        if (!selectedGameId || !selectedSceneId) {
            alert("Cannot create character without a selected game and scene.");
            return;
        }
        try {
            scaffold.createCharacter(selectedGameId, selectedSceneId, payload);
            closeCreateCharacterModal();
            refresh();
        } catch (e: any) {
            alert(`Error: ${e.message}`);
        }
    };

    const handleDeleteCharacter = (id: number) => {
        if (window.confirm("Delete this character? This cannot be undone.")) {
            if (id === selectedCharacterId) {
                setSelectedCharacterId(null);
            }
            scaffold.deleteCharacter(id);
            refresh();
        }
    };

    const handleAddChallenge = () => {
        if (!selectedSceneId) return alert("Please select a scene first.");
        setEditingState({ type: 'new_challenge', data: { name: '', difficulty: 'Medium', type: 'Obstacle', pips: 1, strong_outcome: "Success!", weak_outcome: "Failure." }});
    };

    const handleEditChallenge = (challenge: Challenge) => {
        const pips = scaffold.getPipsForChallenge(challenge.id);
        setEditingState({ type: 'challenge', data: { ...challenge, pips } });
    };

    const handleDeleteChallenge = (id: number) => {
        if (window.confirm("Delete this challenge?")) {
            if (id === selectedChallengeId) {
                setSelectedChallengeId(null);
            }
            scaffold.deleteChallenge(id);
            refresh();
        }
    };

    return {
        handleSave,
        handleAddGame,
        handleDeleteGame,
        handleAddAct,
        handleDeleteAct,
        handleAddScene,
        handleDeleteScene,
        handleAddCharacter,
        handleCreateCharacter,
        handleDeleteCharacter,
        handleAddChallenge,
        handleEditChallenge,
        handleDeleteChallenge,
        handleAddPlayer,
        handleDeletePlayer,
        handleAddMasterCard,
        handleDeleteMasterCard,
    };
};