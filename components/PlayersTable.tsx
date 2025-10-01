
import React from 'react';
import { EditIcon, SaveIcon, CancelIcon, DeleteIcon, AddIcon } from './Icons';
import { useGameContext } from '../hooks/useGameContext';

const PlayersTable: React.FC = () => {
    const {
        players,
        editingState,
        setEditingState,
        handleSave,
        handleCancelEdit,
        handleDeletePlayer,
        handleEditingChange,
        handleAddPlayer
    } = useGameContext();

    const editingPlayer = editingState?.type === 'player' ? editingState.data : null;
    const isAddingPlayer = editingState?.type === 'new_player';

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                    <tr>
                        <th scope="col" className="p-2">ID</th>
                        <th scope="col" className="p-2">Name</th>
                        <th scope="col" className="p-2 text-right">
                            <button onClick={handleAddPlayer} disabled={!!editingState} className="flex items-center space-x-1 text-green-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Add new player">
                                <AddIcon className="w-4 h-4" />
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isAddingPlayer && (
                         <tr className="border-b border-gray-700 bg-yellow-900/30">
                            <td className="p-2 font-medium whitespace-nowrap text-gray-500">*</td>
                            <td className="p-2">
                                <input 
                                    type="text" 
                                    value={editingState.data.name} 
                                    onChange={(e) => handleEditingChange('name', e.target.value)} 
                                    className="bg-gray-800 p-1 rounded-md w-full"
                                    placeholder="Enter new player name"
                                    autoFocus
                                />
                            </td>
                            <td className="p-2">
                                <div className="flex justify-end items-center space-x-2">
                                    <button onClick={handleSave} className="text-green-400 hover:text-white" aria-label="Save new player"><SaveIcon /></button>
                                    <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white" aria-label="Cancel adding player"><CancelIcon /></button>
                                </div>
                            </td>
                        </tr>
                    )}
                    {players.map((player) => {
                        const isEditing = editingPlayer?.id === player.id;
                        return (
                            <tr
                                key={player.id}
                                className={`border-b border-gray-700 hover:bg-gray-600/50 ${isEditing ? 'bg-yellow-900/30' : ''}`}
                            >
                                <td className="p-2 font-medium whitespace-nowrap">{player.id}</td>
                                <td className="p-2">
                                    {isEditing ? (
                                        <input type="text" value={editingPlayer?.name ?? ''} onChange={(e) => handleEditingChange('name', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full" />
                                    ) : (
                                        player.name
                                    )}
                                </td>
                                <td className="p-2">
                                    <div className="flex justify-end items-center space-x-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={handleSave} className="text-green-400 hover:text-white" aria-label="Save changes"><SaveIcon /></button>
                                                <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white" aria-label="Cancel editing"><CancelIcon /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => setEditingState({ type: 'player', data: { ...player } })} className="text-gray-400 hover:text-white" aria-label={`Edit ${player.name}`}><EditIcon /></button>
                                                <button onClick={() => handleDeletePlayer(player.id)} className="text-red-500 hover:text-red-400" aria-label={`Delete ${player.name}`}><DeleteIcon /></button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PlayersTable;