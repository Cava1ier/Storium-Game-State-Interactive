import React from 'react';
import { Character } from '../types';
import { EditIcon, SaveIcon, CancelIcon, DeleteIcon } from './Icons';
import { useGameContext } from '../hooks/useGameContext';

const CharactersTable: React.FC = () => {
    const {
        characters,
        players,
        ownerships,
        selectedCharacterId,
        editingState,
        handleSelectCharacter,
        setEditingState,
        handleSave,
        handleCancelEdit,
        handleDeleteCharacter,
        handleEditingChange
    } = useGameContext();

    const getPlayerForCharacter = (characterId: number) => {
        const ownership = ownerships.find(o => o.character_id === characterId);
        if (!ownership) return undefined;
        return players.find(p => p.id === ownership.player_id);
    };

    const editingCharacter = editingState?.type === 'character' ? editingState.data : null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
          <tr>
            <th scope="col" className="p-2">Sel</th>
            <th scope="col" className="p-2">ID</th>
            <th scope="col" className="p-2">Name</th>
            <th scope="col" className="p-2">Player</th>
            <th scope="col" className="p-2">Status</th>
            <th scope="col" className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters.map((char) => {
            const isEditing = editingCharacter?.id === char.id;
            const player = getPlayerForCharacter(char.id);
            return (
              <tr
                key={char.id}
                className={`border-b border-gray-700 hover:bg-gray-600/50 ${selectedCharacterId === char.id ? 'bg-blue-900/50' : ''} ${isEditing ? 'bg-yellow-900/30' : ''}`}
              >
                <td className="p-2">
                  <input
                    type="radio"
                    name="character-select"
                    checked={selectedCharacterId === char.id}
                    onChange={() => handleSelectCharacter(char.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
                  />
                </td>
                <td className="p-2 font-medium whitespace-nowrap">{char.id}</td>
                <td className="p-2">
                    {isEditing ? (
                        <input type="text" value={editingCharacter?.name ?? ''} onChange={(e) => handleEditingChange('name', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full" />
                    ) : (
                        char.name
                    )}
                </td>
                <td className="p-2 text-gray-400">
                  {isEditing ? (
                    <select value={editingCharacter?.playerId ?? ''} onChange={(e) => handleEditingChange('playerId', e.target.value ? parseInt(e.target.value) : null)} className="bg-gray-800 p-1 rounded-md w-full">
                      <option value="">N/A</option>
                      {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  ) : (
                    player?.name ?? 'N/A'
                  )}
                </td>
                <td className="p-2">
                    {isEditing ? (
                        <select value={editingCharacter?.status ?? 'Active'} onChange={(e) => handleEditingChange('status', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full">
                            <option>Active</option>
                            <option>Idle</option>
                        </select>
                    ) : (
                        <span className={`px-2 py-1 text-xs rounded-full ${char.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {char.status}
                        </span>
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
                            <button onClick={() => setEditingState({ type: 'character', data: {...char, playerId: player?.id ?? null }})} className="text-gray-400 hover:text-white" aria-label={`Edit ${char.name}`}><EditIcon /></button>
                            <button onClick={() => handleDeleteCharacter(char.id)} className="text-red-500 hover:text-red-400" aria-label={`Delete ${char.name}`}><DeleteIcon /></button>
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

export default CharactersTable;