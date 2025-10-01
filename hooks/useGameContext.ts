
import { useContext } from 'react';
import { GameStateContext } from '../contexts/GameStateContext';

export const useGameContext = () => {
    const context = useContext(GameStateContext);
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameStateProvider');
    }
    return context;
};
