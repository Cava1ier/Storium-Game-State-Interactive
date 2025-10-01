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
        if (Object.keys(challengeData).length > 0) {
            this.crud.update<Challenge>('tblChallenges', id, challengeData);
        }
    }

    /**
     * Validates if a new pip value for a challenge is permissible within the scene's limits.
     * This calculation is crucial for maintaining game balance.
     * @param sceneId The ID of the scene containing the challenge.
     * @param newPips The proposed new number of pips for the challenge.
     * @param oldPips The current number of pips assigned to the challenge being edited. This is 0 for new challenges.
     */
    private validatePips(sceneId: number, newPips: number, oldPips: number) {
        // 1. Determine the maximum pips allowed for the entire scene.
        // This is typically calculated based on the number of active player characters (e.g., 3 pips per character).
        const maxPips = this.scaffold.getSceneMaxPips(sceneId);

        // 2. Get the total pips currently assigned to *all* challenges in the scene.
        const currentPips = this.scaffold.getCurrentScenePipsUsed(sceneId);

        // 3. Calculate the new total if the change is applied.
        // We subtract the challenge's old pip value from the current total and add the new value.
        // This accurately reflects the pips used by *other* challenges plus the new value for *this* challenge.
        const newTotal = currentPips - oldPips + newPips;
        
        // 4. Check if the new total exceeds the scene's maximum limit.
        if (newTotal > maxPips) {
            // The error message clearly states how many pips are available for this specific change.
            const pipsAvailableForThisChange = maxPips - (currentPips - oldPips);
            throw new Error(`Cannot set pips. Scene pip limit exceeded. Available: ${pipsAvailableForThisChange}, Tried to set to: ${newPips}.`);
        }
        
        // 5. Enforce an individual challenge limit (e.g., a challenge can't have more than 9 pips).
        // This limit can also be capped by the scene's max pips if the scene itself is small.
        const challengeMaxPips = Math.min(9, maxPips);
        if (newPips > challengeMaxPips) {
            throw new Error(`Challenge pips (${newPips}) cannot exceed the maximum of ${challengeMaxPips}.`);
        }
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