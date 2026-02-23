import * as d3 from "d3";

let original_data = {
  name: "Collect",
  step: 0,
  branch_type: "trunk",
  ppl: 1,
  time: 20,
  type: "pax_collect",
  children: [
    {
      name: "Translate",
      step: 1,
      branch_type: "trunk",
      ppl: 25,
      time: 10,
      type: "pax_translate",
      children: [
        {
          name: "Transcribe",
          step: 2,
          branch_type: "trunk",
          ppl: 1,
          time: 40,
          type: "pax_transcribe",
          children: [
            {
              name: "Code",
              step: 3,
              branch_type: "trunk",
              ppl: 40,
              time: 100,
              type: "pax_code",
              link: "https://pax.peaceagreements.org/media/documents/PA_X_codebook_v8.pdf",
              children: [
                {
                  name: "Quality Control",
                  step: 4,
                  branch_type: "trunk",
                  ppl: 7,
                  time: 20,
                  type: "pax_quality_control",
                  children: [
                    {
                      name: "PA-X",
                      step: 5,
                      branch_type: "trunk",
                      ppl: 3,
                      time: 100,
                      type: "pax_db",
                      link: "https://pax.peaceagreements.org/agreements/search/",
                      children: [
                        {
                          name: "Research",
                          step: 9,
                          branch_type: "uppest_trunk",
                          ppl: 50,
                          time: 100,
                          type: "research",
                          children: [
                            {
                              name: "paper",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 3,
                              time: 10,
                              type: "data_report",
                            },
                            {
                              name: "paper",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 1,
                              time: 10,
                              type: "book",
                            },
                            {
                              name: "paper",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 1,
                              time: 10,
                              type: "journal",
                            },
                            {
                              name: "paper",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 1,
                              time: 10,
                              type: "blog",
                            },
                            {
                              name: "paper",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 1,
                              time: 10,
                              type: "conference",
                            },
                          ],
                        },
                        {
                          name: "Code",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 13,
                          time: 50,
                          type: "pax_gender_code",
                          link: "https://pax.peaceagreements.org/media/documents/PA_X_codebook_wgg_v8.pdf",
                          children: [
                            {
                              name: "Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              time: 20,
                              type: "pax_gender_quality_control",
                              children: [
                                {
                                  name: "PA-X Gender",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  time: 10,
                                  type: "pax_gender_db",
                                  link: "https://pax.peaceagreements.org/agreements/wggsearch/",
                                  children: [
                                    {
                                      name: "App Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 2,
                                      time: 10,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "PeaceFem",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 4,
                                          time: 2,
                                          type: "app",
                                          link: "https://peacerep.org/digital-resources/peacefem/",
                                        },
                                      ]
                                    },
                                    {
                                      name: "d3",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      time: 3,
                                      type: "prog",
                                      link: "https://github.com/tvancisin/pax_gender",
                                      children: [
                                        {
                                          name: "Scrollytelling",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 4,
                                          time: "2",
                                          type: "vis",
                                          link: "https://tvancisin.github.io/pax_gender/",
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
                          name: "Code",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 2,
                          time: 100,
                          type: "pax_children_code",
                          children: [
                            {
                              name: "Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              time: 20,
                              type: "pax_children_quality_control",
                              children: [
                                {
                                  name: "Children & Youth",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  time: 10,
                                  type: "pax_children_db",
                                  children: [
                                    {
                                      name: "PBi Youth Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      time: 10,
                                      type: "prog",
                                      children: [{
                                        name: "PBi Youth",
                                        step: 12,
                                        branch_type: "leaf",
                                        ppl: 1,
                                        time: 1,
                                        type: "vis",
                                      }]
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: "Code",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 10,
                          time: 100,
                          type: "pax_local_code",
                          children: [
                            {
                              name: "Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              time: 20,
                              type: "pax_local_quality_control",
                              children: [
                                {
                                  name: "PA-X Local",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  time: 10,
                                  type: "pax_local_db",
                                  children: [
                                    {
                                      name: "d3 local",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "Map",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          time: 10,
                                          type: "vis",
                                          link: "https://www.peaceagreements.org/visualizations/local-agreements/"
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
                          name: "Code",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 2,
                          time: 100,
                          type: "paax_code",
                          children: [
                            {
                              name: "Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 2,
                              time: 20,
                              type: "paax_quality_control",
                              children: [
                                {
                                  name: "PAA-X",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 1,
                                  time: 10,
                                  type: "paax_db",
                                  children: [
                                    {
                                      name: "VUE",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "Actors-Network",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          time: 10,
                                          type: "vis",
                                          link: "https://www.peaceagreements.org/visualizations/actor-networks/"
                                        },
                                      ],
                                    },
                                    {
                                      name: "d3",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "3rd Party Scroll",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 3,
                                          time: 10,
                                          type: "vis",
                                          link: "https://www.peaceagreements.org/visualizations/third-party-scroll/"
                                        },
                                      ],
                                    },
                                    {
                                      name: "Python",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "Network",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          time: 10,
                                          type: "vis",
                                        },
                                      ],
                                    },
                                    {
                                      name: "Tracker Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "Tracker",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 3,
                                          time: 50,
                                          type: "vis",
                                          link: "https://www.peaceagreements.org/tracker/"
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
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 3,
                          time: 50,
                          type: "prog",
                          children: [
                            {
                              name: "Messy Timeline",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 3,
                              time: 10,
                              type: "vis",
                              link: "https://www.peaceagreements.org/visualizations/messy-peace-processes/"
                            },
                          ],
                        },
                        {
                          name: "d3",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 5,
                          time: 50,
                          type: "prog",
                          children: [
                            {
                              name: "Time & Space",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 5,
                              time: 10,
                              type: "vis",
                              link: "http://peaceagreements.org/visualizations/agreements-process-map/"
                            },
                          ],
                        },
                        {
                          name: "d3",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 1,
                          time: 50,
                          type: "prog",
                          children: [
                            {
                              name: "Sequence Comparison",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 1,
                              time: 50,
                              type: "vis",
                              link: "https://www.peaceagreements.org/visualizations/compare-processes/"
                            },
                          ],
                        },
                        {
                          name: "d3",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 2,
                          time: 50,
                          type: "prog_overview",
                          children: [
                            {
                              name: "Data Overview",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 2,
                              time: 50,
                              type: "vis",
                              link: "https://www.peaceagreements.org/visualizations/data-overview-visualization/"
                            },
                          ],
                        },
                        {
                          name: "Infographics",
                          step: 15,
                          branch_type: "leaf",
                          ppl: 3,
                          time: 10,
                          type: "pdf",
                          link: "",
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
  ucdp: [
    // Africa (20)
    ...Array.from({ length: 20 }, () => ({
      name: "conflict",
      number: 721,
      continent: "Africa",
    })),

    // Europe & Eurasia (12)
    ...Array.from({ length: 12 }, () => ({
      name: "conflict",
      number: 435,
      continent: "Europe_Eurasia",
    })),

    // Asia (12)
    ...Array.from({ length: 12 }, () => ({
      name: "conflict",
      number: 425,
      continent: "Asia",
    })),

    // Middle East (8)
    ...Array.from({ length: 8 }, () => ({
      name: "conflict",
      number: 295,
      continent: "Middle_East",
    })),

    // Americas (7)
    ...Array.from({ length: 7 }, () => ({
      name: "conflict",
      number: 263,
      continent: "Americas",
    })),

    // Cross (1)
    {
      name: "conflict",
      number: 38,
      continent: "Cross",
    },
  ]
};

export let steps = {
  workflow: [
    {
      step_id: "1",
      type: "conflicts",
      description:
        `First real life events captured in some way by the PA-X Database are 
        armed conflicts. As you can see, there is a different number of conflicts 
        (and the subsequent peace processes) taking place in different parts of the world.`,
    },
    {
      step_id: "2",
      type: "negotiations",
      description:
        `Peace negotiations are formal attempts to bring political and/or military 
        protagonists of conflict to a mutual agreement. However, not all conflicts 
        lead to negotiations, and not all negotiations lead to agreements.`,
    },
    {
      step_id: "3",
      type: "peace_agreements",
      description:
        `If peace negotiations lead to a signed peace agreement, PA-X collects it if 
        it meets the following criteria: formal, signed, written, publicly available, 
        addressing conflicts with more than 25 conflict related deaths in a year.`,
    },
    {
      step_id: "4",
      type: "translation",
      description:
        `Peace agreements are often written in local languages and in these cases, 
        the documents are translated into English by domain and language experts.`,
    },
    {
      step_id: "5",
      type: "transcription",
      description:
        `The agreements come in various formats (PDF, Word, Images) and 
        the text therefore often needs to be transcribed into plain text.`,
    },
    {
      step_id: "6",
      type: "pax_coding",
      description:
        `The plain text of the agreement then gets tagged into topics covered within. 
        These include categories like Socio-economic Development, Political or Military 
        Powersharing, Gender etc.`,
    },
    {
      step_id: "7",
      type: "pax_quality_control",
      description:
        `The tagged text goes through quality control to ensure 
        the coding is consistent with defintions of the topics across versions.`,
    },
    {
      step_id: "8",
      type: "pax_database",
      description:
        `Once the data is approved and quality checks are resolved, the data is published 
        in the database. On average, 50 new agreements are added annually.`,
    },
    {
      step_id: "9",
      type: "research/further_coding/d3_programming/tracker_visualization/infographics",
      description:
        `Agreements that include references to gender, local conflict, children & youth, 
        or third parties, are further coded in more depth.`
    },
    {
      step_id: "10",
      type: "sub-database quality control",
      description: `To ensure coding consistency and 
      reliability, the sub-theme tagging undergoes further quality control.`,
    },
    {
      step_id: "11",
      type: "sub_databases",
      description:
        `As in the case of the main PA-X database, once the data is approved, it is 
        published in PA-X Gender, PA-X Local, PA-X Children & Youth, 
        and PAA-X Third Parties databases.`,
    },
    {
      step_id: "12",
      type: "research",
      description: `Information gathered in the core PA-X database and sub-databases, coupled
      by the ability to query this information in novel and very flexible ways, 
      subsequently inform peacebuilding research.`,
    },
    {
      step_id: "13",
      type: "publications",
      description:
        `There are 5 types of publication outcomes that stem from this research: 
        academic papers, books, journal articles, blogs, and conference publications.`,
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

export function groupDownwardByContinent(
  root,
  innerWidth,
  {
    nodeSpacing = 10,
    continentGap = 80, // used only for minimum spacing
  } = {},
) {
  if (!root.children || root.children.length === 0) return;

  // ---- group top-level subtrees by continent (stable order)
  const groups = Array.from(
    d3.group(root.children, (d) => d.data.continent ?? "Unknown"),
    ([continent, nodes]) => ({
      continent,
      nodes,
      width: nodes.length > 1 ? (nodes.length - 1) * nodeSpacing : 0,
    }),
  );

  // ---- compute total natural width
  const totalNaturalWidth =
    d3.sum(groups, (g) => g.width) + continentGap * (groups.length - 1);

  // ---- scale natural layout to screen
  const scale = totalNaturalWidth > 0 ? innerWidth / totalNaturalWidth : 1;

  let cursor = 0;

  groups.forEach((group) => {
    // center of this continent in screen space
    const groupCenter = (cursor + group.width / 2) * scale;

    group.nodes.forEach((subRoot, i) => {
      const localOffset = (i * nodeSpacing - group.width / 2) * scale;
      const targetX = groupCenter + localOffset;
      const dx = targetX - subRoot.x;

      subRoot.each((node) => {
        node.x += dx;
      });
    });

    cursor += group.width + continentGap;
  });
}

export function alignBranchToX(
  root,
  sourceName,
  targetName,
  stopAtName = null,
) {
  const nodes = root.descendants();
  const source = nodes.find((d) => d.data.name === sourceName);
  const target = nodes.find((d) => d.data.name === targetName);

  if (!source || !target) return;

  const between = target.x - source.x;
  const targetX = target.x - between / 2;

  let node = source;
  let abovePAX = false;

  while (node) {
    if (node.data.name === "PA-X") {
      abovePAX = true;
    }

    node.x = abovePAX ? targetX - between / 1.5 : targetX;

    if (stopAtName && node.data.name === stopAtName) break;
    node = node.parent;
  }
}

// position downward tree
export function setUniformY(node, spacing) {
  if (!node.children) return;
  node.children.forEach((child) => {
    child.y = node.y + spacing; // child one level below parent
    setUniformY(child, spacing); // recurse
  });
}

