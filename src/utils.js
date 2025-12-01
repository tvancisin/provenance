
export let original_data = {
    name: 'Collect',
    ppl: 2,
    time: '20',
    children: [
        {
            name: 'Translate',
            ppl: 5,
            time: '10',
            url: 'img/trans.png',
            children: [
                {
                    name: 'Transcribe',
                    ppl: 10,
                    time: '40',
                    children: [
                        {
                            name: 'Code',
                            ppl: 3,
                            time: '100',
                            url: 'img/pax_code.png',
                            type: 'first_code',
                            link: 'https://pax.peaceagreements.org/media/documents/PA_X_codebook_v8.pdf',
                            children: [
                                {
                                    name: 'PA-X',
                                    type: 'db',
                                    ppl: 5,
                                    time: '100',
                                    url: 'img/pax_db.png',
                                    link: 'https://pax.peaceagreements.org/agreements/search/',
                                    children: [
                                        {
                                            name: 'Code',
                                            ppl: 3,
                                            time: '50',
                                            type: 'paax_code',
                                            url: 'img/gender_code.png',
                                            link: 'https://pax.peaceagreements.org/media/documents/PA_X_codebook_wgg_v8.pdf',
                                            children: [
                                                {
                                                    name: 'PA-X Gender',
                                                    type: 'db',
                                                    ppl: 3,
                                                    time: '10',
                                                    url: 'img/gender_db.png',
                                                    link: 'https://pax.peaceagreements.org/agreements/wggsearch/',
                                                    children: [
                                                        {
                                                            name: 'd3',
                                                            type: 'prog',
                                                            ppl: 1,
                                                            time: '3',
                                                            url: 'img/d3_bgd.png',
                                                            link: 'https://github.com/tvancisin/pax_gender',
                                                            children: [
                                                                {
                                                                    name: 'Scrollytelling',
                                                                    type: 'vis',
                                                                    ppl: 4,
                                                                    time: '2',
                                                                    url: 'img/scroll.png',
                                                                    link: 'https://tvancisin.github.io/pax_gender/',
                                                                }
                                                            ]
                                                        },
                                                        { name: 'PeaceFem' }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            name: 'research',
                                            children: [
                                            ]
                                        },
                                        {
                                            name: 'Code',
                                            children: [
                                                {
                                                    name: 'Children & Youth',
                                                    type: 'db',
                                                    children: [
                                                        {
                                                            name: 'PBi',
                                                            type: 'prog',
                                                            children: [{ name: 'PowerBi', type: 'vis' }]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            name: 'Code',
                                            children: [
                                                {
                                                    name: 'PA-X Local',
                                                    type: 'db',
                                                    children: [
                                                        {
                                                            name: 'd3',
                                                            type: 'prog',
                                                            children: [{ name: 'Map', type: 'vis' }]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            name: 'Code',
                                            type: 'paax_code',
                                            children: [
                                                {
                                                    name: 'PAA-X',
                                                    type: 'db',
                                                    children: [
                                                        {
                                                            name: 'PBi',
                                                            type: 'prog',
                                                            children: [{ name: 'Tracker', type: 'vis' }]
                                                        },
                                                        {
                                                            name: 'd3',
                                                            type: 'prog',
                                                            children: [{ name: 'Actors-Processes', type: 'vis' }]
                                                        },
                                                        {
                                                            name: 'd3',
                                                            type: 'prog',
                                                            children: [{ name: 'Third Parties', type: 'vis' }]
                                                        },
                                                        {
                                                            name: 'd3',
                                                            choose: 'last',
                                                            type: 'prog',
                                                            children: [{ name: 'Network', type: 'vis' }]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            name: 'd3',
                                            type: 'prog',
                                            children: [{ name: 'Messy Timeline', type: 'vis' }]
                                        },
                                        {
                                            name: 'd3',
                                            type: 'prog',
                                            children: [{ name: 'Time & Space', type: 'vis' }]
                                        },
                                        {
                                            name: 'd3',
                                            type: 'prog',
                                            children: [{ name: 'Sequence Comparison', type: 'vis' }]
                                        },
                                        {
                                            name: 'd3',
                                            type: 'prog',
                                            children: [{ name: 'Data Overview', type: 'vis' }]
                                        },
                                        {
                                            name: 'PBi',
                                            type: 'prog',
                                            children: [{ name: 'PA-X Tracker', type: 'vis' }]
                                        },
                                        {
                                            name: 'd3',
                                            type: 'prog',
                                            children: [{ name: 'Infographics', type: 'vis' }]
                                        },
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    downward: [
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
        { name: 'agt', children: [{ name: 'conflict', children: [{ name: 'neg' }] }] },
    ]
};