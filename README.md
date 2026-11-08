# Spartan Drill

3D arena shooter that runs in the browser. Static files only, no build step.

Deploy: push this folder to a GitHub repo, then Settings > Pages > deploy from the branch root.
Local test: run `python3 -m http.server` in this folder and open http://localhost:8000.

## Files
- `favicon.svg` game icon (crosshair)
- `index.html` menu, HUD, pause screen and the match-end overlay
- `style.css` all styling (including phone layout)
- `js/core.js` data (weapons, perks, maps), Boomtown map, engine/collision, bots, weapons, game loop, keyboard and mouse input
- `js/systems.js` juice (shake, particles, sounds), pickups and killstreaks, VMP-X, KN-115 and RayGun models, held weapons (visible magazines, pump shotgun), character rigs, reload animations, mantling and wall jumps, bot PvP, Team Deathmatch, Capture the Flag
- `js/interface.js` levels, prestige and the camo tracks (animated shader camos), death camera, private P2P matches and persistent lobbies, home screen and the Zombies / Multiplayer menus, pause/dev menus, match-end sequence (victory/defeat, leaderboard, podium with emotes), touch controls
- `js/gfx.js` graphics: procedurally textured and merged level geometry, real-time shadows, sky dome (day and night), window facades, flickering lights
- `js/input.js` gamepad controller support (menus and play) and WebXR VR mode
- `js/zombies.js` the Zombies mode: the Hollow Estate map, rounds and waves, zombie AI with flow-field pathfinding, points, doors, mystery boxes, Pack-a-Punch, soda perks and the co-op networking

Each section inside the JS files starts with a banner comment showing its original file name.

## Controls
WASD move, Shift sprint, mouse look, click or F shoot, R reload, V katana, E frag, Q flashbang, F interact (in Zombies: buy / interact, hold to revive a teammate), 3 to 6 killstreak slots, 1 / 2 or the mouse wheel to change weapon, Space jump (also mantles ledges and wall jumps), Esc pause. On the podium: 1 to 4 emote. Touch: drag left to look, tap/hold right to shoot, stick to move.

## Home screen
The game opens on a home screen with two choices. ZOMBIES opens the Zombies menu (Play, Co-op lobby, Camos, Settings). MULTIPLAYER opens the Multiplayer menu (Play, Private match, Loadout, Weapon mastery, Settings). Back returns to the home screen.

## Balance
Everyone (player, bots, other players) has 50 health plus 50 recharging shield and uses the same weapon stats, so a standard weapon kills in 3 to 5 body shots. Each match is worth 1 to 3 player levels.

## Match end
When a match ends the world freezes and blurs, VICTORY or DEFEAT pops up, then the leaderboard (Continue to skip ahead), then a podium of the top 3 players who emote (Wave, Cheer, Dance, Flex; keys 1 to 4 or the buttons). If you are not in the top 3 you stand beside the podium so you can still emote. After 5 seconds you are back at the main menu.

## Reloads
Every weapon has its own reload and the part being loaded travels with the left hand: magazine weapons drop the old mag and seat a fresh one, the shotgun is loaded shell by shell and then pumped, the rocket launcher is loaded from the rear and the RayGun swaps its energy cell. Bots use the same animations.

## Movement
Walking speed is 7, hold Shift to sprint at 9 (forward only, the FOV widens slightly). While sprinting the weapon is held low, muzzle pointing down, and across the body with a running swing and you cannot fire it, unless you carry the Run & Gun perk (Multiplayer loadout, unlocks at level 10; in Zombies the Stamin Fizz soda gives the same ability). Movement accelerates and stops smoothly. The Marathon perk adds 15% to both. On touch, push the stick to its edge to sprint.

## Domination
Two teams (you are Blue, 5v5 with bots), three zones (A, B, C) per map. Stand in a zone with no enemy inside to capture it; the more of your team inside, the faster it flips (up to 3 count). A contested zone does not move. Every 2 seconds each zone a team owns gives that team 1 point. First team to 350 wins. Zones show on the radar and in the top bar. Bots go for the nearest zone their team does not own, and defenders hold zones the team already has. Zone positions come from `zn` in each map (a default row is used if a map has none).

## Maps
Blockfort, Pillars, Canyon, Boomtown and Suburbia: two crossing streets with sidewalks, driveways with cars, houses with garages, picket fences you can mantle, backyard pools, sheds and trees. Flat ground pieces (streets, driveways, decks) are walkable and ignored by spawning.

## Random picks and private lobbies
The Play screen has a Random mode card and a Random map card. Pick them and a new combination is rolled every time you press Deploy. The private match host also has Random mode and Random map in the dropdowns.
Private lobbies are persistent: after a match everybody (host and guests) goes back to the Private match screen still connected to the same code. The host picks a mode and map again and presses Start match. Use Leave lobby to disconnect. Exit match from the pause menu leaves the lobby.

## Zombies
Survive endless rounds in the Hollow Estate, an abandoned and half-collapsed mansion: four ruined wings (Foyer, Ballroom, Conservatory, Kitchen) joined by four locked doors. Walls are 8 high, doors are 8 high, wall jumps are disabled and nothing can be mantled above 2.6, so nobody can climb out. Each wing has broken partition walls, rubble to jump on, wrecked furniture, rafters open to the sky and its own lighting that comes from real objects (a floor lamp, a fallen chandelier, burning barrels, a lantern on the fountain, a wall sconce) instead of floating lights. You start in the first wing with the 1911 and 500 points.
- Points: 10 per hit; kills pay 50 (60 with explosives or the RayGun), 100 for a headshot kill and 130 for a knife kill. The knife kills in one hit up to round 2, then loses effectiveness gradually: it takes about 2 swings in round 3, 4 in round 6, 7 in round 12 and tops out at 20 swings from round 35.
- Rounds and waves: each round has more zombies than the last and they spawn in waves from the wings you have opened. All ammo is restocked at the start of every round.
- Zombies get stronger every round: more health (steady growth, then 7% per round after round 10), harder hits (up to 55), faster attacks and movement. Runners appear from round 6 and everything runs from round 25. Weapons do 2.2x damage to zombies (explosives 3x) so the arsenal keeps up. Every fifth round brings brutes (large, 4x health, heavy hits). Zombie colours shift from green to rotten purple to ember red as rounds go up.
- Doors (Ballroom 1000, Conservatory 1250, Kitchen 1500 and 2000) open new wings. Zombies path around walls and through doors you opened.
- Mystery Box (950, two locations): a random weapon (KN-115, SMG, Battle Rifle, Shotgun, Magnum, Machine Pistol, VMP-X, Sniper, Rocket Launcher, Coyote). The RayGun is rare (3%) and one-shots every normal zombie up to round 29; from round 30 a base RayGun no longer kills in one shot, but a Pack-a-Punched RayGun still does (until round ~49, and PaP II beyond).
- Pack-a-Punch (5000 then 10000): upgrades the weapon you are holding (damage x2.2 then x3.6, bigger magazine, faster fire).
- Perk machines (soda machines): red Vitality Cola +50 health (2500), green Quick Fizz reload twice as fast (3000), yellow Double Pop double damage with bullet weapons and faster fire (2000), blue Revive Soda self-revive once (500; the machine runs dry after 4 purchases), purple Stamin Fizz run 20% faster (2000), orange Mule Soda third weapon slot (4000).
- Down: you lie on the floor (low camera, slow crawl; no ragdoll) and you lose all your perks and any third weapon. With Revive Soda you get back up by yourself after 4 seconds. In solo, going down otherwise ends the run.

### Co-op (up to 4 players)
In the Zombies menu choose Co-op lobby: the host creates a code, up to 3 friends join, the host presses Start match. The host simulates every zombie, round and door; guests see the zombies, their hits count, and the kill points come back to them. Points, perks and weapons belong to each player; doors, boxes and the Revive Soda stock are shared. Teammates cannot hurt each other.
- When a player goes down everyone else gets a PLAYER DOWN alert with a sound, a kill-feed line and a red marker with distance over the body. A teammate can revive you: hold E next to them for 2 seconds (the reviver earns 100 points). You have 45 seconds.
- Downed or bled-out players come back at the start of the next round with a pistol (points are kept).
- The run ends when everybody is down at the same time.
- The lobby stays connected after the run, like private matches.

## Camos
Two separate tracks, both usable in both modes. Multiplayer camos are earned with kills (Weapon mastery menu). Zombie camos are earned with zombie kills per weapon (Rotted 25, Bile 75, Bone 150, Blood 225, Rust 300, Toxic 375), three global camos for your best round (Graveyard round 10, Wasteland round 15, Hellscape round 20) and the three animated finishers (Inferno 500 zombie kills, Necrotic 500 zombie kills on every weapon of that type, Abyss 500 zombie kills on every weapon). Any unlocked camo from either track can be picked on any weapon from either menu.
The final three of each track are live shaders that animate on the weapon: Gold (molten gold), Diamond (prismatic ice), Dark Matter (swirling nebula), Inferno (flames and lava cracks), Necrotic (toxic plasma), Abyss (a void with glowing rifts).

## Weapons
New: the Coyote, a 60 round LMG (unlocks at level 34), modelled on the reference picture with a drum magazine that really comes out when you reload.

## Open maps
Suburbia and Boomtown have no tall walls. The play area is enclosed by one continuous painted fence that follows the edge of the map (Boomtown's bat-wing outline included). An invisible tall collision wall sits on top of it so it cannot be mantled, wall-jumped or squeezed through, and the scenery (houses, trees, hills) continues beyond it. Suburbia is larger now with an outer ring road and a ring of houses.

## Characters and animation
Players and bots are now real humans: head with face, ears and hair or a combat helmet, neck, oval torso, tactical vest, tapered jointed arms and legs, boots. Zombies are rotting undead: pale or sickly skin, glowing eyes, hanging jaw, wounds, ragged clothes in random colours, a hunched lurching gait with one dragging leg and reaching arms. Skin and clothes darken as rounds climb. Bots fall over when killed. Animation is procedural: smooth turning, stride and arm counter-swing, torso twist and lean, breathing and idle weight shift, hit flinches. First person has a proper sprint pose, head bob, strafe roll and a landing dip (the sprint shake is fixed: the bob uses an accumulated phase).

## Graphics
Level geometry is merged into a few textured meshes (brick, stucco, wood planks, concrete, asphalt, grass, shingles, tile, metal) with real-time shadows, a sky dome with sun and clouds (or a night sky with moon and stars in the zombie estate), window facades, street furniture, car wheels and lights, rounded trees and bushes. The zombie estate has flickering warm and cold lights, blood and debris. Settings has a Graphics option: High (shadows) or Low (faster, default on phones).

## Player name
The name box lives in the profile area of both menus and is saved in the browser, so it is still there after closing the tab.

## Weapons and perks (update)
- **1911** (new, `CT`): the Zombies starter pistol and a Multiplayer sidearm (level 12). Modelled on a government-pattern 1911 with a serrated slide, spur hammer, beavertail and checkered wood grips (built from boxes, the reference photo is not used in the game).
- **Magnum** now has a new revolver model: 6 inch vented-rib barrel with underlug, ramp front sight, fluted cylinder, spur hammer and walnut grips with a gold medallion.
- **KN-115** has a single magazine attached under the receiver.
- **Sniper Rifle** pierces: one shot damages every enemy and zombie along the line until it hits a wall, in both modes.
- **RayGun**: no range falloff and no headshot bonus; direct damage 48 plus a larger, stronger blast (radius 4.4, damage 62) so it is a 2 shot kill in Multiplayer at any range and one shot still cannot kill a full health player.
- **Run & Gun** perk: lets you shoot while sprinting.

## Characters
Human heads were rebuilt (smaller eyes in sockets, brows, nose, mouth, ears, chin) and skin and hair are lighter and slightly self-lit so people stay readable in dark lighting. Uniforms, vests, helmets and gloves are unchanged.

## Ragdolls
Players, bots and zombies that die are thrown by the hit, tumble, bounce off walls, land on the highest surface under them (crates, rubble, ledges) and lie there limp with floppy legs, arms and head. Zombie bodies stay for several seconds and then sink away.

## Menus, saving and audio
- Pausing in a Private match or Zombies co-op only opens the menu: the match keeps running for everyone (including you). Solo matches still freeze.
- Your loadout, mode, map and settings are saved on every change and when the tab is hidden or closed, and are loaded after all weapons exist (previously a loadout using the VMP-X, Coyote or other late-defined weapons was thrown away on load).
- Audio resumes automatically when you return to the tab.
- Zombies podium: only the real players stand on it (just you in solo) while a crowd of zombies shambles around them.

## Controller and VR
- **Controller** (any standard gamepad, plug in and press a button): left stick move, right stick look, RT shoot, A jump, X reload, B or R3 knife, Y or D-pad swap, LB or LT grenade, RB use / killstreak (hold to revive), L3 toggles sprint (releasing the stick cancels it), Start pause. In menus the D-pad or left stick moves the focus, A presses, B goes back or resumes, left/right changes drop-downs and sliders. Note: browsers may refuse pointer lock without a mouse click; the game plays fine without it.
- **VR** (WebXR, e.g. Quest browser or desktop Chrome/Edge with a headset): Settings > VR headset mode > On, then Deploy / Start survival; the match opens in the headset. The right controller aims and holds the gun (shots go where it points), trigger shoots, left stick moves in the aim direction, right stick snap-turns 30 degrees, A jump, B swap, X use, left trigger grenade, left grip reload, right grip knife, stick click sprint, Y leaves VR and opens the pause menu (Resume goes back into VR). Health, shield, ammo and round/points are on a panel on your left wrist. Shadows are turned off while in VR. Match end also returns you to the screen. Not tested on real hardware: please report anything that feels off.

## Controls overhaul
**Keyboard and mouse:** WASD move, Space jump / stand / mantle, Shift sprint (double press = tactical sprint, a short faster sprint with a cooldown), C crouch / slide (while sprinting), Ctrl prone / dive (while sprinting), Alt walk, H auto run, LMB fire, RMB aim down sights, R reload, V or Mouse 4 katana, E lethal (frag), Q tactical (flashbang), F interact / buy / revive, T or Mouse 5 weapon mount (while aiming), B fire mode (single / auto), X field upgrade, G armor plate, 1 or wheel down next weapon, 2 or wheel up previous weapon, 3 to 6 killstreak slots 1 to 4, Tab scoreboard (hold), M or Caps Lock map, middle mouse ping, N night vision, Esc / F1 / F3 / F6 menu. In menus F1 is home, F3 settings, F6 loadout, O private match. Voice and text chat are not included.

**Controller:** the table in Settings. Menus are fully usable with a pad (D-pad or left stick moves focus spatially, A presses, B goes back, an on-screen keyboard opens for the name and match code boxes).

**New systems:** aim down sights with real iron sights on every weapon (thin rear aperture or notch and a front post or blade, per weapon; the sniper uses a scope overlay), stances (crouch, slide, prone, dive; crouching and lying down also reduce incoming damage a little), walk, auto run, tactical sprint, flashbang (stuns bots and zombies, blinds you if you look at it), field upgrade (Adrenaline: shield refill and faster for 6 seconds, 45 second cooldown), 3 armor plates per life (+50 shield, +15 health), fire mode toggle, weapon mount and steady aim (less spread and recoil), world pings, night vision, scoreboard and a full map overlay.

**Katana:** the melee weapon (V). Detailed model: curved single-edged blade with a ridge line, fuller grooves, a wavy temper line and a pointed tip, gold collar and washers, iron guard with gold studs, cord-wrapped grip with diamond wrap, ornaments, pommel cap and a red tassel. One slash can hit up to 3 targets (reach 3.1). In Zombies it kills in one hit up to round 2 and then needs more swings every round.

## Hardpoint (new mode)
Capture and hold the active Hardpoint to earn points for your team. Only one teammate is required inside it to score and you only score while nobody from the other team is inside. The Hardpoint rotates to the next location every 60 seconds. First team to 250 points wins. It is marked by a visible perimeter (ring, wall and beam: white when empty, blue / red when held, yellow when contested), and shows on the radar and map. Locations come from `zn` in each map. Bots play it too, and it works in private matches.

## Radar and map
The radar now draws walls and objects around you (not only dots). The M map overlay shows every wall and object, objectives, your allies, and enemies while a UAV is up.

## Navigation (zombies and bots)
`js/nav.js`: 1 unit grid of the whole map with every cell near a wall blocked (inflated by the agent radius so nobody clips corners). Zombies follow one Dijkstra flow field per player with look-ahead and line-of-sight smoothing; Multiplayer bots use A* with string pulling toward their target or objective whenever they are far away or have no clear line to the enemy. Everyone has stuck detection: after a stall they side-step, re-plan, and as a last resort snap to the nearest free cell.

## Decay (new map)
A ruined city block: two crossing streets, four gutted buildings (doorways, window sills you can vault), a crater plaza with a fountain ruin, a toppled bus, wrecked cars, barricades and rubble. This is a first layout built without the reference images; five Hardpoint locations. Send the reference images and layout again and I will rebuild it to match.

## VR
Menus work inside the headset (the DOM menus are mirrored onto a panel you point at), the Quest browser shows an Enter VR splash and the whole site runs in VR after one trigger pull (browsers only allow starting VR from a user gesture). Fix: in VR the shot origin used the headset-relative camera position, which is why shots came from the middle of the map; shots now leave from the right controller and the real eye position is restored after every render.

## Update notes
- **New maps:** Rust (desert oil refinery traced from the reference layout) and Decay (abandoned downtown, completely new layout). Blockfort, Pillars and Canyon were rebuilt as detailed maps (castle, Roman forum, mining gorge). All open maps are enclosed by a fence or low wall with an invisible barrier above it; the world continues beyond (js/maps.js, js/decay.js, js/maps2.js).
- **Tactical map** (M) now uses the dark/red scan-line style, and the player arrow points the way you look.
- **Loadout screen** redesigned: numbered loadout tabs (saved), slot grid, detail panel with a weapon preview rendered from the game's own models (js/loadout.js). New **Melee** slot: Katana or Fists.
- **Melee:** tap V = quick weapon strike (weaker); hold V = draw the loadout melee weapon (much more damage). Katana is held with both hands at the base of the grip. New first-person arms/hands (js/melee.js).
- **MVR-67** assault rifle added (js/weapons.js). New attachment: **Quickdraw Grip** (faster aim down sights).
- **Iron sights:** every weapon has its own style (js/sights.js). KN-115, VMP-X and Coyote follow the reference photos. Detailed models for KN-115, SMG, Battle Rifle, Machine Pistol, Sniper, Rocket Launcher and RayGun (js/models.js).
- **Killstreaks:** Shield Boost now at 5 kills, Airstrike at 8 as a bomber carpet bombing a line across the map; it never hurts you or your team (js/strike.js).
- **Zombies:** lie prone in front of a perk machine for +100 points, once per machine per match, first player only.
- **Multiplayer (P2P):** TURN/STUN servers, heartbeat, 15 s reconnect grace, automatic rejoin, and the match keeps running in a background tab. Other players show jump, crouch, slide, prone and dive poses, backwards running, look pitch, correct height and hit boxes, and their weapon camo.
- **VR:** the weapon's grip point now sits on the controller.
- **Customize weapon** replaces the Weapon mastery menu: a button in the Loadout screen (and the Camos button in the Zombies menu) opens a camo screen with a large preview of the weapon wearing the selected camo (Preview weapon cycles side / three quarter / top / front / rear / underside), Challenges and Weapon Prestige tabs, Military / Special / Mastery camo rows for Multiplayer and Zombies, locks with requirement and progress, and Track next camo (js/customize.js).
- **Controller vibration** (gamepad and VR) with a Settings toggle (js/haptics.js). VR menu panels are placed in the world, facing the player (js/input.js).
- **Attachments are visible** on the weapon in first person, previews and other players (js/attach.js). Held weapons are scaled and placed so both hands reach the grip and foregrip. Models are welded so no part floats free (js/models.js).
- **Navigation fixes:** doors are at least 2.4 m wide, the walkable main region is computed per map, spawns and bots stay inside it (js/nav.js).
- **Private matches:** bot count slider, and the new mode **One in the Chamber** (js/oitc.js).
- **Melee:** hold V to whip the melee weapon out; it stays equipped, left-click swings, tap V or press R to put it away (js/melee.js).
- **Skyboxes:** a different sky and sun direction on every map (js/sky.js).
- **Killstreaks:** 45 streaks with models, a customizable Scorestreaks screen (Loadout > Killstreaks), enemy bots shoot your placed streaks, enemy helicopters appear now and then (js/sk_data.js, sk_core.js, sk_use.js, sk_ui.js). Streaks are local to the player who earned them in P2P matches.
- **Three lane maps:** every multiplayer map has a north, middle and south lane. Each map has three routes. The divider lines are scattered blocks with wide open ground between them (MK.lanes in js/maps.js), plus the map's own buildings and the lane floor tint; there are no continuous walls.

## File layout (12 files in total)
index.html, style.css, favicon.svg, README.md and eight scripts in js/, loaded in this order:
core.js (engine, modes, original maps) · maps.js (toolkit, Rust, Decay, Blockfort, Pillars, Canyon, lane dividers) · systems.js (sights, weapons, models, bots, killstreak basics) ·
graphics.js (level rendering, per-map skies) · interface.js (menus, P2P networking, navigation, zombies) · controls.js (controls, VR and gamepad, melee, arms, attachments) ·
menus.js (loadout and customize screens, vibration, One in the Chamber) · streaks.js (the 45 killstreaks and their screen).
Each bundle contains the source sections named in the "######## name.js ########" comments, so the file names in the notes above point to those sections.


## Update notes (this version)
- **Barriers:** the invisible boundary walls (kind `'n'`) now only stop players. Bullets, and anything fired from killstreaks, pass over them (`castW` skips boxes flagged `pl`).
- **Killstreaks in multiplayer (js/streaks.js, sk_net):** every device, aircraft and helicopter is mirrored to the other players (10 Hz), they can shoot it down (the owner applies the damage, capped per hit), and explosions are shown to everyone. Streaks are also awarded every frame, not only on the kill event, and the ready streak glows in the side panel.
- **Nuke:** cannot be equipped any more. It launches by itself at 30 kills in a row, everyone gets the countdown, and when it detonates the match ends with the nuker winning (works in solo, team and free-for-all private matches; the host ends the match).
- **Streak durability:** helicopters have 2.4x health, enemy bot fire on streaks is much weaker, and the Rocket Launcher (x3.5-4) and RayGun (x3-3.5) deal extra damage to streaks.
- **Power weapons:** Rocket Launcher and Sniper pick-ups are lost on death and stripped at the start of every match.
- **One in the Chamber:** every kill (gun, melee or a player) gives one bullet back.
- **Sounds:** every weapon has its own synthesized shot (table `GS` in js/systems.js). The MVR-67 is now a slow, hard hitting rifle (40 damage, 0.14 s per shot, 24 rounds, 3 body shots to kill).
- **Attachments** are now measured in the weapon's own space, so they show up in first person and on other players.
- **Terrain:** dunes and hills that reached into the arena are pushed out past the fence (`tclip` in js/graphics.js). They are scenery only.
- **HUD:** the match info at the top is rendered as a scoreboard bar (team panels with progress, a centre badge, status chips) from the text the game modes already produce.
- **RayGun ADS:** the power cell and cap no longer block the sight picture while aiming.
- **VR:** in the main menu the headset stays at a fixed spot facing the arena (the old code followed the orbiting menu camera, so you drifted away from the panel). Weapon and arm meshes are forced hidden outside matches.
- **Anti-cheat (end of js/streaks.js, in a closure):** progress is signed; edits made from outside the game (console scripts, hack menus, edited storage) flag the profile and reset levels, unlocks, camos and weapon progress the next time the game is opened. Also catches god mode, double damage, edited weapon tables, replaced game functions and impossible hits. The dev menu works only from real clicks. Existing profiles that used the dev "unlock everything" are reset on first load. This is client-side protection against copy-paste exploits; real security needs a server.


## Update notes (second pass)
- **TRB-3 Turbine** (new, level 22): 3-round burst assault rifle modelled on the reference photo (round turbine housing, ring sight, front fin, angled magazine). 32 damage, two bursts kill. Burst logic is in the `shoot` hook (BST) at the end of js/streaks.js; bots also fire in bursts.
- **Holding animations:** every weapon has its own profile (`HOLD` and `HOLD3` in js/streaks.js): idle pose, breathing, movement sway, sprint carry, draw-in motion and recoil kick for the first person view, and a separate stance for how other players and bots hold it. Offsets fade out when aiming so the sight line is never moved.
- **Attachments:** the first-person model stores its anchors in gun space, but attachments are built in model space. The anchors are converted back, and magazines, lasers, grips and wraps are now placed from the measured geometry of each model.
- **Care package:** the claim debounce `SK.fp` was never reset, so only the first crate could ever be opened. It resets when F is released and at the start of every match.
- **Lanes:** my earlier divider rewrite was reverted. The original lane code is back with a much larger gap between blocks.


## Update notes (third pass)
- **Prestige:** prestiging resets your unlocks (camos and weapon progress are never touched). Each prestige (1-10) earns 1 permanent unlock token: click any locked item in the loadout or the scorestreak screen to spend it, and that item stays unlocked through every future prestige. Everything up to level 5 x your prestige number is unlocked automatically and permanently, and Prestige Master unlocks everything. Code: `permHas`, `unlocked`, `tokenSpend`, `doPrestige` in js/interface.js.
- **TRB-3 Turbine** was rebuilt from the new reference image (bullpup with a carry-handle loop, aperture sight, long barrel with a vented brake, sawtooth handguard, magazine behind the grip). The old TRB-3 model is now the **TUR-9 Cyclone**, a fast fully automatic rifle (level 26).
- **Controls rebinding:** Settings, Controls. Click an action and press a key; Esc cancels, Backspace restores the default, a key already in use swaps the two actions. Saved on the device. All in-game keys go through `RB()`.
- **Chat:** Enter opens chat (team channel in team modes, Tab switches), Z opens quick chat (1-8, the first two also drop a ping). Commands: /help /clear /mute name /unmute name /team /all. Rate limited on both ends. Can be turned off in Settings.
- **Killcam and death recap:** after you die you watch your killer from an over-the-shoulder camera with their name, weapon, distance and health, plus a recap of the damage you took and dealt. Press the interact key to skip after a second. Can be turned off in Settings.
- **Anti-cheat fix:** health and damage checks now pause during Juggernaut and Goliath (the Goliath suit has 520 health, over the old 400 cap). Gameplay detections (health, damage, weapon numbers) no longer reset a profile on the first hit: they end the match with a warning and only repeated detections (3) count as a strike. Tampering with progress, the weapon table or game functions is still an immediate strike.
- **Secret menu:** click the S of SPARTAN five times, then type "ohio". Change level, prestige, Prestige Master level, tokens, individual unlocks, weapon kills and prestige, unlock every camo, zombies best round, or reset. Only real clicks and key presses work. Edits are signed so the anti-cheat accepts them, and the profile is marked as a dev profile (which relaxes the progress plausibility checks, not the gameplay ones).


## Update notes (fourth pass)
These changes were checked by running the real scripts in headless Chromium (real DOM, events, CSS and Web Audio) with a stand-in for three.js, not just syntax checks.
- **Gunshot silent on a killing shot (root cause):** a killing shot threw an exception in `wkill -> okSet -> allCamos -> camos` (the streak-only weapons MNG, GL and FT have no weapon category, so `CATS[catOf(k)]` was undefined). `shoot()` aborted before `gunSnd(w)`, and `featKill` aborted before awarding streaks. Fixed in `camos`/`zcamos`/`okSet` (`CATS[..]||[k]`); `shoot()` now plays the shot first and isolates hit errors (`safeHit`). This also affected the mastery screen and killstreak awards in the original upload.
- **Secret menu:** the five clicks now work on the home-screen title as well as the menu title, and the code can be typed on either screen.
- **Chat:** the team-colour classes `.tb`/`.tr` clashed with the existing touch-button style; renamed (`cta`/`ctb`). Chat, killcam and the secret menu were verified with real key presses and clicks.
- **Notifications redesigned:** compact stacked toasts placed below the match bar (position measured from it), at most 3 at a time, repeats refresh instead of stacking; kill points rise under the crosshair; popups use a card toast; the kill feed is tidier. The old centre banner is hidden. During a killcam the notifications, hint and streak list are hidden.
- **Anti-cheat and suits:** no checks are switched off during Juggernaut or Goliath any more. Only the two real suits with their exact time and health are accepted (anything else is a hard strike), and health, damage and invulnerability checks follow the registered suit's health. Browser-side limits still apply.
- **Hold animations:** the first-person left hand was clamped to 1.19 but the arm only reaches 1.157, so AR/BR arms were overstretched; fixed. Recoil is now a damped spring instead of an instant jump (about 5x smaller per-frame spikes). Settings, Gameplay options, Weapon hold animations (Full / Reduced / Off) scales or disables the per-weapon layer.
- **New features:** Challenges and Medals (Multiplayer, Challenges: 3 daily, 3 weekly, 4 career challenges with tiers; 15 medals), After Action Report (MVP, K/D, accuracy, headshots, damage, best streak, time, medals, challenges completed), Threat awareness (grenade danger arrows and 3D enemy footsteps, both switchable in Settings).

## Update notes (fifth pass)
- **Hold animations**: new `gripArm` (systems.js) turns each fist so it wraps the handle and moves the wrist so the handle passes through it. Katana has a new ready stance with breathing/walk sway. 1911 and Magnum use a stacked two-handed grip.
- **Loadout**: Coyote label fixed (light machine gun), missing weapon descriptions added. Sniper and Rocket Launcher are intentionally left as they were.
- **Armor plates removed** (key G, gamepad/VR holds, Ballistic Vest bonus, HUD/inventory text, rebind list).
- **New Call of Duty features**: Semtex sticky lethal (level 18), Quick Fix perk (level 16, kills restore health and shield), weapon inspect (Y, rebindable).

## Update notes (sixth pass)
- **Anti-cheat false alarm fixed**: Quick Fix now lives inside `featKill` instead of replacing the function (the anti-cheat treats any replaced guarded function as tampering). Never wrap a function listed in `names_` in the anti-cheat section after it loads.
- **Sights**: RayGun centre antenna removed from the sight line, TRB-3 carry handle opened up, TUR-9 blade fin and housing slimmed.
- **Magazine attachments** (Extended Mag, Hollow Point) ride on a pivot that follows the magazine through the reload.
- **Bomb drone 2.0**: 7 second battery, camera-feed filter (`#dfx`), detonates on trigger / crash / enemy proximity / empty battery, big fireball and shockwave, first-person hands hidden while piloting.
- **Flak guns 2.0**: three detailed turrets that drop in, scan, track and shoot aircraft and nearby enemies. **Enemy chopper** has 650 HP and takes reduced damage from bullets.
- **Kill Confirmed** (offline team mode): dog tags (yellow = enemy, red = your side), confirm / deny scoring, first to 100 confirms.
- **Nitrogen Fists** melee: rocket gauntlets with blue flames, forward slash animation, engine-rev strike sounds that climb with a chain of strikes and a layered demolition hit sound (all through a limiter and your Volume setting).
