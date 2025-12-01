<script>
  import * as d3 from "d3";
  import { original_data } from "./utils";

  let width,
    height,
    details_width = 1,
    details_data = [],
    clicked = null,
    data = JSON.parse(JSON.stringify(original_data)),
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

  // adding id to upward nodes
  let idCounter = 0;
  function assignIds(node) {
    node.id = `node-${idCounter++}`;
    if (node.children) {
      node.children.forEach(assignIds);
    }
  }
  assignIds(data);

  // adding id's to downward nodes
  data.downward.forEach(assignIds);

  $: upwardCluster = d3.cluster().size([innerWidth, upHeight]);
  $: downwardCluster = d3.cluster().size([innerWidth, downHeight]);

  $: rootUp = d3.hierarchy(data, (d) => d.children);
  $: rootDown = d3.hierarchy(
    { ...data, children: data.downward },
    (d) => d.children,
  );

  function setUniformY(node, spacing = 100) {
    if (!node.children) return;
    node.children.forEach((child) => {
      child.y = node.y + spacing; // child one level below parent
      setUniformY(child, spacing); // recurse
    });
  }

  $: {
    upwardCluster(rootUp);
    downwardCluster(rootDown);

    // find "Collect" in the upward tree
    const collectNode = rootUp
      .descendants()
      .find((d) => d.data.name === "Collect");

    // move only the downward root to match Collect
    rootDown.x = collectNode.x;

    // set uniform spacing for upward tree
    const spacingUp = upHeight / (rootUp.height + 1);
    setUniformY(rootUp, spacingUp);

    // set uniform spacing for downward tree
    const spacingDown = downHeight / (rootDown.height + 1);
    setUniformY(rootDown, spacingDown);

    nodesUp = rootUp.descendants();
    linksUp = nodesUp.slice(1);
    nodesDown = rootDown.descendants().slice(1);
    linksDown = nodesDown.filter((d) => d.parent);
  }

  function removeNodesAndPrune(node, targetNames) {
    if (!node.children) return { ...node };

    const newChildren = [];

    for (const child of node.children) {
      // If this child should be removed, skip it
      if (targetNames.has(child.name)) continue;

      // Recursively process the child
      const updatedChild = removeNodesAndPrune(child, targetNames);

      // Keep it if not pruned
      if (updatedChild) newChildren.push(updatedChild);
    }

    // If all children were removed and at least one was a target, prune this node
    const hadTargetChild = node.children.some((c) => targetNames.has(c.name));
    if (newChildren.length === 0 && hadTargetChild) {
      return null;
    }

    return {
      ...node,
      children: newChildren.length > 0 ? newChildren : undefined,
    };
  }

  function reset() {
    innerWidth = width - margin.right - margin.left;
    details_width = 1;
    fullChain = [];
    clicked = null;
    highlightedLinks = new Set();
    d3.selectAll(".ind_line").style("opacity", 0.5);
  }

  function filter() {
    const targets = new Set(["Scrollytelling", "Tracker", "Network"]);
    data = removeNodesAndPrune(data, targets);
  }

  // mouseover
  let highlightedLinks = new Set();
  function handleHoverEvent(e) {
    console.log("here");

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

  // click
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

  let segment_height;
  $: if (fullChain.length > 1) {
    const totalBorder = fullChain.length * 4;
    segment_height = (height - totalBorder) / fullChain.length;
  }

  // levels for downward nodes
  $: nodesDown.forEach((node) => {
    node.level =
      node.children && node.children.length
        ? Math.max(...node.children.map((c) => c.level ?? 0)) + 1
        : 0;
  });

  let currentLevel = 0;
  let currentLevelUp = -1; // for nodesUp (hidden at first)

  $: currentHeightUp =
    currentLevelUp >= 0 ? maxHeightUp - currentLevelUp : null;

  $: visibleNodesUp =
    currentHeightUp !== null
      ? nodesUp.filter((d) => d.height >= currentHeightUp)
      : [];

  $: visibleLinksUp =
    currentHeightUp !== null
      ? linksUp.filter(
          (d) =>
            d.parent &&
            (d.height >= currentHeightUp),
        )
      : [];

  // maxHeightUp = highest height in nodesUp (8 in your example)
  $: maxHeightUp = Math.max(...nodesUp.map((d) => d.height));

  function startAnimation() {
    if (currentLevel < Math.max(...nodesDown.map((d) => d.level))) {
      currentLevel += 1;
    } else {
      if (currentLevelUp < maxHeightUp) {
        currentLevelUp += 1;
      }
    }
  }

  $: visibleNodes = nodesDown.filter((d) => d.level <= currentLevel);

  // Only show links from nodes whose level is <= currentLevel - 1
  $: visibleLinks = linksDown.filter(
    (d) => d.parent && d.level <= currentLevel,
  );
</script>

<div id="wrapper" bind:clientWidth={width} bind:clientHeight={height}>
  <div class="tree">
    <button id="reset" on:click={reset}>reset</button>
    <button id="next" on:click={startAnimation}>next</button>

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
                ? "orange"
                : "#595959"}
              stroke-width="1"
            />
          {/each}

          <!-- downward nodes -->
          {#each visibleNodes as d}
            <g transform={`translate(${d.x}, ${yCenter + d.y})`}>
              <circle
                cx="0"
                cy="0"
                r="3"
                fill="white"
                on:mouseenter={() => {
                  handleHoverEvent({ node: d });
                }}
                on:mouseleave={() => handleHoverEvent({ node: null })}
                on:click={() => handleClickEvents({ node: d })}
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
                x={d.children ? 10 : 5}
                y={d.children ? 5 : -10}
                font-size="8"
                fill="gray"
                transform={"rotate(-35)"}
              >
                {d.data.name}
              </text>
              <circle
                cx="0"
                cy="0"
                r="3"
                fill="white"
                on:mouseenter={() => {
                  handleHoverEvent({ node: d });
                }}
                on:mouseleave={() => handleHoverEvent({ node: null })}
                on:click={() => handleClickEvents({ node: d })}
              ></circle>
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
