<script>
  import * as d3 from "d3";
  import BackgroundTree from "./lib/BackgroundTree.svelte";
  import ForegroundTree from "./lib/ForegroundTree.svelte";
  import Legend from "./lib/Legend.svelte";
  import {
    data,
    steps,
    groupDownwardByContinent,
    alignBranchToX,
    setUniformY,
  } from "./utils";

  let width,
    height,
    details_width = 1,
    details_data = [],
    clicked = null,
    removedAgreements,
    margin = { top: 20, right: 100, bottom: 20, left: 100 },
    nodesUp = [],
    linksUp = [],
    nodesDown = [],
    linksDown = [],
    ucdpNodes = [],
    tracker,
    peacefem;

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
  let ucdpDown = d3.hierarchy(
    {
      name: "__ucdp_root__",
      children: data.ucdp,
    },
    (d) => d.children,
  );
  $: upwardCluster = d3.cluster().size([innerWidth, upHeight]);
  $: downwardCluster = d3.cluster().size([innerWidth, downHeight]);
  $: regionLabels = (() => {
    if (!rootDown.children) return [];
    const groups = d3.group(
      rootDown.children,
      (d) => d.data.continent ?? "Unknown",
    );

    return Array.from(groups, ([continent, nodes]) => ({
      continent,
      count: nodes[0]?.data.number ?? nodes.length, // true count
      x: d3.mean(nodes, (d) => d.x),
      y: yCenter + downHeight,
    }));
  })();

  // positioning of the upward tree node positions
  const defaultWeightUp = 1;
  const depthWeightUp = {
    0: 0.7, // root
    1: 0.7, // Collect
    2: 0.7, // Translate
    3: 0.7, // Transcribe
    4: 0.7, // Code
    5: 0.7, // QC
  };

  function setResponsiveY(node, unitHeight) {
    if (!node.children) return;

    node.children.forEach((child) => {
      const weight = depthWeightUp[child.depth] ?? defaultWeightUp;
      child.y = node.y + weight * unitHeight;
      setResponsiveY(child, unitHeight);
    });
  }

  // remove some negotiation and agreement nodes
  function pickRandom(nodes, count) {
    return new Set(d3.shuffle(nodes.slice()).slice(0, count));
  }

  function isInRemovedSubtree(node, removedSet) {
    let current = node;
    while (current) {
      if (removedSet.has(current)) return true;
      current = current.parent;
    }
    return false;
  }

  //////////////////////////////// compute layout and positions 
  $: {
    upwardCluster(rootUp);
    downwardCluster(rootDown);
    downwardCluster(ucdpDown);

    // posittion pax subdatabases to the centre
    alignBranchToX(rootUp, "PA-X Local", "VUE");

    // center upward and downward tree on "Collect" node
    const collectNode = rootUp
      .descendants()
      .find((d) => d.data.name === "Collect");
    rootDown.x = collectNode.x;
    rootUp.y = 0;
    ucdpDown.x = innerWidth / 1.5;
    ucdpDown.y -= 20;

    // positioning of the upward tree nodes
    const maxDepth = rootUp.height + 1;
    let totalWeight = 0;
    for (let d = 1; d <= maxDepth; d++) {
      totalWeight += depthWeightUp[d] ?? defaultWeightUp;
    }
    const unitHeight = upHeight / totalWeight;
    setResponsiveY(rootUp, unitHeight);

    // shifting research and d3 subtree to the top level
    function shiftSubtree(node, delta) {
      node.y += delta;
      if (node.children) {
        node.children.forEach((child) => shiftSubtree(child, delta));
      }
    }
    const paaXD3Node = rootUp
      .descendants()
      .find((d) => d.data.name === "d3" && d.parent?.data?.name === "PAA-X");

    if (paaXD3Node) {
      const targetY = paaXD3Node.y;
      rootUp.descendants().forEach((d) => {
        if (
          (d.data.name === "d3" && d.parent?.data?.name === "PA-X") ||
          (d.data.name === "Tracker" && d.parent?.data?.name === "PA-X") ||
          (d.data.name === "Infographics" && d.parent?.data?.name === "PA-X")
        ) {
          const delta = targetY - d.y;
          shiftSubtree(d, delta);
        } else if (d.data.name === "Research") {
          const delta = targetY - d.y;
          shiftSubtree(d, delta);
        }
      });
    }

    // position peacefem and youth to the top level
    peacefem = rootUp.descendants().find((d) => d.data.name === "PeaceFem");
    tracker = rootUp.descendants().find((d) => d.data.name === "Tracker");
    let infographics = rootUp
      .descendants()
      .find((d) => d.data.name === "Infographics");
    let gender = rootUp
      .descendants()
      .find((d) => d.data.name === "Scrollytelling");
    let youth = rootUp.descendants().find((d) => d.data.name === "PBi Youth");
    peacefem.y = gender.y;
    youth.y = gender.y;
    tracker.y = gender.y;
    infographics.y = gender.y;
    infographics.x += 20;

    // positioning of the downward tree nodes
    const spacingDown = downHeight / (rootDown.height + 0.8);
    setUniformY(rootDown, spacingDown);

    // positioning of ucdp down tree
    const paxConflictNodes = rootDown
      .descendants()
      .filter((d) => d.data.name === "conflict");
    const conflictY =
      paxConflictNodes.length > 0 ? paxConflictNodes[0].y : null;
    if (conflictY !== null) {
      ucdpDown.descendants().forEach((d) => {
        // only real nodes, skip artificial root
        if (d.parent) {
          d.y = conflictY;
        }
      });
    }

    groupDownwardByContinent(rootDown, innerWidth, {
      nodeSpacing: 10,
      continentGap: 80,
    });
    groupDownwardByContinent(ucdpDown, innerWidth, {
      nodeSpacing: 10,
      continentGap: 80,
    });

    nodesUp = rootUp.descendants();
    linksUp = nodesUp.slice(1);
    nodesDown = rootDown.descendants().slice(1);
    linksDown = nodesDown.filter((d) => d.parent);
    ucdpNodes = ucdpDown.descendants();

    // remove some nodes from downward tree
    const allNodesDown = rootDown.descendants().slice(1);
    const allLinksDown = allNodesDown.filter((d) => d.parent);
    // agreement-level nodes
    const agreementNodes = allNodesDown.filter((d) => d.depth === 1);
    removedAgreements = pickRandom(agreementNodes, 20);

    // filter nodes
    nodesDown = allNodesDown.filter((d) => {
      // always keep conflict nodes
      if (d.data.name === "conflict") return true;
      // otherwise remove if in removed agreement subtree
      return !isInRemovedSubtree(d, removedAgreements);
    });

    // filter links
    linksDown = allLinksDown.filter((d) => {
      // keep links *to* conflict nodes
      if (d.data.name === "conflict") return true;
      // otherwise same pruning rule
      return !isInRemovedSubtree(d, removedAgreements);
    });

  }

  //////////////////////////////// reset to default
  function reset() {
    innerWidth = width - margin.right - margin.left;
    details_width = 1;
    fullChain = [];
    clicked = null;
    highlightedLinks = new Set();
    d3.selectAll(".ind_line").style("opacity", 0.5);
  }

  //////////////////////////////// node hover 
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
        if (!isInRemovedSubtree(d, removedAgreements)) {
          const key = `${d.parent.data.id}→${d.data.id}`;
          links.add(key);
        }
      });

      highlightedLinks = links;
    }
  }

  //////////////////////////////// node click 
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

    while (downCurrent) {
      console.log(downCurrent);

      downCurrentChain.push(downCurrent);
      downCurrent = downCurrent.children?.[0] || null;
    }

    // Push the downCurrent chain in reverse order
    fullChain = fullChain.concat(downCurrentChain);
  }
  $: if (fullChain.length > 1) {
    const totalBorder = fullChain.length * 4;
    segment_height = (height - totalBorder) / fullChain.length;
  }

  /////////////////////////////// gradual reveal logic 
  // revel doesn't work fir the agreement -> collection FIX !!!
  function downRevealLevel(d) {
    switch (d.data.name) {
      case "agreement":
        return 0;
      case "negotiation":
        return 1;
      case "conflict":
        return 2;
      default:
        return 0;
    }
  }
  let currentLevelDown = -1;
  let currentLevelUp = -1;
  let segment_height;

  // levels for downward nodes
  // assign revealLevel to all downward descendants (including the artificial root)
  $: rootDown.descendants().forEach((d) => {
    d.revealLevel = downRevealLevel(d);
  });
  $: maxHeightDown = Math.max(...nodesDown.map((d) => d.revealLevel));

  // next step handler
  function nextStepHandler() {
    if (currentLevelDown < maxHeightDown) {
      currentLevelDown += 1;
      if (currentLevelDown === 2) {
        currentLevelUp += 1;
      }
    } else {
      currentLevelUp += 1;
    }
  }

  // remove first level connections
  $: {
    if (currentLevelUp === -1 && currentLevelDown === 0) {
      d3.select("#step_description")
        .style("visibility", "visible")
        .html(steps.workflow[0].description);
    } else if (currentLevelUp === -1 && currentLevelDown === 1) {
      d3.select("#step_description").html(steps.workflow[1].description);
    } else if (currentLevelUp === 0) {
      d3.select("#step_description").html(steps.workflow[2].description);
    } else if (currentLevelUp === 1) {
      d3.select("#step_description").html(steps.workflow[3].description);
    } else if (currentLevelUp === 2) {
      d3.select("#step_description").html(steps.workflow[4].description);
    } else if (currentLevelUp === 3) {
      d3.select("#step_description").html(steps.workflow[5].description);
    } else if (currentLevelUp === 4) {
      d3.select("#step_description").html(steps.workflow[6].description);
    } else if (currentLevelUp === 5) {
      d3.select("#step_description").html(steps.workflow[7].description);
    } else if (currentLevelUp === 6) {
      d3.select("#step_description").html(steps.workflow[8].description);
    } else if (currentLevelUp === 7) {
      d3.select("#step_description").html(steps.workflow[9].description);
      d3.select(".trackerCircle").remove();
    } else if (currentLevelUp === 8) {
      d3.select("#step_description").html(steps.workflow[10].description);
    } else if (currentLevelUp === 9) {
      d3.selectAll(".sub_db_research").style("stroke", "#bfbfbf");
      d3.select("#step_description").remove();
      d3.select("#step_description").html(steps.workflow[11].description);
      d3.select(".progPathFirst").remove();
    } else if (currentLevelUp === 10) {
      d3.select("#step_description").html(steps.workflow[12].description);
      d3.selectAll(".visPathFirst, .pbiCircle").remove();
    } else if (currentLevelUp === 16) {
    }
  }

  $: console.log(currentLevelUp);
</script>

<div id="wrapper" bind:clientWidth={width} bind:clientHeight={height}>
  <div id="step_description"></div>
  <div class="tree">
    <button id="reset" on:click={reset}>reset</button>
    <button id="next" on:click={nextStepHandler}>next</button>
    {#if width !== undefined || height !== undefined}
      <svg {width} {height}>
        <g transform={`translate(${margin.right}, ${margin.top})`}>
          <BackgroundTree
            {ucdpNodes}
            {nodesUp}
            {nodesDown}
            {regionLabels}
            {yCenter}
          />
          <ForegroundTree
            {nodesUp}
            {linksUp}
            {nodesDown}
            {linksDown}
            {highlightedLinks}
            {currentLevelUp}
            {currentLevelDown}
            {yCenter}
            {handleHoverEvent}
            {handleClickEvents}
            {rootUp}
          />
        </g>
        <Legend />
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
              <g transform={`translate(5, 5)`}>
                <text x="10" y="15" font-size="12" fill="white"
                  >{d.data.name}</text
                >
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

  #step_description {
    visibility: hidden;
    position: absolute;
    top: 60%;
    left: 5px;
    width: 250px;
    color: rgb(255, 255, 255);
    font-size: 12px;
    background-color: #001c23;
    padding: 20px 20px;
    border-radius: 5px;
    z-index: 10;
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
    border-color: rgba(255, 255, 255, 0.8);
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
    text-align: center;
  }
  #reset {
    position: absolute;
    top: 0px;
    left: 0px;
  }

  #next {
    position: absolute;
    top: 0px;
    left: 55px;
  }

  .icon {
    width: 12px;
    height: 12px;
    background-size: cover;
    border-radius: 0px;
    transition: transform 0.2s ease;
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
