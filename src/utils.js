import * as d3 from "d3";

let original_data = {
  name: "Collect",
  tooltip_name: "Peace Agreement Collection",
  step: 0,
  branch_type: "trunk",
  ppl: 2,
  expertise: ["law", "international relations"],
  errors: ["missed agreements", "non-written agreements", "source bias", "source verification"],
  methods: ["web scraping", "news monitoring", "social media", "word of mouth", "email", "official websites"],
  time: 10,
  type: "pax_collect",
  segment_image: "segment_images/collection.png",
  link: "https://www.peaceagreements.org/agreements/search/",
  children: [
    {
      name: "Translate",
      tooltip_name: "Agreement Translation",
      step: 1,
      branch_type: "trunk",
      ppl: 25,
      expertise: ["interpretation", "translation", "domain knowledge", "legal terminology", "country context"],
      errors: ["translation errors", "misinterpretation"],
      methods: ["manual", "AI-assisted"],
      time: 50,
      type: "pax_translate",
      segment_image: "segment_images/translation.png",
      link: "https://www.peaceagreements.org/agreements/152/",
      children: [
        {
          name: "Transcribe",
          tooltip_name: "Agreement Transcription",
          step: 2,
          branch_type: "trunk",
          ppl: 2,
          expertise: ["data entry"],
          errors: ["typos", "duplicate text", "table extraction issues", "handwriting detection issues"],
          methods: ["OCR", "hand-typed", "copy-paste", "automated extraction"],
          time: 40,
          type: "pax_transcribe",
          segment_image: "segment_images/transcription.png",
          link: "https://www.peaceagreements.org/agreements/1688/",
          children: [
            {
              name: "Code",
              tooltip_name: "Thematic Coding",
              step: 3,
              branch_type: "trunk",
              ppl: 40,
              expertise: ["data entry", "political science", "country context", "conflict resolution", "law", "international relations"],
              errors: ["untagged segments", "missing data", "incomplete tag removal", "coding manual misinterpretation", "inter-coder disagreement"],
              methods: ["manual", "AI-assisted"],
              time: 90,
              type: "pax_code",
              segment_image: "segment_images/coding.png",
              link: "https://www.peaceagreements.org/cms/documents/4196/PA_X_codebook_v9.pdf",
              children: [
                {
                  name: "Quality Control",
                  tooltip_name: "PA-X Quality Control",
                  step: 4,
                  branch_type: "trunk",
                  ppl: 7,
                  expertise: ["substantive expertise", "PA-X coding context"],
                  errors: ["untagged segments", "missing data", "incomplete tag removal"],
                  methods: ["resolve coding questions", "review during coding", "include if in doubt"],
                  time: 20,
                  type: "pax_quality_control",
                  segment_image: "segment_images/qc.png",
                  children: [
                    {
                      name: "PA-X",
                      tooltip_name: "PA-X Database",
                      step: 5,
                      branch_type: "trunk",
                      ppl: 3,
                      expertise: ["software engineering", "database management", "web-development"],
                      errors: ["database anomalies", "data integrity issues", "incomplete coverage"],
                      methods: ["manual entry", "automated processing"],
                      time: 30,
                      type: "pax_db",
                      segment_image: "segment_images/pax_db.png",
                      link: "https://www.peaceagreements.org/agreements/search/",
                      children: [
                        {
                          name: "Research",
                          tooltip_name: "Research",
                          step: 9,
                          branch_type: "uppest_trunk",
                          ppl: 50,
                          expertise: ["law", "international relations", "political science", "data science", "visualization", "peace studies", "conflict resolution"],
                          errors: ["methodology", "analysis", "interpretation"],
                          methods: ["quantitative", "qualitative", "mixed"],
                          time: 90,
                          type: "research",
                          segment_image: "segment_images/research.png",
                          link: "https://peacerep.org/publications-database/",
                          children: [
                            {
                              name: "paper",
                              tooltip_name: "Data Reports", /*changed to data report on tooltip?*/
                              step: 10,
                              branch_type: "leaf",
                              ppl: 5,
                              expertise: ["law", "international relations", "political science", "data science", "visualization", "peace studies", "conflict resolution"],
                              errors: ["interpretation", "argumentation", "writing"],
                              methods: ["quantitative research", "qualitative research", "mixed methods"],
                              time: 30,
                              type: "data_report",
                              segment_image: "segment_images/report.png",
                              link: "https://peacerep.org/publication/peace-agreements-in-2024/", /*PA-X data report for 2024 (will be 2025 - udpate here with new version)*/
                            },
                            {
                              name: "paper",
                              tooltip_name: "Books",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 8,
                              expertise: ["law", "international relations", "political science", "data science", "visualization"],
                              errors: ["interpretation", "argumentation", "writing"],
                              methods: ["quantitative research", "qualitative research", "mixed methods"],
                              time: 30,
                              type: "book",
                              segment_image: "segment_images/book.png",
                              link: "https://peacerep.org/publication/peacetech-digital-transformation-to-end-wars/", /*since book putting Christine's as PA-X fed into it*/
                            },
                            {
                              name: "paper",
                              tooltip_name: "Journal Articles",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 10,
                              expertise: ["law", "international relations", "political science", "data science", "information visualization"],
                              errors: ["interpretation", "argumentation", "writing"],
                              methods: ["quantitative research", "qualitative research", "mixed methods"],
                              time: 30,
                              type: "journal",
                              segment_image: "segment_images/journal.png",
                              link: "https://peacerep.org/publication/introducing-pa-x-a-new-peace-agreement-database-and-dataset/" /*put link to introducing PA-X */
                            },
                            {
                              name: "paper",
                              tooltip_name: "Blogs",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 10,
                              expertise: ["policy", "pracitioner experience", "international relations", "political science", "data science", "information visualization"],
                              errors: ["structure", "argument", "writing"],
                              methods: ["quantitative research", "qualitative research", "mixed methods"],
                              time: 30,
                              type: "blog",
                              segment_image: "segment_images/blog.png",
                              link: "https://peacerep.org/category/blog/" /*put link to all blogs on peacerep but could do specific pax ones? */
                            },
                            {
                              name: "paper",
                              tooltip_name: "Conference Publications",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 3,
                              expertise: ["law", "international relations", "political science", "data science", "information visualization"],
                              errors: ["structure", "argument", "writing"],
                              methods: ["quantitative", "qualitative", "mixed"],
                              time: 30,
                              segment_image: "segment_images/conference.png",
                              link: "https://peacerep.org/publication/visualizing-peace-and-transition-process-trajectories/", /*link to conference publications on peacerep but could do specific ones? */
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
                          expertise: ["data entry", "political science", "country context", "gender perspectives"],
                          errors: ["untagged segments", "missing data", "incomplete tags removal"],
                          methods: ["manual coding", "AI-assisted coding"],
                          time: 50,
                          type: "pax_gender_code",

                          segment_image: "segment_images/coding.png",
                          link: "https://www.peaceagreements.org/cms/documents/3925/PA_X_codebook_wgg_v8.pdf",
                          children: [
                            {
                              name: "Quality Control",
                              tooltip_name: "PA-X Gender Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              expertise: ["2 years of substantive expertise with PA-X Gender"],
                              errors: ["untagged segments", "missing data", "incomplete tag removal"],
                              methods: ["resolve coding questions", "review during coding", "include if in doubt"],
                              time: 20,
                              type: "pax_gender_quality_control",
                              segment_image: "segment_images/qc.png",
                              children: [
                                {
                                  name: "PA-X Gender",
                                  tooltip_name: "PA-X Gender Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  expertise: ["software engineering", "database management", "web-development"],
                                  errors: ["database anomalies", "data integrity issues"],
                                  methods: ["manual", "automatic"],
                                  time: 10,
                                  type: "pax_gender_db",
                                  segment_image: "segment_images/pax_gender_db.png",
                                  link: "https://www.peaceagreements.org/agreements/wggsearch/",
                                  children: [
                                    {
                                      name: "App Development",
                                      tooltip_name: "PeaceFem App Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 4,
                                      expertise: ["software engineering", "data integration", "mobile development", "domain expertise"],
                                      errors: ["syntax", "runtime", "logic"],
                                      methods: ["kotlin", "swift"],
                                      time: 50,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      children: [
                                        {
                                          name: "PeaceFem",
                                          tooltip_name: "PeaceFem App",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["data interpretation", "policy context", "gender context"],
                                          errors: ["misinterpretation", "navigation ambiguity", "update lag"],
                                          methods: ["mobile app", "interactive browsing", "resource navigation"],
                                          time: 10,
                                          type: "app",
                                          segment_image: "segment_images/peacefem.png",
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
                                      expertise: ["software engineering", "data management", "web development", "information visualization", "design", "data analysis", "gender studies"],
                                      errors: ["syntax", "runtime", "logic"],
                                      methods: ["d3", "svelte", "git", "python"],
                                      time: 40,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      link: "https://github.com/peacerep/pax_gender",
                                      children: [
                                        {
                                          name: "Scrollytelling",
                                          tooltip_name: "PA-X Gender Scrollytelling",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 2,
                                          expertise: ["visual literacy", "data interpretation", "gender context"], //these were same as dev - changing it to the expertise required by the users of the vis?
                                          errors: ["misinterpretation", "visual encoding"],
                                          methods: ["scrollytelling", "interactive charts", "narrative flow"],
                                          time: 10,
                                          type: "vis",
                                          segment_image: "segment_images/gender.png",
                                          link: "https://www.peaceagreements.org/visualizations/gender-vis/",
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
                          expertise: ["law", "children and youth context"],
                          errors: ["untagged segments", "missing data", "coding drift"],
                          methods: ["manual"],
                          time: 100,
                          type: "pax_children_code",
                          segment_image: "segment_images/coding.png",
                          link: "https://peacerep.org/wp-content/uploads/2023/10/Children-AND-Youth-in-Peace-Agreement-Database-Codebook.pdf", //added codebook here
                          children: [
                            {
                              name: "Quality Control",
                              tooltip_name: "PA-X Children & Youth Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              expertise: ["legal expertise", "children and youth context"],
                              errors: ["untagged segments", "missing data", "incomplete tags removal"],
                              methods: ["ironout questions", "do as we code", "include if in doubt"],
                              time: 20,
                              type: "pax_children_quality_control",
                              segment_image: "segment_images/qc.png",
                              children: [
                                {
                                  name: "Children & Youth",
                                  tooltip_name: "PA-X Children & Youth Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  expertise: ["software engineering", "database management", "web-development"],
                                  errors: ["database anomalies", "update errors"],
                                  methods: ["manual"],
                                  time: 10,
                                  type: "pax_children_db",
                                  segment_image: "segment_images/ch_y_db.png",
                                  link: "https://peacerep.org/children-and-youth-database/",
                                  children: [
                                    {
                                      name: "PBi Youth Development",
                                      tooltip_name: "PA-X Children & Youth Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["data modelling", "data analysis", "visualization"],
                                      errors: ["data & infrastructure", "visualization issues"],
                                      methods: ["powerBI", "dashboard design", "interactive reporting"],
                                      time: 10,
                                      type: "prog",
                                      segment_image: "segment_images/bi_development.png",
                                      children: [
                                        {
                                          name: "PBi Youth",
                                          tooltip_name: "PA-X Children & Youth Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["data interpretation", "visual literacy", "children and youth context"],
                                          errors: ["misinterpretation", "visual encoding", "category ambiguity"],
                                          methods: ["interactive dashboard", "topic-based exploration", "multi-page navigation"],
                                          time: 10,
                                          type: "vis",
                                          segment_image: "segment_images/children.png",
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
                          expertise: ["data entry", "political science", "country context", "local context"],
                          errors: ["untagged segments", "missing data", "incomplete tag removal"],
                          methods: ["manual coding", "AI-assisted coding"],
                          time: 100,
                          type: "pax_local_code",
                          segment_image: "segment_images/coding.png",
                          link: "https://www.peaceagreements.org/cms/documents/3924/PA_X_codebook_local_v8.pdf",
                          children: [
                            {
                              name: "Quality Control",
                              tooltip_name: "PA-X Local Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 7,
                              expertise: ["substantive expertise", "local peace process knowledge"],
                              errors: ["untagged segments", "missing data", "incomplete tag removal"],
                              methods: ["resolve coding questions", "review during coding", "include if in doubt"],
                              time: 20,
                              type: "pax_local_quality_control",
                              segment_image: "segment_images/qc.png",
                              children: [
                                {
                                  name: "PA-X Local",
                                  tooltip_name: "PA-X Local Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  expertise: ["software engineering", "database management", "web development"],
                                  errors: ["database anomalies", "data integrity issues", "geocoding uncertainty", "incomplete coverage", "source bias"],
                                  methods: ["manual", "automatic"],
                                  time: 10,
                                  type: "pax_local_db",
                                  segment_image: "segment_images/pax_local_db.png",
                                  link: "https://www.peaceagreements.org/agreements/lsearch/",
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
                                      segment_image: "segment_images/programming.png",
                                      link: "https://github.com/peacerep/pax_local",
                                      children: [
                                        {
                                          name: "Map",
                                          tooltip_name: "PA-X Local Map Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["map interpretation", "visual literacy", "local context"],
                                          errors: ["misinterpretation", "spatial ambiguity", "visual encoding"],
                                          methods: ["interactive map", "spatial exploration"],
                                          time: 10,
                                          type: "vis",
                                          segment_image: "segment_images/local.png",
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
                          tooltip_name: "PAA-X Thematic Coding",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 2,
                          expertise: ["natural language processing", "political science", "country context", "actor context"],
                          errors: ["missed actors", "misattributed actors", "generic actor terms"],
                          methods: ["manual coding", "named entity recognition", "dictionary matching"],
                          time: 100,
                          type: "paax_code",
                          segment_image: "segment_images/coding.png",
                          children: [
                            {
                              name: "Quality Control",
                              tooltip_name: "PAA-X Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 2,
                              expertise: ["substantive expertise", "actor and agreement context"],
                              errors: ["misattributed actors", "missing signatory data"],
                              methods: ["manual verification", "agreement-level review"],
                              time: 20,
                              type: "paax_quality_control",
                              segment_image: "segment_images/qc.png",
                              children: [
                                {
                                  name: "PAA-X",
                                  tooltip_name: "PAA-X Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 1,
                                  expertise: ["structured data handling", "political science", "country context", "actor context"],
                                  errors: ["data integrity issues", "duplicate records", "update lag"],
                                  methods: ["iterative updating", "manual and NER-assisted processing"],
                                  time: 10,
                                  type: "paax_db",
                                  children: [
                                    {
                                      name: "VUE",
                                      tooltip_name: "PAA-X Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["software engineering", "network visualization", "web development"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["Vue", "git", "interface design"], //Ben's network library (cannot remember name)
                                      time: 50,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      link: "https://github.com/peacerep/actor-network",
                                      children: [
                                        {
                                          name: "Actors-Network",
                                          tooltip_name: "PAA-X Actors-Network Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["network interpretation", "visual literacy", "actor context"],
                                          errors: ["misinterpretation", "relationship ambiguity", "visual encoding"],
                                          methods: ["interactive network", "actor exploration"],
                                          time: 10,
                                          type: "vis",
                                          segment_image: "segment_images/actor_network.png",
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
                                      expertise: ["software engineering", "information visualization", "web development", "actor context"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["d3", "git", "scrollytelling development"],
                                      time: 50,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      link: "https://github.com/tvancisin/peace_scroll", //can remove if dont want to share
                                      children: [
                                        {
                                          name: "3rd Party Scroll",
                                          tooltip_name: "PAA-X 3rd Party Scroll Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 3,
                                          expertise: ["data interpretation", "visual literacy", "third-party actor context"],
                                          errors: ["misinterpretation", "visual encoding", "narrative framing"],
                                          methods: ["scrollytelling", "interactive visualization", "narrative sequencing"],
                                          time: 10,
                                          type: "vis",
                                          segment_image: "segment_images/3rd_scroll.png",
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
                                      expertise: ["network analysis", "actor context"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["Python", "streamlit", "git"],
                                      time: 50,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      children: [
                                        {
                                          name: "Network",
                                          tooltip_name: "PAA-X Network Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["network interpretation", "actor context"],
                                          errors: ["misinterpretation", "relationship ambiguity", "visual encoding"],
                                          methods: ["network visualization", "relationship exploration", "pattern identification"],
                                          time: 10,
                                          type: "vis",
                                          segment_image: "segment_images/network.png",
                                          link: "https://peacerep.org/signatories-network-analysis/",
                                        },
                                      ],
                                    },
                                    {
                                      name: "Tracker Development",
                                      tooltip_name: "PA-X Tracker Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["data engineering", "product design", "political science", "mediation expertise", "user engagement", "web-development"],
                                      errors: ["uneven data availability", "limited interoperability", "indicator variability", "scalability constraints"],
                                      methods: ["PowerBi", "Python", "iterative design"],
                                      time: 50,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      link: "https://github.com/peacerep/tracker_globe",
                                      children: [
                                        {
                                          name: "Tracker",
                                          tooltip_name: "PA-X Tracker Platform",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 3,
                                          expertise: ["data interpretation", "comparative analysis", "policy context"],
                                          errors: ["performance limitations", "information complexity", "navigation ambiguity", "loading time"],
                                          methods: ["interactive platform", "comparative exploration", "dashboards, timelines, networks, maps"],
                                          time: 50,
                                          type: "vis",
                                          segment_image: "segment_images/tracker.png",
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
                          expertise: ["software engineering", "web development", "information visualization", "domain expertise"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["d3", "git"],
                          time: 50,
                          type: "prog",
                          segment_image: "segment_images/programming.png",
                          link: "https://github.com/peacerep/v7_messy_timeline",
                          children: [
                            {
                              name: "Messy Timeline",
                              tooltip_name: "Messy Timeline Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 3,
                              expertise: ["data interpretation", "visual literacy"],
                              errors: ["misinterpretation", "visual encoding"],
                              methods: ["interactive timeline", "temporal exploration"],
                              time: 10,
                              type: "vis",
                              segment_image: "segment_images/messy.png",
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
                          expertise: ["software engineering", "web development", "information visualization", "domain expertise"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["d3", "git"],
                          time: 50,
                          type: "prog",
                          segment_image: "segment_images/programming.png",
                          link: "https://github.com/peacerep/pax-map",
                          children: [
                            {
                              name: "Time & Space",
                              tooltip_name: "Time & Space Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 5,
                              expertise: ["data interpretation", "visual literacy", "spatial and temporal understanding"],
                              errors: ["misinterpretation", "visual encoding"],
                              methods: ["interactive visualization", "map-based exploration", "temporal exploration"],
                              time: 10,
                              type: "vis",
                              segment_image: "segment_images/patels.png",
                              link: "https://www.peaceagreements.org/visualizations/agreements-process-map/"
                            },
                          ],
                        },
                        {
                          name: "d3",
                          tooltip_name: "Sequence Comparison Visualization Development",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 1,
                          expertise: ["software engineering", "web development", "information visualization", "domain expertise"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["d3", "git"],
                          time: 50,
                          type: "prog",
                          segment_image: "segment_images/programming.png",
                          link: "https://github.com/peacerep/compare-sequences",
                          children: [
                            {
                              name: "Sequence Comparison",
                              tooltip_name: "Sequence Comparison Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 1,
                              expertise: ["data interpretation", "visual literacy", "comparative analysis"],
                              errors: ["misinterpretation", "comparison ambiguity", "visual encoding"],
                              methods: ["interactive visualization", "sequence comparison", "comparative exploration"],
                              time: 50,
                              type: "vis",
                              segment_image: "segment_images/sequence.png",
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
                          expertise: ["software engineering", "web development", "information visualization", "domain expertise"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["d3", "git"],
                          time: 50,
                          type: "prog_overview",
                          segment_image: "segment_images/programming.png",
                          link: "https://github.com/peacerep/hierarchy",
                          children: [
                            {
                              name: "Data Overview",
                              tooltip_name: "Data Overview Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 2,
                              expertise: ["data interpretation", "visual literacy"],
                              errors: ["misinterpretation", "visual encoding", "information complexity"],
                              methods: ["interactive visualization", "data overview", "exploratory navigation"],
                              time: 50,
                              type: "vis",
                              segment_image: "segment_images/hierarchy.png",
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
                          expertise: ["domain expertise", "data analysis", "graphics design"],
                          errors: ["text", "visual encoding"],
                          methods: ["Inkscape"],
                          time: 10,
                          type: "pdf",
                          segment_image: "segment_images/infographics.png",
                          link: "https://peacerep.org/digital-resources/infographics/",
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
      tooltip_name: "Agreement",
      children: [{ name: "negotiation", tooltip_name: "Negotiation", children: [{ name: "conflict", tooltip_name: "Conflict" }] }],
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


