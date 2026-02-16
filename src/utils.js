import * as d3 from "d3";

let original_data = {
  name: "Collect",
  step: 0,
  branch_type: "trunk",
  ppl: 1,
  time: "20",
  children: [
    {
      name: "Translate",
      step: 1,
      branch_type: "trunk",
      ppl: 25,
      time: "10",
      url: "img/trans.png",
      children: [
        {
          name: "Transcribe",
          step: 2,
          branch_type: "trunk",
          ppl: 1,
          time: "40",
          children: [
            {
              name: "PA-X Code",
              step: 3,
              branch_type: "trunk",
              ppl: 40,
              time: "100",
              url: "img/pax_code.png",
              type: "code",
              link: "https://pax.peaceagreements.org/media/documents/PA_X_codebook_v8.pdf",
              children: [
                {
                  name: "PA-X QC",
                  step: 4,
                  branch_type: "trunk",
                  ppl: 7,
                  time: "20",
                  type: "quality_control",
                  children: [
                    {
                      name: "PA-X",
                      step: 5,
                      branch_type: "trunk",
                      type: "db",
                      ppl: 3,
                      time: "100",
                      url: "img/pax_db.png",
                      link: "https://pax.peaceagreements.org/agreements/search/",
                      children: [
                        {
                          name: "Research",
                          step: 9,
                          branch_type: "uppest_trunk",
                          ppl: 10,
                          children: [
                            {
                              name: "paper",
                              step: 10,
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                            {
                              name: "paper",
                              step: 10,
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                            {
                              name: "paper",
                              step: 10,
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                            {
                              name: "paper",
                              step: 10,
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                            {
                              name: "paper",
                              step: 10,
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                            {
                              name: "paper",
                              step: 10,
                              label: "paper",
                              type: "paper",
                              ppl: 1,
                              time: "2",
                            },
                          ],
                        },
                        {
                          name: "Code",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 13,
                          time: "50",
                          type: "code",
                          url: "img/gender_code.png",
                          link: "https://pax.peaceagreements.org/media/documents/PA_X_codebook_wgg_v8.pdf",
                          children: [
                            {
                              name: "QC",
                              step: 7,
                              branch_type: "upper_trunk",
                              type: "quality_control",
                              ppl: 7,
                              children: [
                                {
                                  name: "PA-X Gender",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  type: "db",
                                  ppl: 3,
                                  time: "10",
                                  url: "img/gender_db.png",
                                  link: "https://pax.peaceagreements.org/agreements/wggsearch/",
                                  children: [
                                    { name: "PeaceFem", step: 12, type: "app" },
                                    {
                                      name: "d3",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      type: "prog",
                                      ppl: 1,
                                      time: "3",
                                      url: "img/d3_bgd.png",
                                      link: "https://github.com/tvancisin/pax_gender",
                                      children: [
                                        {
                                          name: "Scrollytelling",
                                          step: 12,
                                          type: "vis",
                                          ppl: 4,
                                          time: "2",
                                          url: "img/scroll.png",
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
                          type: "code",
                          children: [
                            {
                              name: "QC",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              type: "quality_control",
                              children: [
                                {
                                  name: "Children & Youth",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  type: "db",
                                  children: [
                                    {
                                      name: "PBi Youth",
                                      step: 12,
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
                          step: 6,
                          branch_type: "upper_trunk",
                          type: "code",
                          ppl: 10,
                          children: [
                            {
                              name: "QC",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              type: "quality_control",
                              children: [
                                {
                                  name: "PA-X Local",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  type: "db",
                                  children: [
                                    {
                                      name: "d3 local",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      type: "prog",
                                      children: [
                                        { name: "Map", step: 12, type: "vis", ppl: 4 },
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
                          label: "Coding",
                          branch_type: "upper_trunk",
                          type: "code",
                          ppl: 1,
                          children: [
                            {
                              name: "QC",
                              step: 7,
                              label: "Quality Control",
                              branch_type: "upper_trunk",
                              ppl: 7,
                              type: "quality_control",
                              children: [
                                {
                                  name: "PAA-X",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  type: "db",
                                  ppl: 3,
                                  children: [
                                    {
                                      name: "VUE",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      type: "prog",
                                      ppl: 1,
                                      children: [
                                        { name: "Actors-Network", step: 12, type: "vis" },
                                      ],
                                    },
                                    {
                                      name: "d3",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "3rd Party Scroll",
                                          step: 12,
                                          ppl: 3,
                                          type: "vis",
                                        },
                                      ],
                                    },
                                    {
                                      name: "Python",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      choose: "last",
                                      type: "prog",
                                      children: [
                                        {
                                          name: "Network",
                                          step: 12,
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
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 3,
                          type: "prog",
                          children: [
                            {
                              name: "Messy Timeline",
                              step: 14,
                              ppl: 3,
                              type: "vis",
                            },
                          ],
                        },
                        {
                          name: "d3",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 5,
                          type: "prog",
                          children: [
                            {
                              name: "Time & Space",
                              step: 14,
                              ppl: 5, type: "vis"
                            },

                          ],
                        },
                        {
                          name: "d3",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 1,
                          type: "prog",
                          children: [
                            {
                              name: "Sequence Comparison",
                              step: 14,
                              ppl: 1,
                              type: "vis",
                            },
                          ],
                        },
                        {
                          name: "d3",
                          step: 13,
                          label: "Programming",
                          branch_type: "uppest_trunk",
                          ppl: 2,
                          type: "prog",
                          children: [
                            {
                              name: "Data Overview",
                              step: 14,
                              ppl: 2, type: "vis"
                            },
                          ],
                        },
                        {
                          name: "Tracker",
                          step: 15,
                          ppl: 3,
                          type: "vis",
                        },
                        {
                          name: "Infographics",
                          step: 15,
                          label: "Infographics",
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
        armed conflicts around the world. As you can see, different number of conflicts 
        and the subsequent peace processes take place in different parts of the world.`,
    },
    {
      step_id: "2",
      type: "negotiations",
      description:
        `Peace negotiations are formal attempts to bring political and/or military 
        protagonists of conflict, to some sort of mutual agreement as to how to 
        end the conflict. However, not all conflicts lead to negotiations, and not all 
        negotiations lead to agreements.`,
    },
    {
      step_id: "3",
      type: "peace_agreements",
      description:
        `If peace negotiations reach a formal agreement, it results in a signed peace agreement. 
        This is where PA-X steps in. PA-X collects formal, signed, written, and publicly 
        available peace agreements that address conflicts with more than 25 conflict 
        related deaths in a year.`,
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
        `The agreements come in various formats (PDF, Word, Images, Tweets) and 
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
        in the database as a new version of PA-X. On average, 50 new agreements are added 
        per version which is updated annually.`,
    },
    {
      step_id: "9",
      type: "research/further_coding/d3_programming/tracker_visualization/infographics",
      description:
        `Agreements that include references to gender, local conflict, children & youth, 
        or third parties, are further coded in to more depth. For example, in main PA-X Gender is coded at a high level. 
        In PA-X Gender, topics are much more detailed in relation to gender for example if the 
        mention is regarding violence against women, womens involvement in implementation or 
        rights-institutions.`
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
      type: "d3_programming/peacefem_app/visualization",
      description: `Research`,
    },
    {
      step_id: "13",
      type: "visualization",
      description:
        `Publications`,
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

