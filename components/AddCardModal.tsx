
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../hooks/useGameContext';
import { CancelIcon } from './Icons';

const AddCardModal: React.FC = () => {
    const { 
        isAddCardModalOpen, 
        closeAddCardModal, 
        allCards, 
        allCardTypes, 
        handleAddCardToCharacter,
        selectedCharacterId,
        characters,
        cards // existing cards for the character
    } = useGameContext();

    const [selectedCardId, setSelectedCardId] = useState<string>('');
    const [selectedCardTypeId, setSelectedCardTypeId] = useState<string>('');
    const [validationError, setValidationError] = useState<string | null>(null);
    
    const character = characters.find(c => c.id === selectedCharacterId);

    // Effect to reset state when modal opens
    useEffect(() => {
        if (isAddCardModalOpen) {
            setSelectedCardId('');
            setSelectedCardTypeId('');
            setValidationError(null);
        }
    }, [isAddCardModalOpen]);
    
    // Effect for validation
    useEffect(() => {
        if (selectedCardId && selectedCardTypeId) {
            const cardExists = cards.some(c => 
                c.card.id === parseInt(selectedCardId) && 
                c.cardType.id === parseInt(selectedCardTypeId)
            );
            if (cardExists) {
                setValidationError("This character already has this card. Please edit the existing card's count instead.");
            } else {
                setValidationError(null);
            }
        } else {
            setValidationError(null);
        }
    }, [selectedCardId, selectedCardTypeId, cards]);


    if (!isAddCardModalOpen || !character) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validationError || !selectedCardId || !selectedCardTypeId) {
            // This should not be triggerable if button is disabled, but is a safeguard.
            return;
        }
        handleAddCardToCharacter(parseInt(selectedCardId), parseInt(selectedCardTypeId));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 relative">
                <button onClick={closeAddCardModal} className="absolute top-3 right-3 text-gray-500 hover:text-white">
                    <CancelIcon />
                </button>
                <h2 className="text-xl font-bold mb-4 text-white">Add Card to {character.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="card-select" className="block mb-2 text-sm font-medium text-gray-300">Master Card</label>
                        <select
                            id="card-select"
                            value={selectedCardId}
                            onChange={(e) => setSelectedCardId(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="">Choose a card</option>
                            {allCards.map(card => (
                                <option key={card.id} value={card.id}>{card.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="card-type-select" className="block mb-2 text-sm font-medium text-gray-300">Card Type</label>
                        <select
                            id="card-type-select"
                            value={selectedCardTypeId}
                            onChange={(e) => setSelectedCardTypeId(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="">Choose a type</option>
                            {allCardTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>

                    {validationError && (
                        <div className="p-3 bg-red-900/50 border border-red-700 rounded-md">
                            <p className="text-sm text-red-300">{validationError}</p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            disabled={!!validationError || !selectedCardId || !selectedCardTypeId}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Card
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCardModal;
