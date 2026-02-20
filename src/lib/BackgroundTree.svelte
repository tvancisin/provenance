<script>
  import { data } from "../utils";

  export let ucdpNodes = [];
  export let nodesUp = [];
  export let nodesDown = [];
  export let regionLabels = [];
  export let yCenter;

  $: researchNode = nodesUp.find((d) => d.data.name == "Research");
  $: subdatabaseNode1 = nodesUp.find((d) => d.data.type == "paax_db");
  $: subdatabaseNode2 = nodesUp.find((d) => d.data.type == "pax_gender_db");

  $: visInfographics = nodesUp.find((d) => d.data.name == "Infographics");
  $: visFem = nodesUp.find((d) => d.data.name == "PeaceFem");
  $: console.log(researchNode, visFem, subdatabaseNode2);

  $: linksUp = nodesUp.slice(1);
  $: linksDown = nodesDown.filter((d) => d.parent);
  $: ucdpLinks = ucdpNodes.filter((d) => d.parent);
  $: ucdpRoot = ucdpNodes.find((d) => d.data.name === "__ucdp_root__");
  $: globeNode = nodesUp.find((d) => d.data.name === "Data Overview");
  $: trackerNode = nodesUp.find((d) => d.data.name === "Tracker");

  $: x1 = globeNode ? globeNode.x + 4 : 0;
  $: y1 = globeNode ? yCenter - globeNode.y : 0;
  $: x2 = ucdpRoot ? ucdpRoot.x : 0;
  $: y2 = ucdpRoot ? yCenter + ucdpRoot.y : 0;

  $: xt1 = trackerNode ? trackerNode.x + 4 : 0;
  $: yt1 = trackerNode ? yCenter - trackerNode.y : 0;
  $: xt2 = ucdpRoot ? ucdpRoot.x : 0;
  $: yt2 = ucdpRoot ? yCenter + ucdpRoot.y : 0;

  function createBezier(source, target1, target2) {
    const x1 = source.x;
    const y1 = yCenter - source.y;
    const x2 = target1.x;
    const y2 = yCenter - target1.y;
    const x3 = target2.x;
    const y3 = yCenter - target2.y;

    const offset = Math.min(0, (y1 - y2) * 0.6);
    const control = offset * 0;

    return `M${x1},${y1}
          L${x1},${y2 + offset}
          C${x1},${y2 + control}
           ${x2},${y2 + control}
           ${x2},${y2}
          L${x3},${y3}`;
  }

  function createBezierUp(source, target1, target2) {
    const x1 = source.x;
    const y1 = yCenter - source.y;
    const x2 = target1.x;
    const y2 = yCenter - target1.y;
    const x3 = target2.x;
    const y3 = yCenter - target2.y;

    const midX = x1 + (x2 - x1) * 0.7;
    const startPull = x1 + (x2 - x1) * 0.8;
    const endPull = x1 + (x2 - x1) * 0.3;

    return `M${x1},${y1}
          C${startPull},${y1}
           ${endPull},${y2}
           ${x2},${y2}
          L${x3},${y3}`;
  }
</script>

{#if researchNode && subdatabaseNode1 && subdatabaseNode2}
  <path
    fill="none"
    class="sub_db_research"
    stroke="gray"
    stroke-width="5"
    stroke-dasharray="10 5"
    d={createBezier(researchNode, subdatabaseNode2, subdatabaseNode1)}
  />
{/if}
{#if researchNode && visFem && visInfographics}
  <path
    fill="none"
    stroke="gray"
    stroke-width="5"
    stroke-dasharray="10 5"
    d={createBezierUp(researchNode, visFem, visInfographics)}
  />
{/if}

<!-- ucdp nodes and links -->
<path
  d={`
    M ${x1},${y1}
    L ${x1},${y1 + (y2 - y1) / 1.5 - (y2 - y1) * 0.1}
    C ${x1},${y1 + (y2 - y1) / 1.5} 
      ${x1},${y1 + (y2 - y1) / 1.5} 
      ${x1 + (x2 - x1) * 0.1},${y1 + (y2 - y1) / 1.5}
    L ${x2 - (x2 - x1) * 0.1},${y1 + (y2 - y1) / 1.5}
    C ${x2},${y1 + (y2 - y1) / 1.5} 
      ${x2},${y1 + (y2 - y1) / 1.5} 
      ${x2},${y1 + (y2 - y1) / 1.5 + (y2 - y1) * 0.1}
    L ${x2},${y2}
  `}
  fill="none"
  stroke="#404040"
  stroke-width="4"
  stroke-opacity="0.7"
/>
<path
  d={`
    M ${xt1},${yt1}
    L ${xt1},${yt1 + (yt2 - yt1) / 1.5 - (yt2 - yt1) * 0.1}
    C ${xt1},${yt1 + (yt2 - yt1) / 1.5} 
      ${xt1},${yt1 + (yt2 - yt1) / 1.5} 
      ${xt1 + (xt2 - xt1) * 0.1},${yt1 + (yt2 - yt1) / 1.5}
    L ${xt2 - (xt2 - xt1) * 0.1},${yt1 + (yt2 - yt1) / 1.5}
    C ${xt2},${yt1 + (yt2 - yt1) / 1.5} 
      ${xt2},${yt1 + (yt2 - yt1) / 1.5} 
      ${xt2},${yt1 + (yt2 - yt1) / 1.5 + (yt2 - yt1) * 0.1}
    L ${xt2},${yt2}
  `}
  fill="none"
  stroke="#404040"
  stroke-width="4"
  stroke-opacity="0.7"
/>
{#each ucdpLinks as d}
  <path
    d={`M${d.x},${yCenter + d.y} 
       C${d.x},${yCenter + d.parent.y + 60} 
        ${d.parent.x},${yCenter + d.parent.y + 70} 
        ${d.parent.x},${yCenter + d.parent.y}`}
    fill="none"
    stroke="#404040"
    stroke-opacity="0.4"
    stroke-width="1"
  />
{/each}
{#each ucdpNodes as d}
  <g transform={`translate(${d.x}, ${yCenter + d.y})`}>
    <circle
      cx="0"
      cy="0"
      r={d.data.name == "__ucdp_root__" ? 5 : 0}
      fill={d.data.name == "__ucdp_root__" ? "gray" : "none"}
    ></circle>
    {#if d.data.name == "__ucdp_root__"}
      <!-- <text
        x="10"
        y="0"
        font-size="10"
        fill="white"
        text-anchor="start"
      >
        UCDP/ACLED
      </text> -->
    {/if}
  </g>
{/each}

{#each linksUp as d}
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
    stroke={d.data.name === "Research" ? "gray" : "#005266"}
    stroke-dasharray={d.data.name === "Research" ? "10 5" : null}
    stroke-width={d.data.branch_type === "trunk"
      ? 20
      : d.data.branch_type === "upper_trunk"
        ? 10
        : d.data.branch_type === "uppest_trunk"
          ? 5
          : 2}
  />
{/each}

{#each linksDown as d}
  <path
    d={`M${d.x},${yCenter + d.y} 
       C${d.x},${yCenter + d.parent.y + 20} 
        ${d.parent.x},${yCenter + d.parent.y + 20} 
        ${d.parent.x},${yCenter + d.parent.y}`}
    fill="none"
    stroke="#005266"
    stroke-width="1"
  />
{/each}
{#each nodesUp as d}
  <g transform={`translate(${d.x}, ${yCenter - d.y})`}>
    {#if d.data.type == "vis" || d.data.type == "db" || d.data.type == "paper" || d.data.type == "app" || d.data.type == "pdf"}
      <rect
        x="-8"
        y="-8"
        rx="2"
        width="16"
        height="16"
        fill="gray"
        transform="rotate(45, 0, 0)"
      />
    {:else}
      <circle cx="0" cy="0" r="8" fill="gray"></circle>
    {/if}
  </g>
{/each}
{#each nodesDown as d, i}
  <g transform={`translate(${d.x}, ${yCenter + d.y})`}>
    {#if d.data.name === "agreement"}
      <rect
        x="-5"
        y="-5"
        width="10"
        height="10"
        rx="2"
        fill="gray"
        transform="rotate(45, 0, 0)"
      />
    {:else}
      <circle cx="0" cy="0" r="3" fill="gray"></circle>
    {/if}
  </g>
{/each}

<!-- continent labels -->
{#each regionLabels as r}
  <text
    x={r.x}
    y={r.y}
    text-anchor="middle"
    font-size="12"
    fill="white"
    letter-spacing="0.5"
  >
    {r.continent.replace("_", " ") + ` (${r.count})`}
  </text>
{/each}
