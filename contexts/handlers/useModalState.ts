import { useState } from 'react';

export const useModalState = () => {
    const [isAddCardModalOpen, setAddCardModalOpen] = useState(false);
    const [isCreateCharacterModalOpen, setCreateCharacterModalOpen] = useState(false);

    const openAddCardModal = () => setAddCardModalOpen(true);
    const closeAddCardModal = () => setAddCardModalOpen(false);

    const openCreateCharacterModal = () => setCreateCharacterModalOpen(true);
    const closeCreateCharacterModal = () => setCreateCharacterModalOpen(false);

    return {
        isAddCardModalOpen,
        openAddCardModal,
        closeAddCardModal,
        isCreateCharacterModalOpen,
        openCreateCharacterModal,
        closeCreateCharacterModal,
    };
};
