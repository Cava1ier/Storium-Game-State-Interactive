import React from 'react';
import { GameStateProvider } from './contexts/GameStateContext';
import { useGameContext } from './hooks/useGameContext';
import CharactersTable from './components/CharactersTable';
import ChallengesTable from './components/ChallengesTable';
import CardsList from './components/CardsList';
import RawDataPanel from './components/RawDataPanel';
import PlayersTable from './components/PlayersTable';
import AddCardModal from './components/AddCardModal';
import { AddIcon, ChevronDownIcon } from './components/Icons';
import EditableHeader from './components/EditableHeader';
import CreateCharacterModal from './components/CreateCharacterModal';
import MasterCardsTable from './components/MasterCardsTable';

const AppUI: React.FC = () => {
    const {
        selectedSceneId,
        scenePips,
        handleAddCharacter,
        handleAddChallenge,
    } = useGameContext();
    const [isPremadeCardsOpen, setIsPremadeCardsOpen] = React.useState(true);
    
    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col">
            <AddCardModal />
            <CreateCharacterModal />
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto w-full">
                {/* Left Panel */}
                <div className="bg-gray-900/50 p-4 rounded-lg shadow-inner flex flex-col space-y-4">
                    <h2 className="text-xl font-bold text-gray-300">Live Game State (CRUD Tree)</h2>
                    <EditableHeader />
                    
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <button
                                    onClick={() => setIsPremadeCardsOpen(!isPremadeCardsOpen)}
                                    className="w-full flex justify-between items-center text-left hover:bg-gray-800/50 p-1 rounded-md"
                                    aria-expanded={isPremadeCardsOpen}
                                >
                                    <h3 className="font-semibold text-lg text-gray-300">Premade Cards</h3>
                                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isPremadeCardsOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                          {isPremadeCardsOpen && <MasterCardsTable />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-300 mb-2 px-1">Players</h3>
                          <PlayersTable />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2 px-1">
                                <h3 className="font-semibold text-lg text-gray-300">Characters</h3>
                                <button onClick={handleAddCharacter} className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition duration-150 disabled:opacity-50" disabled={!selectedSceneId}>
                                    <AddIcon className="w-4 h-4" />
                                    <span>Add</span>
                                </button>
                            </div>
                            <CharactersTable />
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg text-gray-300 mb-2 px-1">Cards</h3>
                            <CardsList />
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-2 px-1">
                                <div className="flex items-center space-x-4">
                                    <h3 className="font-semibold text-lg text-gray-300">Challenges</h3>
                                    {selectedSceneId && (
                                        <span 
                                            className="text-sm font-mono bg-gray-700/80 px-2 py-1 rounded-md text-gray-300"
                                            title={`This scene can support a total of ${scenePips.max} pips for its challenges. Currently, ${scenePips.used} pips are assigned.`}
                                        >
                                            Scene Pips Used: {scenePips.used} / {scenePips.max}
                                        </span>
                                    )}
                                </div>
                                <button onClick={handleAddChallenge} className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition duration-150 disabled:opacity-50" disabled={!selectedSceneId}>
                                    <AddIcon className="w-4 h-4" />
                                    <span>Add</span>
                                </button>
                            </div>
                            <ChallengesTable />
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <RawDataPanel />
            </main>
            <footer className="text-center py-4 mt-8 text-gray-500 text-sm">
                <p>Crafted by a Storium Dreamer with Gemini. May your stories be legendary.</p>
                <p className="mt-1">This project is ready for GitHub. Go share your creation with the world!</p>
            </footer>
        </div>
    );
};

const App: React.FC = () => (
    <GameStateProvider>
        <AppUI />
    </GameStateProvider>
);

export default App;