<script>
  import * as d3 from "d3";
  import {
    data,
    generateDiagonalProgPath,
    steps,
    groupDownwardByContinent,
    alignBranchToX,
    setUniformY,
  } from "./utils";

  // TODO
  // add external datasets at least acled and ucdp

  let width,
    height,
    orbitRadius = 8,
    ringGap = 4,
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
    ucdpLinks = [],
    tracker,
    peacefem,
    ucdp_root;

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
    0: 0.6, // root
    1: 0.6, // Collect
    2: 0.6, // Translate
    3: 0.6, // Transcribe
    4: 0.6, // Code
    5: 0.6, // QC
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
    ucdpDown.x = innerWidth - 50;

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
          d.data.name === "Research" ||
          (d.data.name === "d3" && d.parent?.data?.name === "PA-X") ||
          (d.data.name === "Tracker" && d.parent?.data?.name === "PA-X") ||
          (d.data.name === "Infographics" && d.parent?.data?.name === "PA-X")
        ) {
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
    ucdpLinks = ucdpNodes.filter((d) => d.parent);

    ucdp_root = ucdpNodes.find((d) => d.data.name === "__ucdp_root__");

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
        if (!isInRemovedSubtree(d, removedAgreements)) {
          const key = `${d.parent.data.id}→${d.data.id}`;
          links.add(key);
        }
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
  let currentLevelDown = 0;
  let currentLevelUp = -1;
  let segment_height;

  // levels for downward nodes
  $: nodesDown.forEach((d) => {
    d.revealLevel = downRevealLevel(d);
  });

  $: maxHeightUp = Math.max(...nodesUp.map((d) => d.height));
  $: maxHeightDown = Math.max(...nodesDown.map((d) => d.revealLevel));
  $: currentHeightUp = currentLevelUp >= 0 ? currentLevelUp : null;

  // tree up
  $: visibleNodesUp =
    currentHeightUp !== null
      ? nodesUp.filter((d) => d.data.step <= currentHeightUp)
      : [];
  $: visibleLinksUp =
    currentHeightUp !== null
      ? linksUp.filter((d) => d.parent && d.data.step <= currentHeightUp)
      : [];

  // tree down
  $: visibleNodesDown = nodesDown.filter(
    (d) => d.revealLevel >= maxHeightDown - currentLevelDown,
  );
  $: visibleLinksDown = linksDown.filter(
    (d) =>
      d.parent &&
      d.revealLevel >= maxHeightDown - currentLevelDown &&
      d.parent.revealLevel >= maxHeightDown - currentLevelDown,
  );

  // next step handler
  function nextStepHandler() {
    if (currentLevelDown < maxHeightDown) {
      currentLevelDown += 1;
    } else {
      currentLevelUp += 1;
    }
  }

  // remove first level connections
  $: {
    if (currentLevelUp === -1 && currentLevelDown === 1) {
      d3.select("#step_description").html(steps.workflow[1].description);
      d3.select("#step_description").style("top", "65%");
    } else if (currentLevelUp === -1 && currentLevelDown === 2) {
      d3.select("#step_description").html(steps.workflow[2].description);
      d3.select("#step_description").style("top", "60%");
    } else if (currentLevelUp === 0) {
      d3.select("#step_description").html(steps.workflow[3].description);
      d3.select("#step_description").style("top", "55%");
    } else if (currentLevelUp === 1) {
      d3.select("#step_description").html(steps.workflow[4].description);
      d3.select("#step_description").style("top", "50%");
    } else if (currentLevelUp === 2) {
      d3.select("#step_description").html(steps.workflow[5].description);
      d3.select("#step_description").style("top", "45%");
    } else if (currentLevelUp === 3) {
      d3.select("#step_description").html(steps.workflow[6].description);
      d3.select("#step_description").style("top", "40%");
    } else if (currentLevelUp === 4) {
      d3.select("#step_description").html(steps.workflow[7].description);
      d3.select("#step_description").style("top", "35%");
    } else if (currentLevelUp === 5) {
      d3.select("#step_description").html(steps.workflow[8].description);
      d3.select("#step_description").style("top", "30%");
    } else if (currentLevelUp === 6) {
      d3.select("#step_description").html(steps.workflow[9].description);
      d3.select("#step_description").style("top", "25%");
    } else if (currentLevelUp === 7) {
      d3.select("#step_description").style("top", "20%");
      d3.select("#step_description").html(steps.workflow[10].description);
      d3.select(".trackerCircle").remove();
    } else if (currentLevelUp === 8) {
      d3.select("#step_description").style("top", "15%");
      d3.select("#step_description").html(steps.workflow[11].description);
    } else if (currentLevelUp === 9) {
      d3.select("#step_description").style("top", "10%");
      d3.select("#step_description").html(steps.workflow[12].description);
      d3.select(".progPathFirst").remove();
    } else if (currentLevelUp === 10) {
      d3.select("#step_description").style("top", "2%");
      d3.select("#step_description").html(steps.workflow[13].description);
      d3.selectAll(".visPathFirst, .pbiCircle").remove();
    }
  }

  ///////////////////////////// connecting same type nodes
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
  $: paXProgSecond = rootUp
    .descendants()
    .filter((d) => d.data.type === "prog" && d.parent.data.name == "PA-X");
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
    .filter(
      (d) =>
        d.data.type === "vis" &&
        d.parent?.data?.name === "d3" &&
        d.parent?.parent?.data?.name === "PA-X",
    )
    .sort((a, b) => a.x - b.x)
    .slice(-5);
  $: paXVisNodesSecond.sort((a, b) => a.x - b.x);
  $: visObstaclesSecond = rootUp
    .descendants()
    .filter(
      (d) =>
        !paXVisNodesSecond.includes(d) &&
        d.parent?.ancestors().some((a) => a.data.name === "PA-X"),
    );
  $: visPathSecond = generateDiagonalProgPath(
    yCenter,
    paXVisNodesSecond,
    visObstaclesSecond,
    40,
  );

  // db connections
  $: paXDBNodes = rootUp
    .descendants()
    .filter((d) => d.data.type === "db" && d.data.name !== "PA-X");
  $: paXDBNodes.sort((a, b) => a.x - b.x);
  $: dbObstacles = rootUp
    .descendants()
    .filter(
      (d) =>
        !paXDBNodes.includes(d) &&
        d.parent?.ancestors().some((a) => a.data.name === "PA-X"),
    );
  $: dbPath = generateDiagonalProgPath(yCenter, paXDBNodes, dbObstacles, 40);

  // qc connections
  $: qcNodes = rootUp
    .descendants()
    .filter(
      (d) => d.data.type === "quality_control" && d.data.name !== "PA-X QC",
    );
  $: qcNodes.sort((a, b) => a.x - b.x);
  $: qcObstacles = rootUp
    .descendants()
    .filter(
      (d) =>
        !qcNodes.includes(d) &&
        d.parent?.ancestors().some((a) => a.data.name === "PA-X"),
    );
  $: qcPath = generateDiagonalProgPath(yCenter, qcNodes, qcObstacles, 40);

  // code connections
  $: codeNodes = rootUp
    .descendants()
    .filter((d) => d.data.type === "code" && d.data.name !== "PA-X Code");
  $: codeNodes.sort((a, b) => a.x - b.x);
  $: codeObstacles = rootUp
    .descendants()
    .filter(
      (d) =>
        !codeNodes.includes(d) &&
        d.parent?.ancestors().some((a) => a.data.name === "PA-X"),
    );
  $: codePath = generateDiagonalProgPath(yCenter, codeNodes, codeObstacles, 40);

  // paper connections
  $: paXPaperNodes = rootUp
    .descendants()
    .filter((d) => d.data.type === "paper" && d.data.name !== "PA-X");
  $: paXPaperNodes.sort((a, b) => a.x - b.x);
  $: paperObstacles = rootUp
    .descendants()
    .filter(
      (d) =>
        !paXPaperNodes.includes(d) &&
        d.parent?.ancestors().some((a) => a.data.name === "PA-X"),
    );
  $: paperPath = generateDiagonalProgPath(
    yCenter,
    paXPaperNodes,
    paperObstacles,
    40,
  );

  const labelConfig = new Map([
    ["Collect", { x: 12 }],
    ["Translate", { x: 20 }],
    ["Transcribe", { x: 12 }],
    ["PA-X QC", { x: 12 }],
    ["PA-X", { x: 12 }],
    ["Research", { x: 12 }],
    ["PA-X Code", { x: 25 }],
  ]);

  $: firstNodeByLevelDown = new Map();

  $: {
    firstNodeByLevelDown.clear();
    for (const d of visibleNodesDown) {
      if (!firstNodeByLevelDown.has(d.revealLevel)) {
        firstNodeByLevelDown.set(d.revealLevel, d);
      }
    }
  }

  $: console.log(currentLevelUp);
  $: x1 = peacefem.x;
  $: y1 = yCenter - peacefem.y; // upward tree

  $: x2 = ucdp_root.x;
  $: y2 = yCenter + ucdp_root.y; // downward tree
  // parameters for the curve
  $: curveRadius = Math.min(30, (y2 - y1) / 1.5);
  const cornerYFactor = 0.5; // where the first corner is along y-axis (0-1)
</script>

<div id="wrapper" bind:clientWidth={width} bind:clientHeight={height}>
  <!-- <div id="step_description">{steps.workflow[0].description}</div> -->
  <div class="tree">
    <button id="reset" on:click={reset}>reset</button>
    <button id="next" on:click={nextStepHandler}>next</button>
    {#if width !== undefined || height !== undefined}
      <svg {width} {height}>
        <!-- textures -->
        <!-- <defs>
          <pattern
            id="diagonalHatch"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke="white" stroke-width="2" />
          </pattern>
          <pattern
            id="tex-cross"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="white"
              stroke-width="1.5"
            />
            <line
              x1="0"
              y1="0"
              x2="8"
              y2="0"
              stroke="white"
              stroke-width="1.5"
            />
          </pattern>
          <pattern
            id="tex-dots"
            patternUnits="userSpaceOnUse"
            width="10"
            height="10"
          >
            <circle cx="5" cy="5" r="2" fill="white" />
          </pattern>
        </defs> -->
        <!-- BACKGROUND TREE -->
        <g transform={`translate(${margin.right}, ${margin.top})`}>
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
  stroke="#666"
  stroke-width="2"
  stroke-dasharray="4 4"
/>




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

                      // push corner DOWN for Tracker / Infographics
                      const extraDown =
                        d.data.name === "Tracker" ||
                        d.data.name === "Infographics"
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
              stroke="steelblue"
              stroke-opacity="0.3"
              stroke-width={d.data.branch_type === "trunk"
                ? 10
                : d.data.branch_type === "upper_trunk"
                  ? 7
                  : d.data.branch_type === "uppest_trunk"
                    ? 4
                    : 1}
            />
          {/each}

          <!-- ucdp nodes and links -->
          {#each ucdpLinks as d}
            <path
              d={`M${d.x},${yCenter + d.y} 
       C${d.x},${yCenter + d.parent.y + 60} 
        ${d.parent.x},${yCenter + d.parent.y + 70} 
        ${d.parent.x},${yCenter + d.parent.y}`}
              fill="none"
              stroke="gray"
              stroke-opacity="0.1"
              stroke-width="1"
              stroke-dasharray="4 4"
            />
          {/each}
          {#each ucdpNodes as d}
            <g transform={`translate(${d.x}, ${yCenter + d.y})`}>
              <circle
                cx="0"
                cy="0"
                r={d.data.name == "__ucdp_root__" ? 4 : 2}
                fill={d.data.name == "__ucdp_root__" ? "white" : "none"}
              ></circle>
              {#if d.data.name == "__ucdp_root__"}
                <text
                  x="10"
                  y="0"
                  font-size="10"
                  fill="white"
                  text-anchor="start"
                >
                  UCDP/ACLED
                </text>
              {/if}
            </g>
          {/each}

          {#each linksDown as d}
            <path
              d={`M${d.x},${yCenter + d.y} 
       C${d.x},${yCenter + d.parent.y + 20} 
        ${d.parent.x},${yCenter + d.parent.y + 20} 
        ${d.parent.x},${yCenter + d.parent.y}`}
              fill="none"
              stroke={highlightedLinks.has(`${d.parent.data.id}→${d.data.id}`)
                ? "gray"
                : "steelblue"}
              stroke-opacity="0.3"
              stroke-width="1"
            />
          {/each}
          {#each nodesUp as d}
            <g transform={`translate(${d.x}, ${yCenter - d.y})`}>
              <circle cx="0" cy="0" r="4.5" fill="#4d4d4d"></circle>
            </g>
          {/each}
          {#each nodesDown as d, i}
            <g transform={`translate(${d.x}, ${yCenter + d.y})`}>
              <circle cx="0" cy="0" r="2" fill="#4d4d4d"></circle>
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

          <!-- downward gradual links -->
          {#each visibleLinksDown as d}
            <path
              d={`M${d.x},${yCenter + d.y} 
       C${d.x},${yCenter + d.parent.y + 20} 
        ${d.parent.x},${yCenter + d.parent.y + 20} 
        ${d.parent.x},${yCenter + d.parent.y}`}
              fill="none"
              stroke={highlightedLinks.has(`${d.parent.data.id}→${d.data.id}`)
                ? "gray"
                : "steelblue"}
              stroke-width="1"
            />
          {/each}

          <!-- downward gradual nodes -->
          {#each visibleNodesDown as d, i}
            <g transform={`translate(${d.x}, ${yCenter + d.y})`}>
              {#if firstNodeByLevelDown.get(d.revealLevel) === d}
                <text
                  x={-8}
                  y={0}
                  font-size="10"
                  fill="white"
                  transform="rotate(35)"
                  text-anchor="end"
                >
                  {d.data.name.charAt(0).toUpperCase() + d.data.name.slice(1)}
                </text>
              {/if}
              <circle
                cx="0"
                cy="0"
                r="2"
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
          {#if currentLevelUp >= 11}
            <path
              d={progPathFirst}
              fill="none"
              stroke="white"
              stroke-width="30"
              stroke-opacity="0.2"
              stroke-linecap="round"
            />
          {/if}
          {#if currentLevelUp >= 12}
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
          {#if currentLevelUp >= 14}
            <path
              d={visPathSecond}
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

                      // push corner DOWN for Tracker / Infographics
                      const extraDown =
                        d.data.name === "Tracker" ||
                        d.data.name === "Infographics"
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
              stroke={highlightedLinks.has(`${d.parent.data.id}→${d.data.id}`)
                ? "white"
                : "steelblue"}
              stroke-width={d.data.branch_type === "trunk"
                ? 10
                : d.data.branch_type === "upper_trunk"
                  ? 7
                  : d.data.branch_type === "uppest_trunk"
                    ? 4
                    : 1}
            />
          {/each}

          <!-- upward nodes -->
          {#each visibleNodesUp as d}
            <g transform={`translate(${d.x}, ${yCenter - d.y})`}>
              {#if labelConfig.has(d.data.name)}
                <text
                  x={labelConfig.get(d.data.name).x}
                  y={10}
                  font-size="10"
                  fill="white"
                  transform="rotate(-35)"
                >
                  {d.data.name}
                </text>
              {/if}

              <!-- label -->
              {#if d.data.name == "Tracker"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  Visualization
                </text>
              {/if}
              {#if d.data.name == "PeaceFem"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  App
                </text>
              {/if}
              {#if d.data.name == "Data Overview"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  Visualization
                </text>
              {/if}
              {#if d.data.label == "Programming"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  Programming
                </text>
              {/if}
              {#if d.data.label == "Quality Control"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  Quality Control
                </text>
              {/if}
              {#if d.data.label == "Coding"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  Coding
                </text>
              {/if}
              {#if d.data.name == "PAA-X"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  Databases
                </text>
              {/if}
              {#if d.data.label == "paper"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  Publications
                </text>
              {/if}
              {#if d.data.label == "Infographics"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  Infographics
                </text>
              {/if}
              {#if d.data.name == "Python"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  Programming
                </text>
              {/if}
              {#if d.data.name == "Network"}
                <text
                  x={20}
                  y={5}
                  font-size="10"
                  fill="white"
                  transform={"rotate(-35)"}
                >
                  Visualization
                </text>
              {/if}

              <!-- main circle -->
              <circle
                cx="0"
                cy="0"
                r="4.5"
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

              <!-- people circles -->
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

              {#if d.data.name == "Research"}
                <circle cx="0" cy="0" r="15" fill="white" opacity="0.2"
                ></circle>
              {/if}
              {#if d.data.name == "PeaceFem"}
                <circle cx="0" cy="0" r="15" fill="white" opacity="0.2"
                ></circle>
              {/if}
              {#if d.data.name == "Tracker"}
                <circle
                  class="trackerCircle"
                  cx="0"
                  cy="0"
                  r="15"
                  fill="white"
                  opacity="0.2"
                ></circle>
              {/if}
              {#if d.data.name == "Infographics"}
                <circle cx="0" cy="0" r="15" fill="white" opacity="0.2"
                ></circle>
              {/if}
              {#if d.data.name == "PBi"}
                <circle
                  class="pbiCircle"
                  cx="0"
                  cy="0"
                  r="15"
                  fill="white"
                  opacity="0.2"
                ></circle>
              {/if}
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

  #step_description {
    position: absolute;
    top: 70%;
    left: 50%;
    width: 60%;
    transform: translateX(-50%);
    color: rgb(255, 255, 255);
    font-size: 14px;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 20px 20px;
    border-radius: 5px;
    text-align: center;
    z-index: 10;
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
