import * as d3 from "d3";

let original_data = {
  name: "Collect",
  tooltip_name: "Peace Agreement Collection",
  step: 0,
  branch_type: "trunk",
  ppl: 2,
  expertise: ["law", "international relations"],
  errors: ["missed agreements", "non-written agreements", "verifiable sources"],
  methods: ["web scrape", "news", "social media", "word of mouth", "email", "official websites"],
  time: 10,
  type: "pax_collect",
  children: [
    {
      name: "Translate",
      tooltip_name: "Agreement Translation",
      step: 1,
      branch_type: "trunk",
      ppl: 25,
      expertise: ["interpretation", "translation", "domain knowledge", "legal terminology", "country context"],
      errors: ["typos", "misinterpretation"],
      methods: ["manual", "AI", "combination"],
      time: 50,
      type: "pax_translate",
      children: [
        {
          name: "Transcribe",
          tooltip_name: "Agreement Transcription",
          step: 2,
          branch_type: "trunk",
          ppl: 2,
          expertise: ["database entry knowledge"],
          errors: ["typos", "duplicate text", "text in wrong agreement records", "table extraction issues"],
          methods: ["OCR", "hand-typed", "copy-paste", "automatic extraction"],
          time: 40,
          type: "pax_transcribe",
          children: [
            {
              name: "Code",
              tooltip_name: "Thematic Coding",
              step: 3,
              branch_type: "trunk",
              ppl: 40,
              expertise: ["database entry knowledge", "political science", "country context", "conflict resolution", "law", "international relations"],
              errors: ["untagged segments", "missing data", "incomplete tags removal", "coding manual misinterpretation"],
              methods: ["manual", "AI-assisted", "combination"],
              time: 90,
              type: "pax_code",
              link: "https://pax.peaceagreements.org/media/documents/PA_X_codebook_v8.pdf",
              children: [
                {
                  name: "Quality Control",
                  tooltip_name: "PA-X Quality Control",
                  step: 4,
                  branch_type: "trunk",
                  ppl: 7,
                  expertise: ["2 years of substantive expertise"],
                  errors: ["untagged segments", "missing data", "incomplete tags removal"],
                  methods: ["ironout questions", "do as we code", "include if in doubt"],
                  time: 20,
                  type: "pax_quality_control",
                  children: [
                    {
                      name: "PA-X",
                      tooltip_name: "PA-X Database",
                      step: 5,
                      branch_type: "trunk",
                      ppl: 3,
                      expertise: ["software engineering", "database management", "web-development"],
                      errors: ["insert, update, delete anomalies"],
                      methods: ["manual", "automatic"],
                      time: 30,
                      type: "pax_db",
                      link: "https://pax.peaceagreements.org/agreements/search/",
                      children: [
                        {
                          name: "Research",
                          tooltip_name: "Research",
                          step: 9,
                          branch_type: "uppest_trunk",
                          ppl: 50,
                          expertise: ["law", "international relations", "political science", "data science", "visualization"],
                          errors: ["methodology", "analysis"],
                          methods: ["quantitative", "qualitative", "mixed"],
                          time: 90,
                          type: "research",
                          children: [
                            {
                              name: "paper",
                              tooltip_name: "Academic Papers",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 5,
                              expertise: ["law", "international relations", "political science", "data science", "visualization"],
                              errors: ["structure", "argument", "writing"],
                              methods: ["quantitative", "qualitative", "mixed"],
                              time: 30,
                              type: "data_report",
                            },
                            {
                              name: "paper",
                              tooltip_name: "Books",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 8,
                              expertise: ["law", "international relations", "political science", "data science", "visualization"],
                              errors: ["structure", "argument", "writing"],
                              methods: ["quantitative", "qualitative", "mixed"],
                              time: 30,
                              type: "book",
                            },
                            {
                              name: "paper",
                              tooltip_name: "Journal Articles",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 10,
                              expertise: ["law", "international relations", "political science", "data science", "visualization"],
                              errors: ["structure", "argument", "writing"],
                              methods: ["quantitative", "qualitative", "mixed"],
                              time: 30,
                              type: "journal",
                            },
                            {
                              name: "paper",
                              tooltip_name: "Blogs",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 10,
                              expertise: ["law", "international relations", "political science", "data science", "visualization"],
                              errors: ["structure", "argument", "writing"],
                              methods: ["quantitative", "qualitative", "mixed"],
                              time: 30,
                              type: "blog",
                            },
                            {
                              name: "paper",
                              tooltip_name: "Conference Publications",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 3,
                              expertise: ["law", "international relations", "political science", "data science", "visualization"],
                              errors: ["structure", "argument", "writing"],
                              methods: ["quantitative", "qualitative", "mixed"],
                              time: 30,
                              type: "conference",
                            },
                          ],
                        },
                        {
                          name: "Code",
                          tooltip_name: "PA-X Gender Thematic Coding",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 13,
                          expertise: ["back-end knowledge", "political science", "country context", "gender perspectives"],
                          errors: ["untagged segments", "missing data", "incomplete tags removal"],
                          methods: ["manual", "AI-assisted", "combination"],
                          time: 50,
                          type: "pax_gender_code",
                          link: "https://pax.peaceagreements.org/media/documents/PA_X_codebook_wgg_v8.pdf",
                          children: [
                            {
                              name: "Quality Control",
                              tooltip_name: "PA-X Gender Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              expertise: ["2 years of substantive expertise"],
                              errors: ["untagged segments", "missing data", "incomplete tags removal"],
                              methods: ["ironout questions", "do as we code", "include if in doubt"],
                              time: 20,
                              type: "pax_gender_quality_control",
                              children: [
                                {
                                  name: "PA-X Gender",
                                  tooltip_name: "PA-X Gender Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  expertise: ["software engineering", "database management", "web-development"],
                                  errors: ["insert, update, delete anomalies"],
                                  methods: ["manual", "automatic"],
                                  time: 10,
                                  type: "pax_gender_db",
                                  link: "https://pax.peaceagreements.org/agreements/wggsearch/",
                                  children: [
                                    {
                                      name: "App Development",
                                      tooltip_name: "PeaceFem App Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 4,
                                      expertise: ["software engineering", "data management", "app development"],
                                      errors: ["syntax", "runtime", "logic"],
                                      methods: ["kotlin", "swift"],
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "PeaceFem",
                                          tooltip_name: "PeaceFem App",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["software engineering", "datab management", "app development"],
                                          errors: ["syntax", "runtime", "logic"],
                                          methods: ["kotlin", "swift"],
                                          time: 10,
                                          type: "app",
                                          link: "https://peacerep.org/digital-resources/peacefem/",
                                        },
                                      ]
                                    },
                                    {
                                      name: "d3",
                                      tooltip_name: "PA-X Gender Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["software engineering", "data management", "web development"],
                                      errors: ["syntax", "runtime", "logic"],
                                      methods: ["d3", "svelte", "git"],
                                      time: 40,
                                      type: "prog",
                                      link: "https://github.com/tvancisin/pax_gender",
                                      children: [
                                        {
                                          name: "Scrollytelling",
                                          tooltip_name: "PA-X Gender Scrollytelling",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 2,
                                          expertise: ["software engineering", "data management", "web development"],
                                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                                          methods: ["d3", "svelte", "git"],
                                          time: 10,
                                          type: "vis",
                                          segment_image: "gender.png",
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
                          tooltip_name: "PA-X Children & Youth Thematic Coding",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 2,
                          expertise: ["back-end knowledge", "political science", "country context", "children and youth context"],
                          errors: ["untagged segments", "missing data", "incomplete tags removal"],
                          methods: ["manual", "AI-assisted", "combination"],
                          time: 100,
                          type: "pax_children_code",
                          children: [
                            {
                              name: "Quality Control",
                              tooltip_name: "PA-X Children & Youth Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              expertise: ["2 years of substantive expertise"],
                              errors: ["untagged segments", "missing data", "incomplete tags removal"],
                              methods: ["ironout questions", "do as we code", "include if in doubt"],
                              time: 20,
                              type: "pax_children_quality_control",
                              children: [
                                {
                                  name: "Children & Youth",
                                  tooltip_name: "PA-X Children & Youth Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  expertise: ["software engineering", "database management", "web-development"],
                                  errors: ["insert, update, delete anomalies"],
                                  methods: ["manual", "automatic"],
                                  time: 10,
                                  type: "pax_children_db",
                                  children: [
                                    {
                                      name: "PBi Youth Development",
                                      tooltip_name: "PA-X Children & Youth Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["data management", "visualization"],
                                      errors: ["data & infrastructure", "visualization issues"],
                                      methods: ["powerBI"],
                                      time: 10,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "PBi Youth",
                                          tooltip_name: "PA-X Children & Youth Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["data management", "visualization"],
                                          errors: ["data & infrastructure", "visual encoding"],
                                          methods: ["powerBI"],
                                          time: 10,
                                          type: "vis",
                                          segment_image: "children.png",
                                          link: "https://peacerep.org/children-and-youth-database/",
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
                          tooltip_name: "PA-X Local Thematic Coding",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 10,
                          expertise: ["back-end knowledge", "political science", "country context", "local context"],
                          errors: ["untagged segments", "missing data", "incomplete tags removal"],
                          methods: ["manual", "AI-assisted", "combination"],
                          time: 100,
                          type: "pax_local_code",
                          children: [
                            {
                              name: "Quality Control",
                              tooltip_name: "PA-X Local Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              expertise: ["2 years of substantive expertise"],
                              errors: ["untagged segments", "missing data", "incomplete tags removal"],
                              methods: ["ironout questions", "do as we code", "include if in doubt"],
                              time: 20,
                              type: "pax_local_quality_control",
                              children: [
                                {
                                  name: "PA-X Local",
                                  tooltip_name: "PA-X Local Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  expertise: ["software engineering", "database management", "web development"],
                                  errors: ["insert, update, delete anomalies"],
                                  methods: ["manual", "automatic"],
                                  time: 10,
                                  type: "pax_local_db",
                                  children: [
                                    {
                                      name: "d3 local",
                                      tooltip_name: "PA-X Local Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["software engineering", "data management", "web development"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["d3", "git"],
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "Map",
                                          tooltip_name: "PA-X Local Map Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["software engineering", "data management", "web development"],
                                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                                          methods: ["d3", "git"],
                                          time: 10,
                                          type: "vis",
                                          segment_image: "local.png",
                                          link: "https://peacerep.github.io/pax_local/"
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
                          tooltip_name: "PAA-X Thematic Coding",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 2,
                          expertise: ["back-end knowledge", "political science", "country context", "actor context"],
                          errors: ["untagged segments", "missing data", "incomplete tags removal"],
                          methods: ["manual", "AI-assisted", "combination"],
                          time: 100,
                          type: "paax_code",
                          children: [
                            {
                              name: "Quality Control",
                              tooltip_name: "PAA-X Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 2,
                              expertise: ["2 years of substantive expertise"],
                              errors: ["untagged segments", "missing data", "incomplete tags removal"],
                              methods: ["manual", "AI-assisted", "combination"],
                              time: 20,
                              type: "paax_quality_control",
                              children: [
                                {
                                  name: "PAA-X",
                                  tooltip_name: "PAA-X Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 1,
                                  expertise: ["back-end knowledge", "political science", "country context", "local context"],
                                  errors: ["insert, update, delete anomalies"],
                                  methods: ["manual", "automatic"],
                                  time: 10,
                                  type: "paax_db",
                                  children: [
                                    {
                                      name: "VUE",
                                      tooltip_name: "PAA-X Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["software engineering", "data management", "web development"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["VUE", "git"],
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "Actors-Network",
                                          tooltip_name: "PAA-X Actors-Network Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["software engineering", "data management", "web development"],
                                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                                          methods: ["VUE", "git"],
                                          time: 10,
                                          type: "vis",
                                          link: "https://www.peaceagreements.org/visualizations/actor-networks/"
                                        },
                                      ],
                                    },
                                    {
                                      name: "d3",
                                      tooltip_name: "PAA-X Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["software engineering", "data management", "web development"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["d3", "git"],
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "3rd Party Scroll",
                                          tooltip_name: "PAA-X 3rd Party Scroll Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 3,
                                          expertise: ["software engineering", "data management", "web development"],
                                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                                          methods: ["d3", "git"],
                                          time: 10,
                                          type: "vis",
                                          link: "https://www.peaceagreements.org/visualizations/third-party-scroll/"
                                        },
                                      ],
                                    },
                                    {
                                      name: "Python",
                                      tooltip_name: "PAA-X Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["software engineering", "data management", "web development"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["Python", "git"],
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "Network",
                                          tooltip_name: "PAA-X Network Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["software engineering", "data management", "web development"],
                                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                                          methods: ["Python", "git"],
                                          time: 10,
                                          type: "vis",
                                        },
                                      ],
                                    },
                                    {
                                      name: "Tracker Development",
                                      tooltip_name: "PAA-X Tracker Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["data management", "visualization", "web-development"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["PowerBi"],
                                      time: 50,
                                      type: "prog",
                                      children: [
                                        {
                                          name: "Tracker",
                                          tooltip_name: "PAA-X Tracker Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 3,
                                          expertise: ["data management", "visualization", "web-development"],
                                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                                          methods: ["PowerBi"],
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
                          tooltip_name: "Messy Timeline Visualization Development",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 3,
                          expertise: ["software engineering", "data management", "web development"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["d3", "git"],
                          time: 50,
                          type: "prog",
                          children: [
                            {
                              name: "Messy Timeline",
                              tooltip_name: "Messy Timeline Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 3,
                              expertise: ["software engineering", "data management", "web development"],
                              errors: ["syntax", "runtime", "logic", "visual encoding"],
                              methods: ["d3", "git"],
                              time: 10,
                              type: "vis",
                              link: "https://www.peaceagreements.org/visualizations/messy-peace-processes/"
                            },
                          ],
                        },
                        {
                          name: "d3",
                          tooltip_name: "Time & Space Visualization Development",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 5,
                          expertise: ["software engineering", "data management", "web development"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["d3", "git"],
                          time: 50,
                          type: "prog",
                          children: [
                            {
                              name: "Time & Space",
                              tooltip_name: "Time & Space Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 5,
                              expertise: ["software engineering", "data management", "web development"],
                              errors: ["syntax", "runtime", "logic", "visual encoding"],
                              methods: ["d3", "git"],
                              time: 10,
                              type: "vis",
                              link: "http://peaceagreements.org/visualizations/agreements-process-map/"
                            },
                          ],
                        },
                        {
                          name: "d3",
                          tooltip_name: "Sequence Comparison Visualization Development",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 1,
                          expertise: ["software engineering", "data management", "web development"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["d3", "git"],
                          time: 50,
                          type: "prog",
                          children: [
                            {
                              name: "Sequence Comparison",
                              tooltip_name: "Sequence Comparison Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 1,
                              expertise: ["software engineering", "data management", "web development"],
                              errors: ["syntax", "runtime", "logic", "visual encoding"],
                              methods: ["d3", "git"],
                              time: 50,
                              type: "vis",
                              link: "https://www.peaceagreements.org/visualizations/compare-processes/"
                            },
                          ],
                        },
                        {
                          name: "d3",
                          tooltip_name: "Data Overview Visualization Development",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 2,
                          expertise: ["software engineering", "data management", "web development"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["d3", "git"],
                          time: 50,
                          type: "prog_overview",
                          children: [
                            {
                              name: "Data Overview",
                              tooltip_name: "Data Overview Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 2,
                              expertise: ["software engineering", "data management", "web development"],
                              errors: ["syntax", "runtime", "logic", "visual encoding"],
                              methods: ["d3", "git"],
                              time: 50,
                              type: "vis",
                              link: "https://www.peaceagreements.org/visualizations/data-overview-visualization/"
                            },
                          ],
                        },
                        {
                          name: "Infographics",
                          tooltip_name: "Infographics",
                          step: 15,
                          branch_type: "leaf",
                          ppl: 3,
                          expertise: ["graphics design"],
                          errors: ["text", "visual encoding"],
                          methods: ["Inkscape"],
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
      continent: "Cross_Continental",
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
      continent: "Cross-Continental",
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
        <strong>academic papers, books, journal articles, blogs, and conference publications</strong>.`,
    },
    {
      step_id: "14",
      type: "development",
      description:
        `The machine-processable form of the information gathered in the sub-databases
        also gives rise to the development of various visualizations and digital resources (PeaceTech).`,
    },
    {
      step_id: "15",
      type: "visualizations + app",
      description:
        `Interactive web-based visualizations and mobile apps allow to study peace processes 
        in novel ways and to communicate research findings in more engaging and accessible formats.`,
    },
    {
      step_id: "16",
      type: "pax vis development",
      description:
        `As in the case of the sub-databases, the core PA-X database with machine-processable 
        information and flexible querying capabilities enables the development of PeaceTech tools.`,
    },
    {
      step_id: "17",
      type: "pax vis",
      description:
        `These include Messy Timeline or Data Overview visualizations that provide entirely 
        new perspectives on peace processes across the world.`,
    },
    {
      step_id: "18",
      type: "infographics",
      description:
        `PA-X is also used for the development of static infographics that provide easy entry 
        points to the data and research findings and all these PeaceTech tools are then used 
        to inform research into peacemaking.`,
    },
    {
      step_id: "19",
      type: "ucdp/acled",
      description:
        `What's important to emphasize is that the PA-X database is also used in conjunction 
        with UCDP and ACLED data to provide a more complete picture of conflict and peace processes.`,
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

function createUpwardElbowPath(link, yCenter, extraDown = 0) {
  const offset = Math.min(50, (yCenter - link.y - (yCenter - link.parent.y)) * 0.3) + extraDown;
  const control = offset * 0.3;

  return `M${link.x},${yCenter - link.y}
            L${link.x},${yCenter - link.parent.y + offset}
            C${link.x},${yCenter - link.parent.y + control}
             ${link.parent.x},${yCenter - link.parent.y + control}
             ${link.parent.x},${yCenter - link.parent.y}`;
}

export function getUpwardLinkPath(link, yCenter) {
  const isResearch = link.data.name === "Research";
  const isSpecialBranch =
    (link.data.name === "d3" && link.parent.data.name === "PA-X") ||
    link.data.name === "Tracker" ||
    link.data.name === "Infographics";

  if (isResearch) {
    return createUpwardElbowPath(link, yCenter);
  }

  if (isSpecialBranch) {
    const extraDown =
      link.data.name === "Tracker" || link.data.name === "Infographics"
        ? 20
        : 0;
    return createUpwardElbowPath(link, yCenter, extraDown);
  }

  return `M${link.x},${yCenter - link.y}
                   C${link.x},${yCenter - link.parent.y - 20}
                    ${link.parent.x},${yCenter - link.parent.y - 50}
                    ${link.parent.x},${yCenter - link.parent.y}`;
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


