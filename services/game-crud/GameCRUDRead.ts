import { BaseCrudHandler } from './BaseCrudHandler';
import { Game, Scene, Character, Challenge, Card, CardType, CharacterCard, PlayedCard, PipsPerChallenge, UICard, Player, PlayerCharacterOwnership, Act, UIPlayedCard, UIChallenge } from '../../types';

export class GameCRUDRead extends BaseCrudHandler {
    // Game
    getGames = () => this.crud.readAll<Game>('tblGames');
    
    // Act
    getActs = (gameId: number) => this.crud.readAll<Act>('tblActs', { game_id: gameId });

    // Scene
    getScenes = (actId: number) => this.crud.readAll<Scene>('tblScenes', { act_id: actId });
    getSceneMaxPips = (sceneId: number): number => {
        const charactersInScene = this.crud.readAll<Character>('tblCharacters', { scene_id: sceneId });
        const activeCharacters = charactersInScene.filter(c => c.status === 'Active');
        const activeCharacterIds = new Set(activeCharacters.map(c => c.id));
        
        if (activeCharacterIds.size === 0) {
            return 0;
        }
        
        const allOwnerships = this.scaffold.getPlayerCharacterOwnerships();
        const playerOwnedCharacterCount = allOwnerships.filter(o => activeCharacterIds.has(o.character_id)).length;

        return playerOwnedCharacterCount * 3;
    }
    getCurrentScenePipsUsed = (sceneId: number): number => {
        const challenges = this.crud.readAll<Challenge>('tblChallenges', { scene_id: sceneId });
        return challenges.reduce((total, challenge) => total + this.scaffold.getPipsForChallenge(challenge.id), 0);
    }
    
    // Player
    getPlayers = (): Player[] => this.crud.readAll<Player>('tblPlayers');
    getPlayersByGame = (gameId: number): Player[] => {
        const charactersInGame = this.crud.readAll<Character>('tblCharacters', { game_id: gameId });
        const characterIds = new Set(charactersInGame.map(c => c.id));
        const allOwnerships = this.scaffold.getPlayerCharacterOwnerships();
        const playerIdsInGame = new Set(allOwnerships.filter(o => characterIds.has(o.character_id)).map(o => o.player_id));
        return this.getPlayers().filter(p => playerIdsInGame.has(p.id));
    }
    
    // Character
    getCharacters = (sceneId: number): Character[] => this.crud.readAll<Character>('tblCharacters', { scene_id: sceneId });
    
    // Challenge
    getChallenges = (sceneId: number): UIChallenge[] => {
        const challenges = this.crud.readAll<Challenge>('tblChallenges', { scene_id: sceneId });
        return challenges.map(challenge => {
            const card = this.crud.get<Card>('tblCards', challenge.card_id);
            if (!card) {
                console.error(`Card with ID ${challenge.card_id} not found for challenge ${challenge.id}`);
                return null;
            }
            return { ...challenge, card };
        }).filter((c): c is UIChallenge => c !== null);
    }
    
    // Card
    getAllCards = (): Card[] => this.crud.readAll<Card>('tblCards');
    getCardByName = (name: string): Card | null => this.crud.readAll<Card>('tblCards', { name })[0] ?? null;

    // Card Type
    getAllCardTypes = (): CardType[] => this.crud.readAll<CardType>('tblCardTypes');
    getCardTypeByName = (name: string): CardType | null => this.crud.readAll<CardType>('tblCardTypes', { name })[0] ?? null;

    // Character Card
    getCardsForCharacter = (characterId: number): UICard[] => {
        return this.crud.readAll<CharacterCard>('tblCardsWTypesWCharacter', { character_id: characterId }).map(cc => {
            const card = this.crud.get<Card>('tblCards', cc.card_id);
            const cardType = this.crud.get<CardType>('tblCardTypes', cc.card_type_id);
            return (card && cardType) ? { characterCardId: cc.id, card, cardType, count: cc.count } : null;
        }).filter((c): c is UICard => c !== null);
    }

    // Played Card
    getPlayedCardsForChallenge = (challengeId: number): UIPlayedCard[] => {
        return this.crud.readAll<PlayedCard>('tblCardsPlayedOnChallenges', { challenge_id: challengeId }).map(link => {
            const charCard = this.crud.get<CharacterCard>('tblCardsWTypesWCharacter', link.CharacterwCards_id);
            if (!charCard) return null;
            const card = this.crud.get<Card>('tblCards', charCard.card_id);
            const cardType = this.crud.get<CardType>('tblCardTypes', charCard.card_type_id);
            return (card && cardType) ? { playedCardId: link.id, characterCardId: charCard.id, card, cardType } : null;
        }).filter((c): c is UIPlayedCard => c !== null);
    }

    // Player Ownership
    getPlayerCharacterOwnerships = (): PlayerCharacterOwnership[] => this.crud.readAll<PlayerCharacterOwnership>('tblPlayersCharactersOwnership');

    // Pips
    getPipsForChallenge = (challengeId: number): number => this.crud.readAll<PipsPerChallenge>('tblPipsperChallenge', { challenge_id: challengeId })[0]?.pips ?? 0;
}