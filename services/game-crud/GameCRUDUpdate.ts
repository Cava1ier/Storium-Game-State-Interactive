import { BaseCrudHandler } from './BaseCrudHandler';
import { Game, Scene, Character, Challenge, Card, CharacterCard, Player, Act, PlayerCharacterOwnership, PipsPerChallenge } from '../../types';

export class GameCRUDUpdate extends BaseCrudHandler {
    updateGame = (id: number, data: Partial<Game>) => this.crud.update<Game>('tblGames', id, data);
    updateAct = (id: number, data: Partial<Act>) => this.crud.update<Act>('tblActs', id, data);
    updateScene = (id: number, data: Partial<Scene>) => this.crud.update<Scene>('tblScenes', id, data);
    updatePlayer = (id: number, data: Partial<Player>) => this.crud.update<Player>('tblPlayers', id, data);
    updateCharacter = (id: number, data: Partial<Character>) => this.crud.update<Character>('tblCharacters', id, data);

    updateChallenge = (id: number, data: Partial<Challenge & { pips: number }>) => {
        const { pips, ...challengeData } = data;
        const challenge = this.crud.get<Challenge>('tblChallenges', id);
        if (!challenge) return;

        if (typeof pips === 'number') {
            const oldPips = this.scaffold.getPipsForChallenge(id);
            this.validatePips(challenge.scene_id, pips, oldPips);
            this.updatePipsForChallenge(id, pips);
        }
        this.crud.update<Challenge>('tblChallenges', id, challengeData);
    }

    private validatePips(sceneId: number, newPips: number, oldPips: number) {
        const maxPips = this.scaffold.getSceneMaxPips(sceneId);
        const currentPips = this.scaffold.getCurrentScenePipsUsed(sceneId);
        const newTotal = currentPips - oldPips + newPips;
        
        if (newTotal > maxPips) throw new Error(`Cannot set pips. Scene pip limit exceeded. Available: ${maxPips - (currentPips - oldPips)}, Tried to set to: ${newPips}.`);
        const challengeMaxPips = Math.min(9, maxPips);
        if (newPips > challengeMaxPips) throw new Error(`Challenge pips (${newPips}) cannot exceed the maximum of ${challengeMaxPips}.`);
    }

    updateCard = (id: number, data: Partial<Card>) => this.crud.update<Card>('tblCards', id, data);

    updateCharacterCard = (id: number, data: Partial<CharacterCard>) => {
        const cardToUpdate = this.crud.get<CharacterCard>('tblCardsWTypesWCharacter', id);
        if (!cardToUpdate) return;
        
        const existing = this.crud.readAll<CharacterCard>('tblCardsWTypesWCharacter', { 
            character_id: cardToUpdate.character_id, 
            card_id: data.card_id ?? cardToUpdate.card_id, 
            card_type_id: data.card_type_id ?? cardToUpdate.card_type_id 
        }).find(c => c.id !== id);

        if (existing) {
            this.updateCharacterCard(existing.id, { count: existing.count + (data.count ?? cardToUpdate.count) });
            this.crud.delete('tblCardsWTypesWCharacter', id);
        } else {
            this.crud.update<CharacterCard>('tblCardsWTypesWCharacter', id, data);
        }
    }

    updateCharacterOwnership = (characterId: number, playerId: number | null) => {
        const existing = this.crud.readAll<PlayerCharacterOwnership>('tblPlayersCharactersOwnership', { character_id: characterId })[0];
        if (playerId === null || playerId === undefined) {
            if (existing) this.crud.delete('tblPlayersCharactersOwnership', existing.id);
        } else {
            if (existing) this.crud.update<PlayerCharacterOwnership>('tblPlayersCharactersOwnership', existing.id, { player_id: playerId });
            else this.crud.create<PlayerCharacterOwnership>('tblPlayersCharactersOwnership', { player_id: playerId, character_id: characterId });
        }
    }

    updatePipsForChallenge = (challengeId: number, pips: number) => {
        const pipsRecord = this.crud.readAll<PipsPerChallenge>('tblPipsperChallenge', { challenge_id: challengeId })[0];
        if (pipsRecord) this.crud.update<PipsPerChallenge>('tblPipsperChallenge', pipsRecord.id, { pips });
        else this.scaffold.createPipsForChallenge(challengeId, pips);
    }
}
