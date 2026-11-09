/* game modes and subtypes, shared by the loading screen and the motd */
var zcModeGroups = [
  { group: "Social", modes: [
    { name: "Homicide", kind: "Hidden killer", desc: "Someone in town is a murderer with poisons, explosives and weapons in their pockets. Everyone else has to work out who, or survive until the police arrive.",
      subs: [
        { name: "Partners", desc: "Two traitors who know each other and share a radio channel." },
        { name: "Classic", desc: "The murderer has only a knife, the sheriff a revolver with a single round." }
      ] },
    { name: "Trouble in Z-City", kind: "Traitors", desc: "Just like good ol' TTT.",
      subs: [
        { name: "No Shop", desc: "No credits shop. Traitors start with a knife, a silenced pistol and a smoke grenade." }
      ] },
    { name: "Hide & Seek", kind: "Shooter", desc: "Some lunatic has a gun. Bystanders hide and run, and SWAT has to take the shooter out before everyone is dead." }
  ]},
  { group: "Hunted", modes: [
    { name: "Stalker", kind: "1 vs all", desc: "Based off of 'The Stalker: Remastered'. The lights are off and something is hunting a Combine squad. It can't be put down easily, and every kill buys it more time." },
    { name: "The Machine", kind: "1 vs all", desc: "Something that doesn't bleed is walking the map. SWAT has to stop it before it finishes the job." },
    { name: "Pathowogen :3", kind: "Infection", desc: "A few of you are already assimilated. The rest have to stay human until the extraction arrives." },
    { name: "ZS Versus", kind: "Infection", desc: "Humans against player zombies. Patient Zero turns, the bitten follow." }
  ]},
  { group: "Co-op", modes: [
    { name: "Zombie Survival", kind: "Waves", desc: "Hold out against waves of zombies. Barricade, scavenge, and keep each other alive.",
      subs: [
        { name: "Nights", desc: "Days to scavenge, nights to survive. On the last night, hold out for extraction..." }
      ] },
    { name: "Antlion Containment", kind: "Waves", desc: "Combine against waves of antlions. Hold the sector, keep the thumpers running, don't let the guard through." },
    { name: "NPC Defense", kind: "Waves", desc: "Hold your ground against waves of Combine or zombies, with bosses and special enemies in the extended version." },
    { name: "CO-OP", kind: "Campaign", desc: "Work together through a Half-Life 2 map and get to the end of it alive." }
  ]},
  { group: "Teams", modes: [
    { name: "Counter-Strike", kind: "Bomb", desc: "Just like Counter-Strike. Terrorists plant a bomb or hold hostages, CT's have to defuse the bomb/save the hostages.",
      subs: [
        { name: "Competitive Match", desc: "First to win more than half the rounds. Sides swap at half-time." }
      ] },
    { name: "Assassination", kind: "VIP", desc: "One Counter-Terrorist is the VIP. Escort them to the escape zone, or kill them before they get there." },
    { name: "Crisis Response", kind: "Breach", desc: "Based off of the Crisis Response game, R.I.P... Suspects fortify the building, and SWAT has to breach it and take them all down before time runs out.",
      subs: [
        { name: "Barricade", desc: "The suspects came prepared. SWAT must breach the building and take down every suspect before time runs out." },
        { name: "Hostage Rescue", desc: "The suspects have taken someone hostage, SWAT has to rescue them." }
      ] },
    { name: "Team Deathmatch", kind: "Buy menu", desc: "Two teams, and an arsenal of weapons that can be purchased.",
      subs: [
        { name: "No Buy", desc: "No buy menu. Every team gets the same rifle, pistol and armor." },
        { name: "Close Quarters", desc: "Pistols, SMGs and shotguns only." },
        { name: "Arms Race", desc: "Every 2 kills on an enemy moves you to the next gun. The first kill with the last gun wins." }
      ] },
    { name: "Gang Wars", kind: "Streets", desc: "Grove Street against the Ballas.",
      subs: [
        { name: "Street Fight", desc: "Melee only. Fists, bats and whatever else is lying around." },
        { name: "Heat", desc: "The police were notified of what's about to happen. They are coming early, and they are bringing backup." }
      ] },
    { name: "Riot", kind: "Streets", desc: "Rioters take the streets, the police have to restore order and arrest them.",
      subs: [
        { name: "Prison Riot", desc: "Prisoners start unarmed, with loot scattered all over the map. Fewer guards, but they carry pistols." },
        { name: "HL2 Riot", desc: "Civil Protection against many unarmed rebels. Overwatch comes in and shuts everything down if it goes badly." }
      ] },
    { name: "Half-Life 2 Deathmatch", kind: "Combine", desc: "Rebels against the Combine. Rebels outnumber the Combine, but the Combine are well-equipped.",
      subs: [
        { name: "Uprising", desc: "Rebels outnumber the Combine two to one, but every Combine soldier is a tough, well-supplied Elite." }
      ] },
    { name: "Day of Defeat", kind: "Flags", desc: "Based off of DoD:S. Allies against Axis. Capture and hold the flags, the dead come back in waves." },
    { name: "DoD: TDM", kind: "Last standing", desc: "Day of Defeat's Allies against Axis, one life each. The last side standing wins." },
    { name: "1995", kind: "Hold / storm", desc: "Federal Forces against the Chechen Fighters. Hold the point, and wait for reinforcements to come help.",
      subs: [
        { name: "Storm", desc: "The Federal Forces storm the points one by one, and every capture buys them time. The Chechen Fighters win if the clock runs out." }
      ] },
    { name: "1995: TDM", kind: "Last standing", desc: "The Federal Forces against the Chechens, classic team deathmatch." },
    { name: "Black October", kind: "Moscow 1993", desc: "Moscow, October 1993. Take down the Mayor, then hold off the storm. Dead people come back as reinforcements." }
  ]},
  { group: "Free for all", modes: [
    { name: "Deathmatch", kind: "Everyone", desc: "Kill everyone. Last one standing wins.",
      subs: [
        { name: "HEV Suits", desc: "Everyone spawns in a powered-up HEV suit." },
        { name: "Flying Kriegsman", desc: "Based off of CSGO's Flying Scoutsman. Scoped Kar98k and a combat knife. Low gravity, full air control, no fall damage." }
      ] },
    { name: "Superfighters 3D", kind: "Chaos", desc: "Kill everyone, with weapon crates scattered around the map.",
      subs: [
        { name: "Explosives Only", desc: "Every crate holds grenades, mines or bombs." },
        { name: "Melee Only", desc: "No guns, just pipes, axes and crowbars." }
      ] }
  ]}
];
