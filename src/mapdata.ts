// mapData.ts
export interface MapArea {
  id: string;
  name: string;
  locked: boolean; // or discovered: boolean
  monstersDocumented: boolean;
  monsters: string[];
  polygon: [number, number][]; // array of coordinates
  image?: string; // any extra image for details
}

export interface MapFloor {
  id: string;
  name: string;
  imageUrl: string; // main PNG for that floor
  areas: MapArea[];
}

export interface MapCategory {
  id: string;
  name: string;
  floors: MapFloor[];
}

// Your entire map data might look like this:
export const mapData: MapCategory[] = [
  {
    id: "town",
    name: "The Town",
    floors: [
      {
        id: "town-base",
        name: "The Town",
        imageUrl: "/images/town-center.png",
        areas: [
          {
            id: "tavern",
            name: "Tavern",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: [
              [100, 150],
              [200, 150],
              [200, 220],
              [100, 220]
            ]
          },
          // more areas...
        ]
      },
      // possibly more sub-locations
    ]
  },
  {
    id: "tower",
    name: "Tower",
    floors: [
      {
        id: "tower-floor-1",
        name: "Floor 1",
        imageUrl: "/images/tower-floor-1.png",
        areas: [
          {
            id: "goblin-room",
            name: "Goblin Room",
            locked: true,
            monstersDocumented: true,
            monsters: ["Goblin", "Goblin Archer"],
            image: "/images/goblin-room.png",
            polygon: [
              [300, 300],
              [400, 300],
              [400, 400],
              [300, 400]
            ]
          },
          // ...
        ]
      },
      // ...
    ]
  }
];
