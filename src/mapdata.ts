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
  /** For Town-type regions only: an array of images for the building, 
    inside or outside. */
  carouselImages?: string[];
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
                id: "the-healing-hand-clinic",
                name: "The Healing Hand Clinic",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                // Single polygon taken from the SVG
                polygon: parseCoordsToPolygon("1058.2,1230.26 1772.27,1746.46 2426.11,1359.31 2099.19,748.481 1428.14,412.955"),
                carouselImages: [
                  
                ],
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "the-mending-mind-clinic",
                name: "The Mending Mind Clinic",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("2761.64,1342.1 3312.25,1703.44 3527.33,1574.39 3570.34,1152.83 3088.56,851.72 2839.07,1049.59"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "cremias-salvation",
                name: "Cremia’s Salvation",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("2563.76,800.101 2813.26,954.959 3252.02,834.514 3226.21,576.417 2821.86,335.526"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "guardhouse-medical",
                name: "Guardhouse",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("2477.73,1798.08 2649.8,1935.73 2882.08,1823.89 2847.67,1522.77 2555.16,1462.55"),
                color: "rgba(255, 255, 0, 0.3)"
              }
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
                id: "shield-anvil",
                name: "Shield & Anvil",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("2667,2090.59 3054.15,2426.11 3449.9,2211.03 3097.16,1789.47"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "endless-emporium",
                name: "The Endless Emporeum",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("1927.12,2563.76 2546.56,2047.57 3131.58,2503.54 2503.54,2856.27"),
                color: "rgba(255, 255, 0, 0.3)",
                carouselImages: [
                  "/imgs/regions/The Endless Emporium.png"
                ],
              },
              {
                id: "arcane-antique",
                name: "Arcane Antique",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("2443.32,3131.58 2933.7,2632.59 3346.66,3019.74 2873.48,3303.64"),
                color: "rgba(255, 255, 0, 0.3)",
                carouselImages: [
                  "/imgs/regions/Arcane Antiques.png"
                ],
              },
              {
                id: "blade-bow",
                name: "The Blade and Bow",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("3983.3,2254.05 4172.57,1892.71 4576.92,2202.43 4284.41,2451.92"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "guardhouse-market",
                name: "Guardhouse",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("4697.37,2753.04 5007.08,2529.35 4645.75,2236.84 4370.44,2503.54"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "whispering-quill",
                name: "The Whispering Quill",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("4146.76,3045.54 4181.17,3398.28 4422.06,3578.95 4989.88,3157.39 4585.52,2813.26"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "trinkets-treasures",
                name: "Trinkets and Treasures",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("3441.29,3561.74 3880.06,3811.23 4215.58,3553.14 3768.22,3183.2"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "silk-stitch",
                name: "Silk and Stitch",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("3948.88,3837.04 4224.19,3647.77 4723.18,3948.88 4327.43,4215.58"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "golden-grain",
                name: "The Golden Grain",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("4490.89,3596.15 4826.41,3811.23 5428.64,3329.45 5015.69,3114.37"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "alchemists-alembic",
                name: "The Alchemist's Alembic",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("5101.72,3028.34 5609.31,3295.04 6013.66,2925.1 5600.71,2606.78"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "gem-cutters-guild",
                name: "The Gem Cutter's Guild",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("5678.13,3406.88 6005.06,2813.26 6435.22,3122.97 6469.63,3501.52 6056.68,3690.79"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "heros-museum",
                name: "The Hero's Museum",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("4903.84,3828.44 5325.4,4206.98 5936.23,3862.85 5566.29,3277.83 5127.53,3510.12"),
                color: "rgba(255, 255, 0, 0.3)"
              }
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
                id: "clover-lake",
                name: "Clover Lake",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("5282.39,1995.95 5652.33,2211.03 5970.64,1892.71 5549.09,1677.63"),
                color: "rgba(255, 165, 0, 0.3)" // Orange
              },
              {
                id: "night-eye",
                name: "The Night Eye",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("5523.28,1574.39 5523.28,1015.18 5746.96,1006.58 5781.37,1591.6"),
                color: "rgba(255, 165, 0, 0.3)" // Orange
              },
              {
                id: "silver-chalice",
                name: "The Silver Chalice",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("5772.77,1152.83 6254.55,1453.95 6512.65,1264.68 6366.39,937.753 5936.23,714.068"),
                color: "rgba(255, 165, 0, 0.3)" // Orange
              }

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
                id: "reyvateil-sanctuary",
                name: "Reyvateil Sanctuary",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("4267.2,5050.1 4293.01,4516.7 4671.56,3862.85 5204.96,4034.92 5015.69,4551.11 5050.1,5041.5 4576.92,5179.15"),
                color: "rgba(128, 0, 128, 0.3)" // Purple
              },
              {
                id: "hall-of-records",
                name: "The Hall of Records",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("5041.5,5050.1 5050.1,4499.49 5196.35,4129.55 5368.42,4258.6 5428.64,4809.21"),
                color: "rgba(128, 0, 128, 0.3)" // Purple
              },
              {
                id: "divers-guildhall",
                name: "The Diver's Guildhall",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("6753.54,3673.58 7243.92,3966.09 7484.81,3802.63 7639.67,3381.07 7794.53,3346.66 7631.07,2925.1 7433.19,2882.08 7063.26,3140.18"),
                color: "rgba(128, 0, 128, 0.3)" // Purple
              },
              {
                id: "alroen-lodge",
                name: "The Alroen Lodge",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("7631.07,3389.67 7880.56,3381.07 7949.39,3707.99 7665.48,3880.06 7545.04,3664.98"),
                color: "rgba(255, 192, 203, 0.3)" // Pink
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
                id: "wandering-minstrel",
                name: "The Wandering Minstrel",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("1608.8,6048.07 2279.86,6366.39 2950.91,6048.07 2279.86,5290.99"),
                color: "rgba(0, 255, 255, 0.3)" // Cyan
              },
              {
                id: "quiet-corner",
                name: "The Quiet Corner",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("2460.53,5342.61 2340.08,4946.86 2804.65,4714.57 3002.53,5118.92"),
                color: "rgba(0, 255, 255, 0.3)" // Cyan
              },
              {
                id: "resting-wyvern",
                name: "The Resting Wyvern",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("989.372,5179.15 1264.68,5265.18 1901.31,5110.32 1118.42,4714.57"),
                color: "rgba(0, 255, 255, 0.3)" // Cyan
              },
              {
                id: "drunken-drake",
                name: "The Drunken Drake",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("129.049,1909.92 602.226,2142.21 989.372,1901.31 886.133,1574.39 481.781,1359.31"),
                color: "rgba(0, 255, 255, 0.3)" // Cyan
              }
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
                id: "glass-menagerie",
                name: "Glass Menagerie",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("6676.11,6263.15 6684.71,5962.04 7459,5557.69 7613.86,5746.96 7605.26,5996.45 6908.4,6375"),
                color: "rgba(255, 192, 203, 0.3)"
              },
              {
                id: "clockwork-wonders",
                name: "Clockwork Wonders",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("7071.86,5015.69 7846.15,5557.69 7820.34,5910.42 7674.08,5962.04 7562.24,5617.91 7338.56,5497.47 7226.72,5652.33 7089.07,5574.9 6968.62,5118.92"),
                color: "rgba(255, 192, 203, 0.3)"
              },
              {
                id: "iron-forge",
                name: "The Iron Forge",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("6073.88,5893.22 6426.62,6073.88 7114.88,5635.12 6873.98,5118.92 6340.58,5359.81"),
                color: "rgba(255, 192, 203, 0.3)"
              },
              {
                id: "herbalist-haven",
                name: "Herbalist Haven",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("5325.4,5540.48 5617.91,5721.15 6108.3,5514.67 5738.36,4989.88"),
                color: "rgba(255, 192, 203, 0.3)"
              },
              {
                id: "enchanters-enclave",
                name: "Enchanter's Enclave",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("4929.65,5506.07 5007.08,6091.09 5420.04,6297.57 5652.33,6142.71 5600.71,5712.55 5007.08,5299.59"),
                color: "rgba(255, 192, 203, 0.3)"
              }

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
                id: "basilica-hq",
                name: "Basilica HQ",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("3131.58,3974.69 3587.55,4232.79 3751.01,3991.9 3923.07,3854.25 3510.12,3553.14"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "town-hall",
                name: "Town Hall",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("3673.58,4258.6 3923.07,4447.87 4129.55,4353.24 4103.74,4129.55 3785.42,3991.9"),
                color: "rgba(255, 255, 0, 0.3)"
              }
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
                id: "grain-mill",
                name: "The Grain Mill",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("1780.87,3613.36 2064.78,3811.23 2615.38,3432.69 2348.68,3071.35 2056.17,3157.39"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "foundry",
                name: "The Foundry",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("1075.4,3880.06 1462.55,4146.76 1935.73,3931.68 1789.47,3647.77 1410.93,3381.07"),
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "waterworks",
                name: "The Waterworks",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                polygon: parseCoordsToPolygon("1737.85,3518.72 1342.1,3303.64 1419.53,3122.97 1884.11,2787.45 2047.57,2830.46 2211.03,3071.35"),
                color: "rgba(255, 255, 0, 0.3)"
              }
            ],
          },
        ],
      },
    ]
  },
  {
    id: "tower",
    name: "Tower",
    floors: [
      {
        id: "floor 1",
        name: "Floor 1",
        areas: [
          {
            id: "storm-treasure-room",
            name: "Storm Treasure Room",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              // (x, y), (x+width, y), (x+width, y+height), (x, y+height)
              "85.57644824311491,38.89838556505223,964.6799620132954,38.89838556505223,964.6799620132954,956.900284900285,85.57644824311491,956.900284900285"
            ),
            // Add any image/color or other properties as needed
            color: "rgba(0,0,0,0.3)",
            regions: [
              {
                id: "storm-treasure-room-region-1",
                name: "Bronze Chests",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                // This polygon represents the first rectangle from your SVG:
                // x = 233.3903133903134, y = 202.27160493827157, width = 583.6522558921695, height = 153.94642747766014
                polygon: [
                  [233.3903133903134, 202.27160493827157],
                  [817.042569282483, 202.27160493827157],
                  [817.042569282483, 356.2180324159317],
                  [233.3903133903134, 356.2180324159317]
                ],
                color: "rgba(255, 255, 0, 0.3)" // Yellow (as in your sample)
              },
              {
                id: "storm-treasure-room-region-2",
                name: "Bronze Chests",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                // This polygon represents the second rectangle:
                // x = 215.0808626071216, y = 653.8458223256497, width = 593.6231807956556, height = 163.46145558141245
                polygon: [
                  [215.0808626071216, 653.8458223256497],
                  [808.7040434027772, 653.8458223256497],
                  [808.7040434027772, 817.3072779070622],
                  [215.0808626071216, 817.3072779070622]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              }
            ]
          },
          {
            id: "storm-crystal-room",
            name: "Storm Crystal Room",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              "4784.5014245014245,77.79677113010446,5655.825261158595,77.79677113010446,5655.825261158595,972.4596391263058,4784.5014245014245,972.4596391263058"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: [
              {
                id: "storm-crystal-room-region-1",
                name: "Storm Crystal",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                // Rectangle: x=5024.28895050236, y=180.66792458998214,
                // width=404.35202170138837, height=490.38436674423724
                polygon: [
                  [5024.28895050236, 180.66792458998214],
                  [5024.28895050236 + 404.35202170138837, 180.66792458998214],
                  [5024.28895050236 + 404.35202170138837, 180.66792458998214 + 490.38436674423724],
                  [5024.28895050236, 180.66792458998214 + 490.38436674423724]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              }
            ],
          },
          {
            id: "cleared-out-slime-habitat-earth",
            name: "Cleared out slime habitat - Earth",
            locked: false,
            monstersDocumented: false,
            monsters: ["Minor Earth Slime"],
            polygon: parseCoordsToPolygon(
              "2061.614434947768,910.2222222222222,3617.5498575498577,910.2222222222222,3617.5498575498577,4208.805318138651,2061.614434947768,4208.805318138651"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: []
          },
          {
            id: "magma-slime-room",
            name: "Magma Slime Room",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              "793.5270655270655,1236.968660968661,1789.325736,1236.968660968661,1789.325736,3407.4985754985755,793.5270655270655,3407.4985754985755"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: []
          },
          {
            id: "fire-crystal-room",
            name: "Fire Crystal Room",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              "941.340930674264,544.5773979107313,1695.9696106362774,544.5773979107313,1695.9696106362774,1236.968660968661,941.340930674264,1236.968660968661"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: [
              {
                id: "fire-crystal-room-region-1",
                name: "Fire Crystal", // from xlink:title
                locked: false,
                monstersDocumented: false,
                monsters: [],
                // Rectangle defined by: x=1023.7849060098988, y=671.0522913342194,
                // width=455.9714287270979, height=404.3520217013887
                polygon: [
                  [1023.7849060098988, 671.0522913342194],
                  [1023.7849060098988 + 455.9714287270979, 671.0522913342194],
                  [1023.7849060098988 + 455.9714287270979, 671.0522913342194 + 404.3520217013887],
                  [1023.7849060098988, 671.0522913342194 + 404.3520217013887]
                ],
                color: "rgba(255, 255, 0, 0.3)" // Yellow
              }
            ],
          },
          {
            id: "cleared-out-slime-habitat-fire",
            name: "Cleared out slime habitat - Fire",
            locked: false,
            monstersDocumented: false,
            monsters: ["Minor Fire Slime"],
            polygon: parseCoordsToPolygon(
              "93.35612535612536,995.7986704653372,824.6457739791073,995.7986704653372,824.6457739791073,3640.8888888888887,93.35612535612536,3640.8888888888887"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: []
          },
          {
            id: "mysterious-water-shrine",
            name: "Mysterious Water Shrine",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              "4029.8727445394106,544.5773979107312,4831.179487179487,544.5773979107312,4831.179487179487,1299.2060778727457,4029.8727445394106,1299.2060778727457"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: []
          },
          {
            id: "platform-challenge-rewards-1",
            name: "Platform Challenge Rewards",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              "4854.518518518518,972.4596391263059,5609.147198480531,972.4596391263059,5609.147198480531,1470.3589743589746,4854.518518518518,1470.3589743589746"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: [
              {
                id: "platform-challenge-rewards-region-1",
                name: "Bronze Chest",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                // Rect: x=5351.211861665185, y=989.3719679927593,
                // width=197.87439359855216, height=258.09703512854605
                polygon: [
                  [5351.211861665185, 989.3719679927593],
                  [5351.211861665185 + 197.87439359855216, 989.3719679927593],
                  [5351.211861665185 + 197.87439359855216, 989.3719679927593 + 258.09703512854605],
                  [5351.211861665185, 989.3719679927593 + 258.09703512854605]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "platform-challenge-rewards-region-2",
                name: "Iron Chest",
                locked: false,
                monstersDocumented: false,
                monsters: [],
                // Rect: x=5359.815096169471, y=1264.675472129875,
                // width=215.08086260712116, height=215.08086260712162
                polygon: [
                  [5359.815096169471, 1264.675472129875],
                  [5359.815096169471 + 215.08086260712116, 1264.675472129875],
                  [5359.815096169471 + 215.08086260712116, 1264.675472129875 + 215.08086260712162],
                  [5359.815096169471, 1264.675472129875 + 215.08086260712162]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              }
            ]
          },
          {
            id: "perpetual-slime-room",
            name: "Perpetual Slime Room",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              "5663.604938271605,855.7644824311492,8153.101614434948,855.7644824311492,8153.101614434948,2839.582146248813,5663.604938271605,2839.582146248813"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: [
              // Several regions share the title "Pod of Greed"
              {
                id: "perpetual-slime-room-region-1",
                name: "Pod of Greed",
                locked: false,
                monstersDocumented: false,
                monsters: ["Avatar of Greed and Patience"],
                // Rect 1: x=6633.093802803631, y=2193.82479859264,
                // width=369.93908368424854, height=395.74878719710387
                polygon: [
                  [6633.093802803631, 2193.82479859264],
                  [6633.093802803631 + 369.93908368424854, 2193.82479859264],
                  [6633.093802803631 + 369.93908368424854, 2193.82479859264 + 395.74878719710387],
                  [6633.093802803631, 2193.82479859264 + 395.74878719710387]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "perpetual-slime-room-region-2",
                name: "Pod of Greed",
                locked: false,
                monstersDocumented: false,
                monsters: ["Avatar of Greed and Patience"],
                // Rect 2: x=5858.802697417993, y=2090.5859845412215,
                // width=275.30350413711585, height=412.9552562056738
                polygon: [
                  [5858.802697417993, 2090.5859845412215],
                  [5858.802697417993 + 275.30350413711585, 2090.5859845412215],
                  [5858.802697417993 + 275.30350413711585, 2090.5859845412215 + 412.9552562056738],
                  [5858.802697417993, 2090.5859845412215 + 412.9552562056738]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "perpetual-slime-room-region-3",
                name: "Pod of Greed",
                locked: false,
                monstersDocumented: false,
                monsters: ["Avatar of Greed and Patience"],
                // Rect 3: x=6383.600002179368, y=1686.2339628398333,
                // width=266.7002696328318, height=378.5423181885342
                polygon: [
                  [6383.600002179368, 1686.2339628398333],
                  [6383.600002179368 + 266.7002696328318, 1686.2339628398333],
                  [6383.600002179368 + 266.7002696328318, 1686.2339628398333 + 378.5423181885342],
                  [6383.600002179368, 1686.2339628398333 + 378.5423181885342]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "perpetual-slime-room-region-4",
                name: "Pod of Greed",
                locked: false,
                monstersDocumented: false,
                monsters: ["Avatar of Greed and Patience"],
                // Rect 4: x=7183.7008110778615, y=1514.169272754136,
                // width=301.1132076499698, height=335.52614566710963
                polygon: [
                  [7183.7008110778615, 1514.169272754136],
                  [7183.7008110778615 + 301.1132076499698, 1514.169272754136],
                  [7183.7008110778615 + 301.1132076499698, 1514.169272754136 + 335.52614566710963],
                  [7183.7008110778615, 1514.169272754136 + 335.52614566710963]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "perpetual-slime-room-region-5",
                name: "Pod of Greed",
                locked: false,
                monstersDocumented: false,
                monsters: ["Avatar of Greed and Patience"],
                // Rect 5: x=7699.894881334953, y=1841.092183916961,
                // width=283.9067386414008, height=344.1293801713946
                polygon: [
                  [7699.894881334953, 1841.092183916961],
                  [7699.894881334953 + 283.9067386414008, 1841.092183916961],
                  [7699.894881334953 + 283.9067386414008, 1841.092183916961 + 344.1293801713946],
                  [7699.894881334953, 1841.092183916961 + 344.1293801713946]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "perpetual-slime-room-region-6",
                name: "Pod of Greed",
                locked: false,
                monstersDocumented: false,
                monsters: ["Avatar of Greed and Patience"],
                // Rect 6: x=7476.210784223547, y=997.9752024970443,
                // width=283.9067386413999, height=378.54231818853407
                polygon: [
                  [7476.210784223547, 997.9752024970443],
                  [7476.210784223547 + 283.9067386413999, 997.9752024970443],
                  [7476.210784223547 + 283.9067386413999, 997.9752024970443 + 378.54231818853407],
                  [7476.210784223547, 997.9752024970443 + 378.54231818853407]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "perpetual-slime-room-region-7",
                name: "Pod of Greed",
                locked: false,
                monstersDocumented: false,
                monsters: ["Avatar of Greed and Patience"],
                // Rect 7: x=6030.867387503689, y=1023.7849060098988,
                // width=258.09703512854594, height=309.7164421542552
                polygon: [
                  [6030.867387503689, 1023.7849060098988],
                  [6030.867387503689 + 258.09703512854594, 1023.7849060098988],
                  [6030.867387503689 + 258.09703512854594, 1023.7849060098988 + 309.7164421542552],
                  [6030.867387503689, 1023.7849060098988 + 309.7164421542552]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "perpetual-slime-room-region-8",
                name: "Pod of Greed",
                locked: false,
                monstersDocumented: false,
                monsters: ["Avatar of Greed and Patience"],
                // Rect 8: x=5686.738007332295, y=1135.626954565602,
                // width=266.7002696328309, height=318.31967665853995
                polygon: [
                  [5686.738007332295, 1135.626954565602],
                  [5686.738007332295 + 266.7002696328309, 1135.626954565602],
                  [5686.738007332295 + 266.7002696328309, 1135.626954565602 + 318.31967665853995],
                  [5686.738007332295, 1135.626954565602 + 318.31967665853995]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              },
              {
                id: "perpetual-slime-room-region-9",
                name: "Avatar of Greed and Patience",
                locked: false,
                monstersDocumented: true,
                monsters: ["Avatar of Greed and Patience"],
                // Rect 9: x=6495.442050735072, y=498.98760124852214,
                // width=748.481401872783, height=1066.8010785313231
                polygon: [
                  [6495.442050735072, 498.98760124852214],
                  [6495.442050735072 + 748.481401872783, 498.98760124852214],
                  [6495.442050735072 + 748.481401872783, 498.98760124852214 + 1066.8010785313231],
                  [6495.442050735072, 498.98760124852214 + 1066.8010785313231]
                ],
                color: "rgba(255, 255, 0, 0.3)"
              }
            ],

          },
          {
            id: "platform-challenge",
            name: "Platform Challenge",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              "4092.1101614434947,1447.019943019943,5624.706552706552,1447.019943019943,5624.706552706552,3555.312440645774,4092.1101614434947,3555.312440645774"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: []
          },
          {
            id: "old-camp",
            name: "Old Camp",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              "4068.7711301044633,3570.871794871795,5982.571699905033,3570.871794871795,5982.571699905033,4177.68660968661,4068.7711301044633,4177.68660968661"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: []
          },
          {
            id: "golden-door-dragon",
            name: "Golden Door (Dragon)",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              "5235.7226970560305,7001.709401709401,7079.506172839507,7001.709401709401,7079.506172839507,7880.812915479582,5235.7226970560305,7880.812915479582"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: []
          },
          {
            id: "golden-dragon-lair",
            name: "Golden Dragon Lair",
            locked: false,
            monstersDocumented: false,
            monsters: [],
            polygon: parseCoordsToPolygon(
              "5297.960113960114,4558.890788224122,6822.776828110162,4558.890788224122,6822.776828110162,6978.3703703703705,5297.960113960114,6978.3703703703705"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: []
          },
          {
            id: "venestrias-room",
            name: "Venestria's Room",
            locked: false,
            monstersDocumented: false,
            monsters: ["Venestria, The Tangled Vine"],
            polygon: parseCoordsToPolygon(
              "630.1538461538462,4807.840455840455,3578.6514719848056,4807.840455840455,3578.6514719848056,8013.067426400759,630.1538461538462,8013.067426400759"
            ),
            color: "rgba(0,0,0,0.3)",
            regions: []
          },
          // ... other areas
        ]
      },
      // ... other floors
    ]
  }
];
