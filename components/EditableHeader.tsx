import React from 'react';
import { AddIcon, DeleteIcon, EditIcon, SaveIcon, CancelIcon } from './Icons';
import { useGameContext } from '../hooks/useGameContext';

const EditableHeader: React.FC = () => {
    const { 
        games, acts, scenes, selectedGameId, selectedActId, selectedSceneId,
        handleGameChange, handleActChange, handleSceneChange,
        editingState, setEditingState, handleCancelEdit, handleSave, handleEditingChange,
        handleAddGame, handleDeleteGame, 
        handleAddAct, handleDeleteAct,
        handleAddScene, handleDeleteScene
    } = useGameContext();

    const selectedGame = games.find(g => g.id === selectedGameId);
    const selectedAct = acts.find(a => a.id === selectedActId);
    const selectedScene = scenes.find(s => s.id === selectedSceneId);
    
    const isEditingGame = editingState?.type === 'game';
    const isAddingGame = editingState?.type === 'new_game';

    const isEditingAct = editingState?.type === 'act';
    const isAddingAct = editingState?.type === 'new_act';

    const isEditingScene = editingState?.type === 'scene';
    const isAddingScene = editingState?.type === 'new_scene';

    const renderGameContent = () => {
        if (isEditingGame || isAddingGame) {
            const data = isAddingGame ? editingState.data : (editingState as any).data;
            return (
                <div className="flex-grow space-y-1">
                    <input 
                        type="text"
                        value={data.name}
                        onChange={(e) => handleEditingChange('name', e.target.value)}
                        placeholder="New Game Name"
                        className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
                        autoFocus
                    />
                    <textarea 
                        value={data.desc}
                        onChange={(e) => handleEditingChange('desc', e.target.value)}
                        placeholder="Description"
                        className="bg-gray-900 border border-gray-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
                        rows={2}
                    />
                </div>
            );
        }
        return (
            <div className="flex-grow">
                <select
                    value={selectedGameId ?? ''}
                    onChange={(e) => handleGameChange(e.target.value ? parseInt(e.target.value) : null)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
                >
                    <option value="">Select Game</option>
                    {games.map((game) => <option key={game.id} value={game.id}>{game.name}</option>)}
                </select>
                {selectedGame && <p className="text-sm text-gray-400 mt-1 pl-1">{selectedGame.desc}</p>}
            </div>
        );
    };

    const renderActContent = () => {
        if (isEditingAct || isAddingAct) {
            const data = isAddingAct ? editingState.data : (editingState as any).data;
            return (
                <div className="flex-grow space-y-1">
                    <input 
                        type="text"
                        value={data.name}
                        onChange={(e) => handleEditingChange('name', e.target.value)}
                        placeholder="New Act Name"
                        className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
                        autoFocus
                    />
                    <textarea 
                        value={data.desc}
                        onChange={(e) => handleEditingChange('desc', e.target.value)}
                        placeholder="Description"
                        className="bg-gray-900 border border-gray-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
                        rows={2}
                    />
                </div>
            );
        }
        return (
            <div className="flex-grow">
                <select
                    value={selectedActId ?? ''}
                    onChange={(e) => handleActChange(e.target.value ? parseInt(e.target.value) : null)}
                    disabled={!selectedGameId}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full disabled:opacity-50"
                >
                    <option value="">Select Act</option>
                    {acts.map((act) => <option key={act.id} value={act.id}>{act.name}</option>)}
                </select>
                {selectedAct && <p className="text-sm text-gray-400 mt-1 pl-1">{selectedAct.desc}</p>}
            </div>
        );
    };
    
    const renderSceneContent = () => {
        if (isEditingScene || isAddingScene) {
            const data = isAddingScene ? editingState.data : (editingState as any).data;
            return (
                <div className="flex-grow space-y-1">
                    <input 
                        type="text"
                        value={data.name}
                        onChange={(e) => handleEditingChange('name', e.target.value)}
                        placeholder="New Scene Name"
                        className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
                        autoFocus
                    />
                     <textarea 
                        value={data.desc}
                        onChange={(e) => handleEditingChange('desc', e.target.value)}
                        placeholder="Description"
                        className="bg-gray-900 border border-gray-600 text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full"
                        rows={2}
                    />
                </div>
            );
        }
        return (
            <div className="flex-grow">
                <select
                    value={selectedSceneId ?? ''}
                    onChange={(e) => handleSceneChange(e.target.value ? parseInt(e.target.value) : null)}
                    disabled={!selectedActId}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full disabled:opacity-50"
                >
                    <option value="">Select Scene</option>
                    {scenes.map((scene) => <option key={scene.id} value={scene.id}>{scene.name}</option>)}
                </select>
                {selectedScene && <p className="text-sm text-gray-400 mt-1 pl-1">{selectedScene.desc}</p>}
            </div>
        );
    };

    return (
        <div className="p-2 bg-gray-800/50 rounded-md space-y-4">
            {/* Game Section */}
            <div className="flex items-start space-x-2">
                <label className="font-semibold text-gray-400 w-16 pt-2">Game:</label>
                {renderGameContent()}
                <div className="flex items-center space-x-1 pt-1">
                    {isEditingGame || isAddingGame ? (
                        <>
                            <button onClick={handleSave} className="text-green-400 hover:text-white p-1"><SaveIcon /></button>
                            <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white p-1"><CancelIcon /></button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleAddGame} className="text-green-400 hover:text-white p-1"><AddIcon /></button>
                            {selectedGame && <button onClick={() => setEditingState({type: 'game', data: {...selectedGame}})} className="text-gray-400 hover:text-white p-1"><EditIcon /></button>}
                            {selectedGame && <button onClick={() => handleDeleteGame(selectedGame.id)} className="text-red-500 hover:text-red-400 p-1"><DeleteIcon /></button>}
                        </>
                    )}
                </div>
            </div>

            {/* Act Section */}
            <div className="flex items-start space-x-2">
                <label className="font-semibold text-gray-400 w-16 pt-2">Act:</label>
                {renderActContent()}
                <div className="flex items-center space-x-1 pt-1">
                    {isEditingAct || isAddingAct ? (
                        <>
                            <button onClick={handleSave} className="text-green-400 hover:text-white p-1"><SaveIcon /></button>
                            <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white p-1"><CancelIcon /></button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleAddAct} disabled={!selectedGameId} className="text-green-400 hover:text-white p-1 disabled:opacity-50"><AddIcon /></button>
                            {selectedAct && <button onClick={() => setEditingState({type: 'act', data: {...selectedAct}})} className="text-gray-400 hover:text-white p-1"><EditIcon /></button>}
                            {selectedAct && <button onClick={() => handleDeleteAct(selectedAct.id)} className="text-red-500 hover:text-red-400 p-1"><DeleteIcon /></button>}
                        </>
                    )}
                </div>
            </div>

            {/* Scene Section */}
            <div className="flex items-start space-x-2">
                <label className="font-semibold text-gray-400 w-16 pt-2">Scene:</label>
                {renderSceneContent()}
                <div className="flex items-center space-x-1 pt-1">
                    {isEditingScene || isAddingScene ? (
                        <>
                            <button onClick={handleSave} className="text-green-400 hover:text-white p-1"><SaveIcon /></button>
                            <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white p-1"><CancelIcon /></button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleAddScene} disabled={!selectedActId} className="text-green-400 hover:text-white p-1 disabled:opacity-50"><AddIcon /></button>
                            {selectedScene && <button onClick={() => setEditingState({type: 'scene', data: {...selectedScene}})} className="text-gray-400 hover:text-white p-1"><EditIcon /></button>}
                            {selectedScene && <button onClick={() => handleDeleteScene(selectedScene.id)} className="text-red-500 hover:text-red-400 p-1"><DeleteIcon /></button>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditableHeader;