<script>
  import * as d3 from "d3";
  import BackgroundTree from "./lib/BackgroundTree.svelte";
  import ForegroundTree from "./lib/ForegroundTree.svelte";
  import Legend from "./lib/Legend.svelte";
  import Details from "./lib/Details.svelte";
  import {
    data,
    steps,
    groupDownwardByContinent,
    alignBranchToX,
    setUniformY,
  } from "./utils";

  const margin = { top: 20, right: 100, bottom: 20, left: 100 };
  const STEP_BY_LEVEL = new Map([
    ["-1:0", 0],
    ["-1:1", 1],
    ["0:any", 2],
    ["1:any", 3],
    ["2:any", 4],
    ["3:any", 5],
    ["4:any", 6],
    ["5:any", 7],
    ["6:any", 8],
    ["7:any", 9],
    ["8:any", 10],
    ["9:any", 11],
    ["10:any", 12],
    ["11:any", 13],
    ["12:any", 14],
    ["13:any", 15],
    ["14:any", 16],
    ["15:any", 17],
    ["16:any", 18],
  ]);

  let width;
  let height;
  let details_width = 1;
  let clicked = null;
  let removedAgreements;
  let nodesUp = [];
  let linksUp = [];
  let nodesDown = [];
  let linksDown = [];
  let ucdpNodes = [];

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
    rootDown.x = collectNode?.x ?? innerWidth / 2;
    rootUp.y = 0;
    ucdpDown.x = innerWidth / 1.2;
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
    const infographics = rootUp
      .descendants()
      .find((d) => d.data.name === "Infographics");
    const gender = rootUp
      .descendants()
      .find((d) => d.data.name === "Scrollytelling");

    if (infographics && gender) {
      infographics.y = gender.y;
      infographics.x += 20;
    }

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
    d3.select("#step_description").style("visibility", "visible");
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

  function getDetailSegmentWeight(node) {
    const name = node?.data?.name;
    return name === "agreement" || name === "negotiation" || name === "conflict"
      ? 0.5
      : 1;
  }

  function handleClickEvents(e) {
    d3.select("#step_description").style("visibility", "hidden");
    d3.selectAll(".ind_line").style("opacity", 0);
    if (clicked == null) {
      innerWidth = width / 2 - margin.right;
    }
    clicked = true;
    fullChain = [];
    details_width = innerWidth;
    let current = e.node;
    let downCurrent =
      nodesDown.find((node) => node.data.name === "agreement") ?? nodesDown[16];
    const downCurrentChain = [];

    // Walk up to collect all parents from the clicked node.
    while (current) {
      fullChain.push(current); // push keeps order as leaf → root
      current = current.parent;
    }

    while (downCurrent) {
      downCurrentChain.push(downCurrent);
      downCurrent = downCurrent.children?.[0] || null;
    }

    fullChain = fullChain.concat(downCurrentChain);
  }
  $: if (fullChain.length > 0) {
    const availableHeight = Math.max(height ?? 0, 0);
    const totalUnits = fullChain.reduce(
      (sum, node) => sum + getDetailSegmentWeight(node),
      0,
    ) + 1;
    segment_height = totalUnits > 0 ? availableHeight / totalUnits : 0;
  } else {
    segment_height = 0;
  }

  /////////////////////////////// gradual reveal logic
  const DOWN_REVEAL_LEVEL = {
    agreement: 0,
    negotiation: 1,
    conflict: 2,
  };

  function downRevealLevel(d) {
    return DOWN_REVEAL_LEVEL[d.data.name] ?? 0;
  }

  function getStepIndex(levelUp, levelDown) {
    return (
      STEP_BY_LEVEL.get(`${levelUp}:${levelDown}`) ??
      STEP_BY_LEVEL.get(`${levelUp}:any`)
    );
  }

  function runWorkflowLevelEffects(levelUp) {
    if (levelUp === 7) {
      d3.select(".trackerCircle").remove();
    } else if (levelUp === 9) {
      d3.selectAll(".sub_db_research, .research_link").style(
        "stroke",
        "#bfbfbf",
      );
      d3.select(".progPathFirst").remove();
    } else if (levelUp === 10) {
      d3.selectAll(".visPathFirst, .pbiCircle").remove();
    } else if (levelUp === 14) {
      d3.selectAll(".vis_link").style("stroke", "#bfbfbf");
    } else if (levelUp === 15) {
      d3.selectAll(".sub_vis_research").style("stroke", "#bfbfbf");
    } else if (levelUp === 16) {
      d3.selectAll(".ucdp_link").style("stroke", "#bfbfbf");
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

  // update step text + transition highlights
  $: {
    const stepIndex = getStepIndex(currentLevelUp, currentLevelDown);
    if (stepIndex !== undefined) {
      const description = steps.workflow[stepIndex]?.description;
      if (description) {
        const stepDescription = d3.select("#step_description");
        if (currentLevelUp === -1 && currentLevelDown === 0) {
          stepDescription.style("visibility", "visible");
        }

        stepDescription.html(description);
        runWorkflowLevelEffects(currentLevelUp);
      }
    }
  }

  // $: console.log(currentLevelUp);
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
            {currentLevelUp}
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
            {clicked}
            {rootUp}
          />
        </g>
        <Legend {currentLevelDown} />
      </svg>
    {/if}
  </div>
  <Details {fullChain} {details_width} {segment_height} innerHeight={height} />
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
    width: 30%;
    color: rgb(255, 255, 255);
    font-size: 13px;
    background-color: #001c23;
    padding: 20px 20px;
    border-radius: 5px;
    z-index: 10;
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
</style>
