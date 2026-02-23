<script>
  import { generateDiagonalProgPath } from "../utils";

  export let nodesUp = [];
  export let linksUp = [];
  export let nodesDown = [];
  export let linksDown = [];
  export let highlightedLinks;
  export let currentLevelUp;
  export let currentLevelDown;
  export let yCenter;
  export let handleHoverEvent;
  export let handleClickEvents;
  export let rootUp;

  const orbitRadius = 14;
  const ringGap = 4.5;

  const labelConfig = new Map([
    ["pax_collect", { x: 12 }],
    ["pax_translate", { x: 20 }],
    ["pax_transcribe", { x: 12 }],
    ["pax_quality_control", { x: 12 }],
    ["pax_db", { x: 12 }],
    ["research", { x: 25 }],
    ["pax_code", { x: 25 }],
  ]);

  const labelMap = new Map([
    ["Tracker", { text: "Visualization", y: -10, maxLevel: 14, rotate: -45 }],
    ["PeaceFem", { text: "App", y: -10, rotate: -45 }],
    ["Data Overview", { text: "Visualization", y: -10, rotate: -45 }],
    ["PAA-X", { text: "Sub-Databases" }],
    [
      "Tracker Development",
      { text: "Development", maxLevel: 13, y: -10, rotate: -45 },
    ],
  ]);

  const labelByCategory = new Map([
    ["paax_code", { text: "Code" }],
    ["paax_quality_control", { text: "Quality Control" }],
    ["conference", { text: "Publications", rotate: -45 }],
    ["prog_overview", { text: "Development", y: -20, rotate: -45 }],
    ["pdf", { text: "Infographics", rotate: -45 }],
  ]);

  let visibleLinksDown = [];

  $: maxHeightDown = nodesDown.length
    ? Math.max(...nodesDown.map((d) => d.revealLevel))
    : -1;
  $: currentHeightUp = currentLevelUp >= 0 ? currentLevelUp : null;

  $: visibleNodesUp =
    currentHeightUp !== null
      ? nodesUp.filter((d) => d.data.step <= currentHeightUp)
      : [];
  $: visibleLinksUp =
    currentHeightUp !== null
      ? linksUp.filter((d) => d.parent && d.data.step <= currentHeightUp)
      : [];

  $: visibleNodesDown = nodesDown.filter(
    (d) => d.revealLevel >= maxHeightDown - currentLevelDown,
  );

  $: {
    const threshold = maxHeightDown - currentLevelDown;
    visibleLinksDown = linksDown.filter((d) => {
      if (!d.parent) return false;
      return (
        d.revealLevel >= threshold && d.parent.revealLevel >= threshold - 1
      );
    });
  }

  $: firstNodeByLevelDown = new Map();
  $: {
    firstNodeByLevelDown.clear();
    for (const d of visibleNodesDown) {
      if (!firstNodeByLevelDown.has(d.revealLevel)) {
        firstNodeByLevelDown.set(d.revealLevel, d);
      }
    }
  }

  ///////////////////////////// connecting same type nodes
  // code connections
  $: codeNodes = rootUp
    .descendants()
    .filter((d) => d.data.name === "Code" && d.data.type !== "pax_code");
  $: codeNodes.sort((a, b) => a.x - b.x);
  $: codePath = generateDiagonalProgPath(yCenter, codeNodes, [], 40);

  // qc connections
  $: qcNodes = rootUp
    .descendants()
    .filter(
      (d) =>
        d.data.name === "Quality Control" &&
        d.data.type !== "pax_quality_control",
    );
  $: qcNodes.sort((a, b) => a.x - b.x);
  $: qcPath = generateDiagonalProgPath(yCenter, qcNodes, [], 40);

  // db connections
  $: paXDBNodes = rootUp.descendants().filter((d) => {
    const type = d.data.type;
    return type?.slice(-2) === "db" && type !== "pax_db";
  });
  $: paXDBNodes.sort((a, b) => a.x - b.x);
  $: dbPath = generateDiagonalProgPath(yCenter, paXDBNodes, [], 40);

  // paper connections
  $: paXPaperNodes = rootUp
    .descendants()
    .filter((d) => d.data.name === "paper");
  $: paXPaperNodes.sort((a, b) => a.x - b.x);
  $: paperPath = generateDiagonalProgPath(yCenter, paXPaperNodes, [], 40);

  // first layer of programming
  $: paXProgFirst = rootUp
    .descendants()
    .filter((d) => d.data.type === "prog" && d.parent.data.name !== "PA-X");
  $: paXProgFirst.sort((a, b) => a.x - b.x);
  $: progPathFirst = generateDiagonalProgPath(yCenter, paXProgFirst, [], 40);

  // second layer of programming
  $: paXProgSecond = rootUp
    .descendants()
    .filter((d) => d.data.type === "prog" || d.data.type === "prog_overview");
  $: paXProgSecond.sort((a, b) => a.x - b.x);
  $: progPathSecond = generateDiagonalProgPath(yCenter, paXProgSecond, [], 40);

  // first layer of vis connections
  $: paXVisNodes = rootUp.descendants().filter((d) => {
    if (d.data.type !== "vis") return false;
    const parent = d.parent;
    const grandparent = d.parent?.parent;
    // exclude nodes if parent or grandparent name is "PA-X"
    if (
      (parent && parent.data.name === "PA-X") ||
      (grandparent && grandparent.data.name === "PA-X")
    ) {
      return false;
    }
    return true;
  });
  $: paXVisNodes.sort((a, b) => a.x - b.x);
  $: visObstacles = rootUp
    .descendants()
    .filter(
      (d) =>
        !paXVisNodes.includes(d) &&
        d.parent?.ancestors().some((a) => a.data.name === "PA-X"),
    );
  $: visPathFirst = generateDiagonalProgPath(
    yCenter,
    paXVisNodes,
    visObstacles,
    40,
  );

  // second level of vis
  $: paXVisNodesSecond = rootUp
    .descendants()
    .filter((d) => d.data.type === "vis" && d.parent.data.name !== "PA-X")
    .sort((a, b) => a.x - b.x);
  $: paXVisNodesSecond.sort((a, b) => a.x - b.x);
  $: visObstaclesSecond = rootUp
    .descendants()
    .filter(
      (d) =>
        !paXVisNodesSecond.includes(d) &&
        d.parent?.ancestors().some((a) => a.data.name == "PA-X"),
    );
  $: visPathSecond = generateDiagonalProgPath(
    yCenter,
    paXVisNodesSecond,
    visObstaclesSecond,
    40,
  );

  $: paXVisNodesThird = rootUp
    .descendants()
    .filter((d) => d.data.type === "vis")
    .sort((a, b) => a.x - b.x);
  $: paXVisNodesThird.sort((a, b) => a.x - b.x);
  $: visObstaclesThird = rootUp
    .descendants()
    .filter(
      (d) =>
        !paXVisNodesThird.includes(d) &&
        d.parent?.ancestors().some((a) => a.data.name == "PA-X"),
    );
  $: visPathThird = generateDiagonalProgPath(
    yCenter,
    paXVisNodesThird,
    visObstaclesThird,
    40,
  );

  // Helper functions
  function nodeRadius(ppl) {
    const MIN_R = 5,
      MAX_R = 28,
      MAX_PPL = 50;
    return MIN_R + (Math.sqrt(ppl) / Math.sqrt(MAX_PPL)) * (MAX_R - MIN_R);
  }

  function dotRadius(ppl) {
    return Math.max(1.5, strokeWidth(ppl) / 2 - 1);
  }

  function getPeopleDots(ppl) {
    const r = nodeRadius(ppl);
    const dr = 2;
    const gap = 1;
    const dotSpacing = dr * 2 + gap;
    const dotsPerRing = Math.max(1, Math.floor((2 * Math.PI * r) / dotSpacing));
    const numRings = Math.ceil(ppl / dotsPerRing);

    return Array.from({ length: ppl }, (_, i) => {
      const ring = Math.floor(i / dotsPerRing);
      const posInRing = i % dotsPerRing;
      const angle = posInRing * ((2 * Math.PI) / dotsPerRing) - Math.PI / 2;
      // center rings on r, expanding inward/outward symmetrically
      const ringOffset = (ring - (numRings - 1) / 2) * dotSpacing;
      const ringR = r + ringOffset;
      return {
        cx: ringR * Math.cos(angle),
        cy: ringR * Math.sin(angle),
      };
    });
  }

  // stroke-width must fit all rings of dots
  function strokeWidth(ppl) {
    const r = nodeRadius(ppl);
    const dr = 2;
    const gap = 1;
    const dotSpacing = dr * 2 + gap;
    const dotsPerRing = Math.max(1, Math.floor((2 * Math.PI * r) / dotSpacing));
    const numRings = Math.ceil(ppl / dotsPerRing);
    return Math.max(6, numRings * dotSpacing + gap * 2); // padding of gap on each side
  }
</script>

<!-- downward gradual links -->
{#each visibleLinksDown as d}
  <path
    d={`M${d.x},${yCenter + d.y} 
       C${d.x},${yCenter + d.parent.y + 20} 
        ${d.parent.x},${yCenter + d.parent.y + 20} 
        ${d.parent.x},${yCenter + d.parent.y}`}
    fill="none"
    stroke={highlightedLinks.has(`${d.parent.data.id}→${d.data.id}`)
      ? "#cc8500"
      : "#00ccff"}
    stroke-width="1"
  />
{/each}

<!-- downward gradual nodes -->
{#each visibleNodesDown as d, i}
  <g transform={`translate(${d.x}, ${yCenter + d.y})`}>
    {#if firstNodeByLevelDown.get(d.revealLevel) === d}
      <text x={-10} y={3} font-size="12" fill="white" text-anchor="end">
        {d.data.name.charAt(0).toUpperCase() + d.data.name.slice(1)}
      </text>
    {/if}
    <circle
      cx="0"
      cy="0"
      r="3"
      fill={d.data.name === "agreement" ? "white" : "#001C23"}
      stroke="#00ccff"
      stroke-width="2"
    />
  </g>
{/each}

{#if currentLevelUp >= 6}
  <path
    d={codePath}
    fill="none"
    stroke="white"
    stroke-width="30"
    stroke-opacity="0.2"
    stroke-linecap="round"
  />
{/if}
{#if currentLevelUp >= 7}
  <path
    d={qcPath}
    fill="none"
    stroke="white"
    stroke-width="30"
    stroke-opacity="0.2"
    stroke-linecap="round"
  />
{/if}
{#if currentLevelUp >= 8}
  <path
    d={dbPath}
    fill="none"
    stroke="white"
    stroke-width="30"
    stroke-opacity="0.2"
    stroke-linecap="round"
  />
{/if}
{#if currentLevelUp >= 10}
  <path
    d={paperPath}
    fill="none"
    stroke="white"
    stroke-width="30"
    stroke-opacity="0.2"
    stroke-linecap="round"
  />
{/if}
{#if currentLevelUp >= 11 && currentLevelUp < 13}
  <path
    d={progPathFirst}
    fill="none"
    stroke="white"
    stroke-width="30"
    stroke-opacity="0.2"
    stroke-linecap="round"
  />
{/if}
{#if currentLevelUp >= 12 && currentLevelUp < 14}
  <path
    d={visPathFirst}
    fill="none"
    stroke="white"
    stroke-width="30"
    stroke-opacity="0.2"
    stroke-linecap="round"
  />
{/if}
{#if currentLevelUp >= 13}
  <path
    d={progPathSecond}
    fill="none"
    stroke="white"
    stroke-width="30"
    stroke-opacity="0.2"
    stroke-linecap="round"
  />
{/if}
{#if currentLevelUp >= 14 && currentLevelUp < 15}
  <path
    d={visPathSecond}
    fill="none"
    stroke="white"
    stroke-width="30"
    stroke-opacity="0.2"
    stroke-linecap="round"
  />
{/if}
{#if currentLevelUp >= 15}
  <path
    d={visPathThird}
    fill="none"
    stroke="white"
    stroke-width="30"
    stroke-opacity="0.2"
    stroke-linecap="round"
  />
{/if}

<!-- upward links -->
{#each visibleLinksUp as d}
  <path
    d={d.data.name === "Research"
      ? (() => {
          const offset = Math.min(
            50,
            (yCenter - d.y - (yCenter - d.parent.y)) * 0.3,
          );
          const control = offset * 0.3;

          return `M${d.x},${yCenter - d.y}
                            L${d.x},${yCenter - d.parent.y + offset}
                            C${d.x},${yCenter - d.parent.y + control}
                             ${d.parent.x},${yCenter - d.parent.y + control}
                             ${d.parent.x},${yCenter - d.parent.y}`;
        })()
      : (d.data.name === "d3" && d.parent.data.name === "PA-X") ||
          d.data.name === "Tracker" ||
          d.data.name === "Infographics"
        ? (() => {
            const baseOffset = Math.min(
              50,
              (yCenter - d.y - (yCenter - d.parent.y)) * 0.3,
            );

            const extraDown =
              d.data.name === "Tracker" || d.data.name === "Infographics"
                ? 20
                : 0;

            const offset = baseOffset + extraDown;
            const control = offset * 0.3;

            return `M${d.x},${yCenter - d.y}
            L${d.x},${yCenter - d.parent.y + offset}
            C${d.x},${yCenter - d.parent.y + control}
             ${d.parent.x},${yCenter - d.parent.y + control}
             ${d.parent.x},${yCenter - d.parent.y}`;
          })()
        : `M${d.x},${yCenter - d.y}
                   C${d.x},${yCenter - d.parent.y - 20}
                    ${d.parent.x},${yCenter - d.parent.y - 50}
                    ${d.parent.x},${yCenter - d.parent.y}`}
    fill="none"
    stroke-linecap="round"
    stroke={highlightedLinks.has(`${d.parent.data.id}→${d.data.id}`)
      ? "#cc8500"
      : d.data.name === "Research"
        ? ""
        : "#00CCFF"}
    stroke-width={d.data.branch_type === "trunk"
      ? 17
      : d.data.branch_type === "upper_trunk"
        ? 13
        : d.data.branch_type === "uppest_trunk"
          ? 5
          : 2}
  />
{/each}

<!-- upward nodes -->
{#each visibleNodesUp as d}
  {@const r = nodeRadius(d.data.ppl)}
  {@const sw = strokeWidth(d.data.ppl)}
  {@const dots = getPeopleDots(d.data.ppl)}
  <g transform={`translate(${d.x}, ${yCenter - d.y})`}>
    {#if labelConfig.has(d.data.type)}
      <rect
        x={labelConfig.get(d.data.type).x + 8}
        y={-10}
        width={d.data.name.length * 7}
        height={16}
        fill="#001C23"
        rx="3"
        opacity="0.8"
      />
      <text
        x={labelConfig.get(d.data.type).x + 10}
        y={0}
        font-size="12"
        fill="white"
      >
        {d.data.name}
      </text>
    {/if}

    {#if d.data.name && labelMap.has(d.data.name)}
      {#if !labelMap.get(d.data.name).maxLevel || currentLevelUp < labelMap.get(d.data.name).maxLevel}
        {@const lm = labelMap.get(d.data.name)}
        <rect
          x={18}
          y={(lm.y ?? 0) - 10}
          width={lm.text.length * 7}
          height={16}
          fill="#001C23"
          rx="3"
          opacity="0.8"
          transform={lm.rotate
            ? `rotate(${lm.rotate}, 20, ${lm.y ?? 5})`
            : null}
        />
        <text
          x={20}
          y={lm.y ?? 0}
          font-size="12"
          fill="white"
          transform={lm.rotate
            ? `rotate(${lm.rotate}, 20, ${lm.y ?? 5})`
            : null}
        >
          {lm.text}
        </text>
      {/if}
    {:else if d.data.type && labelByCategory.has(d.data.type)}
      {@const lc = labelByCategory.get(d.data.type)}
      <rect
        x={18}
        y={-10}
        width={lc.text.length * 7}
        height={16}
        fill="#001C23"
        rx="3"
        opacity="0.8"
        transform={lc.rotate ? `rotate(${lc.rotate}, -5, 5)` : null}
      />
      <text
        x={20}
        y={0}
        font-size="12"
        fill="white"
        transform={lc.rotate ? `rotate(${lc.rotate}, -5, 5)` : null}
      >
        {lc.text}
      </text>
    {/if}

    {#if d.data.name && labelMap.has(d.data.name)}
      {#if !labelMap.get(d.data.name).maxLevel || currentLevelUp < labelMap.get(d.data.name).maxLevel}
        <text
          x={20}
          y={labelMap.get(d.data.name).y ?? 0}
          font-size="12"
          fill="white"
          transform={labelMap.get(d.data.name).rotate
            ? `rotate(${labelMap.get(d.data.name).rotate}, 20, ${labelMap.get(d.data.name).y ?? 5})`
            : null}
        >
          {labelMap.get(d.data.name).text}
        </text>
      {/if}
    {:else if d.data.type && labelByCategory.has(d.data.type)}
      <text
        x={20}
        y={0}
        font-size="12"
        fill="white"
        transform={labelByCategory.get(d.data.type).rotate
          ? `rotate(${labelByCategory.get(d.data.type).rotate}, -5, 5)`
          : null}
      >
        {labelByCategory.get(d.data.type).text}
      </text>
    {/if}

    <circle
      cx="0"
      cy="0"
      {r}
      fill={d.data.name === "PA-X" ||
      d.data.branch_type === "leaf" ||
      d.data.type?.slice(-2) === "db"
        ? "white"
        : "#001C23"}
      stroke="#00CCFF"
      stroke-width={sw}
      tabindex="0"
      role="button"
      aria-label="Node details"
      on:mouseenter={() => handleHoverEvent({ node: d })}
      on:mouseleave={() => handleHoverEvent({ node: null })}
      on:click={() => handleClickEvents({ node: d })}
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClickEvents({ node: d });
        }
      }}
    />

    {#each dots as dot}
      <circle
        cx={dot.cx}
        cy={dot.cy}
        r="2"
        fill="black"
        opacity="0.85"
        pointer-events="none"
      />
    {/each}
  </g>
{/each}
