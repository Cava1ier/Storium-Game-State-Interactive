import React, { useState, useMemo } from 'react';
import { Card } from '../types';
import { EditIcon, SaveIcon, CancelIcon, DeleteIcon, AddIcon, ChevronDownIcon } from './Icons';
import { useGameContext } from '../hooks/useGameContext';

const MasterCardsTable: React.FC = () => {
    const {
        allCards,
        allCardTypes,
        editingState,
        setEditingState,
        handleSave,
        handleCancelEdit,
        handleDeleteMasterCard,
        handleEditingChange,
        handleAddMasterCard
    } = useGameContext();

    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [filterTypeId, setFilterTypeId] = useState<string>('all');

    const editingCard = editingState?.type === 'card' ? editingState.data : null;
    const isAddingCard = editingState?.type === 'new_card';

    const groupedCards = useMemo(() => {
        const groups: Record<string, { name: string; cards: Card[] }> = {
            'uncategorized': { name: 'Uncategorized', cards: [] }
        };

        allCardTypes.forEach(ct => {
            groups[String(ct.id)] = { name: ct.name, cards: [] };
        });

        allCards.forEach(card => {
            const key = card.default_card_type_id !== null ? String(card.default_card_type_id) : 'uncategorized';
            if (groups[key]) {
                groups[key].cards.push(card);
            } else {
                groups['uncategorized'].cards.push(card);
            }
        });
        
        return Object.entries(groups)
            .map(([key, group]) => ({ key, ...group }))
            .filter(group => group.cards.length > 0 || group.key === 'uncategorized')
            .sort((a, b) => {
                if (a.name === 'Uncategorized') return 1;
                if (b.name === 'Uncategorized') return -1;
                return a.name.localeCompare(b.name);
            });
    }, [allCards, allCardTypes]);

    const filteredGroupedCards = useMemo(() => {
        if (filterTypeId === 'all') {
             // Show groups with cards, and always show Uncategorized
            return groupedCards.filter(g => g.cards.length > 0 || g.key === 'uncategorized');
        }
        return groupedCards.filter(group => group.key === filterTypeId);
    }, [groupedCards, filterTypeId]);

    const handleAccordionToggle = (key: string) => {
        setOpenAccordion(prev => (prev === key ? null : key));
    };

    const getTypeName = (typeId: number | null) => {
        if (typeId === null) return 'Uncategorized';
        return allCardTypes.find(ct => ct.id === typeId)?.name ?? 'Unknown';
    };

    const renderCardRow = (card: Card | null, isNew: boolean) => {
        const data = isNew && editingState?.type === 'new_card' ? editingState.data : editingCard;
        const isEditingThisRow = (isNew && isAddingCard) || (card && editingCard?.id === card.id);

        if (!isEditingThisRow && card) {
            return (
                 <tr key={card.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                    <td className="p-2 font-medium whitespace-nowrap">{card.id}</td>
                    <td className="p-2">{card.name}</td>
                    <td className="p-2 text-xs text-gray-400">{card.desc}</td>
                    <td className="p-2 text-xs text-gray-400">{getTypeName(card.default_card_type_id)}</td>
                    <td className="p-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${card.is_wild ? 'bg-purple-900 text-purple-300' : 'bg-gray-600 text-gray-300'}`}>
                            {card.is_wild ? 'Yes' : 'No'}
                        </span>
                    </td>
                    <td className="p-2">
                        <div className="flex justify-end items-center space-x-2">
                            <button onClick={() => setEditingState({ type: 'card', data: { ...card } })} className="text-gray-400 hover:text-white" aria-label={`Edit ${card.name}`}><EditIcon /></button>
                            <button onClick={() => handleDeleteMasterCard(card.id)} className="text-red-500 hover:text-red-400" aria-label={`Delete ${card.name}`}><DeleteIcon /></button>
                        </div>
                    </td>
                </tr>
            );
        }

        if (isEditingThisRow && data) {
            return (
                <tr className="border-b border-gray-700 bg-yellow-900/30">
                    <td className="p-2 font-medium whitespace-nowrap text-gray-500">{isNew ? '*' : card?.id}</td>
                    <td className="p-2">
                        <input type="text" value={data.name} onChange={(e) => handleEditingChange('name', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full" autoFocus />
                    </td>
                    <td className="p-2">
                        <input type="text" value={data.desc} onChange={(e) => handleEditingChange('desc', e.target.value)} className="bg-gray-800 p-1 rounded-md w-full" />
                    </td>
                     <td className="p-2">
                        <select value={data.default_card_type_id ?? ''} onChange={(e) => handleEditingChange('default_card_type_id', e.target.value ? parseInt(e.target.value, 10) : null)} className="bg-gray-800 p-1 rounded-md w-full text-sm">
                            <option value="">Uncategorized</option>
                            {allCardTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                        </select>
                    </td>
                    <td className="p-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={!!data.is_wild} 
                                onChange={(e) => handleEditingChange('is_wild', e.target.checked ? 1 : 0)} 
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </td>
                    <td className="p-2">
                        <div className="flex justify-end items-center space-x-2">
                            <button onClick={handleSave} className="text-green-400 hover:text-white" aria-label="Save changes"><SaveIcon /></button>
                            <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white" aria-label="Cancel editing"><CancelIcon /></button>
                        </div>
                    </td>
                </tr>
            );
        }
        return null;
    };

    return (
        <div className="space-y-2">
             <div className="flex justify-between items-end mb-2 gap-4">
                <div className="flex-grow">
                    <label htmlFor="card-type-filter" className="block text-sm font-medium text-gray-400 mb-1">Filter by Type</label>
                    <select
                        id="card-type-filter"
                        value={filterTypeId}
                        onChange={(e) => setFilterTypeId(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="all">All Types</option>
                        {allCardTypes.map(ct => (
                            <option key={ct.id} value={ct.id}>{ct.name}</option>
                        ))}
                        <option value="uncategorized">Uncategorized</option>
                    </select>
                </div>
                <button onClick={handleAddMasterCard} disabled={!!editingState} className="flex-shrink-0 flex items-center space-x-1 px-3 py-2 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition duration-150 disabled:opacity-50" aria-label="Add new premade card">
                    <AddIcon className="w-4 h-4" />
                    <span>Add Premade Card</span>
                </button>
            </div>

            {isAddingCard && (
                <div className="p-2 bg-gray-700/50 rounded-md">
                    <h4 className="text-md font-semibold text-gray-300 mb-2 px-1">Adding New Premade Card</h4>
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/80">
                            <tr>
                                <th scope="col" className="p-2">ID</th>
                                <th scope="col" className="p-2">Name</th>
                                <th scope="col" className="p-2">Description</th>
                                <th scope="col" className="p-2">Default Type</th>
                                <th scope="col" className="p-2">Wild</th>
                                <th scope="col" className="p-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderCardRow(null, true)}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="space-y-1">
                {filteredGroupedCards.map(({ key, name, cards }) => (
                    <div key={key} className="bg-gray-800/50 rounded-md overflow-hidden">
                        <button
                            onClick={() => handleAccordionToggle(key)}
                            className="w-full flex justify-between items-center p-2 text-left bg-gray-700 hover:bg-gray-600"
                            aria-expanded={openAccordion === key}
                        >
                            <span className="font-semibold text-gray-300">{name} ({cards.length})</span>
                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${openAccordion === key ? 'rotate-180' : ''}`} />
                        </button>
                        {openAccordion === key && (
                            <div className="p-2">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-300">
                                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                                            <tr>
                                                <th scope="col" className="p-2">ID</th>
                                                <th scope="col" className="p-2">Name</th>
                                                <th scope="col" className="p-2">Description</th>
                                                <th scope="col" className="p-2">Default Type</th>
                                                <th scope="col" className="p-2">Wild</th>
                                                <th scope="col" className="p-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cards.map(card => renderCardRow(card, false))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                 {filteredGroupedCards.length === 0 && filterTypeId !== 'all' && (
                    <div className="p-4 text-center text-gray-500">
                        No cards found for this type.
                    </div>
                 )}
            </div>
        </div>
    );
};

export default MasterCardsTable;