export const initialData = `tblGames:id|name|desc
1|The Serpent's Coil|A mystery set in a 1920s speakeasy where magic is real and secrets are currency.
2|Starfall Drifters|A gritty sci-fi adventure about a crew of misfits on the galaxy's edge, chasing one last big score.

tblPlayers:id|name
1|Roger
2|Sarah
3|Tom

tblActs:id|name|desc|game_id
1|The Investigation Begins|Following the trail of clues from the initial incident.|1
2|Raising the Stakes|The opposition makes their move, complicating matters.|1
3|The Heist|Acquiring the nav-computer from the local syndicate.|2
4|The Escape|Getting off-world before the bounty hunters close in.|2

tblScenes:id|name|desc|place_card_id|act_id
1|The Emerald Room|The glitzy main floor of the Serpent's Coil club.|4|1
2|The Serpent's Kiss|A backroom where high-stakes deals are made.|2|2
3|The Rustbucket|The cramped, flickering bridge of the crew's ship, The Comet.|1|3
4|Neon Harbor|A bustling spaceport on a forgotten moon, filled with shady contacts.|4|4

tblCharacters:id|name|status|scene_id|game_id
1|Vivian|Active|1|1
2|Jack|Active|1|1
3|Jax|Active|3|2
4|Zora|Active|3|2

tblPlayersCharactersOwnership:id|player_id|character_id
1|2|1
2|3|2
3|2|3
4|3|4

tblCardTypes:id|name
1|Strength
2|Weakness
3|Subplot
4|Place
5|Obstacle
6|Character(Npc)
7|Wild(Str)
8|Wild(Weak)
9|Assets
10|Goals
11|Nature

tblCards:id|name|desc|is_wild|default_card_type_id
1|Sharp Wit|A clever turn of phrase that can disarm or distract.|0|1
2|Shadowy Past|A secret that could be used as leverage or become a liability.|0|2
3|Wild Card|An unpredictable element.|1|
4|Secret Passage|A hidden route known only to a few.|0|4
5|Blaster Pistol|Standard issue sidearm. Reliable, but loud.|0|9
6|Hacking Kit|A set of tools for bypassing electronic security.|0|9
7|Guard Captain's Key|Opens the security office.|0|9
8|Defining Nature|A core aspect of the character's personality.|0|11
9|Unnamed Wild (Strength)|A blank card for a moment of inspiration.|1|7
10|Unnamed Wild (Weakness)|A blank card for an unforeseen complication.|1|8
11|Unfolding Subplot|A personal story arc waiting to be discovered.|0|3
12|Suspicious Bouncer|He's seen it all, and isn't impressed.|0|6
13|Jammed Lock|A rusty, stubborn mechanism stands in the way.|0|5
14|Flickering Power Grid|The lights buzz and threaten to plunge the room into darkness.|0|5
15|Rival Scavenger|Another desperate soul after the same prize.|0|6

tblCardsWTypesWCharacter:id|character_id|card_type_id|card_id|count
1|1|1|1|1
2|1|9|4|1
3|2|2|2|1
4|2|1|7|1
5|3|1|5|1
6|3|9|6|1
7|4|2|2|1
8|4|1|3|1

tblChallenges:id|scene_id|card_id|strong_outcome|weak_outcome
1|1|12|The bouncer gives a knowing nod and looks the other way.|The bouncer blocks the path, demanding a hefty bribe.
2|1|13|The lock clicks open with a satisfying clunk.|The lockpick snaps, making more noise than intended.
3|3|14|Power is stabilized, and all systems are green.|A console shorts out, plunging the bridge into darkness.
4|3|15|The scavenger offers a valuable piece of intel for a cut.|The scavenger ambushes the character, trying to steal their gear.

tblPipsperChallenge:id|challenge_id|pips
1|1|3
2|2|2
3|3|4
4|4|2

tblCardsPlayedOnChallenges:id|challenge_id|CharacterwCards_id
1|1|1
2|3|5
`;