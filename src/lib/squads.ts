import { getTerritorySalesCaptain, getTerritoryRecoveryCaptain } from "./mvps";

export interface Officer {
  name: string;
  role: "Sales Officer (SO)" | "Recovery Officer (RO)" | "Solo Officer (SO & RO)";
}

// Extra officers for the 3-player squads
export const JUNIOR_OFFICERS: Record<string, string> = {
  "Argentina": "Angel Di Maria",
  "France": "Antoine Griezmann",
  "Brazil": "Vinicius Junior",
  "Germany": "Kai Havertz",
  "England": "Jude Bellingham"
};

// Territories with exactly 3 players
export const THREE_PLAYER_SQUADS = ["Argentina", "France", "Brazil", "Germany", "England"];

// Territories with exactly 1 player (Solo squads)
export const ONE_PLAYER_SQUADS = ["Qatar", "New Zealand", "Saudi Arabia", "Costa Rica", "Tunisia"];

export function getTerritorySquad(territoryName: string): Officer[] {
  // 1-Player Solo Squad
  if (ONE_PLAYER_SQUADS.includes(territoryName)) {
    return [
      {
        name: getTerritorySalesCaptain(territoryName),
        role: "Solo Officer (SO & RO)"
      }
    ];
  }

  // 3-Player Elite Squad
  if (THREE_PLAYER_SQUADS.includes(territoryName)) {
    return [
      {
        name: getTerritorySalesCaptain(territoryName),
        role: "Sales Officer (SO)"
      },
      {
        name: JUNIOR_OFFICERS[territoryName] || "Junior Sales Officer",
        role: "Sales Officer (SO)"
      },
      {
        name: getTerritoryRecoveryCaptain(territoryName),
        role: "Recovery Officer (RO)"
      }
    ];
  }

  // Standard 2-Player Squad (Default)
  return [
    {
      name: getTerritorySalesCaptain(territoryName),
      role: "Sales Officer (SO)"
    },
    {
      name: getTerritoryRecoveryCaptain(territoryName),
      role: "Recovery Officer (RO)"
    }
  ];
}

export function getSquadSize(territoryName: string): number {
  if (ONE_PLAYER_SQUADS.includes(territoryName)) return 1;
  if (THREE_PLAYER_SQUADS.includes(territoryName)) return 3;
  return 2;
}
