import { BaseCrudHandler } from './BaseCrudHandler';
import { Game, Scene, Character, Challenge, Card, CharacterCard, PlayedCard, PipsPerChallenge, Player, Act, NewCharacterPayload } from '../../types';

export class GameCRUDCreate extends BaseCrudHandler {
    createGame = (data: Omit<Game, 'id'>) => this.crud.create<Game>('tblGames', data);
    createAct = (gameId: number, data: Omit<Act, 'id' | 'game_id'>) => this.crud.create<Act>('tblActs', { ...data, game_id: gameId });
    createScene = (actId: number, data: Omit<Scene, 'id' | 'act_id'>) => this.crud.create<Scene>('tblScenes', { ...data, act_id: actId });
    createPlayer = (data: Omit<Player, 'id'>) => this.crud.create<Player>('tblPlayers', data);
    
    createCharacter = (gameId: number, sceneId: number, payload: NewCharacterPayload): Character => {
        const createOrGetCardId = (type: 'nature' | 'strength' | 'weakness' | 'subplot') => {
            const selectionType = payload[`${type}SelectionType`];
            if (selectionType === 'custom') {
                return this.scaffold.createCard({
                    name: payload[`${type}CardName`],
                    desc: payload[`${type}CardDesc`],
                    is_wild: 0,
                    default_card_type_id: this.scaffold.getCardTypeByName(type.charAt(0).toUpperCase() + type.slice(1))?.id ?? null
                }).id;
            }
            return payload[`${type}CardId`];
        };

        const newCharacter = this.crud.create<Character>('tblCharacters', { name: payload.name, status: payload.status, game_id: gameId, scene_id: sceneId });
        if (payload.playerId) this.scaffold.updateCharacterOwnership(newCharacter.id, payload.playerId);

        const cardMappings = [
            { typeName: 'Nature', cardId: createOrGetCardId('nature'), count: 2 },
            { typeName: 'Strength', cardId: createOrGetCardId('strength'), count: 2 },
            { typeName: 'Weakness', cardId: createOrGetCardId('weakness'), count: 1 },
            { typeName: 'Subplot', cardId: createOrGetCardId('subplot'), count: 3 },
            { typeName: 'Wild(Str)', cardName: 'Unnamed Wild (Strength)', count: 2 },
            { typeName: 'Wild(Weak)', cardName: 'Unnamed Wild (Weakness)', count: 2 },
        ];
        
        for (const mapping of cardMappings) {
            const cardType = this.scaffold.getCardTypeByName(mapping.typeName);
            let cardId = mapping.cardId;
            if (mapping.cardName) {
                cardId = this.scaffold.getCardByName(mapping.cardName)?.id;
            }

            if (cardType && cardId) {
                this.scaffold.addCardToCharacter(newCharacter.id, { card_id: cardId, card_type_id: cardType.id, count: mapping.count });
            }
        }
        return newCharacter;
    }

    createChallenge = (sceneId: number, data: Omit<Challenge & { pips: number }, 'id' | 'scene_id'>): Challenge => {
        const { pips, ...challengeData } = data;
        this.validatePips(sceneId, pips, 0);
        const newChallenge = this.crud.create<Challenge>('tblChallenges', { ...challengeData, scene_id: sceneId });
        this.createPipsForChallenge(newChallenge.id, pips);
        return newChallenge;
    }

    private validatePips(sceneId: number, newPips: number, oldPips: number) {
        const maxPips = this.scaffold.getSceneMaxPips(sceneId);
        const currentPips = this.scaffold.getCurrentScenePipsUsed(sceneId);
        const newTotal = currentPips - oldPips + newPips;
        
        if (newTotal > maxPips) throw new Error(`Cannot set pips. Scene pip limit exceeded. Available: ${maxPips - (currentPips - oldPips)}, Tried to set to: ${newPips}.`);
        const challengeMaxPips = Math.min(9, maxPips);
        if (newPips > challengeMaxPips) throw new Error(`Challenge pips (${newPips}) cannot exceed the maximum of ${challengeMaxPips}.`);
    }

    createCard = (data: Omit<Card, 'id'>) => this.crud.create<Card>('tblCards', data);
    
    addCardToCharacter = (characterId: number, data: Omit<CharacterCard, 'id' | 'character_id'>) => {
        const existing = this.crud.readAll<CharacterCard>('tblCardsWTypesWCharacter', { character_id: characterId, card_id: data.card_id, card_type_id: data.card_type_id })[0];
        if (existing) this.scaffold.updateCharacterCard(existing.id, { count: existing.count + data.count });
        else this.crud.create<CharacterCard>('tblCardsWTypesWCharacter', { ...data, character_id: characterId });
    }

    playCardOnChallenge = (challengeId: number, characterCardId: number) => {
        const charCard = this.crud.get<CharacterCard>('tblCardsWTypesWCharacter', characterCardId);
        if (!charCard) throw new Error("Character card not found.");
        if (charCard.count <= 0) throw new Error("This card is out of uses.");
        if (this.scaffold.getPlayedCardsForChallenge(challengeId).length >= this.scaffold.getPipsForChallenge(challengeId)) throw new Error("This challenge is full.");
        
        this.scaffold.updateCharacterCard(characterCardId, { count: charCard.count - 1 });
        this.crud.create<PlayedCard>('tblCardsPlayedOnChallenges', { challenge_id: challengeId, CharacterwCards_id: characterCardId });
    }
    
    createPipsForChallenge = (challengeId: number, pips: number) => this.crud.create<PipsPerChallenge>('tblPipsperChallenge', { challenge_id: challengeId, pips });
}
