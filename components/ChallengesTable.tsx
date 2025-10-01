
import React from 'react';
import { Challenge, CardType } from '../types';
import { EditIcon, SaveIcon, CancelIcon, DeleteIcon, PipIcon } from './Icons';
import { useGameContext } from '../hooks/useGameContext';

const ChallengesTable: React.FC = () => {
    const {
        scaffold,
        challenges,
        selectedChallengeId,
        editingState,
        handleSelectChallenge,
        handleEditChallenge,
        handleSave,
        handleCancelEdit,
        handleDeleteChallenge,
        handleEditingChange,
        scenePips,
        selectedCharacterId,
        handlePlayCardOnChallenge,
        handleRemoveCardFromChallenge,
    } = useGameContext();

    const [pipsError, setPipsError] = React.useState<string | null>(null);
    const [dragOverChallengeId, setDragOverChallengeId] = React.useState<number | null>(null);
    const originalPipsRef = React.useRef<number>(0);
    
    const getPipStrength = (cardType: CardType): 'strong' | 'weak' => {
        const weakTypes = [2, 8]; // Weakness, Wild(Weak)
        return weakTypes.includes(cardType.id) ? 'weak' : 'strong';
    };

    const PipsDisplay: React.FC<{challengeId: number}> = ({ challengeId }) => {
        const maxPips = scaffold.getPipsForChallenge(challengeId);
        const playedCards = scaffold.getPlayedCardsForChallenge(challengeId);
        const pips: ('strong' | 'weak' | 'empty')[] = Array(maxPips).fill('empty');
        
        playedCards.slice(0, maxPips).forEach((playedCard, index) => {
            pips[index] = getPipStrength(playedCard.cardType);
        });
        
        return (
            <div>
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1 items-center">
                        {pips.map((pip, index) => <PipIcon key={index} strength={pip} />)}
                    </div>
                    <span className="text-xs text-gray-400 font-mono">({playedCards.length}/{maxPips})</span>
                </div>
                {playedCards.length > 0 && (
                    <ul className="mt-2 space-y-1">
                        {playedCards.map(played => (
                            <li key={played.playedCardId} className="group flex items-center justify-between text-xs bg-gray-900/50 p-1 rounded-md">
                                <span className="truncate" title={`${played.card.name} (${played.cardType.name})`}>
                                    {played.card.name} <span className="text-gray-500">({played.cardType.name})</span>
                                </span>
                                <button
                                    onClick={() => handleRemoveCardFromChallenge(played.playedCardId)}
                                    className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                                    aria-label={`Remove ${played.card.name}`}
                                >
                                    <CancelIcon className="w-3 h-3" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    const validatePips = React.useCallback((currentPipsInput: number) => {
        const pipsUsedByOthers = scenePips.used - originalPipsRef.current;
        const pipsAvailableInScene = scenePips.max - pipsUsedByOthers;

        let error = null;
        if (currentPipsInput < 1) {
          error = "Pips must be 1 or more.";
        } else if (currentPipsInput > 9) {
          error = "A challenge cannot have more than 9 pips.";
        } else if (currentPipsInput > pipsAvailableInScene) {
          error = `Exceeds scene limit. ${pipsAvailableInScene} pips available.`;
        }
        setPipsError(error);
    }, [scenePips.used, scenePips.max]);

    const editingItemId = React.useMemo(() => {
        if (!editingState) {
            return undefined;
        }
        switch (editingState.type) {
            case 'game':
            case 'act':
            case 'scene':
            case 'character':
            case 'challenge':
            case 'player':
                return editingState.data.id;
            default:
                return undefined;
        }
    }, [editingState]);

    React.useEffect(() => {
      if (editingState?.type === 'challenge') {
          originalPipsRef.current = editingState.data.pips;
          validatePips(editingState.data.pips);
      } else if (editingState?.type === 'new_challenge') {
          originalPipsRef.current = 0;
          validatePips(editingState.data.pips);
      } else {
          setPipsError(null);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingState?.type, editingItemId, validatePips]);


    const handlePipsInputChange = (value: string) => {
        if (!/^\d*$/.test(value)) return;
        const num = value === '' ? 0 : parseInt(value, 10);
        validatePips(num);
        handleEditingChange('pips', num);
    };

    const editingChallenge = editingState?.type === 'challenge' ? editingState.data : null;
    const isAddingChallenge = editingState?.type === 'new_challenge';

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
          <tr>
            <th scope="col" className="p-2 w-10">Sel</th>
            <th scope="col" className="p-2 w-10">ID</th>
            <th scope="col" className="p-2">Name</th>
            <th scope="col" className="p-2 w-48">Pips</th>
            <th scope="col" className="p-2">Strong Outcome</th>
            <th scope="col" className="p-2">Weak Outcome</th>
            <th scope="col" className="p-2 text-right w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isAddingChallenge && (
             <tr className="border-b border-gray-700 bg-yellow-900/30">
               <td className="p-2">-</td>
               <td className="p-2 font-medium whitespace-nowrap text-gray-500">*</td>
               <td className="p-2">
                 <input type="text" value={editingState.data.name} onChange={(e) => handleEditingChange('name', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full" autoFocus />
               </td>
               <td className="p-2 align-top">
                 <div className="flex flex-col">
                    <input 
                        type="text"
                        value={editingState.data.pips === 0 ? '' : editingState.data.pips}
                        onChange={(e) => handlePipsInputChange(e.target.value)} 
                        className={`bg-gray-800 p-1 rounded-md w-16 ${pipsError ? 'border border-red-500' : 'border border-transparent'}`}
                        pattern="\d*"
                    />
                    {pipsError && <span className="text-xs text-red-400 mt-1">{pipsError}</span>}
                 </div>
               </td>
               <td className="p-2">
                 <input type="text" value={editingState.data.strong_outcome} onChange={(e) => handleEditingChange('strong_outcome', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full" />
               </td>
               <td className="p-2">
                 <input type="text" value={editingState.data.weak_outcome} onChange={(e) => handleEditingChange('weak_outcome', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full" />
               </td>
               <td className="p-2">
                 <div className="flex justify-end items-center space-x-2">
                   <button onClick={handleSave} disabled={!!pipsError} className="text-green-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Save new challenge"><SaveIcon /></button>
                   <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white" aria-label="Cancel adding challenge"><CancelIcon /></button>
                 </div>
               </td>
             </tr>
          )}
          {challenges.map((challenge) => {
              const isEditing = editingChallenge?.id === challenge.id;
              const playedCardsCount = scaffold.getPlayedCardsForChallenge(challenge.id).length;
              const maxPips = scaffold.getPipsForChallenge(challenge.id);
              const isChallengeFull = playedCardsCount >= maxPips;
              const isDropTarget = !isChallengeFull && !!selectedCharacterId;

              return (
                <tr
                  key={challenge.id}
                  onDragOver={(e) => {
                    if (isDropTarget) e.preventDefault();
                  }}
                  onDragEnter={() => {
                      if(isDropTarget) setDragOverChallengeId(challenge.id);
                  }}
                  onDragLeave={() => setDragOverChallengeId(null)}
                  onDrop={(e) => {
                      if (!isDropTarget) return;
                      e.preventDefault();
                      setDragOverChallengeId(null);
                      const characterCardId = e.dataTransfer.getData('characterCardId');
                      if (characterCardId) {
                          handlePlayCardOnChallenge(challenge.id, parseInt(characterCardId, 10));
                      }
                  }}
                  className={`border-b border-gray-700 hover:bg-gray-600/50 ${selectedChallengeId === challenge.id ? 'bg-blue-900/50' : ''} ${isEditing ? 'bg-yellow-900/30' : ''} ${dragOverChallengeId === challenge.id ? 'bg-green-900/50 ring-2 ring-inset ring-green-400' : ''} transition-all duration-150`}
                >
                  <td className="p-2">
                    <input
                      type="radio"
                      name="challenge-select"
                      checked={selectedChallengeId === challenge.id}
                      onChange={() => handleSelectChallenge(challenge.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
                    />
                  </td>
                  <td className="p-2 font-medium whitespace-nowrap">{challenge.id}</td>
                  <td className="p-2">
                      {isEditing ? <input type="text" value={editingChallenge?.name ?? ''} onChange={(e) => handleEditingChange('name', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full" /> : challenge.name}
                  </td>
                  <td className="p-2 align-top">
                      {isEditing ? (
                          <div className="flex flex-col">
                              <input
                                  type="text"
                                  value={editingChallenge?.pips === 0 ? '' : editingChallenge?.pips}
                                  onChange={(e) => handlePipsInputChange(e.target.value)}
                                  className={`bg-gray-800 p-1 rounded-md w-16 ${pipsError ? 'border border-red-500' : 'border border-transparent'}`}
                                  pattern="\d*"
                              />
                              {pipsError && <span className="text-xs text-red-400 mt-1">{pipsError}</span>}
                          </div>
                      ) : (
                          <PipsDisplay challengeId={challenge.id} />
                      )}
                  </td>
                  <td className="p-2 text-xs text-gray-400">
                    {isEditing ? <input type="text" value={editingChallenge?.strong_outcome ?? ''} onChange={(e) => handleEditingChange('strong_outcome', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full" /> : challenge.strong_outcome}
                  </td>
                  <td className="p-2 text-xs text-gray-400">
                    {isEditing ? <input type="text" value={editingChallenge?.weak_outcome ?? ''} onChange={(e) => handleEditingChange('weak_outcome', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full" /> : challenge.weak_outcome}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-end items-center space-x-2">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} disabled={!!pipsError} className="text-green-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Save changes"><SaveIcon /></button>
                                <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white" aria-label="Cancel editing"><CancelIcon /></button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleEditChallenge(challenge)} className="text-gray-400 hover:text-white p-1" aria-label={`Edit ${challenge.name}`}><EditIcon /></button>
                                <button onClick={() => handleDeleteChallenge(challenge.id)} className="text-red-500 hover:text-red-400 p-1" aria-label={`Delete ${challenge.name}`}><DeleteIcon /></button>
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

export default ChallengesTable;
