<script>
  import * as d3 from "d3";
  import BackgroundTree from "./lib/BackgroundTree.svelte";
  import ForegroundTree from "./lib/ForegroundTree.svelte";
  import Legend from "./lib/Legend.svelte";
  import TreeLegend from "./lib/TreeLegend.svelte";
  import PeopleLegend from "./lib/PeopleLegend.svelte";
  import Details from "./lib/Details.svelte";
  import {
    data,
    steps,
    groupDownwardByContinent,
    alignBranchToX,
    setUniformY,
  } from "./utils";

  let margin = { top: 20, right: 100, bottom: 20, left: 100 };
  // half margin when node clicked
  $: margin = { top: 20, right: clicked ? 50 : 100, bottom: 20, left: 100 };

  let stoppedAtNegotiation = null;

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
  const DETAIL_BASELINE_SEGMENTS = 13;
  const DETAIL_TITLE_SEGMENTS = 1;
  const INITIAL_LEVEL = -1;
  const DOWN_TO_UP_TRIGGER_LEVEL = 2;

  let wrapperElement;
  let width;
  let height;
  let clicked = null;
  let removedAgreements;
  let nodesUp = [];
  let linksUp = [];
  let nodesDown = [];
  let linksDown = [];
  let ucdpNodes = [];
  let hasStartedExploring = false;
  let showIntro = true;
  let innerWidth = 0;
  let details_width = 1;

  $: innerHeight = height - margin.top - margin.bottom;
  // recalculate width when node is clicked
  $: innerWidth = clicked
    ? (width - margin.left - margin.right) * 0.6
    : width - margin.left - margin.right;
  $: details_width = clicked ? (Number(width) || 0) * 0.4 : 1;
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
      y: yCenter + downHeight - 3,
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
    // only compute removedAgreements once on first load
    // if (!removedAgreements) {
    //   removedAgreements = pickRandom(agreementNodes, 20);
    // }

    if (!removedAgreements) {
      const shuffled = d3.shuffle(agreementNodes.slice());
      removedAgreements = new Set(shuffled.slice(0, 10)); // fully pruned
      stoppedAtNegotiation = new Set(shuffled.slice(10, 20)); // stop at negotiation
    }

    nodesDown = allNodesDown.filter((d) => {
      if (d.data.name === "conflict") return true; // wait — should this be removed for stopped set?
      if (isInRemovedSubtree(d, removedAgreements)) return false;
      if (d.depth < 2 && isInRemovedSubtree(d, stoppedAtNegotiation))
        return false;
      return true;
    });

    linksDown = allLinksDown.filter((d) => {
      if (isInRemovedSubtree(d, removedAgreements)) return false;
      if (d.depth < 3 && isInRemovedSubtree(d, stoppedAtNegotiation))
        return false;
      return true;
    });
  }

  //////////////////////////////// reset to default
  function reset() {
    fullChain = [];
    clicked = null;
    hoveredNodeName = "";
    highlightedLinks = new Set();
    d3.selectAll(".ind_line").style("opacity", 0.5);
  }

  //////////////////////////////// node hover
  let highlightedLinks = new Set();
  let hoveredNodeName = "";
  let hoveredNodeX = 0;
  let hoveredNodeY = 0;

  function setHoveredNodePosition(event) {
    if (!event) return;

    const wrapperBounds = wrapperElement?.getBoundingClientRect();
    const offsetLeft = wrapperBounds?.left ?? 0;
    const offsetTop = wrapperBounds?.top ?? 0;

    // Anchor to the hovered node geometry so tooltip offset stays stable.
    if (typeof event.currentTarget?.getBoundingClientRect === "function") {
      const nodeBounds = event.currentTarget.getBoundingClientRect();
      const nodeCenterX = nodeBounds.left + nodeBounds.width / 2;
      const nodeTopY = nodeBounds.top;

      hoveredNodeX = nodeCenterX - offsetLeft;
      hoveredNodeY = nodeTopY - offsetTop - 8;
      return;
    }

    hoveredNodeX = event.clientX - offsetLeft;
    hoveredNodeY = event.clientY - offsetTop - 8;
  }

  function handleHoverEvent(e) {
    if (!clicked) {
      let node = e.node;
      if (!node) {
        hoveredNodeName = "";
        highlightedLinks = new Set();
        return;
      }

      setHoveredNodePosition(e.event);
      hoveredNodeName = node.data?.tooltip_name ?? "";

      const links = new Set();

      // 1. Highlight upward ancestry
      while (node.parent) {
        const key = `${node.parent.data.id}→${node.data.id}`;
        links.add(key);
        node = node.parent;
      }

      // 2. Always add all downward links
      linksDown.forEach((d) => {
        if (
          !isInRemovedSubtree(d, removedAgreements) &&
          !isInRemovedSubtree(d, stoppedAtNegotiation)
        ) {
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
    hoveredNodeName = "";
    clicked = true;
    fullChain = [];
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
    const baselineUnits = DETAIL_BASELINE_SEGMENTS + DETAIL_TITLE_SEGMENTS;
    segment_height = baselineUnits > 0 ? availableHeight / baselineUnits : 0;
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

  function getMaxWorkflowUpLevel() {
    const levels = Array.from(STEP_BY_LEVEL.keys())
      .map((key) => Number(key.split(":")[0]))
      .filter((level) => Number.isFinite(level));

    return levels.length > 0 ? Math.max(...levels) : INITIAL_LEVEL;
  }

  function buildWorkflowStates(maxDown, maxUp) {
    const states = [
      {
        levelUp: INITIAL_LEVEL,
        levelDown: INITIAL_LEVEL,
      },
    ];
    const safeMaxDown =
      Number.isFinite(maxDown) && maxDown >= INITIAL_LEVEL
        ? maxDown
        : INITIAL_LEVEL;
    const safeMaxUp =
      Number.isFinite(maxUp) && maxUp >= INITIAL_LEVEL ? maxUp : INITIAL_LEVEL;

    if (safeMaxDown < 0 || safeMaxUp < 0) {
      return states;
    }

    let levelUp = INITIAL_LEVEL;
    let levelDown = INITIAL_LEVEL;

    for (let i = 0; i < 100; i += 1) {
      if (levelDown < safeMaxDown) {
        levelDown += 1;
        if (levelDown === DOWN_TO_UP_TRIGGER_LEVEL && levelUp < safeMaxUp) {
          levelUp += 1;
        }
      } else if (levelUp < safeMaxUp) {
        levelUp += 1;
      } else {
        break;
      }

      states.push({ levelUp, levelDown });
    }

    return states;
  }

  function getCurrentWorkflowStateIndex(states, levelUp, levelDown) {
    const index = states.findIndex(
      (state) => state.levelUp === levelUp && state.levelDown === levelDown,
    );

    return index >= 0 ? index : 0;
  }

  function applyWorkflowState(stateIndex) {
    if (!workflowStates.length) return;
    const clampedIndex = Math.max(
      0,
      Math.min(stateIndex, workflowStates.length - 1),
    );
    const targetState = workflowStates[clampedIndex];
    currentLevelUp = targetState.levelUp;
    currentLevelDown = targetState.levelDown;
  }

  const maxHeightUp = getMaxWorkflowUpLevel();
  let currentLevelDown = INITIAL_LEVEL;
  let currentLevelUp = INITIAL_LEVEL;
  let segment_height;

  // levels for downward nodes
  // assign revealLevel to all downward descendants (including the artificial root)
  $: rootDown.descendants().forEach((d) => {
    d.revealLevel = downRevealLevel(d);
  });
  $: maxHeightDown = nodesDown.length
    ? Math.max(...nodesDown.map((d) => d.revealLevel))
    : INITIAL_LEVEL;
  $: workflowStates = buildWorkflowStates(maxHeightDown, maxHeightUp);
  $: workflowStateIndex = getCurrentWorkflowStateIndex(
    workflowStates,
    currentLevelUp,
    currentLevelDown,
  );
  $: isAtWorkflowStart = workflowStateIndex === 1;
  $: isAtWorkflowEnd = workflowStateIndex >= workflowStates.length - 1;

  // next step handler
  function nextStepHandler() {
    if (isAtWorkflowEnd) return;
    applyWorkflowState(workflowStateIndex + 1);
  }

  function previousStepHandler() {
    if (isAtWorkflowStart) return;
    applyWorkflowState(workflowStateIndex - 1);
  }

  function revealAllHandler() {
    if (isAtWorkflowEnd) return;
    applyWorkflowState(workflowStates.length - 1);
  }

  function startExploringHandler() {
    hasStartedExploring = true;
    showIntro = false;
    if (workflowStateIndex === 0 && workflowStates.length > 1) {
      applyWorkflowState(1);
    }
  }

  $: currentStepIndex = hasStartedExploring
    ? getStepIndex(currentLevelUp, currentLevelDown)
    : undefined;
  $: currentStepDescription =
    currentStepIndex !== undefined
      ? (steps.workflow[currentStepIndex]?.description ?? "")
      : "";
  $: showStepDescription = Boolean(currentStepDescription) && !clicked;
</script>

<div
  id="wrapper"
  bind:this={wrapperElement}
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <!-- intro screen -->
  {#if showIntro}
    <div class="intro-overlay">
      <div class="intro-card">
        <p class="intro-text">
          This visualization shows processes that take place from the point of
          armed conflicts, all the way to conducting peacebuilding research and
          the development of PeaceTech tools aimed to support this research in
          novel ways. The variation in the tree colors indicate the following
          process categories:
        </p>
        <TreeLegend {currentLevelDown} />
        <br />
        <p class="intro-text">There are two types of nodes:</p>
        <Legend {currentLevelDown} />
        <p class="intro-text">The size and the number of circles surronding the main node indicate the nubmer of people involved:</p>
        <PeopleLegend />
        <p class="intro-text">
          Use arrow buttons to navigate through the workflow or the star button
          to reveal everything at once:
        </p>
        <div class="controls_intro">
          <button
            id="back"
            type="button"
            aria-label="Previous step"
            title="Previous step"
          >
            <i class="fa fa-arrow-left" aria-hidden="true"></i>
          </button>
          <button
            id="next"
            type="button"
            aria-label="Next step"
            title="Next step"
          >
            <i class="fa fa-arrow-right" aria-hidden="true"></i>
          </button>
          <button
            id="reveal-all"
            type="button"
            aria-label="Reveal all"
            title="Reveal all"
          >
            <i class="fa fa-star" aria-hidden="true"></i>
          </button>
        </div>
        <button
          class="intro-button"
          type="button"
          on:click={startExploringHandler}
        >
          Explore
        </button>
      </div>
    </div>
  {/if}

  {#if !showIntro}
    <button class="info-button" title="Show info" on:click={() => showIntro = true}>
      <i class="fa fa-info-circle" aria-hidden="true"></i>
    </button>
  {/if}

  <!-- tooltip for node hover -->
  {#if hoveredNodeName && !clicked}
    <div
      class="node-hover-tooltip"
      style={`left: ${hoveredNodeX}px; top: ${hoveredNodeY}px;`}
    >
      {hoveredNodeName}
    </div>
  {/if}

  <div class="tree" style={`width: ${clicked ? width * 0.6 : width}px;`}>
    {#if width !== undefined || height !== undefined}
      <svg width={clicked ? width * 0.6 : width} {height}>
        <g transform={`translate(${margin.right}, ${margin.top})`}>
          <BackgroundTree
            {currentLevelUp}
            {ucdpNodes}
            {nodesUp}
            {linksUp}
            {linksDown}
            {nodesDown}
            {regionLabels}
            {yCenter}
            {clicked}
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
      </svg>
    {/if}
    {#if showStepDescription}
      <div id="step_description">
        <div class="controls">
          <button
            id="back"
            type="button"
            on:click={previousStepHandler}
            disabled={isAtWorkflowStart}
            aria-label="Previous step"
            title="Previous step"
          >
            <i class="fa fa-arrow-left" aria-hidden="true"></i>
          </button>
          <button
            id="next"
            type="button"
            on:click={nextStepHandler}
            disabled={isAtWorkflowEnd}
            aria-label="Next step"
            title="Next step"
          >
            <i class="fa fa-arrow-right" aria-hidden="true"></i>
          </button>
          <button
            id="reveal-all"
            type="button"
            on:click={revealAllHandler}
            disabled={isAtWorkflowEnd}
            aria-label="Reveal all"
            title="Reveal all"
          >
            <i class="fa fa-star" aria-hidden="true"></i>
          </button>
        </div>
        <div id="step_description_text">
          {@html currentStepDescription}
        </div>
      </div>
    {/if}
  </div>
  <Details {fullChain} {details_width} {segment_height} onReset={reset} />
</div>

<style>
  #wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
  }

  .node-hover-tooltip {
    position: absolute;
    z-index: 25;
    transform: translate(-50%, -100%);
    padding: 6px 10px;
    border: solid 1px rgba(255, 255, 255, 0.25);
    border-radius: 4px;
    background: rgba(0, 28, 35, 0.95);
    color: white;
    font-size: 12px;
    pointer-events: none;
    white-space: nowrap;
  }

  h1 {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    z-index: 10;
    margin: 0;
  }

  .intro-overlay {
    position: absolute;
    width: 40%;
    right: 10px;
    z-index: 30;
    display: flex;
    padding: 24px;
  }

  .intro-card {
    /* width: min(640px, calc(100vw - 48px)); */
    height: 80vh;
    max-height: 80vh;
    overflow-y: auto;
    padding: 28px 32px;
    border: solid 1px rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    background: rgba(0, 28, 35, 0.94);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
    text-align: center;
  }

  .intro-text {
    margin: 0 0 20px;
    color: rgba(255, 255, 255, 0.92);
    font-size: 14px;
  }

  .intro-button {
    padding: 10px 18px;
    border: none;
    border-radius: 999px;
    background: #ffffff;
    color: #001c23;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
  }

  .tree {
    height: 100vh;
  }

  #step_description {
    position: absolute;
    top: 55%;
    left: 5px;
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 14px;
    color: rgb(255, 255, 255);
    font-size: 13px;
    background-color: #001c23;
    border-radius: 5px;
    z-index: 10;
  }

  #step_description_text {
    line-height: 1.5;
    padding: 5px;
  }

  .controls {
    display: flex;
    justify-content: flex-start;
    gap: 6px;
  }

  .controls_intro {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-bottom: 20px;
  }

  .controls_intro button {
    width: 28px;
    height: 28px;
    padding: 0;
    border: solid 1px rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .controls button {
    width: 34px;
    height: 34px;
    padding: 0;
    border: solid 1px rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
  }

  .controls button:hover:enabled {
    background: rgba(255, 255, 255, 0.16);
  }

  .controls button i {
    font-size: 14px;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .info-button {
    position: fixed;
    top: 10px;
    right: 10px;
    /* z-index: 0; */
    background: rgba(0,0,0,0.7);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transition: background 0.2s;
  }
  .info-button:hover {
    background: #005266;
  }
</style>
