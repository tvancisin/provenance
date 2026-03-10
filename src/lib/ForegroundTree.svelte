<script>
  import { generateDiagonalProgPath, getUpwardLinkPath } from "../utils";

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
  export let clicked;

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

  const sortByX = (a, b) => a.x - b.x;

  function getSortedDescendants(descendants, predicate) {
    return descendants.filter(predicate).sort(sortByX);
  }

  function inPaXBranch(node) {
    return node.parent?.ancestors().some((a) => a.data.name === "PA-X");
  }

  // highlighting logic
  const defaultStroke = "#00CCFF";
  const mutedStroke = "#005266";
  const highlightedStroke = "#cc8500";

  $: nonHighlightedPathStroke = clicked ? mutedStroke : defaultStroke;

  $: highlightedNodeIds = new Set();
  $: {
    highlightedNodeIds = new Set();
    for (const linkId of highlightedLinks ?? []) {
      const [fromId, toId] = String(linkId).split("→");
      if (fromId) highlightedNodeIds.add(fromId);
      if (toId) highlightedNodeIds.add(toId);
    }
  }

  function nodeStroke(node, isClicked, ids) {
    const isHighlighted = ids.has(String(node.data.id));
    if (!isClicked) return isHighlighted ? highlightedStroke : defaultStroke;
    return isHighlighted ? highlightedStroke : mutedStroke;
  }

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

  $: descendants = rootUp ? rootUp.descendants() : [];

  ///////////////////////////// connecting same type nodes
  // code connections
  $: codeNodes = getSortedDescendants(
    descendants,
    (d) => d.data.name === "Code" && d.data.type !== "pax_code",
  );
  $: codePath = generateDiagonalProgPath(yCenter, codeNodes, [], 40);

  // qc connections
  $: qcNodes = getSortedDescendants(
    descendants,
    (d) =>
      d.data.name === "Quality Control" &&
      d.data.type !== "pax_quality_control",
  );
  $: qcPath = generateDiagonalProgPath(yCenter, qcNodes, [], 40);

  // db connections
  $: paXDBNodes = getSortedDescendants(descendants, (d) => {
    const type = d.data.type;
    return type?.slice(-2) === "db" && type !== "pax_db";
  });
  $: dbPath = generateDiagonalProgPath(yCenter, paXDBNodes, [], 40);

  // paper connections
  $: paXPaperNodes = getSortedDescendants(
    descendants,
    (d) => d.data.name === "paper",
  );
  $: paperPath = generateDiagonalProgPath(yCenter, paXPaperNodes, [], 40);

  // first layer of programming
  $: paXProgFirst = getSortedDescendants(
    descendants,
    (d) => d.data.type === "prog" && d.parent?.data.name !== "PA-X",
  );
  $: progPathFirst = generateDiagonalProgPath(yCenter, paXProgFirst, [], 40);

  // second layer of programming
  $: paXProgSecond = getSortedDescendants(
    descendants,
    (d) => d.data.type === "prog" || d.data.type === "prog_overview",
  );
  $: progPathSecond = generateDiagonalProgPath(yCenter, paXProgSecond, [], 40);

  // first layer of vis connections
  $: paXVisNodes = getSortedDescendants(descendants, (d) => {
    if (d.data.type !== "vis") return false;
    const parent = d.parent;
    const grandparent = d.parent?.parent;

    if (
      (parent && parent.data.name === "PA-X") ||
      (grandparent && grandparent.data.name === "PA-X")
    ) {
      return false;
    }

    return true;
  });
  $: visObstacles = descendants.filter(
    (d) => !paXVisNodes.includes(d) && inPaXBranch(d),
  );
  $: visPathFirst = generateDiagonalProgPath(
    yCenter,
    paXVisNodes,
    visObstacles,
    40,
  );

  // second level of vis
  $: paXVisNodesSecond = getSortedDescendants(
    descendants,
    (d) => d.data.type === "vis" && d.parent?.data.name !== "PA-X",
  );
  $: visObstaclesSecond = descendants.filter(
    (d) => !paXVisNodesSecond.includes(d) && inPaXBranch(d),
  );
  $: visPathSecond = generateDiagonalProgPath(
    yCenter,
    paXVisNodesSecond,
    visObstaclesSecond,
    40,
  );

  $: paXVisNodesThird = getSortedDescendants(
    descendants,
    (d) => d.data.type === "vis",
  );
  $: visObstaclesThird = descendants.filter(
    (d) => !paXVisNodesThird.includes(d) && inPaXBranch(d),
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
      ? highlightedStroke
      : nonHighlightedPathStroke}
    stroke-width="1"
  />
{/each}

<!-- downward gradual nodes -->
{#each visibleNodesDown as d}
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
      stroke={nodeStroke(d, clicked, highlightedNodeIds)}
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
    d={getUpwardLinkPath(d, yCenter)}
    fill="none"
    stroke-linecap="round"
    stroke={highlightedLinks.has(`${d.parent.data.id}→${d.data.id}`)
      ? highlightedStroke
      : d.data.name === "Research"
        ? ""
        : nonHighlightedPathStroke}
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

    <circle
      cx="0"
      cy="0"
      {r}
      fill={d.data.name === "PA-X" ||
      d.data.branch_type === "leaf" ||
      d.data.type?.slice(-2) === "db"
        ? "white"
        : "#001C23"}
      stroke={nodeStroke(d, clicked, highlightedNodeIds)}
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
