let original_data = {
  name: "Collect",
  ppl: 1,
  time: "20",
  children: [
    {
      name: "Translate",
      branch_type: "trunk",
      ppl: 25,
      time: "10",
      url: "img/trans.png",
      children: [
        {
          name: "Transcribe",
          branch_type: "trunk",
          ppl: 1,
          time: "40",
          children: [
            {
              name: "PA-X Code",
              branch_type: "trunk",
              ppl: 40,
              time: "100",
              url: "img/pax_code.png",
              type: "code",
              link: "https://pax.peaceagreements.org/media/documents/PA_X_codebook_v8.pdf",
              children: [
                {
                  name: "PA-X QC",
                  branch_type: "trunk",
                  ppl: 7,
                  time: "20",
                  type: "quality_control",
                  children: [
                    {
                      name: "PA-X",
                      branch_type: "trunk",
                      type: "db",
                      ppl: 3,
                      time: "100",
                      url: "img/pax_db.png",
                      link: "https://pax.peaceagreements.org/agreements/search/",
                      children: [
                        {
                          name: "research",
                          branch_type: "uppest_trunk",
                          children: [
                            {
                              name: "paper",
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                            {
                              name: "paper",
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                            {
                              name: "paper",
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                            {
                              name: "paper",
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                            {
                              name: "paper",
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                            {
                              name: "paper",
                              label: "paper",
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                          ],
                        },
                        {
                          name: "Code",
                          branch_type: "upper_trunk",
                          ppl: 13,
                          time: "50",
                          type: "code",
                          url: "img/gender_code.png",
                          link: "https://pax.peaceagreements.org/media/documents/PA_X_codebook_wgg_v8.pdf",
                          children: [
                            {
                              name: "QC",
                              branch_type: "upper_trunk",
                              type: "quality_control",
                              ppl: 7,
                              children: [
                                {
                                  name: "PA-X Gender",
                                  branch_type: "upper_trunk",
                                  type: "db",
                                  ppl: 3,
                                  time: "10",
                                  url: "img/gender_db.png",
                                  link: "https://pax.peaceagreements.org/agreements/wggsearch/",
                                  children: [
                                    {
                                      name: "d3",
                                      branch_type: "uppest_trunk",
                                      type: "prog",
                                      ppl: 1,
                                      time: "3",
                                      url: "img/d3_bgd.png",
                                      link: "https://github.com/tvancisin/pax_gender",
                                      children: [
                                        {
                                          name: "Scrollytelling",
                                          type: "vis",
                                          ppl: 4,
                                          time: "2",
                                          url: "img/scroll.png",
                                          link: "https://tvancisin.github.io/pax_gender/",
                                        },
                                      ],
                                    },
                                    { name: "PeaceFem" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Code",
                          branch_type: "upper_trunk",
                          ppl: 2,
                          type: "code",
                          children: [
                            {
                              name: "QC",
                              branch_type: "upper_trunk",
                              ppl: 7,
                              type: "quality_control",
                              children: [
                                {
                                  name: "Children & Youth",
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  type: "db",
                                  children: [
                                    {
                                      name: "PBi",
                                      ppl: 1,
                                      type: "vis",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Code",
                          branch_type: "upper_trunk",
                          type: "code",
                          ppl: 10,
                          children: [
                            {
                              name: "QC",
                              branch_type: "upper_trunk",
                              ppl: 7,
                              type: "quality_control",
                              children: [
                                {
                                  name: "PA-X Local",
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  type: "db",
                                  children: [
                                    {
                                      name: "d3",
                                      branch_type: "uppest_trunk",
                                      type: "prog",
                                      children: [
                                        { name: "Map", type: "vis", ppl: 4 },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Code",
                          label: "Coding",
                          branch_type: "upper_trunk",
                          type: "code",
                          ppl: 1,
                          children: [
                            {
                              name: "QC",
                              label: "Quality Control",
                              branch_type: "upper_trunk",
                              ppl: 7,
                              type: "quality_control",
                              children: [
                                {
                                  name: "PAA-X",
                                  branch_type: "upper_trunk",
                                  type: "db",
                                  ppl: 3,
                                  children: [
                                    {
                                      name: "VUE",
                                      branch_type: "uppest_trunk",
                                      type: "prog",
                                      ppl: 1,
                                      children: [
                                        { name: "Actors-Network", type: "vis" },
                                      ],
                                    },
                                    {
                                      name: "d3",
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "3rd Party Scroll",
                                          ppl: 3,
                                          type: "vis",
                                        },
                                      ],
                                    },
                                    {
                                      name: "Python",
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      choose: "last",
                                      type: "prog",
                                      children: [
                                        {
                                          name: "Network",
                                          ppl: 1,
                                          type: "vis",
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },

                        {
                          name: "d3",
                          branch_type: "uppest_trunk",
                          ppl: 3,
                          type: "prog",
                          children: [
                            {
                              name: "Messy Timeline",
                              ppl: 3,
                              type: "vis",
                            },
                          ],
                        },
                        {
                          name: "d3",
                          branch_type: "uppest_trunk",
                          ppl: 5,
                          type: "prog",
                          children: [
                            { name: "Time & Space", ppl: 5, type: "vis" },
                          ],
                        },
                        {
                          name: "d3",
                          branch_type: "uppest_trunk",
                          ppl: 1,
                          type: "prog",
                          children: [
                            {
                              name: "Sequence Comparison",
                              ppl: 1,
                              type: "vis",
                            },
                          ],
                        },
                        {
                          name: "d3",
                          label: "Programming",
                          branch_type: "uppest_trunk",
                          ppl: 2,
                          type: "prog",
                          children: [
                            { name: "Data Overview", ppl: 2, type: "vis" },
                          ],
                        },
                        {
                          name: "Tracker",
                          ppl: 3,
                          type: "vis",
                        },
                        {
                          name: "Infographics",
                          type: "pdf",
                          ppl: 3,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  // downward: [
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  //     { name: 'agreement', children: [{ name: 'negotiation', children: [{ name: 'conflict' }] }] },
  // ]
  downward: [
    // Africa (20)
    ...Array.from({ length: 20 }, () => ({
      name: "agreement",
      number: 721,
      continent: "Africa",
      children: [{ name: "negotiation", children: [{ name: "conflict" }] }],
    })),
    // Europe & Eurasia (12)
    ...Array.from({ length: 12 }, () => ({
      name: "agreement",
      number: 435,
      continent: "Europe_Eurasia",
      children: [{ name: "negotiation", children: [{ name: "conflict" }] }],
    })),
    // Asia (12)
    ...Array.from({ length: 12 }, () => ({
      name: "agreement",
      number: 425,
      continent: "Asia",
      children: [{ name: "negotiation", children: [{ name: "conflict" }] }],
    })),
    // Middle East (8)
    ...Array.from({ length: 8 }, () => ({
      name: "agreement",
      number: 295,
      continent: "Middle_East",
      children: [{ name: "negotiation", children: [{ name: "conflict" }] }],
    })),
    // Americas (7)
    ...Array.from({ length: 7 }, () => ({
      name: "agreement",
      number: 263,
      continent: "Americas",
      children: [{ name: "negotiation", children: [{ name: "conflict" }] }],
    })),
    // Cross (1)
    {
      name: "agreement",
      number: 38,
      continent: "Cross",
      children: [{ name: "negotiation", children: [{ name: "conflict" }] }],
    },
  ],
};

let json_data = JSON.parse(JSON.stringify(original_data));
let idCounter = 0;

// Recursively assign unique IDs to each node
function assignIds(node) {
  node.id = `node-${idCounter++}`;
  if (node.children) {
    node.children.forEach(assignIds);
  }
}

// Assign IDs to top-level nodes and downward nodes
assignIds(json_data);
if (json_data.downward) {
  json_data.downward.forEach(assignIds);
}

// Export the processed data
export const data = json_data;

export function generateDiagonalProgPath(
    yCenter,
    progNodes,
    obstacles = [],
    liftDistance = 20,
  ) {
    if (!progNodes.length) return "";

    const sorted = [...progNodes].sort((a, b) => a.x - b.x);
    let path = `M${sorted[0].x},${yCenter - sorted[0].y}`;

    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = sorted[i];
      const next = sorted[i + 1];

      const LEVEL_EPS = 1;

      const obsBetween = obstacles.filter(
        (o) =>
          o.x > curr.x && o.x < next.x && Math.abs(o.y - curr.y) <= LEVEL_EPS,
      );

      if (obsBetween.length) {
        const midX = (curr.x + next.x) / 2;
        const direction = 1; // 1 = up, -1 = down
        const dx = midX - curr.x;
        const dy = liftDistance * direction;

        // Diagonal up to avoid obstacles
        path += ` L${curr.x + dx},${yCenter - (curr.y + dy)}`;
        // Diagonal down toward next prog node
        path += ` L${next.x - dx},${yCenter - (next.y + dy)}`;
      }

      // Always line to next prog node
      path += ` L${next.x},${yCenter - next.y}`;
    }

    // Ensure line reaches the **last prog node** in case there were obstacles
    const last = sorted[sorted.length - 1];
    path += ` L${last.x},${yCenter - last.y}`;

    return path;
  }
