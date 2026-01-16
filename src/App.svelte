<script>
  import * as d3 from "d3";
  import { data } from "./utils";

  // todo
  // differentiate between different groups steps
  // could be shown as some kind of backgrounds. these are visualizations, these are databases...
  // add external datasets at least acled and ucdp

  let width,
    height,
    details_width = 1,
    details_data = [],
    clicked = null,
    margin = { top: 20, right: 100, bottom: 20, left: 100 },
    nodesUp = [],
    linksUp = [],
    nodesDown = [],
    linksDown = [];

  $: innerWidth = width - margin.right - margin.left;
  $: innerHeight = height - margin.top - margin.bottom;
  $: yCenter = innerHeight * 0.85;
  $: upHeight = yCenter;
  $: downHeight = innerHeight - upHeight;
  let rootUp = d3.hierarchy(data, (d) => d.children);
  let rootDown = d3.hierarchy(
    {
      name: "__downward_root__",
      children: data.downward,
    },
    (d) => d.children,
  );
  console.log(rootDown);
  $: upwardCluster = d3.cluster().size([innerWidth, upHeight]);
  $: downwardCluster = d3.cluster().size([innerWidth, downHeight]);

  function setUniformY(node, spacing = 100) {
    if (!node.children) return;
    node.children.forEach((child) => {
      child.y = node.y + spacing; // child one level below parent
      setUniformY(child, spacing); // recurse
    });
  }

  const depthWeightUp = {
    0: 0.6, // root
    1: 0.6, // Collect
    2: 0.6, // Translate
    3: 0.6, // Transcribe
    4: 0.6, // Code
    5: 0.6, // QC
  };

  const defaultWeightUp = 1.0;

  function setResponsiveY(node, unitHeight) {
    if (!node.children) return;

    node.children.forEach((child) => {
      const weight = depthWeightUp[child.depth] ?? defaultWeightUp;

      child.y = node.y + weight * unitHeight;
      setResponsiveY(child, unitHeight);
    });
  }

  function groupDownwardByContinent(
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

  $: {
    upwardCluster(rootUp);
    downwardCluster(rootDown);

    const collectNode = rootUp
      .descendants()
      .find((d) => d.data.name === "Collect");

    rootDown.x = collectNode.x;
    rootUp.y = 0;

    // --- spacing logic unchanged ---
    const maxDepth = rootUp.height + 1;
    let totalWeight = 0;

    for (let d = 1; d <= maxDepth; d++) {
      totalWeight += depthWeightUp[d] ?? defaultWeightUp;
    }

    const unitHeight = upHeight / totalWeight;
    setResponsiveY(rootUp, unitHeight);

    const spacingDown = downHeight / (rootDown.height + 1);
    setUniformY(rootDown, spacingDown);

    // spacing for downward nodes based on continents
    groupDownwardByContinent(rootDown, innerWidth, {
      nodeSpacing: 10,
      continentGap: 80,
    });

    nodesUp = rootUp.descendants();
    linksUp = nodesUp.slice(1);

    nodesDown = rootDown.descendants().slice(1);
    linksDown = nodesDown.filter((d) => d.parent);
  }

  // function removeNodesAndPrune(node, targetNames) {
  //   if (!node.children) return { ...node };

  //   const newChildren = [];

  //   for (const child of node.children) {
  //     // If this child should be removed, skip it
  //     if (targetNames.has(child.name)) continue;

  //     // Recursively process the child
  //     const updatedChild = removeNodesAndPrune(child, targetNames);

  //     // Keep it if not pruned
  //     if (updatedChild) newChildren.push(updatedChild);
  //   }

  //   // If all children were removed and at least one was a target, prune this node
  //   const hadTargetChild = node.children.some((c) => targetNames.has(c.name));
  //   if (newChildren.length === 0 && hadTargetChild) {
  //     return null;
  //   }

  //   return {
  //     ...node,
  //     children: newChildren.length > 0 ? newChildren : undefined,
  //   };
  // }

  // function filter() {
  //   const targets = new Set(["Scrollytelling", "Tracker", "Network"]);
  //   data = removeNodesAndPrune(data, targets);
  // }

  //////////////////////////////// reset to default //////////////////////////
  function reset() {
    innerWidth = width - margin.right - margin.left;
    details_width = 1;
    fullChain = [];
    clicked = null;
    highlightedLinks = new Set();
    d3.selectAll(".ind_line").style("opacity", 0.5);
  }

  //////////////////////////////// node hover ///////////////////////////////
  let highlightedLinks = new Set();
  function handleHoverEvent(e) {
    if (!clicked) {
      let node = e.node;
      if (!node) {
        highlightedLinks = new Set();
        return;
      }

      const links = new Set();

      // 1. Highlight upward ancestry
      while (node.parent) {
        const key = `${node.parent.data.id}→${node.data.id}`;
        links.add(key);
        node = node.parent;
      }

      // 2. Always add all downward links
      linksDown.forEach((d) => {
        const key = `${d.parent.data.id}→${d.data.id}`;
        links.add(key);
      });

      highlightedLinks = links;
    }
  }

  //////////////////////////////// node click ///////////////////////////////
  let fullChain = [];
  function handleClickEvents(e) {
    d3.selectAll(".ind_line").style("opacity", 0);
    if (clicked == null) {
      innerWidth = width / 2 - margin.right;
    }
    clicked = true;
    fullChain = [];
    details_width = innerWidth;
    details_data = e.node;
    let current = details_data;
    let downCurrent = nodesDown[16];
    let downCurrentChain = []; // Temporary array to store downCurrent hierarchy

    // Walk up to collect all parents from details_data
    while (current) {
      fullChain.push(current); // push keeps order as leaf → root
      current = current.parent;
    }

    // Walk up to collect all parents from downCurrent, except the last one
    while (downCurrent && downCurrent.parent !== null) {
      downCurrentChain.push(downCurrent); // Collect downCurrent nodes in order
      downCurrent = downCurrent.parent;
    }

    // Push the downCurrent chain in reverse order
    fullChain = fullChain.concat(downCurrentChain.reverse());
  }
  $: if (fullChain.length > 1) {
    const totalBorder = fullChain.length * 4;
    segment_height = (height - totalBorder) / fullChain.length;
  }

  /////////////////////////////// gradual reveal logic //////////////////////
  let currentLevelDown = 0;
  let currentLevelUp = 0;
  let segment_height;
  // levels for downward nodes
  $: nodesDown.forEach((node) => {
    node.level =
      node.children && node.children.length
        ? Math.max(...node.children.map((c) => c.level ?? 0)) + 1
        : 0;
  });

  $: maxHeightUp = Math.max(...nodesUp.map((d) => d.height));
  $: maxHeightDown = Math.max(...nodesDown.map((d) => d.level));

  $: currentHeightUp = currentLevelUp >= 1 ? currentLevelUp : null;

  // tree up
  $: visibleNodesUp =
    currentHeightUp !== null
      ? nodesUp.filter((d) => d.depth <= currentHeightUp)
      : [];

  $: visibleLinksUp =
    currentHeightUp !== null
      ? linksUp.filter((d) => d.parent && d.depth <= currentHeightUp)
      : [];

  // tree down
  $: visibleNodesDown = nodesDown.filter((d) => d.level <= currentLevelDown);

  // Only show links from nodes whose level is <= currentLevel - 1
  $: visibleLinks = linksDown.filter(
    (d) => d.parent && d.level <= currentLevelDown,
  );

  // next step handler
  function nextStepHandler() {
    if (currentLevelDown < maxHeightDown) {
      currentLevelDown += 1;
    } else {
      if (currentLevelUp < maxHeightUp) {
        currentLevelUp += 1;
      }
    }
  }

  const orbitRadius = 8; // base distance from main node
  const ringGap = 4;
</script>

<div id="wrapper" bind:clientWidth={width} bind:clientHeight={height}>
  <div class="tree">
    <button id="reset" on:click={reset}>reset</button>
    <button id="next" on:click={nextStepHandler}>next</button>

    {#if width !== undefined || height !== undefined}
      <svg {width} {height}>
        <g transform={`translate(${margin.right}, ${margin.top})`}>
          <!-- downward links -->
          {#each visibleLinks as d}
            <path
              d={`M${d.x},${yCenter + d.y} 
       C${d.x},${yCenter + d.parent.y + 20} 
        ${d.parent.x},${yCenter + d.parent.y + 20} 
        ${d.parent.x},${yCenter + d.parent.y}`}
              fill="none"
              stroke={highlightedLinks.has(`${d.parent.data.id}→${d.data.id}`)
                ? "yellow"
                : "#595959"}
              stroke-width="1"
            />
          {/each}

          <!-- downward nodes -->
          {#each visibleNodesDown as d}
            <g transform={`translate(${d.x}, ${yCenter + d.y})`}>
              <text
                x={-8}
                y={0}
                font-size="8"
                fill="gray"
                transform={"rotate(-35)"}
                text-anchor="end"
              >
                {d.data.name}
              </text>
              <circle
                cx="0"
                cy="0"
                r="1"
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
              ></circle>
            </g>
          {/each}

          <!-- upward links -->
          {#each visibleLinksUp as d}
            <path
              d={`M${d.x},${yCenter - d.y}
        C${d.x},${yCenter - d.parent.y - 20}
         ${d.parent.x},${yCenter - d.parent.y - 50}
         ${d.parent.x},${yCenter - d.parent.y}`}
              fill="none"
              stroke={highlightedLinks.has(`${d.parent.data.id}→${d.data.id}`)
                ? "orange"
                : "#595959"}
              stroke-width="1"
            />
          {/each}
          <!-- upward nodes -->
          {#each visibleNodesUp as d}
            <g transform={`translate(${d.x}, ${yCenter - d.y})`}>
              <text
                x={d.children ? 12 : 5}
                y={d.children ? 5 : -10}
                font-size="8"
                fill="gray"
                transform={"rotate(-35)"}
              >
                {d.data.name}
              </text>

              <!-- main circle -->
              <circle
                cx="0"
                cy="0"
                r="1"
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
              ></circle>

              {#each Array(d.data.ppl) as _, i}
                <circle
                  cx={(orbitRadius + ringGap * Math.floor(i / 12)) *
                    Math.cos(((-90 + ((i % 12) + 1) * 30) * Math.PI) / 180)}
                  cy={(orbitRadius + ringGap * Math.floor(i / 12)) *
                    Math.sin(((-90 + ((i % 12) + 1) * 30) * Math.PI) / 180)}
                  r="1.5"
                  fill="yellow"
                />
              {/each}
            </g>
          {/each}
        </g>
      </svg>
    {/if}
  </div>

  <div id="details" style="margin-top: {0 + 'px'};">
    {#each fullChain as d}
      <a href={d.data.link} target="_blank">
        <div
          class="detail-segment"
          style="
			height: {segment_height}px;
			width: {details_width}px;
			display: flex;
		  "
        >
          <div
            class="segment-left"
            style="flex: 1; border-right: 1px solid rgba(128, 128, 128, 0.333);"
          >
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <g transform={`translate(16, ${segment_height / 2})`}>
                <text x="15" y="-15" font-size="12" fill="white"
                  >{d.data.name}</text
                >
                <line
                  x1="1"
                  y1="-32"
                  x2="1"
                  y2={segment_height - 24}
                  stroke="orange"
                  stroke-width="3"
                />
                <!-- {#if d.data.type === 'vis'}
									<Icons {d} which_icon="img/vis.png" />
								{:else if d.data.type == 'db'}
									<Icons {d} which_icon="img/data.png" />
								{:else if d.data.type == 'prog'}
									<Icons {d} which_icon="img/prog.png" />
								{:else if d.data.name == 'Collect'}
									<Icons {d} which_icon="img/collect.png" />
								{:else if d.data.name == 'Translate'}
									<Icons {d} which_icon="img/translate.png" />
								{:else if d.data.name == 'Transcribe'}
									<Icons {d} which_icon="img/transcribe.png" />
								{:else if d.data.name == 'Code'}
									<Icons {d} which_icon="img/annotation.png" />
								{:else if d.data.name == 'agt'}
									<Icons {d} which_icon="img/agt.png" />
								{:else if d.data.name == 'conflict'}
									<Icons {d} which_icon="img/war.png" />
								{:else}
									<circle r="5" fill="gray" />
								{/if} -->
                {#each Array(d.data.ppl) as _, j}
                  <foreignObject
                    x={20 + j * 12}
                    y={-8 + Math.random()}
                    width="12"
                    height="12"
                    role="button"
                    tabindex="0"
                    aria-label="Icon"
                  >
                    <div
                      class="icon"
                      style={`background-image: url('img/person.png');`}
                    ></div>
                  </foreignObject>
                {/each}
                <line
                  x1="20"
                  y1="15"
                  x2={100}
                  y2="15"
                  stroke="white"
                  stroke-width="1"
                />
              </g>
            </svg>
          </div>
          <div
            class="segment-right"
            style="
				  flex: 1;
				  background-image: url('{d.data.url}');
				  background-size: contain;
				  <!-- background-repeat: no-repeat; -->
				  background-position: center;
				"
          ></div>
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  #wrapper {
    width: 100%;
    height: 100vh;
    display: flex;
  }
  .tree {
    width: 70%;
    height: 100vh;
  }
  .overview {
    width: 30%;
    display: flex;
    flex-direction: column;
  }
  .ppl {
    width: 100%;
    height: 100%;
    /* background-color: red; */
  }
  #details {
    position: absolute;
    top: 4px;
    right: 0;
  }
  .detail-segment {
    color: white;
    display: flex;
    background-color: #002731;
    border-radius: 10px;
    border: solid 2px rgba(106, 106, 106, 0.237);
    transition: border-color 0.2s ease;
  }
  .detail-segment:hover {
    border-color: rgba(255, 255, 255, 0.8); /* brighter border */
  }
  .segment-left,
  .segment-right {
    flex: 1;
    padding: 0;
    box-sizing: border-box;
  }
  .segment-right {
    border-radius: 10px;
  }
  button {
    width: 50px;
  }
  #reset {
    position: absolute;
    top: 0px;
    left: 0px;
  }

  #next {
    position: absolute;
    top: 50px;
    left: 0px;
  }

  #filter {
    position: absolute;
    top: 25px;
    left: 0px;
  }
  iframe {
    width: 90%;
    height: 100vh;
    border: none;
  }
  .icon {
    width: 12px;
    height: 12px;
    background-size: cover;
    border-radius: 0px;
    transition: transform 0.2s ease;
  }

  path.animate {
    animation: draw 0.5s linear forwards;
  }

  @keyframes draw {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
</style>
