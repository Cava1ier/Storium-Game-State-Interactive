import { DatabaseDriver } from './database';
import { GrokCrud } from './grokCrud';
import { initialData } from '../data/initial-data';
import { Game, Scene, Character, Challenge, Card, CardType, CharacterCard, PlayedCard, PipsPerChallenge, UICard, Player, PlayerCharacterOwnership, Act, UIPlayedCard, NewCharacterPayload, UIChallenge } from '../types';
import { GameCRUDRead, GameCRUDCreate, GameCRUDUpdate, GameCRUDDelete } from './game-crud';

// --- MAIN FACADE CLASS ---
export class GameScaffold {
  private driver: DatabaseDriver;
  public crud: GrokCrud;
  public initialData = initialData;

  // CRUD Handlers
  private read: GameCRUDRead;
  private create: GameCRUDCreate;
  private update: GameCRUDUpdate;
  private delete: GameCRUDDelete;
  
  constructor() {
    this.driver = new DatabaseDriver();
    this.crud = new GrokCrud(this.driver.getDatabase());
    this.defineTables();

    // Instantiate handlers
    this.read = new GameCRUDRead(this.crud, this);
    this.create = new GameCRUDCreate(this.crud, this);
    this.update = new GameCRUDUpdate(this.crud, this);
    this.delete = new GameCRUDDelete(this.crud, this);
  }

  private defineTables() {
      this.crud.define('tblGames', { fields: ['id', 'name', 'desc'] });
      this.crud.define('tblPlayers', { fields: ['id', 'name'] });
      this.crud.define('tblActs', { fields: ['id', 'name', 'desc', 'game_id'] });
      this.crud.define('tblScenes', { fields: ['id', 'name', 'desc', 'place_card_id', 'act_id'] });
      this.crud.define('tblCharacters', { fields: ['id', 'name', 'status', 'scene_id', 'game_id'] });
      this.crud.define('tblPlayersCharactersOwnership', { fields: ['id', 'player_id', 'character_id'] });
      this.crud.define('tblCardTypes', { fields: ['id', 'name'] });
      this.crud.define('tblCards', { fields: ['id', 'name', 'desc', 'is_wild', 'default_card_type_id'] });
      this.crud.define('tblCardsWTypesWCharacter', { fields: ['id', 'character_id', 'card_type_id', 'card_id', 'count'] });
      this.crud.define('tblChallenges', { fields: ['id', 'scene_id', 'card_id', 'strong_outcome', 'weak_outcome'] });
      this.crud.define('tblPipsperChallenge', { fields: ['id', 'challenge_id', 'pips']});
      this.crud.define('tblCardsPlayedOnChallenges', { fields: ['id', 'challenge_id', 'CharacterwCards_id']});
  }

  loadData = (data: string) => this.driver.loadFromText(data);
  getRawData = (): string => this.crud.buildRawData();

  // --- PUBLIC API (unchanged) ---
  // This part of the class acts as the public-facing facade, delegating to the specialized handlers.

  // --- READ / GETTERS ---
  getGames = () => this.read.getGames();
  getActs = (gameId: number) => this.read.getActs(gameId);
  getPlayers = () => this.read.getPlayers();
  getAllCards = () => this.read.getAllCards();
  getAllCardTypes = () => this.read.getAllCardTypes();
  getPlayerCharacterOwnerships = () => this.read.getPlayerCharacterOwnerships();
  getScenes = (actId: number) => this.read.getScenes(actId);
  getCharacters = (sceneId: number) => this.read.getCharacters(sceneId);
  getChallenges = (sceneId: number) => this.read.getChallenges(sceneId);
  getCardByName = (name: string) => this.read.getCardByName(name);
  getCardTypeByName = (name: string) => this.read.getCardTypeByName(name);
  getCardsForCharacter = (characterId: number) => this.read.getCardsForCharacter(characterId);
  getPipsForChallenge = (challengeId: number) => this.read.getPipsForChallenge(challengeId);
  getPlayedCardsForChallenge = (challengeId: number) => this.read.getPlayedCardsForChallenge(challengeId);
  getSceneMaxPips = (sceneId: number) => this.read.getSceneMaxPips(sceneId);
  getCurrentScenePipsUsed = (sceneId: number) => this.read.getCurrentScenePipsUsed(sceneId);
  getPlayersByGame = (gameId: number) => this.read.getPlayersByGame(gameId);

  // --- CREATE ---
  createGame = (data: Omit<Game, 'id'>) => this.create.createGame(data);
  createAct = (gameId: number, data: Omit<Act, 'id' | 'game_id'>) => this.create.createAct(gameId, data);
  createPlayer = (data: Omit<Player, 'id'>) => this.create.createPlayer(data);
  createScene = (actId: number, data: Omit<Scene, 'id' | 'act_id'>) => this.create.createScene(actId, data);
  createCard = (data: Omit<Card, 'id'>) => this.create.createCard(data);
  createCharacter = (gameId: number, sceneId: number, payload: NewCharacterPayload) => this.create.createCharacter(gameId, sceneId, payload);
  createChallenge = (sceneId: number, data: Omit<Challenge & { pips: number }, 'id' | 'scene_id'>) => this.create.createChallenge(sceneId, data);
  addCardToCharacter = (characterId: number, data: Omit<CharacterCard, 'id' | 'character_id'>) => this.create.addCardToCharacter(characterId, data);
  playCardOnChallenge = (challengeId: number, characterCardId: number) => this.create.playCardOnChallenge(challengeId, characterCardId);
  createPipsForChallenge = (challengeId: number, pips: number) => this.create.createPipsForChallenge(challengeId, pips);

  // --- UPDATE ---
  updateGame = (id: number, data: Partial<Game>) => this.update.updateGame(id, data);
  updateAct = (id: number, data: Partial<Act>) => this.update.updateAct(id, data);
  updatePlayer = (id: number, data: Partial<Player>) => this.update.updatePlayer(id, data);
  updateScene = (id: number, data: Partial<Scene>) => this.update.updateScene(id, data);
  updateCharacter = (id: number, data: Partial<Character>) => this.update.updateCharacter(id, data);
  updateCard = (id: number, data: Partial<Card>) => this.update.updateCard(id, data);
  updateCharacterCard = (id: number, data: Partial<CharacterCard>) => this.update.updateCharacterCard(id, data);
  updateCharacterOwnership = (characterId: number, playerId: number | null) => this.update.updateCharacterOwnership(characterId, playerId);
  updateChallenge = (id: number, data: Partial<Challenge & { pips: number }>) => this.update.updateChallenge(id, data);

  // --- DELETE ---
  deleteGame = (id: number) => this.delete.deleteGame(id);
  deleteAct = (id: number) => this.delete.deleteAct(id);
  deletePlayer = (id: number) => this.delete.deletePlayer(id);
  deleteScene = (id: number) => this.delete.deleteScene(id);
  deleteCharacter = (id: number) => this.delete.deleteCharacter(id);
  deleteChallenge = (id: number) => this.delete.deleteChallenge(id);
  deleteCard = (id: number) => this.delete.deleteCard(id);
  removeCardFromCharacter = (characterCardId: number) => this.delete.removeCardFromCharacter(characterCardId);
  removeCardFromChallenge = (playedCardId: number) => this.delete.removeCardFromChallenge(playedCardId);
}