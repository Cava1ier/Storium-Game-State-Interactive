import React, { useState } from 'react';
import { AddIcon, DeleteIcon, EditIcon, SaveIcon, CancelIcon } from './Icons';
import { useGameContext } from '../hooks/useGameContext';

const CardsList: React.FC = () => {
  const { 
    cards, selectedCharacterId, openAddCardModal, handleDeleteCharacterCard,
    editingState, handleEditCard, handleSave, handleCancelEdit, handleEditingChange,
    allCards, allCardTypes,
  } = useGameContext();
  
  const [draggingCardId, setDraggingCardId] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <div className="p-1 max-h-48 overflow-y-auto">
        {cards.length === 0 ? (
          <p className="text-gray-500 italic px-2">No cards for selected character.</p>
        ) : (
          <ul className="space-y-2">
            {cards.map(({ characterCardId, card, cardType, count }) => {
              const isEditing = editingState?.type === 'character_card' && editingState.data.characterCardId === characterCardId;
              const hasCount = count > 0;
              const isDraggable = hasCount && !isEditing;

              return (
                <li
                  key={characterCardId}
                  draggable={isDraggable}
                  onDragStart={(e) => {
                    if (!isDraggable) return;
                    e.dataTransfer.setData('characterCardId', characterCardId.toString());
                    e.dataTransfer.effectAllowed = 'move';
                    setDraggingCardId(characterCardId);
                  }}
                  onDragEnd={() => setDraggingCardId(null)}
                  className={`group p-2 rounded-md shadow-sm border-l-4 relative transition-opacity ${!hasCount ? 'bg-gray-800 border-gray-600 opacity-60' : isEditing ? 'bg-yellow-900/30 border-yellow-500' : 'bg-gray-700 border-blue-500'} ${draggingCardId === characterCardId ? 'opacity-50' : 'opacity-100'} ${isDraggable ? 'cursor-grab' : 'cursor-default'}`}
                >
                  {isEditing && editingState.type === 'character_card' ? (
                    <div className="space-y-2">
                      <div>
                          <label className="block mb-1 text-xs font-medium text-gray-400">Card Name</label>
                          <select 
                              value={editingState.data.card_id} 
                              onChange={(e) => handleEditingChange('card_id', parseInt(e.target.value))}
                              className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                          >
                              {allCards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block mb-1 text-xs font-medium text-gray-400">Card Type</label>
                          <select 
                              value={editingState.data.card_type_id} 
                              onChange={(e) => handleEditingChange('card_type_id', parseInt(e.target.value))}
                              className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                          >
                              {allCardTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs font-medium text-gray-400">Count</label>
                          <input 
                              type="number"
                              value={editingState.data.count}
                              onChange={(e) => handleEditingChange('count', parseInt(e.target.value) || 0)}
                              className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                              min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{card.name}</span>
                          <span className="text-sm text-gray-400 font-bold">(x{count})</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">{card.desc}</div>
                      <div className="text-xs text-blue-400 font-mono mt-1">{cardType.name}</div>
                    </>
                  )}
                  
                  <div className="absolute top-1 right-1 flex items-center space-x-1">
                    {isEditing ? (
                      <>
                        <button onClick={handleSave} className="text-green-400 hover:text-white p-0.5" aria-label="Save card changes"><SaveIcon className="w-4 h-4" /></button>
                        <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white p-0.5" aria-label="Cancel editing"><CancelIcon className="w-4 h-4" /></button>
                      </>
                    ) : (
                      <>
                        <button 
                            onClick={() => handleEditCard(characterCardId)}
                            className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            aria-label={`Edit ${card.name}`}
                        >
                            <EditIcon className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDeleteCharacterCard(characterCardId)}
                            className="text-red-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            aria-label={`Delete ${card.name}`}
                        >
                            <DeleteIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="px-1">
        <button 
            onClick={openAddCardModal}
            disabled={!selectedCharacterId}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600/80 text-white text-xs rounded-md hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <AddIcon className="w-4 h-4" />
            <span>Add Card to Character</span>
        </button>
      </div>
    </div>
  );
};

export default CardsList;