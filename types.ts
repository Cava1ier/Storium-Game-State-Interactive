export interface BaseRecord {
  id: number;
  [key: string]: any;
}

export interface Game extends BaseRecord {
  name: string;
  desc: string;
}

export interface Player extends BaseRecord {
  name: string;
}

export interface Act extends BaseRecord {
  name: string;
  desc: string;
  game_id: number;
}

export interface Scene extends BaseRecord {
  name: string;
  desc: string;
  place_card_id: number;
  act_id: number;
}

export interface Character extends BaseRecord {
  name: string;
  status: 'Active' | 'Idle';
  scene_id: number;
  game_id: number;
}

export interface Challenge extends BaseRecord {
  scene_id: number;
  card_id: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  strong_outcome: string;
  weak_outcome: string;
}

export interface UIChallenge extends Challenge {
    card: Card;
}

export interface Card extends BaseRecord {
  name: string;
  desc: string;
  is_wild: 0 | 1;
  default_card_type_id: number | null;
}

export interface CardType extends BaseRecord {
    name: string;
}

export interface CharacterCard extends BaseRecord {
    character_id: number;
    card_type_id: number;
    card_id: number;
    count: number;
}

export interface PlayedCard extends BaseRecord {
    challenge_id: number;
    CharacterwCards_id: number;
}

export interface PipsPerChallenge extends BaseRecord {
    challenge_id: number;
    pips: number;
}

export interface PlayerCharacterOwnership extends BaseRecord {
    player_id: number;
    character_id: number;
}

export interface UICard {
    characterCardId: number;
    card: Card;
    cardType: CardType;
    count: number;
}

export interface UIPlayedCard {
    playedCardId: number;
    characterCardId: number;
    card: Card;
    cardType: CardType;
}

export interface NewCharacterPayload {
    name: string;
    status: 'Active' | 'Idle';
    playerId: number | null;
    
    natureSelectionType: 'premade' | 'custom';
    natureCardId: number;
    natureCardName: string;
    natureCardDesc: string;
    /**
     * The number of 'Nature' cards the character will start with.
     * This count is used by the `createCharacter` service method to determine
     * how many instances of the selected (or created) Nature card to add to the
     * character's inventory upon creation. The default is typically 2.
     */
    natureCardCount: number;

    strengthSelectionType: 'premade' | 'custom';
    strengthCardId: number;
    strengthCardName: string;
    strengthCardDesc: string;
    /**
     * The number of 'Strength' cards the character will start with.
     * This count determines how many copies of the chosen Strength card
     * are given to the character initially. The default is typically 2.
     */
    strengthCardCount: number;

    weaknessSelectionType: 'premade' | 'custom';
    weaknessCardId: number;
    weaknessCardName: string;
    weaknessCardDesc: string;
    /**
     * The number of 'Weakness' cards the character will start with.
     * This count specifies the initial quantity of the selected Weakness card.
     * The default is typically 1.
     */
    weaknessCardCount: number;
    
    subplotSelectionType: 'premade' | 'custom';
    subplotCardId: number;
    subplotCardName: string;
    subplotCardDesc: string;
    /**
     * The number of 'Subplot' cards the character will start with.
     * This count sets the starting number of the chosen Subplot card,
     * representing a personal story arc. The default is typically 3.
     */
    subplotCardCount: number;
}

export type EditingState = 
    | { type: 'game'; data: Game }
    | { type: 'act'; data: Act }
    | { type: 'scene'; data: Scene }
    | { type: 'character'; data: Character & { playerId: number | null } }
    | { type: 'challenge'; data: UIChallenge & { pips: number } }
    | { type: 'player'; data: Player }
    | { type: 'card'; data: Card }
    | { type: 'character_card'; data: { characterCardId: number; count: number; card_id: number; card_type_id: number; } }
    | { type: 'new_player'; data: { name: string } }
    | { type: 'new_game'; data: { name: string; desc: string } }
    | { type: 'new_act'; data: { name: string; desc: string } }
    | { type: 'new_scene'; data: { name: string; desc: string } }
    | { type: 'new_challenge'; data: { card_id: number; strong_outcome: string; weak_outcome: string; pips: number; difficulty: 'Easy' | 'Medium' | 'Hard'; } }
    | { type: 'new_card'; data: { name: string; desc: string; is_wild: 0 | 1; default_card_type_id: number | null; } }
    | null;