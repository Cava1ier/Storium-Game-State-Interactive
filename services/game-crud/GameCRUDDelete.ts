import { BaseCrudHandler } from './BaseCrudHandler';
import { CharacterCard, PipsPerChallenge, PlayedCard, PlayerCharacterOwnership } from '../../types';

export class GameCRUDDelete extends BaseCrudHandler {
    deleteGame = (id: number) => {
        const acts = this.scaffold.getActs(id);
        acts.forEach(act => this.scaffold.deleteAct(act.id));
        this.crud.delete('tblGames', id);
    }

    deleteAct = (id: number) => {
        const scenes = this.scaffold.getScenes(id);
        scenes.forEach(scene => this.scaffold.deleteScene(scene.id));
        this.crud.delete('tblActs', id);
    }

    deleteScene = (id: number) => {
        this.scaffold.getCharacters(id).forEach(char => this.scaffold.deleteCharacter(char.id));
        this.scaffold.getChallenges(id).forEach(chal => this.scaffold.deleteChallenge(chal.id));
        this.crud.delete('tblScenes', id);
    }

    deletePlayer = (id: number) => {
        this.crud.readAll<PlayerCharacterOwnership>('tblPlayersCharactersOwnership', { player_id: id })
            .forEach(o => this.crud.delete('tblPlayersCharactersOwnership', o.id));
        this.crud.delete('tblPlayers', id);
    }

    deleteCharacter = (id: number) => {
        this.crud.readAll<CharacterCard>('tblCardsWTypesWCharacter', { character_id: id }).forEach(c => this.crud.delete('tblCardsWTypesWCharacter', c.id));
        this.crud.readAll<PlayerCharacterOwnership>('tblPlayersCharactersOwnership', { character_id: id }).forEach(o => this.crud.delete('tblPlayersCharactersOwnership', o.id));
        this.crud.delete('tblCharacters', id);
    }

    deleteChallenge = (id: number) => {
        this.crud.readAll<PipsPerChallenge>('tblPipsperChallenge', { challenge_id: id }).forEach(p => this.crud.delete('tblPipsperChallenge', p.id));
        this.crud.readAll<PlayedCard>('tblCardsPlayedOnChallenges', { challenge_id: id }).forEach(pc => this.crud.delete('tblCardsPlayedOnChallenges', pc.id));
        this.crud.delete('tblChallenges', id);
    }

    deleteCard = (id: number) => {
        const isInUse = this.crud.readAll<CharacterCard>('tblCardsWTypesWCharacter', { card_id: id });
        if (isInUse.length > 0) throw new Error(`Cannot delete card. It is in use by ${isInUse.length} character(s).`);
        this.crud.delete('tblCards', id);
    }
    
    removeCardFromCharacter = (id: number) => {
        if (this.crud.readAll<PlayedCard>('tblCardsPlayedOnChallenges', { CharacterwCards_id: id }).length > 0) {
            throw new Error("Cannot remove a card that has already been played in a challenge.");
        }
        this.crud.delete('tblCardsWTypesWCharacter', id);
    }
    
    removeCardFromChallenge = (id: number) => {
        const playedCard = this.crud.get<PlayedCard>('tblCardsPlayedOnChallenges', id);
        if (!playedCard) return;
        const charCard = this.crud.get<CharacterCard>('tblCardsWTypesWCharacter', playedCard.CharacterwCards_id);
        if (charCard) this.scaffold.updateCharacterCard(charCard.id, { count: charCard.count + 1 });
        this.crud.delete('tblCardsPlayedOnChallenges', id);
    }
}
