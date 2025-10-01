import React, { useState, useEffect } from 'react';
import { useGameContext } from '../hooks/useGameContext';
import { NewCharacterPayload, Card, CardType } from '../types';
import { CancelIcon } from './Icons';

const CardSelector: React.FC<{
    cardType: string;
    selectionType: 'premade' | 'custom';
    onSelectionTypeChange: (type: 'premade' | 'custom') => void;
    premadeId: number;
    onPremadeIdChange: (id: number) => void;
    customName: string;
    onCustomNameChange: (name: string) => void;
    customDesc: string;
    onCustomDescChange: (desc: string) => void;
    allCards: Card[];
    allCardTypes: CardType[];
    count: number;
}> = ({ cardType, selectionType, onSelectionTypeChange, premadeId, onPremadeIdChange, customName, onCustomNameChange, customDesc, onCustomDescChange, allCards, allCardTypes, count }) => {
    const fieldId = cardType.toLowerCase();
    
    const relevantCardTypeId = allCardTypes.find(ct => ct.name === cardType)?.id;
    
    const filteredPremadeCards = allCards.filter(c => 
        !c.is_wild && 
        (c.default_card_type_id === relevantCardTypeId || c.default_card_type_id === null)
    );

    return (
        <fieldset className="p-4 border border-gray-600 rounded-md">
            <legend className="px-2 text-lg font-semibold text-gray-300">{cardType} Card (x{count})</legend>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <input id={`${fieldId}-premade`} name={`${fieldId}-type`} type="radio" checked={selectionType === 'premade'} onChange={() => onSelectionTypeChange('premade')} className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500" />
                        <label htmlFor={`${fieldId}-premade`} className="ml-2 text-sm font-medium text-gray-300">Select Premade</label>
                    </div>
                    <div className="flex items-center">
                        <input id={`${fieldId}-custom`} name={`${fieldId}-type`} type="radio" checked={selectionType === 'custom'} onChange={() => onSelectionTypeChange('custom')} className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500" />
                        <label htmlFor={`${fieldId}-custom`} className="ml-2 text-sm font-medium text-gray-300">Create Custom</label>
                    </div>
                </div>

                {selectionType === 'premade' ? (
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">Premade {cardType} *</label>
                        <select value={premadeId} onChange={e => onPremadeIdChange(parseInt(e.target.value))} className="bg-gray-700 p-2 rounded-md w-full">
                            <option value={0}>Choose a {cardType}</option>
                            {filteredPremadeCards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Custom {cardType} Name *</label>
                            <input type="text" value={customName} onChange={e => onCustomNameChange(e.target.value)} placeholder={`e.g., 'A Trusty Old Friend'`} className="bg-gray-700 p-2 rounded-md w-full" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Custom {cardType} Description</label>
                            <textarea value={customDesc} onChange={e => onCustomDescChange(e.target.value)} placeholder="A short description." className="bg-gray-700 p-2 rounded-md w-full" rows={2}></textarea>
                        </div>
                    </div>
                )}
            </div>
        </fieldset>
    );
};

const CreateCharacterModal: React.FC = () => {
    const {
        isCreateCharacterModalOpen,
        closeCreateCharacterModal,
        handleCreateCharacter,
        players,
        allCards,
        allCardTypes
    } = useGameContext();

    const initialPayload: Omit<NewCharacterPayload, 'playerId'> & { playerId: string } = {
        name: '',
        status: 'Active' as 'Active' | 'Idle',
        playerId: '',
        natureSelectionType: 'premade' as 'premade' | 'custom',
        natureCardId: 0,
        natureCardName: '',
        natureCardDesc: '',
        natureCardCount: 2,
        strengthSelectionType: 'premade' as 'premade' | 'custom',
        strengthCardId: 0,
        strengthCardName: '',
        strengthCardDesc: '',
        strengthCardCount: 2,
        weaknessSelectionType: 'premade' as 'premade' | 'custom',
        weaknessCardId: 0,
        weaknessCardName: '',
        weaknessCardDesc: '',
        weaknessCardCount: 1,
        subplotSelectionType: 'premade' as 'premade' | 'custom',
        subplotCardId: 0,
        subplotCardName: '',
        subplotCardDesc: '',
        subplotCardCount: 3,
    };
    
    const [payload, setPayload] = useState(initialPayload);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isCreateCharacterModalOpen) {
            setPayload(initialPayload);
            setError(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCreateCharacterModalOpen]);

    const handleChange = (field: keyof typeof payload, value: string | number | 'premade' | 'custom') => {
        setPayload(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, natureSelectionType, strengthSelectionType, weaknessSelectionType, subplotSelectionType } = payload;
        
        let valid = true;
        if (!name.trim()) valid = false;
        if (natureSelectionType === 'premade' && !payload.natureCardId) valid = false;
        if (natureSelectionType === 'custom' && !payload.natureCardName.trim()) valid = false;
        if (strengthSelectionType === 'premade' && !payload.strengthCardId) valid = false;
        if (strengthSelectionType === 'custom' && !payload.strengthCardName.trim()) valid = false;
        if (weaknessSelectionType === 'premade' && !payload.weaknessCardId) valid = false;
        if (weaknessSelectionType === 'custom' && !payload.weaknessCardName.trim()) valid = false;
        if (subplotSelectionType === 'premade' && !payload.subplotCardId) valid = false;
        if (subplotSelectionType === 'custom' && !payload.subplotCardName.trim()) valid = false;

        if (!valid) {
            setError("All fields marked with * are required.");
            return;
        }
        setError(null);

        const finalPayload: NewCharacterPayload = {
            ...payload,
            playerId: payload.playerId ? parseInt(payload.playerId) : null,
        };

        handleCreateCharacter(finalPayload);
    };

    if (!isCreateCharacterModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 relative max-h-[90vh] overflow-y-auto">
                <button onClick={closeCreateCharacterModal} className="absolute top-3 right-3 text-gray-500 hover:text-white">
                    <CancelIcon />
                </button>
                <h2 className="text-xl font-bold mb-4 text-white">Create New Character</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Character Details */}
                    <fieldset className="p-4 border border-gray-600 rounded-md">
                        <legend className="px-2 text-lg font-semibold text-gray-300">Character Details</legend>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Name *</label>
                                <input type="text" value={payload.name} onChange={e => handleChange('name', e.target.value)} className="bg-gray-700 p-2 rounded-md w-full" autoFocus />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Player</label>
                                    <select value={payload.playerId} onChange={e => handleChange('playerId', e.target.value)} className="bg-gray-700 p-2 rounded-md w-full">
                                        <option value="">N/A</option>
                                        {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Status</label>
                                    <select value={payload.status} onChange={e => handleChange('status', e.target.value)} className="bg-gray-700 p-2 rounded-md w-full">
                                        <option>Active</option>
                                        <option>Idle</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <CardSelector 
                        cardType="Nature"
                        selectionType={payload.natureSelectionType}
                        onSelectionTypeChange={(type) => handleChange('natureSelectionType', type)}
                        premadeId={payload.natureCardId}
                        onPremadeIdChange={(id) => handleChange('natureCardId', id)}
                        customName={payload.natureCardName}
                        onCustomNameChange={(name) => handleChange('natureCardName', name)}
                        customDesc={payload.natureCardDesc}
                        onCustomDescChange={(desc) => handleChange('natureCardDesc', desc)}
                        allCards={allCards}
                        allCardTypes={allCardTypes}
                        count={payload.natureCardCount}
                    />
                    
                    <CardSelector 
                        cardType="Strength"
                        selectionType={payload.strengthSelectionType}
                        onSelectionTypeChange={(type) => handleChange('strengthSelectionType', type)}
                        premadeId={payload.strengthCardId}
                        onPremadeIdChange={(id) => handleChange('strengthCardId', id)}
                        customName={payload.strengthCardName}
                        onCustomNameChange={(name) => handleChange('strengthCardName', name)}
                        customDesc={payload.strengthCardDesc}
                        onCustomDescChange={(desc) => handleChange('strengthCardDesc', desc)}
                        allCards={allCards}
                        allCardTypes={allCardTypes}
                        count={payload.strengthCardCount}
                    />

                    <CardSelector 
                        cardType="Weakness"
                        selectionType={payload.weaknessSelectionType}
                        onSelectionTypeChange={(type) => handleChange('weaknessSelectionType', type)}
                        premadeId={payload.weaknessCardId}
                        onPremadeIdChange={(id) => handleChange('weaknessCardId', id)}
                        customName={payload.weaknessCardName}
                        onCustomNameChange={(name) => handleChange('weaknessCardName', name)}
                        customDesc={payload.weaknessCardDesc}
                        onCustomDescChange={(desc) => handleChange('weaknessCardDesc', desc)}
                        allCards={allCards}
                        allCardTypes={allCardTypes}
                        count={payload.weaknessCardCount}
                    />
                    
                    <CardSelector 
                        cardType="Subplot"
                        selectionType={payload.subplotSelectionType}
                        onSelectionTypeChange={(type) => handleChange('subplotSelectionType', type)}
                        premadeId={payload.subplotCardId}
                        onPremadeIdChange={(id) => handleChange('subplotCardId', id)}
                        customName={payload.subplotCardName}
                        onCustomNameChange={(name) => handleChange('subplotCardName', name)}
                        customDesc={payload.subplotCardDesc}
                        onCustomDescChange={(desc) => handleChange('subplotCardDesc', desc)}
                        allCards={allCards}
                        allCardTypes={allCardTypes}
                        count={payload.subplotCardCount}
                    />
                    
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <div className="flex justify-end space-x-4 pt-2">
                        <button type="button" onClick={closeCreateCharacterModal} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Character</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCharacterModal;