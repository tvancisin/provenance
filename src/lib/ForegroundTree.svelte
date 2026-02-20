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
    ["research", { x: 22 }],
    ["pax_code", { x: 25 }],
  ]);

  const labelMap = new Map([
    ["Tracker", { text: "Visualization", y: -20, rotate: -45 }],
    ["PeaceFem", { text: "App", rotate: -45 }],
    ["Data Overview", { text: "Visualization", maxLevel: 15, rotate: -45 }],
    ["PAA-X", { text: "Sub-Databases" }],
    ["Python", { text: "Programming", maxLevel: 13, rotate: -45 }],
    ["Network", { text: "Visualization", maxLevel: 14, rotate: -45 }],
  ]);

  const labelByCategory = new Map([
    ["paax_code", { text: "Code" }],
    ["paax_quality_control", { text: "Quality Control" }],
    ["conference", { text: "Publications", rotate: -45 }],
    ["Programming", { text: "Programming" }],
    ["Infographics", { text: "Infographics", rotate: -45 }],
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
  $: obstaclesProgFirst = rootUp
    .descendants()
    .filter(
      (d) =>
        !paXProgFirst.includes(d) &&
        d.parent?.ancestors().some((a) => a.data.name === "PA-X"),
    );
  $: progPathFirst = generateDiagonalProgPath(
    yCenter,
    paXProgFirst,
    obstaclesProgFirst,
    40,
  );

  // second layer of programming
  $: paXProgSecond = rootUp.descendants().filter((d) => d.data.type === "prog");
  $: paXProgSecond.sort((a, b) => a.x - b.x);
  $: obstaclesProgSecond = rootUp
    .descendants()
    .filter(
      (d) =>
        !paXProgSecond.includes(d) &&
        d.parent?.ancestors().some((a) => a.data.name === "PA-X"),
    );
  $: progPathSecond = generateDiagonalProgPath(
    yCenter,
    paXProgSecond,
    obstaclesProgSecond,
    40,
  );

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
      : "#008fb3"}
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

    {#if d.data.name === "agreement"}
      <rect
        x="-5"
        y="-5"
        width="10"
        height="10"
        rx="2"
        fill="white"
        transform="rotate(45, 0, 0)"
      />
    {:else}
      <circle cx="0" cy="0" r="3" fill="white"></circle>
    {/if}
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
        ? "#bfbfbf"
        : "#008fb3"}
    stroke-width={d.data.branch_type === "trunk"
      ? 20
      : d.data.branch_type === "upper_trunk"
        ? 10
        : d.data.branch_type === "uppest_trunk"
          ? 5
          : 2}
  />
{/each}

<!-- upward nodes -->
{#each visibleNodesUp as d}
  <g transform={`translate(${d.x}, ${yCenter - d.y})`}>
    {#if labelConfig.has(d.data.type)}
      <text
        x={labelConfig.get(d.data.type).x + 10}
        y={0}
        font-size="12"
        fill="white"
      >
        {d.data.name}
      </text>
    {:else if currentLevelUp >= 6 && d.data.type?.slice(-2) === "db"}
      <text
        x={-5}
        y={-20}
        font-size="10"
        fill="gray"
        opacity="0.7"
        transform="rotate(-45)"
        text-anchor="middle"
      >
        {d.data.name}
      </text>
    {/if}

    {#if d.data.name && labelMap.has(d.data.name)}
      {#if !labelMap.get(d.data.name).maxLevel || currentLevelUp < labelMap.get(d.data.name).maxLevel}
        <text
          x={20}
          y={labelMap.get(d.data.name).y ?? 5}
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
        y={5}
        font-size="12"
        fill="white"
        transform={labelByCategory.get(d.data.type).rotate
          ? `rotate(${labelByCategory.get(d.data.type).rotate}, 20, 5)`
          : null}
      >
        {labelByCategory.get(d.data.type).text}
      </text>
    {/if}

    {#if d.data.type == "vis" || d.data.type == "db" || d.data.type == "paper" || d.data.type == "app" || d.data.type == "pdf"}
      <rect
        x="-8"
        y="-8"
        rx="2"
        width="16"
        height="16"
        fill="white"
        transform="rotate(45, 0, 0)"
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
    {:else}
      <circle
        cx="0"
        cy="0"
        r="8"
        fill="white"
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
    {/if}

    {#each Array(d.data.ppl) as _, i}
      <circle
        cx={(orbitRadius + ringGap * Math.floor(i / 12)) *
          Math.cos(((-90 + ((i % 12) + 1) * 30) * Math.PI) / 180)}
        cy={(orbitRadius + ringGap * Math.floor(i / 12)) *
          Math.sin(((-90 + ((i % 12) + 1) * 30) * Math.PI) / 180)}
        r="2"
        fill="#ffff66"
      />
    {/each}
  </g>
{/each}
