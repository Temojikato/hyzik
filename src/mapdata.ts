// mapdata.ts

export interface MapRegion {
  id: string;
  name: string;
  locked: boolean;
  description?: string;
  monstersDocumented: boolean;
  monsters: string[];
  polygon: [number, number][];
  image?: string;
  color?: string; // Optional color property for Regions
}

export interface MapArea {
  id: string;
  name: string;
  locked: boolean;
  description?: string;
  monstersDocumented: boolean;
  monsters: string[];
  polygon: [number, number][];
  image?: string;
  color?: string; // Optional color property
  regions: MapRegion[]; // Add Regions within Areas
}

export interface MapFloor {
  id: string;
  name: string;
  imageUrl: string;
  areas: MapArea[];
}

export interface MapCategory {
  id: string;
  name: string;
  floors: MapFloor[];
}

// Utility functions
function parseCoordsToPolygon(coordsStr: string): [number, number][] {
  const coords = coordsStr.split(',').map(Number);
  const polygon: [number, number][] = [];
  for (let i = 0; i < coords.length; i += 2) {
    polygon.push([coords[i], coords[i + 1]]);
  }
  return polygon;
}

function mergePolygons(...polygons: [number, number][][]): [number, number][] {
  return polygons.flat();
}


// Updated mapData with color assignments
export const mapData: MapCategory[] = [
  {
    id: "town",
    name: "The Town",
    floors: [
      {
        id: "town-floor",
        name: "The Town",
        imageUrl: "/images/town-center.png",
        areas: [
          {
            id: 'medical-ward',
            name: 'Medical Ward',
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              '1890,2497,3516,1610,3548,1081,3065,366,2746,358,2412,716,1167,762,957,1183,1190,1766'
            ),
            color: 'rgba(255, 0, 0, 0.3)', // Red
            regions: [ // Add Regions within the Area
              {
                id: 'region1',
                name: 'region1',
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2000,2500,2200,2500,2200,2700,2000,2700'
                ),
                color: 'rgba(255, 255, 0, 0.3)', // Yellow
              },
              {
                id: 'region2',
                name: 'region2',
                locked: true,
                monstersDocumented: true,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2300,2500,2500,2500,2500,2700,2300,2700'
                ),
                color: 'rgba(0, 255, 255, 0.3)', // Cyan
              },
            ],
          },
          {
            id: 'market-district',
            name: 'Market District',
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              '1944.92,2621.75,2855.14,3407.5,3345.26,3213.01,3298.58,3640.89,4449.98,4286.6,4722.26,3866.5,5344.64,4263.26,6885.01,3353.04,3967.64,1742.65,4162.13,3111.87,3391.94,2683.99,3500.85,1555.94'
            ),
            color: 'rgba(0, 255, 0, 0.3)', // Green
            regions: [ // Add Regions within the Area
              {
                id: 'region1',
                name: 'region1',
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2000,2500,2200,2500,2200,2700,2000,2700'
                ),
                color: 'rgba(255, 255, 0, 0.3)', // Yellow
              },
              {
                id: 'region2',
                name: 'region2',
                locked: true,
                monstersDocumented: true,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2300,2500,2500,2500,2500,2700,2300,2700'
                ),
                color: 'rgba(0, 255, 255, 0.3)', // Cyan
              },
            ],
          },
          {
            id: 'the-tower',
            name: 'The Tower',
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              '3391.94,2707.33,3780.92,2925.16,4053.21,2497.28,3990.97,2349.46,3920.96,451.221,3578.65,451.221'
            ),
            color: 'rgba(0, 0, 255, 0.3)', // Blue
            regions: [ // Add Regions within the Area
              {
                id: 'region1',
                name: 'region1',
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2000,2500,2200,2500,2200,2700,2000,2700'
                ),
                color: 'rgba(255, 255, 0, 0.3)', // Yellow
              },
              {
                id: 'region2',
                name: 'region2',
                locked: true,
                monstersDocumented: true,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2300,2500,2500,2500,2500,2700,2300,2700'
                ),
                color: 'rgba(0, 255, 255, 0.3)', // Cyan
              },
            ],
          },
          {
            id: 'whispering-woods',
            name: 'Whispering Woods',
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              '3998.75,1641.51,6511.59,3228.57,7211.76,2707.33,7476.27,256.729,6993.93,-7.77968,6604.95,15.5594,5437.99,62.2374,4481.09,606.815'
            ),
            color: 'rgba(255, 165, 0, 0.3)', // Orange
            regions: [ // Add Regions within the Area
              {
                id: 'region1',
                name: 'region1',
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2000,2500,2200,2500,2200,2700,2000,2700'
                ),
                color: 'rgba(255, 255, 0, 0.3)', // Yellow
              },
              {
                id: 'region2',
                name: 'region2',
                locked: true,
                monstersDocumented: true,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2300,2500,2500,2500,2500,2700,2300,2700'
                ),
                color: 'rgba(0, 255, 255, 0.3)', // Cyan
              },
            ],
          },
          {
            id: 'guild-district',
            name: 'Guild District',
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              '6052.59,2824.02,4660.03,3975.42,3983.19,5041.23,4123.23,5437.99,4644.47,5624.71,5367.98,5453.55,5881.44,4768.94,6177.06,4512.21,6752.76,4675.59,7079.51,5134.59,7888.59,5189.04,8090.86,3679.79,7592.96,2847.36'
            ),
            color: 'rgba(128, 0, 128, 0.3)', // Purple
            regions: [ // Add Regions within the Area
              {
                id: 'region1',
                name: 'region1',
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2000,2500,2200,2500,2200,2700,2000,2700'
                ),
                color: 'rgba(255, 255, 0, 0.3)', // Yellow
              },
              {
                id: 'region2',
                name: 'region2',
                locked: true,
                monstersDocumented: true,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2300,2500,2500,2500,2500,2700,2300,2700'
                ),
                color: 'rgba(0, 255, 255, 0.3)', // Cyan
              },
            ],
          },
          {
            id: 'residential-area',
            name: 'Residential Area',
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              '4271.04,5578.03,3959.86,6208.18,3928.74,6371.56,0,6410.45,0,46.6781,2295,7.77968,2302.78,466.781,1151.39,599.035,645.713,1065.82,1151.39,2170.53,1229.19,3213.01,490.12,4037.65,669.052,4543.3,1898.24,5087.91,2621.75,4901.2'
            ),
            color: 'rgba(0, 255, 255, 0.3)', // Cyan
            regions: [ // Add Regions within the Area
              {
                id: 'region1',
                name: 'region1',
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2000,2500,2200,2500,2200,2700,2000,2700'
                ),
                color: 'rgba(255, 255, 0, 0.3)', // Yellow
              },
              {
                id: 'region2',
                name: 'region2',
                locked: true,
                monstersDocumented: true,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2300,2500,2500,2500,2500,2700,2300,2700'
                ),
                color: 'rgba(0, 255, 255, 0.3)', // Cyan
              },
            ],
          },
          {
            id: 'artisans-quarter',
            name: "Artisan’s Quarter",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              '4060.99,6379.34,4029.87,5881.44,4636.69,5453.55,5321.3,5554.69,6145.94,5010.11,6721.64,5041.23,7927.49,5453.55,7888.59,6379.34'
            ),
            color: 'rgba(255, 192, 203, 0.3)', // Pink
            regions: [ // Add Regions within the Area
              {
                id: 'region1',
                name: 'region1',
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2000,2500,2200,2500,2200,2700,2000,2700'
                ),
                color: 'rgba(255, 255, 0, 0.3)', // Yellow
              },
              {
                id: 'region2',
                name: 'region2',
                locked: true,
                monstersDocumented: true,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2300,2500,2500,2500,2500,2700,2300,2700'
                ),
                color: 'rgba(0, 255, 255, 0.3)', // Cyan
              },
            ],
          },
          {
            id: 'central-plaza',
            name: 'Central Plaza',
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              '2170.53,4527.77,2084.95,4060.99,3065.19,3275.24,3251.91,3337.48,3353.04,3812.04,4208.81,4403.3,3858.72,5189.04'
            ),
            color: 'rgba(128, 128, 128, 0.3)', // Gray
            regions: [ // Add Regions within the Area
              {
                id: 'region1',
                name: 'region1',
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2000,2500,2200,2500,2200,2700,2000,2700'
                ),
                color: 'rgba(255, 255, 0, 0.3)', // Yellow
              },
              {
                id: 'region2',
                name: 'region2',
                locked: true,
                monstersDocumented: true,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2300,2500,2500,2500,2500,2700,2300,2700'
                ),
                color: 'rgba(0, 255, 255, 0.3)', // Cyan
              },
            ],
          },
          {
            id: 'utility-buildings',
            name: 'Utility Buildings',
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              '2170.53,4551.11,1470.36,4449.98,1058.04,3773.14,1517.04,3142.99,1944.92,2738.45,2940.72,3578.65'
            ),
            color: 'rgba(128, 0, 0, 0.3)', // Maroon
            regions: [ // Add Regions within the Area
              {
                id: 'region1',
                name: 'region1',
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2000,2500,2200,2500,2200,2700,2000,2700'
                ),
                color: 'rgba(255, 255, 0, 0.3)', // Yellow
              },
              {
                id: 'region2',
                name: 'region2',
                locked: true,
                monstersDocumented: true,
                monsters: [],
                polygon: parseCoordsToPolygon(
                  '2300,2500,2500,2500,2500,2700,2300,2700'
                ),
                color: 'rgba(0, 255, 255, 0.3)', // Cyan
              },
            ],
          },
        ],
      },
    ]},
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
              ],
              color: 'rgba(255, 215, 0, 0.3)', // Gold
              regions: [ // Add Regions within the Area
                {
                  id: 'region1',
                  name: 'region1',
                  locked: false,
                  monstersDocumented: false,
                  monsters: [],
                  polygon: parseCoordsToPolygon(
                    '2000,2500,2200,2500,2200,2700,2000,2700'
                  ),
                  color: 'rgba(255, 255, 0, 0.3)', // Yellow
                },
                {
                  id: 'region2',
                  name: 'region2',
                  locked: true,
                  monstersDocumented: true,
                  monsters: [],
                  polygon: parseCoordsToPolygon(
                    '2300,2500,2500,2500,2500,2700,2300,2700'
                  ),
                  color: 'rgba(0, 255, 255, 0.3)', // Cyan
                },
              ],
            },
            // ... other areas
          ]
        },
        // ... other floors
      ]
    }
  ];
