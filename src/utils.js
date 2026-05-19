import * as d3 from "d3";

let original_data = {
  name: "Collect",
  description: `The Peace Agreement Collection is maintained by
  two researchers with expertise in law and international relations.
  It is an ongoing process that compiles data from a wide range of sources,
  including web scraping, NGO reports, books, news monitoring, social media,
  word of mouth, email correspondence, and official websites. Key recurring
  challenges include identifying agreements that may have been missed,
  accounting for non-written agreements, addressing source bias, verifying
  information, and deciding whether a given agreement should be included.`,
  tooltip_name: "Peace Agreement Collection",
  step: 0,
  branch_type: "trunk",
  ppl: 2,
  expertise: ["law", "international relations"],
  errors: ["missed agreements", "non-written agreements", "source bias", "source verification", "deciding whether to include an agreement"],
  methods: ["web scraping", "NGO reports", "books", "news monitoring", "social media", "word of mouth", "email", "official websites"],
  time: "continuous",
  type: "pax_collect",
  segment_image: "segment_images/collection.png",
  link: "https://www.peaceagreements.org/agreements/search/",
  children: [
    {
      name: "Translate",
      description: `Agreement Translation has involved 25 contributors with
      expertise in interpretation, translation, legal terminology, domain knowledge,
      and country-specific context. This stage is carried out as part of periodic dataset
      releases, typically requiring around 50 hours of work per contributor per version,
      using a combination of manual and AI-assisted methods. In total, 571 agreements
      (2,493 pages) have been translated, representing an estimated 2,493 hours of labour.
      Common challenges include translation errors and misinterpretation risk.`,
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
          description: `Agreement Transcription has involved two contributors
          with expertise in data entry. This stage is undertaken as part of periodic
          dataset releases and combines OCR, hand-typing, copy-paste,
          and automated extraction methods. Each release typically requires around
          40 hours of processing time, alongside item-level transcription effort.
          In total, approximately 1,000 items (around 3,500 pages) have been
          processed, roughly half via OCR and half manually, amounting to an estimated
          875 hours of hand-typing labour. Common challenges include typographical
          errors, duplicate text, table extraction issues, handwriting detection
          issues, and removal of personal information.`,
          tooltip_name: "Agreement Transcription",
          step: 2,
          branch_type: "trunk",
          ppl: 2,
          expertise: ["data entry"],
          errors: ["typos", "duplicate text", "table extraction issues", "handwriting detection issues", "removal of personal information"],
          methods: ["OCR", "hand-typed", "copy-paste", "automated extraction"],
          time: 40,
          type: "pax_transcribe",
          segment_image: "segment_images/transcription.png",
          link: "https://www.peaceagreements.org/agreements/1688/",
          children: [
            {
              name: "Code",
              description: `Thematic Coding has, to date, involved 40 contributors with 
              expertise in data entry, political science, country context, conflict 
              resolution, law, and international relations. This stage is undertaken 
              as part of periodic dataset releases, with each contributor typically 
              contributing around 120 hours of work per release. It combines manual and 
              AI-assisted coding approaches. In addition, item-level coding requires 
              approximately 2 hours per A4 page. In total, 14,067 pages have been coded. 
              Common challenges include untagged segments, missing data, incomplete tag 
              removal, misinterpretation of coding manuals, and inter-coder disagreement.`,
              tooltip_name: "Thematic Coding",
              step: 3,
              branch_type: "trunk",
              ppl: 40,
              expertise: ["data entry", "political science", "country context", "conflict resolution", "law", "international relations"],
              errors: ["untagged segments", "missing data", "incomplete tag removal", "coding manual misinterpretation", "inter-coder disagreement"],
              methods: ["manual", "AI-assisted"],
              time: 120,
              type: "pax_code",
              segment_image: "segment_images/coding.png",
              link: "https://www.peaceagreements.org/cms/documents/3956/PA_X_codebook_v10.pdf",
              children: [
                {
                  name: "Quality Control",
                  description: `PA-X Quality Control has, to date, involved 7 contributors 
                  with substantive expertise in PA-X coding and context. This stage is 
                  undertaken as part of periodic dataset releases, with each contributor 
                  typically completing around 40 hours of collaborative review work per 
                  release. It focuses on resolving coding questions, reviewing decisions 
                  made during coding, and applying inclusion when cases are uncertain. 
                  Common challenges include dealing with untagged segments, missing data, 
                  incomplete tag removal, coding inconsistencies, and ensuring adherence 
                  to the coding manual.`,
                  tooltip_name: "PA-X Quality Control",
                  step: 4,
                  branch_type: "trunk",
                  ppl: 7,
                  expertise: ["substantive expertise", "PA-X coding context"],
                  errors: ["untagged segments", "missing data", "incomplete tag removal", "coding inconsistency", "adherence to coding manual"],
                  methods: ["resolve coding questions", "review during coding", "include if in doubt"],
                  time: 40,
                  type: "pax_quality_control",
                  segment_image: "segment_images/qc.png",
                  children: [
                    {
                      name: "PA-X",
                      description: `Publishing a new PA-X release has, to date, involved 3 contributors 
                      with expertise in software engineering, database management, and web development. 
                      This stage is undertaken as part of periodic dataset releases, with each 
                      contributor typically completing around 8 hours of work per release. 
                      It uses a combination of manual entry and automated processing to maintain 
                      and update the system. Common challenges include database anomalies, data integrity issues, 
                      incomplete coverage, and inconsistencies in website text.`,
                      tooltip_name: "PA-X Database",
                      step: 5,
                      branch_type: "trunk",
                      ppl: 3,
                      expertise: ["software engineering", "database management", "web-development"],
                      errors: ["database anomalies", "data integrity issues", "incomplete coverage", "website text inconsistencies"],
                      methods: ["manual entry", "automated processing"],
                      time: 8,
                      type: "pax_db",
                      segment_image: "segment_images/pax_db.png",
                      link: "https://www.peaceagreements.org/agreements/search/",
                      children: [
                        {
                          name: "Research",
                          description: `Research has, to date, involved around 50 contributors with expertise in law, international relations, 
                          political science, data science, visualization, peace studies, and conflict resolution. This stage is a continuous process, 
                          drawing on quantitative, qualitative, and mixed-method approaches to support analysis and interpretation of the dataset. 
                          Common challenges include dealing with methodological decisions, analytical complexity, and interpretive consistency.`,
                          tooltip_name: "Research",
                          step: 9,
                          branch_type: "uppest_trunk",
                          ppl: 50,
                          expertise: ["law", "international relations", "political science", "data science", "visualization", "peace studies", "conflict resolution"],
                          errors: ["methodology", "analysis", "interpretation"],
                          methods: ["quantitative", "qualitative", "mixed"],
                          time: "continuous",
                          type: "research",
                          segment_image: "segment_images/research.png",
                          link: "https://peacerep.org/publications-database/",
                          children: [
                            {
                              name: "paper",
                              description: `Data Reports have, to date, involved 10 contributors with expertise in law, 
                              international relations, political science, data science, visualization, peace studies, 
                              and conflict resolution. This stage is undertaken as part of periodic dataset releases, 
                              with each contributor typically completing around 10 hours of work per release. 
                              It involves quantitative, qualitative, and mixed-method approaches to analysis and 
                              interpretation of the dataset. Common challenges include interpretive framing, 
                              analytical argumentation, and academic writing clarity.`,
                              tooltip_name: "Data Reports",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 10,
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
                              description: `Writing of Journal/Conference Articles has, to date, involved  aorund 20 contributors with expertise in law, international relations, 
                              political science, data science, and information visualization. This stage draws on quantitative, qualitative, and mixed-method 
                              approaches and typically requires around 100 hours of collaborative research, analysis, and writing per output. In total, 
                              nearly 40 articles related to PA-X and/or PeaceTech tools have been published. Common challenges include interpretation, 
                              argumentation, and academic writing.`,
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
                              description: `One of the research outputs is a book called PeaceTech: Digital Transformation to End Wars,
                              which summarizes how technology can be used in peacebuilding. It was written by Christine Bell, an expert in law, 
                              international relations, and political science. It is a scholarly output that draws on quantitative, qualitative, 
                              and mixed-method approaches, developed over an extended period of sustained research and synthesis, taking 
                              approximately 320 hours of work. Common challenges include interpretation, argumentation, and academic writing.`,
                              tooltip_name: "Book",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 1,
                              expertise: ["law", "international relations", "political science"],
                              errors: ["interpretation", "argumentation", "writing"],
                              methods: ["quantitative research", "qualitative research", "mixed methods"],
                              time: 320,
                              type: "book",
                              segment_image: "segment_images/book.png",
                              link: "https://peacerep.org/publication/peacetech-digital-transformation-to-end-wars/", /*since book putting Christine's as PA-X fed into it*/
                            },
                            {
                              name: "paper",
                              description: `Writing of blogs has, to date, involved around 50 contributors with expertise in policy, 
                              practitioner experience, international relations, political science, data science, and information visualization. 
                              This process supports the production of research-informed blog outputs and draws on quantitative, qualitative, 
                              and mixed-method approaches. In total, 278 blogs have been written, typically requiring around 5 hours per 
                              production cycle. Common challenges include structure, argumentation, and writing clarity.`,
                              tooltip_name: "Blogs",
                              step: 10,
                              branch_type: "leaf",
                              ppl: 20,
                              expertise: ["policy", "pracitioner experience", "international relations", "political science", "data science", "information visualization"],
                              errors: ["structure", "argument", "writing"],
                              methods: ["quantitative research", "qualitative research", "mixed methods"],
                              time: 5,
                              type: "blog",
                              segment_image: "segment_images/blog.png",
                              link: "https://peacerep.org/category/blog/"
                            },
                          ],
                        },
                        {
                          name: "Code",
                          description: `PA-X Gender Thematic Coding has, to date, involved 13 contributors with expertise in data entry, 
                          political science, country context, and gender perspectives. This stage is undertaken as part of periodic dataset 
                          releases, with each contributor typically contributing around 50 hours of work per release. It combines manual and 
                          AI-assisted coding approaches. Common challenges include dealing with untagged segments, missing data, incomplete tag removal, 
                          and ensuring accurate identification of female-coded content.`,
                          tooltip_name: "PA-X Gender Thematic Coding",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 13,
                          expertise: ["data entry", "political science", "country context", "gender perspectives"],
                          errors: ["untagged segments", "missing data", "incomplete tags removal", "ensuring accurate identification of females"],
                          methods: ["manual coding", "AI-assisted coding"],
                          time: 50,
                          type: "pax_gender_code",
                          segment_image: "segment_images/coding.png",
                          link: "https://www.peaceagreements.org/cms/documents/3925/PA_X_codebook_wgg_v8.pdf",
                          children: [
                            {
                              name: "Quality Control",
                              description: `PA-X Gender Quality Control has, to date, involved 2 contributors with at 
                              least two years of substantive expertise in PA-X Gender coding. This stage is undertaken 
                              as part of periodic dataset releases, with each contributor typically contributing around 
                              40 hours of review work per release. It focuses on resolving coding questions, reviewing 
                              decisions during coding, and applying inclusion when cases are uncertain. Common challenges 
                              include untagged segments, missing data, and incomplete tag removal.`,
                              tooltip_name: "PA-X Gender Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 2,
                              expertise: ["2 years of substantive expertise with PA-X Gender"],
                              errors: ["untagged segments", "missing data", "incomplete tag removal"],
                              methods: ["resolve coding questions", "review during coding", "include if in doubt"],
                              time: 40,
                              type: "pax_gender_quality_control",
                              segment_image: "segment_images/qc.png",
                              children: [
                                {
                                  name: "PA-X Gender",
                                  description: `Publishing a new PA-X Gender release has, to date, involved 3 contributors with expertise
                                  in software engineering, database management, and web development. This stage is undertaken 
                                  as part of periodic dataset releases, with each contributor typically contributing around 8 
                                  hours of work per release. It uses a combination of manual and automated processes to maintain 
                                  and update the database. Common challenges include database anomalies and data integrity issues.`,
                                  tooltip_name: "PA-X Gender Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  expertise: ["software engineering", "database management", "web-development"],
                                  errors: ["database anomalies", "data integrity issues"],
                                  methods: ["manual", "automatic"],
                                  time: 8,
                                  type: "pax_gender_db",
                                  segment_image: "segment_images/pax_gender_db.png",
                                  link: "https://www.peaceagreements.org/agreements/wggsearch/",
                                  children: [
                                    {
                                      name: "App Development",
                                      description: `PeaceFem App Development involved UN Women, Inclusive Peace, Monash University, 
                                      and the University of Edinburgh. Each institution contributed approximately 50 hours of 
                                      work to a one-off development effort led by 4 collaborating teams with expertise in software 
                                      engineering, data integration, mobile development, and domain knowledge. The result is PeaceFem, 
                                      a free mobile application designed to support inclusive peacemaking by providing data and strategies 
                                      for women’s inclusion in peace processes. The app allows users to explore gender provisions in peace 
                                      agreements through searchable case studies and offline access. Common challenges included syntax errors, 
                                      runtime issues, implementation logic, and cross-platform integration.`,
                                      tooltip_name: "PeaceFem App Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 4,
                                      expertise: ["software engineering", "data integration", "mobile development", "domain expertise"],
                                      errors: ["syntax", "runtime", "logic", "cross-platform integration"],
                                      methods: ["kotlin", "swift"],
                                      time: 50,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      children: [
                                        {
                                          name: "PeaceFem",
                                          description: `PeaceFem App is maintained by 1 contributor with expertise in data interpretation,
                                          policy context, and gender analysis. This stage typically requires around 2 hours of work and 
                                          supports ongoing maintenance of the mobile application, which enables interactive browsing and 
                                          resource navigation. Common challenges include misinterpretation of content, navigation ambiguity, 
                                          and update lag.`,
                                          tooltip_name: "PeaceFem App",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["data interpretation", "policy context", "gender context"],
                                          errors: ["misinterpretation", "navigation ambiguity", "update lag"],
                                          methods: ["mobile app", "interactive browsing", "resource navigation"],
                                          time: 2,
                                          type: "app",
                                          segment_image: "segment_images/peacefem.png",
                                          link: "https://peacerep.org/digital-resources/peacefem/",
                                        },
                                      ]
                                    },
                                    {
                                      name: "d3",
                                      description: `PA-X Gender Visualization Development has, to date, involved 3 contributors 
                                      with expertise in software engineering, data management, web development, information visualization, 
                                      design, data analysis, and gender studies. Development has taken approximately 200 hours. It uses 
                                      tools such as D3.js, Svelte, Git, and Python to support visualization design and implementation. 
                                      Common challenges include syntax errors, runtime issues, and logical implementation problems.`,
                                      tooltip_name: "PA-X Gender Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["software engineering", "data management", "web development", "information visualization", "design", "data analysis", "gender studies"],
                                      errors: ["syntax", "runtime", "logic"],
                                      methods: ["D3.js", "svelte", "git", "python"],
                                      time: 40,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      link: "https://github.com/peacerep/pax_gender",
                                      children: [
                                        {
                                          name: "Scrollytelling",
                                          description: `PA-X Gender Scrollytelling Visualization is maintained by 2 contributors with expertise in data 
                                          engineering and web development. This stage typically requires around 2 hours of maintenance and 
                                          development work. It uses scrollytelling techniques, interactive charts, and narrative flow to support 
                                          engagement with the data. Common challenges include data consistency issues and runtime errors in the application.`,
                                          tooltip_name: "PA-X Gender Scrollytelling",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 2,
                                          expertise: ["data engineering", "web development"],
                                          errors: ["data consistency", "runtime errors"],
                                          methods: ["scrollytelling", "interactive charts", "narrative flow"],
                                          time: 2,
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
                          description: `PA-X Children & Youth Thematic Coding has, to date, involved 1 contributor with 
                          expertise in law and children/youth contexts. This stage is undertaken as part of periodic 
                          dataset releases, with each contributor typically contributing around 100 hours of work per 
                          release. It uses manual coding approaches and common challenges include dealing with untagged 
                          segments, missing data, and coding drift.`,
                          tooltip_name: "PA-X Children & Youth Thematic Coding",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 1,
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
                              description: `PA-X Children & Youth Quality Control has, to date, involved 1 contributor 
                              with legal expertise and knowledge of children and youth contexts. This stage is undertaken 
                              as part of periodic dataset releases, with the contributor typically completing around 20 
                              hours of review work per release. It focuses on resolving coding questions, applying “do as 
                              we code” principles, and including cases where uncertainty remains. Common challenges include 
                              untagged segments, missing data, and incomplete tag removal.`,
                              tooltip_name: "PA-X Children & Youth Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 1,
                              expertise: ["legal expertise", "children and youth context"],
                              errors: ["untagged segments", "missing data", "incomplete tag removal"],
                              methods: ["ironout questions", "do as we code", "include if in doubt"],
                              time: 20,
                              type: "pax_children_quality_control",
                              segment_image: "segment_images/qc.png",
                              children: [
                                {
                                  name: "Children & Youth",
                                  description: `Publishing a new PA-X Children & Youth release has, to date,
                                  involved 1 contributor with expertise in software engineering, database management,
                                  and web development. This stage is undertaken as part of periodic dataset releases, 
                                  with each contributor typically contributing around 10 hours of work per release. It uses 
                                  manual processes to maintain and update the database. Common challenges include database 
                                  anomalies and update errors.`,
                                  tooltip_name: "PA-X Children & Youth Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 1,
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
                                      description: `PA-X Children & Youth Visualization Development has involved 1 contributor with 
                                      expertise in data modelling, data analysis, and visualization. This stage has required around 
                                      10 hours of development work. It uses tools such as PowerBI, dashboard design, and interactive 
                                      reporting to support data exploration and presentation. Common challenges include dealing with 
                                      data and infrastructure constraints, as well as visualization issues.`,
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
                                          description: `PA-X Children & Youth Visualization is maintained by 1 contributor with expertise
                                           in data interpretation, visual literacy, and children and youth context. This stage typically 
                                           requires around 2 hours of maintenance work. It uses interactive dashboards, topic-based 
                                           exploration, and multi-page navigation to support data interpretation. Common challenges 
                                           include misinterpretation, visual encoding issues, and category ambiguity.`,
                                          tooltip_name: "PA-X Children & Youth Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["data interpretation", "visual literacy", "children and youth context"],
                                          errors: ["misinterpretation", "visual encoding", "category ambiguity"],
                                          methods: ["interactive dashboard", "topic-based exploration", "multi-page navigation"],
                                          time: 2,
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
                          description: `PA-X Local Thematic Coding has, to date, involved 7 contributors with 
                          expertise in data entry, political science, country context, and local context. This 
                          stage is undertaken as part of periodic dataset releases, with each contributor typically 
                          contributing around 30 hours of work per release. It combines manual and/or AI-assisted coding 
                          approaches. Common challenges include dealing with untagged segments, missing data, and 
                          incomplete tag removal.`,
                          tooltip_name: "PA-X Local Thematic Coding",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 7,
                          expertise: ["data entry", "political science", "country context", "local context"],
                          errors: ["untagged segments", "missing data", "incomplete tag removal"],
                          methods: ["manual coding", "AI-assisted coding"],
                          time: 30,
                          type: "pax_local_code",
                          segment_image: "segment_images/coding.png",
                          link: "https://www.peaceagreements.org/cms/documents/3924/PA_X_codebook_local_v8.pdf",
                          children: [
                            {
                              name: "Quality Control",
                              description: `PA-X Local Quality Control has involved 2 contributors with expertise in
                              local peace processes. This stage usually takes around 30 hours and uses methods such as
                              resolving coding questions, reviewing decisions during coding, including uncertain cases,
                              geocoding, metadata verification, and cultural or linguistic checks. Common challenges
                              include untagged segments, missing data, and incomplete tag removal.`,
                              tooltip_name: "PA-X Local Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 2,
                              expertise: ["local peace process"],
                              errors: ["untagged segments", "missing data", "incomplete tag removal"],
                              methods: ["resolve coding questions", "review during coding", "include if in doubt", "geocoding", "metadata verification", "cultural/linguistic chal"],
                              time: 30,
                              type: "pax_local_quality_control",
                              segment_image: "segment_images/qc.png",
                              children: [
                                {
                                  name: "PA-X Local",
                                  description: `Publishing a new PA-X Local release has, to date, involved 3 contributors 
                                  with expertise in software engineering, database management, and web development. This stage is 
                                  undertaken as part of periodic dataset releases, with each contributor typically contributing 
                                  around 8 hours of work per release. It uses a combination of manual and automated processes to 
                                  maintain and update the database. Common challenges include database anomalies, data integrity 
                                  issues, geocoding uncertainty, incomplete coverage, and source bias.`,
                                  tooltip_name: "PA-X Local Database",
                                  step: 8,
                                  branch_type: "upper_trunk",
                                  ppl: 3,
                                  expertise: ["software engineering", "database management", "web development"],
                                  errors: ["database anomalies", "data integrity issues", "geocoding uncertainty", "incomplete coverage", "source bias"],
                                  methods: ["manual", "automatic"],
                                  time: 8,
                                  type: "pax_local_db",
                                  segment_image: "segment_images/pax_local_db.png",
                                  link: "https://www.peaceagreements.org/agreements/lsearch/",
                                  children: [
                                    {
                                      name: "d3 local",
                                      description: `PA-X Local Visualization Development has involved 1 contributor with expertise 
                                      in software engineering, data management, and web development. This stage has required around 
                                      200 hours of development work. It uses tools such as D3.js and Git to support visualization design 
                                      and implementation. Common challenges include syntax errors, runtime issues, logical 
                                      implementation problems, and visual encoding.`,
                                      tooltip_name: "PA-X Local Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["software engineering", "data management", "web development"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["D3.js", "git"],
                                      time: 200,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      link: "https://github.com/peacerep/pax_local",
                                      children: [
                                        {
                                          name: "Map",
                                          description: `PA-X Local Map Visualization is maintained by 2 contributors with expertise
                                          in data engineering and web development. This stage typically requires 
                                          around 10 hours of maintenance work. It uses interactive maps and spatial exploration to 
                                          support interpretation of local peace process data. Common challenges include data consistency 
                                          issues and runtime errors in the application.`,
                                          tooltip_name: "PA-X Local Map Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 2,
                                          expertise: ["data engineering", "web development"],
                                          errors: ["data consistency", "runtime errors"],
                                          methods: ["interactive map", "spatial exploration"],
                                          time: 2,
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
                          description: `PAA-X Thematic Coding involves 2 contributors with expertise in natural 
                          language processing, political science, country context, and actor context. This stage is undertaken 
                          as part of periodic dataset releases, with each contributor typically contributing around 100 hours 
                          of work per release. It combines manual coding, named entity recognition, and dictionary matching to 
                          identify actors and individuals. Common challenges include dealing with missed actors, misattributed 
                          actors, and generic actor terms.`,
                          tooltip_name: "PAA-X Thematic Coding",
                          step: 6,
                          branch_type: "upper_trunk",
                          ppl: 2,
                          expertise: ["natural language processing", "political science", "country context", "actor context"],
                          errors: ["missed actors", "misattributed actors", "generic actor terms"],
                          methods: ["manual coding", "named entity recognition", "dictionary matching", "identifying individuals"],
                          time: 100,
                          type: "paax_code",
                          segment_image: "segment_images/coding.png",
                          children: [
                            {
                              name: "Quality Control",
                              description:`PAA-X Quality Control involves 2 contributors with substantive expertise 
                              in actor and agreement context. This stage is undertaken as part of periodic dataset releases, 
                              with each contributor typically contributing around 20 hours of work per release. It focuses on 
                              manual verification and agreement-level review. Common challenges include misattributed actors 
                              and missing signatory data.`, 
                              tooltip_name: "PAA-X Quality Control",
                              step: 7,
                              branch_type: "upper_trunk",
                              ppl: 2,
                              expertise: ["substantive expertise", "actor and agreement context"],
                              errors: ["misattributed actors", "missing signatory data",],
                              methods: ["manual verification", "agreement-level review"],
                              time: 20,
                              type: "paax_quality_control",
                              segment_image: "segment_images/qc.png",
                              children: [
                                {
                                  name: "PAA-X",
                                  description: `Publishing a new PAA-X release involves 1 contributor 
                                  with expertise in structured data handling, political science, country context, 
                                  and actor context. This stage typically requires around 10 hours of work per 
                                  release and uses iterative updating as well as manual and NER-assisted processing. 
                                  Common challenges include data integrity issues, duplicate records, and update lag.`,
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
                                      description: `PAA-X Actor Network Visualization Development has involved 1 contributor with
                                      expertise in software engineering, network visualization, and web development.
                                      This stage has required around 200 hours of development work. It uses Vue.js, Git,
                                      and interface design to support implementation and maintenance of the visualization.
                                      Common challenges include syntax errors, runtime issues, logical implementation
                                      problems, and visual encoding inconsistencies.`,
                                      tooltip_name: "PAA-X Actor Network Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["software engineering", "network visualization", "web development"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["Vue.js", "Git", "interface design"], //Ben's network library (cannot remember name)
                                      time: 200,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      link: "https://github.com/peacerep/actor-network",
                                      children: [
                                        {
                                          name: "Actors-Network",
                                          description: `PAA-X Actors-Network Visualization is maintained by 1 contributor with 
                                          expertise in network interpretation, visual literacy, and actor context. This stage 
                                          typically requires around 2 hours of maintenance work. It uses interactive network 
                                          exploration and actor-based navigation to support analysis of relationships. Common 
                                          challenges include relationship ambiguity, data consistency issues, and runtime or 
                                          rendering errors in the application.`,
                                          tooltip_name: "PAA-X Actors-Network Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["network interpretation", "visual literacy", "actor context"],
                                          errors: ["misinterpretation", "relationship ambiguity", "visual encoding"],
                                          methods: ["interactive network", "actor exploration"],
                                          time: 2,
                                          type: "vis",
                                          segment_image: "segment_images/actor_network.png",
                                          link: "https://www.peaceagreements.org/visualizations/actor-networks/"
                                        },
                                      ],
                                    },
                                    {
                                      name: "d3",
                                      description: `PAA-X 3rd Party Visualization Development has involved 1 contributor with 
                                      expertise in software engineering, information visualization, web development, and actor 
                                      context. The development has taken approximately 200 hours of work. It uses D3.js, Git, 
                                      and scrollytelling functionality to support implementation and integration of third-party visual 
                                      components. Common challenges include syntax errors, runtime issues, logical implementation 
                                      problems, and visual encoding inconsistencies.`,
                                      tooltip_name: "PAA-X 3rd Party Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["software engineering", "information visualization", "web development", "actor context"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["D3.js", "git", "scrollytelling development"],
                                      time: 50,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      link: "https://github.com/tvancisin/peace_scroll", //can remove if dont want to share
                                      children: [
                                        {
                                          name: "3rd Party Scroll",
                                          description: `PAA-X 3rd Party Scroll Visualization is maintained by 2 contributors with 
                                          expertise in data engineering and web development. This stage typically requires around 
                                          2 hours of maintenance work. It uses scrollytelling, interactive visualization, and 
                                          narrative sequencing to support engagement with third-party actor data. Common challenges 
                                          include data consistency issues and runtime or rendering failures in the application.`, 
                                          tooltip_name: "PAA-X 3rd Party Scroll Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 2,
                                          expertise: ["data interpretation", "visual literacy", "third-party actor context"],
                                          errors: ["data consistency", "runtime errors", "rendering errors"],
                                          methods: ["scrollytelling", "interactive visualization", "narrative sequencing"],
                                          time: 2,
                                          type: "vis",
                                          segment_image: "segment_images/3rd_scroll.png",
                                          link: "https://www.peaceagreements.org/visualizations/third-party-scroll/"
                                        },
                                      ],
                                    },
                                    {
                                      name: "Python",
                                      description: `PAA-X Peace Agreement Signatories Network Visualization Development has involved 1 
                                      contributor with expertise in network analysis and actor context. This stage required 
                                      around 100 hours of development work. It uses Python, Streamlit, and Git to support 
                                      the construction and maintenance of the signatories network visualization. Common 
                                      challenges include data consistency issues, runtime errors, and logical implementation 
                                      problems.`, 
                                      tooltip_name: "Peace Agreement Signatories Network Visualization Development",
                                      step: 11,
                                      branch_type: "uppest_trunk",
                                      ppl: 1,
                                      expertise: ["network analysis", "actor context"],
                                      errors: ["syntax", "runtime", "logic", "visual encoding"],
                                      methods: ["Python", "streamlit", "git"],
                                      time: 100,
                                      type: "prog",
                                      segment_image: "segment_images/programming.png",
                                      children: [
                                        {
                                          name: "Network",
                                          description: `PAA-X Peace Agreement Signatories Network Visualization is maintained by 1 contributor with expertise
                                          in network interpretation and Python. This stage typically requires around 2 hours 
                                          of maintenance work. It uses network visualization, relationship exploration, and pattern 
                                          identification to support analysis of actor networks. Common challenges include 
                                          misinterpretation, relationship ambiguity, and visual encoding issues.`,
                                          tooltip_name: "PAA-X Network Visualization",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["network interpretation", "Python"],
                                          errors: ["misinterpretation", "relationship ambiguity", "visual encoding"],
                                          methods: ["network visualization", "relationship exploration", "pattern identification"],
                                          time: 2,
                                          type: "vis",
                                          segment_image: "segment_images/network.png",
                                          link: "https://peacerep.org/signatories-network-analysis/",
                                        },
                                      ],
                                    },
                                    {
                                      name: "Tracker Development",
                                      description: `PA-X Tracker Development has involved 1 contributor with expertise 
                                      in data engineering, product design, political science, mediation expertise, user 
                                      engagement, and web development. This stage typically requires around 50 hours of 
                                      development work. It uses PowerBI, Python, and iterative design to support development 
                                      and refinement of the tracker. Common challenges include uneven data availability, 
                                      limited interoperability, indicator variability, and scalability constraints.`,
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
                                          description: `PA-X Tracker Platform is maintained by 1 contributor with expertise in data 
                                          interpretation, comparative analysis, and policy context. This stage typically requires 
                                          around 2 hours of maintenance work. It uses interactive dashboards, comparative exploration 
                                          tools, timelines, networks, and maps to support user interaction with the tracker. Common 
                                          challenges include performance limitations, information complexity, navigation ambiguity, 
                                          and loading time issues.`,
                                          tooltip_name: "PA-X Tracker Platform",
                                          step: 12,
                                          branch_type: "leaf",
                                          ppl: 1,
                                          expertise: ["data interpretation", "comparative analysis", "policy context"],
                                          errors: ["performance limitations", "information complexity", "navigation ambiguity", "loading time"],
                                          methods: ["interactive platform", "comparative exploration", "dashboards, timelines, networks, maps"],
                                          time: 2,
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
                          description: `Messy Timeline Visualization Development has involved 3 contributors with expertise in 
                          software engineering, web development, information visualization, and domain expertise. This stage 
                          involved around 200 hours of development work. It uses D3.js and Git to support implementation 
                          and version control of the visualization. Common challenges include syntax errors, runtime issues, 
                          logical implementation problems, and visual encoding inconsistencies.`, 
                          tooltip_name: "Messy Timeline Visualization Development",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 3,
                          expertise: ["software engineering", "web development", "information visualization", "domain expertise"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["D3.js", "git"],
                          time: 200,
                          type: "prog",
                          segment_image: "segment_images/programming.png",
                          link: "https://github.com/peacerep/v7_messy_timeline",
                          children: [
                            {
                              name: "Messy Timeline",
                              description: `Messy Timeline Visualization is maintained by 1 contributor with expertise in data
                              interpretation and visual literacy. This stage typically requires around 2 hours of maintenance
                              work. It uses interactive timelines and temporal exploration to support understanding of sequencing
                              in the data. Common challenges include misinterpretation and visual encoding issues.`,
                              tooltip_name: "Messy Timeline Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 1,
                              expertise: ["data interpretation", "visual literacy"],
                              errors: ["misinterpretation", "visual encoding"],
                              methods: ["interactive timeline", "temporal exploration"],
                              time: 2,
                              type: "vis",
                              segment_image: "segment_images/messy.png",
                              link: "https://www.peaceagreements.org/visualizations/messy-peace-processes/"
                            },
                          ],
                        },
                        {
                          name: "d3",
                          description: `Time & Space Visualization Development has involved 5 contributors with expertise 
                          in software engineering, web development, information visualization, and domain expertise. This 
                          stage required around 200 hours of development work. It uses D3.js and Git to support 
                          implementation and version control of the visualization. Common challenges include syntax errors, 
                          runtime issues, logical implementation problems, and visual encoding inconsistencies.`,
                          tooltip_name: "Time & Space Visualization Development",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 5,
                          expertise: ["software engineering", "web development", "information visualization", "domain expertise"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["D3.js", "git"],
                          time: 200,
                          type: "prog",
                          segment_image: "segment_images/programming.png",
                          link: "https://github.com/peacerep/pax-map",
                          children: [
                            {
                              name: "Time & Space",
                              description: `Time & Space Visualization is maintained by 1 contributor with expertise in data
                              interpretation, visual literacy, and spatial and temporal understanding. This stage typically 
                              requires around 2 hours of maintenance work. It uses interactive visualization, map-based 
                              exploration, and temporal exploration to support combined analysis of space and time. Common 
                              challenges include misinterpretation, data consistency issues, and visual encoding problems.`,
                              tooltip_name: "Time & Space Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 1,
                              expertise: ["data interpretation", "visual literacy", "spatial and temporal understanding"],
                              errors: ["misinterpretation", "data consistency", "visual encoding"],
                              methods: ["interactive visualization", "map-based exploration", "temporal exploration"],
                              time: 2,
                              type: "vis",
                              segment_image: "segment_images/patels.png",
                              link: "https://www.peaceagreements.org/visualizations/agreements-process-map/"
                            },
                          ],
                        },
                        {
                          name: "d3",
                          description: `Sequence Comparison Visualization Development has involved 1 contributor with expertise 
                          in software engineering, web development, information visualization, and domain expertise. This stage has 
                          required around 200 hours of development work. It uses D3.js and Git to support implementation 
                          and version control of the visualization. Common challenges include syntax errors, runtime issues, 
                          logical implementation problems, and visual encoding inconsistencies.`,
                          tooltip_name: "Sequence Comparison Visualization Development",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 1,
                          expertise: ["software engineering", "web development", "information visualization", "domain expertise"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["D3.js", "git"],
                          time: 200,
                          type: "prog",
                          segment_image: "segment_images/programming.png",
                          link: "https://github.com/peacerep/compare-sequences",
                          children: [
                            {
                              name: "Sequence Comparison",
                              description: `Sequence Comparison Visualization is maintained by 1 contributor with expertise in data 
                              interpretation, visual literacy, and comparative analysis. This stage typically requires around 2 
                              hours of maintenance work. It uses interactive visualization, sequence comparison, and comparative 
                              exploration to support analysis of ordered patterns. Common challenges include data consistency issues, 
                              runtime errors, and rendering issues in the application.`,
                              tooltip_name: "Sequence Comparison Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 1,
                              expertise: ["data interpretation", "visual literacy", "comparative analysis"],
                              errors: ["data consistency", "runtime errors", "rendering errors"],
                              methods: ["interactive visualization", "sequence comparison", "comparative exploration"],
                              time: 2,
                              type: "vis",
                              segment_image: "segment_images/sequence.png",
                              link: "https://www.peaceagreements.org/visualizations/compare-processes/"
                            },
                          ],
                        },
                        {
                          name: "d3",
                          description: `Data Overview Visualization Development has involved 2 contributors with expertise 
                          in software engineering, web development, information visualization, and domain expertise. This 
                          stage has required around 200 hours of development work. It uses D3.js and Git to support 
                          implementation and version control of the visualization. Common challenges include syntax errors, 
                          runtime issues, logical implementation problems, and visual encoding inconsistencies.`,
                          tooltip_name: "Data Overview Visualization Development",
                          step: 13,
                          branch_type: "uppest_trunk",
                          ppl: 2,
                          expertise: ["software engineering", "web development", "information visualization", "domain expertise"],
                          errors: ["syntax", "runtime", "logic", "visual encoding"],
                          methods: ["D3.js", "git"],
                          time: 200,
                          type: "prog_overview",
                          segment_image: "segment_images/programming.png",
                          link: "https://github.com/peacerep/hierarchy",
                          children: [
                            {
                              name: "Data Overview",
                              description: `Data Overview Visualization is maintained by 2 contributors with expertise in data 
                              interpretation and visual literacy. This stage typically requires around 2 hours of maintenance work. 
                              It uses interactive visualization, data overview exploration, and navigational interfaces to support 
                              understanding of the dataset. Common challenges include misinterpretation and data consistency issues`,
                              tooltip_name: "Data Overview Visualization",
                              step: 14,
                              branch_type: "leaf",
                              ppl: 2,
                              expertise: ["data interpretation", "visual literacy"],
                              errors: ["misinterpretation", "data consistency"],
                              methods: ["interactive visualization", "data overview", "exploratory navigation"],
                              time: 2,
                              type: "vis",
                              segment_image: "segment_images/hierarchy.png",
                              link: "https://www.peaceagreements.org/visualizations/data-overview-visualization/"
                            },
                          ],
                        },
                        {
                          name: "Infographics",
                          description: `Infographics Development has involved 3 contributors with expertise in domain knowledge,
                          data analysis, and graphic design. This stage typically requires around 10 hours of design and production
                          work. It uses tools such as Inkscape to create static visual representations of data.
                          Common challenges include text clarity, visual encoding issues, and balancing informational accuracy
                          with design constraints.`,
                          tooltip_name: "Infographics",
                          step: 15,
                          branch_type: "leaf",
                          ppl: 3,
                          expertise: ["domain expertise", "data analysis", "graphics design"],
                          errors: ["text clarity", "visual encoding", "balancing informational accuracy with design constraints"],
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
        `First real-life events captured in some way by the PA-X Database are 
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
        the coding is consistent with defintions of the topics.`,
    },
    {
      step_id: "8",
      type: "pax_database",
      description:
        `Once the data is approved and quality checks are resolved, the data is published 
        in the PA-X database. On average, 50 new agreements are added annually.`,
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
        published in <strong>PA-X Gender</strong>, <strong>PA-X Local</strong>, <strong>PA-X Children & Youth</strong>, 
        and <strong>PAA-X Third Parties</strong> databases.`,
    },
    {
      step_id: "12",
      type: "research",
      description: `Information gathered in these databases, coupled with the ability 
      to query it in highly flexible ways, subsequently informs novel peacebuilding research 
      at PeaceRep.`,
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
        `The machine-processable form of the information gathered in the databases
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
        points to the data and research findings.`,
    },
    {
      step_id: "19",
      type: "ucdp/acled",
      description:
        `It's important to emphasize is that the PA-X database is also used in conjunction 
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


