<script>
  export let fullChain = [];
  export let segment_height;
  export let details_width = 1;
  export let onReset = () => {};

  // half height for conflict, negotiation, and agreement segment
  const HALF_HEIGHT_SEGMENT_COUNT = 3;
  // how much segment expands on click
  const SEGMENT_EXPAND_DELTA = 200;
  // one lane each: process, time, expertise, methods, errors, text
  const SEGMENT_LANE_COUNT = 6;
  const SEGMENT_SVG_PADDING_X = 8;
  const LANE_CONTENT_PADDING = 2;
  let expandedSegmentIndex = null;

  const COG_ICON_HREF = `${import.meta.env.BASE_URL}cog.svg`;
  const HAT_ICON_HREF = `${import.meta.env.BASE_URL}hat.svg`;
  const WARN_ICON_HREF = `${import.meta.env.BASE_URL}erro.svg`;

  function isBottomSegment(index, totalCount) {
    return index >= Math.max(0, totalCount - HALF_HEIGHT_SEGMENT_COUNT - 1);
  }

  function handleSegmentClick(event, segmentIndex) {
    event.preventDefault();
    event.stopPropagation();
    expandedSegmentIndex =
      expandedSegmentIndex === segmentIndex ? null : segmentIndex;
  }

  $: if (
    expandedSegmentIndex !== null &&
    expandedSegmentIndex >= fullChain.length
  ) {
    expandedSegmentIndex = null;
  }

  $: maxPplInChain = fullChain.reduce((max, node) => {
    const ppl = Number(node?.data?.ppl) || 0;
    return Math.max(max, ppl);
  }, 1);

  $: maxTimeInChain = fullChain.reduce((max, node) => {
    const time = numericTimeValue(node?.data?.time);
    return Math.max(max, time);
  }, 0);

  $: maxMethodsInChain = fullChain.reduce((max, node) => {
    const count = getMethodsCount(node?.data?.methods);
    return Math.max(max, count);
  }, 1);

  $: maxExpertiseInChain = fullChain.reduce((max, node) => {
    const count = getExpertiseCount(node?.data?.expertise);
    return Math.max(max, count);
  }, 1);

  $: maxErrorsInChain = fullChain.reduce((max, node) => {
    const count = getErrorsCount(node?.data?.errors);
    return Math.max(max, count);
  }, 1);

  // process circles logic
  function nodeRadius(ppl) {
    const MIN_R = 5,
      MAX_R = 28,
      MAX_PPL = 50;
    return MIN_R + (Math.sqrt(ppl) / Math.sqrt(MAX_PPL)) * (MAX_R - MIN_R);
  }

  function getPeopleDots(ppl, scale = 1) {
    const r = nodeRadius(ppl);
    const dr = 2,
      gap = 1;
    const dotSpacing = dr * 2 + gap;
    const dotsPerRing = Math.max(1, Math.floor((2 * Math.PI * r) / dotSpacing));
    const numRings = Math.ceil(ppl / dotsPerRing);
    return Array.from({ length: ppl }, (_, i) => {
      const ring = Math.floor(i / dotsPerRing);
      const posInRing = i % dotsPerRing;
      const angle = posInRing * ((2 * Math.PI) / dotsPerRing) - Math.PI / 2;
      const ringOffset = (ring - (numRings - 1) / 2) * dotSpacing;
      const ringR = r + ringOffset;
      return {
        cx: ringR * Math.cos(angle) * scale,
        cy: ringR * Math.sin(angle) * scale,
      };
    });
  }

  function circleScale(referencePpl, maxHalfHeight, maxHalfWidth) {
    const r = nodeRadius(referencePpl);
    const sw = nodeStrokeWidth(referencePpl);
    const outer = r + sw / 2;
    if (outer <= 0) return 1;
    return Math.max(
      0,
      Math.min(1, maxHalfHeight / outer, maxHalfWidth / outer),
    );
  }

  function nodeFill(d) {
    return d.data.name === "PA-X" ||
      d.data.branch_type === "leaf" ||
      d.data.type?.slice(-2) === "db"
      ? "white"
      : "#001C23";
  }

  function numericTimeValue(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.max(0, value);
    }
    const parsed = Number.parseFloat(
      String(value ?? "").replace(/[^0-9.-]/g, ""),
    );
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  function getMethodsCount(value) {
    if (Array.isArray(value)) return value.length;
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  }

  function getErrorsCount(value) {
    if (Array.isArray(value)) return value.length;
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  }

  function wrapWordsToLines(text, maxWidthPx, fontSizePx) {
    const value = String(text ?? "").trim();
    if (!value) return [];

    const words = value.split(/\s+/);
    const approxCharWidth = fontSizePx * 0.58;
    const maxCharsPerLine = Math.max(
      1,
      Math.floor(maxWidthPx / approxCharWidth),
    );

    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;
      if (nextLine.length <= maxCharsPerLine || !currentLine) {
        currentLine = nextLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  function nodeStrokeWidth(ppl) {
    const r = nodeRadius(ppl);
    const dr = 2,
      gap = 1;
    const dotSpacing = dr * 2 + gap;
    const dotsPerRing = Math.max(1, Math.floor((2 * Math.PI * r) / dotSpacing));
    const numRings = Math.ceil(ppl / dotsPerRing);
    return Math.max(6, numRings * dotSpacing + gap * 2);
  }

  // expertise count logic
  function getExpertiseCount(value) {
    if (Array.isArray(value)) return value.length;
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  }
</script>

<div id="details" style="height: 100vh; width: {details_width}px;">
  {#if fullChain.length > 0 && segment_height > 0}
    <div
      class="detail-segment detail-title-segment"
      style="
        height: {segment_height}px;
        width: {details_width}px;
      "
    >
      <span class="detail-title-text">Detail View</span>
      <button
        class="detail-reset-button"
        type="button"
        on:click={onReset}
        title="Back to overview"
        ><i class="fa fa-chevron-left" aria-hidden="true"></i>
      </button>
      <div class="labels"
        style="position: absolute; bottom: 2px; display: flex; flex-direction: row;   width: 100%; justify-content: space-between; align-items: flex-end;"
      >
        <span>Process</span>
        <span>Expertise</span>
        <span>Time</span>
        <span>Method</span>
        <span>Errors</span>
        <span>Description</span>
      </div>
    </div>
  {/if}

  <!-- individual segments -->
  {#each fullChain as d, segmentIndex}
    <!-- process/artifact cell -->
    {@const isHalfHeightSegment =
      segmentIndex >= Math.max(0, fullChain.length - HALF_HEIGHT_SEGMENT_COUNT)}
    {@const currentSegmentHeight = isHalfHeightSegment
      ? segment_height / 2
      : segment_height}
    {@const isExpanded = expandedSegmentIndex === segmentIndex}
    {@const expandsUp = isBottomSegment(segmentIndex, fullChain.length)}
    {@const renderedSegmentHeight = isExpanded
      ? currentSegmentHeight + SEGMENT_EXPAND_DELTA
      : currentSegmentHeight}
    {@const segmentInnerWidth = Math.max(
      0,
      details_width - SEGMENT_SVG_PADDING_X * 2,
    )}
    {@const laneWidth = segmentInnerWidth / SEGMENT_LANE_COUNT}
    {@const circleCenterX = SEGMENT_SVG_PADDING_X + laneWidth / 2}
    {@const ppl = d.data.ppl ?? 0}
    {@const maxCircleHalfHeight = Math.max(
      0,
      currentSegmentHeight / 2 - LANE_CONTENT_PADDING,
    )}
    {@const maxCircleHalfWidth = Math.max(
      0,
      laneWidth / 2 - LANE_CONTENT_PADDING,
    )}
    {@const scale = circleScale(
      maxPplInChain,
      maxCircleHalfHeight,
      maxCircleHalfWidth,
    )}

    <!-- expertise cell -->
    {@const expertiseCount = getExpertiseCount(d.data?.expertise)}
    {@const expertiseLaneX =
      SEGMENT_SVG_PADDING_X + laneWidth + LANE_CONTENT_PADDING}
    {@const expertiseLaneY = LANE_CONTENT_PADDING}
    {@const expertiseLaneWidth = Math.max(
      0,
      laneWidth - LANE_CONTENT_PADDING * 2,
    )}
    {@const expertiseLaneHeight = Math.max(
      0,
      currentSegmentHeight - LANE_CONTENT_PADDING * 2,
    )}
    {@const expertiseRefRows = maxExpertiseInChain > 1 ? 2 : 1}
    {@const expertiseRefCols =
      maxExpertiseInChain > 0 ? Math.ceil(maxExpertiseInChain / 2) : 1}
    {@const expertiseColGap =
      expertiseRefCols > 1
        ? Math.max(1, Math.min(4, expertiseLaneWidth * 0.06))
        : 0}
    {@const expertiseRowGap =
      expertiseRefRows > 1
        ? Math.max(1, Math.min(4, expertiseLaneHeight * 0.08))
        : 0}
    {@const expertiseAvailableWidth = Math.max(
      0,
      expertiseLaneWidth - expertiseColGap * (expertiseRefCols - 1),
    )}
    {@const expertiseAvailableHeight = Math.max(
      0,
      expertiseLaneHeight - expertiseRowGap * (expertiseRefRows - 1),
    )}
    {@const expertiseIconSize = Math.max(
      0,
      Math.min(
        expertiseAvailableWidth / expertiseRefCols,
        expertiseAvailableHeight / expertiseRefRows,
      ),
    )}
    {@const expertiseRowsCurrent = expertiseCount > 1 ? 2 : 1}
    {@const expertiseBlockHeight =
      expertiseRowsCurrent * expertiseIconSize +
      (expertiseRowsCurrent - 1) * expertiseRowGap}
    {@const expertiseStartY =
      expertiseLaneY +
      Math.max(0, (expertiseLaneHeight - expertiseBlockHeight) / 2)}

    <!-- time cell -->
    {@const timeValue = numericTimeValue(d.data?.time)}
    {@const timeRatio =
      maxTimeInChain > 0 ? Math.min(1, timeValue / maxTimeInChain) : 0}
    {@const timeLaneX =
      SEGMENT_SVG_PADDING_X + laneWidth * 2 + LANE_CONTENT_PADDING}
    {@const timeLaneY = LANE_CONTENT_PADDING}
    {@const timeLaneWidth = Math.max(0, laneWidth - LANE_CONTENT_PADDING * 2)}
    {@const timeLaneHeight = Math.max(
      0,
      currentSegmentHeight - LANE_CONTENT_PADDING * 2,
    )}
    {@const timeFillWidth = timeLaneWidth * timeRatio}

    <!-- method cell -->
    {@const methodsCount = getMethodsCount(d.data?.methods)}
    {@const methodsLaneX =
      SEGMENT_SVG_PADDING_X + laneWidth * 3 + LANE_CONTENT_PADDING}
    {@const methodsLaneY = LANE_CONTENT_PADDING}
    {@const methodsLaneWidth = Math.max(
      0,
      laneWidth - LANE_CONTENT_PADDING * 2,
    )}
    {@const methodsLaneHeight = Math.max(
      0,
      currentSegmentHeight - LANE_CONTENT_PADDING * 2,
    )}
    {@const methodsRefRows = maxMethodsInChain > 1 ? 2 : 1}
    {@const methodsRefCols =
      maxMethodsInChain > 0 ? Math.ceil(maxMethodsInChain / 2) : 1}
    {@const methodsColGap =
      methodsRefCols > 1
        ? Math.max(1, Math.min(4, methodsLaneWidth * 0.06))
        : 0}
    {@const methodsRowGap =
      methodsRefRows > 1
        ? Math.max(1, Math.min(4, methodsLaneHeight * 0.08))
        : 0}
    {@const methodsAvailableWidth = Math.max(
      0,
      methodsLaneWidth - methodsColGap * (methodsRefCols - 1),
    )}
    {@const methodsAvailableHeight = Math.max(
      0,
      methodsLaneHeight - methodsRowGap * (methodsRefRows - 1),
    )}
    {@const methodsIconSize = Math.max(
      0,
      Math.min(
        methodsAvailableWidth / methodsRefCols,
        methodsAvailableHeight / methodsRefRows,
      ),
    )}
    {@const methodsRowsCurrent = methodsCount > 1 ? 2 : 1}
    {@const methodsBlockHeight =
      methodsRowsCurrent * methodsIconSize +
      (methodsRowsCurrent - 1) * methodsRowGap}
    {@const methodsStartY =
      methodsLaneY + Math.max(0, (methodsLaneHeight - methodsBlockHeight) / 2)}

    <!-- error cell -->
    {@const errorsCount = getErrorsCount(d.data?.errors)}
    {@const errorsLaneX =
      SEGMENT_SVG_PADDING_X + laneWidth * 4 + LANE_CONTENT_PADDING}
    {@const errorsLaneY = LANE_CONTENT_PADDING}
    {@const errorsLaneWidth = Math.max(0, laneWidth - LANE_CONTENT_PADDING * 2)}
    {@const errorsLaneHeight = Math.max(
      0,
      currentSegmentHeight - LANE_CONTENT_PADDING * 2,
    )}
    {@const errorsRefRows = maxErrorsInChain > 1 ? 2 : 1}
    {@const errorsRefCols =
      maxErrorsInChain > 0 ? Math.ceil(maxErrorsInChain / 2) : 1}
    {@const errorsColGap =
      errorsRefCols > 1 ? Math.max(1, Math.min(4, errorsLaneWidth * 0.06)) : 0}
    {@const errorsRowGap =
      errorsRefRows > 1 ? Math.max(1, Math.min(4, errorsLaneHeight * 0.08)) : 0}
    {@const errorsAvailableWidth = Math.max(
      0,
      errorsLaneWidth - errorsColGap * (errorsRefCols - 1),
    )}
    {@const errorsAvailableHeight = Math.max(
      0,
      errorsLaneHeight - errorsRowGap * (errorsRefRows - 1),
    )}
    {@const errorsIconSize = Math.max(
      0,
      Math.min(
        errorsAvailableWidth / errorsRefCols,
        errorsAvailableHeight / errorsRefRows,
      ),
    )}
    {@const errorsRowsCurrent = errorsCount > 1 ? 2 : 1}
    {@const errorsBlockHeight =
      errorsRowsCurrent * errorsIconSize +
      (errorsRowsCurrent - 1) * errorsRowGap}
    {@const errorsStartY =
      errorsLaneY + Math.max(0, (errorsLaneHeight - errorsBlockHeight) / 2)}

    <!-- text cell -->
    {@const textLaneX =
      SEGMENT_SVG_PADDING_X +
      laneWidth * (SEGMENT_LANE_COUNT - 1) +
      LANE_CONTENT_PADDING}
    {@const textLaneY = LANE_CONTENT_PADDING}
    {@const textLaneWidth = Math.max(0, laneWidth - LANE_CONTENT_PADDING * 2)}
    {@const textLaneHeight = Math.max(
      0,
      currentSegmentHeight - LANE_CONTENT_PADDING * 2,
    )}
    {@const textFontSize = Math.max(8, Math.min(12, laneWidth * 0.14))}
    {@const textLineHeight = textFontSize * 1.2}
    {@const maxTextLines = Math.max(
      1,
      Math.floor(textLaneHeight / textLineHeight),
    )}
    {@const tooltipLines = wrapWordsToLines(
      d.data?.tooltip_name,
      textLaneWidth,
      textFontSize,
    ).slice(0, maxTextLines)}
    {@const textStartY =
      textLaneY +
      Math.max(0, (textLaneHeight - tooltipLines.length * textLineHeight) / 2)}
    {@const r = nodeRadius(ppl) * scale}
    {@const sw = nodeStrokeWidth(ppl) * scale}
    {@const dots = getPeopleDots(ppl, scale)}
    {@const dotRadius = Math.max(0.8, (segment_height <= 40 ? 1.5 : 2) * scale)}
    <div
      class="detail-segment"
      style="
        height: {renderedSegmentHeight}px;
        width: {details_width}px;
        transform: translateY({isExpanded && expandsUp
        ? -SEGMENT_EXPAND_DELTA
        : 0}px);
        margin-bottom: {isExpanded && expandsUp ? -SEGMENT_EXPAND_DELTA : 0}px;
      "
      aria-label={`Toggle details for ${d.data?.tooltip_name ?? "segment"}`}
      aria-expanded={isExpanded}
    >
      <div
        class="segment-svg-shell"
        style="height: {currentSegmentHeight}px;"
        on:click={(event) => handleSegmentClick(event, segmentIndex)}
        on:keydown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            handleSegmentClick(event, segmentIndex);
          }
        }}
        role="button"
        tabindex="0"
      >
        <svg
          class="segment-svg"
          aria-hidden="true"
          focusable="false"
          style="width: {details_width}px; height: {currentSegmentHeight}px;"
        >
          <g transform="translate({circleCenterX}, {currentSegmentHeight / 2})">
            <circle
              cx="0"
              cy="0"
              {r}
              fill={nodeFill(d)}
              stroke="#CC8500"
              stroke-width={sw}
            />
            {#each dots as dot}
              <circle
                cx={dot.cx}
                cy={dot.cy}
                r={dotRadius}
                fill="black"
                opacity="0.85"
                pointer-events="none"
              />
            {/each}
          </g>
          <rect
            x={timeLaneX}
            y={timeLaneY}
            width={timeFillWidth}
            height={timeLaneHeight}
            rx="2"
            ry="2"
            fill="#CC8500"
          />
          {#if methodsCount > 0 && methodsIconSize > 0}
            {#each Array.from({ length: methodsCount }, (_, methodIndex) => methodIndex) as methodIndex}
              {@const methodCol = Math.floor(methodIndex / 2)}
              {@const methodRow = methodIndex % 2}
              <image
                href={COG_ICON_HREF}
                x={methodsLaneX + methodCol * (methodsIconSize + methodsColGap)}
                y={methodsStartY +
                  methodRow * (methodsIconSize + methodsRowGap)}
                width={methodsIconSize}
                height={methodsIconSize}
                preserveAspectRatio="xMinYMin meet"
              />
            {/each}
          {/if}
          {#if expertiseCount > 0 && expertiseIconSize > 0}
            {#each Array.from({ length: expertiseCount }, (_, expertiseIndex) => expertiseIndex) as expertiseIndex}
              {@const expertiseCol = Math.floor(expertiseIndex / 2)}
              {@const expertiseRow = expertiseIndex % 2}
              <image
                href={HAT_ICON_HREF}
                x={expertiseLaneX +
                  expertiseCol * (expertiseIconSize + expertiseColGap)}
                y={expertiseStartY +
                  expertiseRow * (expertiseIconSize + expertiseRowGap)}
                width={expertiseIconSize}
                height={expertiseIconSize}
                preserveAspectRatio="xMinYMin meet"
              />
            {/each}
          {/if}
          {#if errorsCount > 0 && errorsIconSize > 0}
            {#each Array.from({ length: errorsCount }, (_, errorIndex) => errorIndex) as errorIndex}
              {@const errorCol = Math.floor(errorIndex / 2)}
              {@const errorRow = errorIndex % 2}
              <image
                href={WARN_ICON_HREF}
                x={errorsLaneX + errorCol * (errorsIconSize + errorsColGap)}
                y={errorsStartY + errorRow * (errorsIconSize + errorsRowGap)}
                width={errorsIconSize}
                height={errorsIconSize}
                preserveAspectRatio="xMinYMin meet"
              />
            {/each}
          {/if}
          {#each tooltipLines as line, lineIndex}
            <text
              x={textLaneX + 5}
              y={textStartY + lineIndex * textLineHeight}
              fill="rgba(255, 255, 255, 0.92)"
              font-size={textFontSize}
              dominant-baseline="hanging"
            >
              {line}
            </text>
          {/each}
          {#each Array.from({ length: SEGMENT_LANE_COUNT - 1 }, (_, i) => i + 1) as divider}
            <line
              x1={SEGMENT_SVG_PADDING_X + laneWidth * divider}
              y1="0"
              x2={SEGMENT_SVG_PADDING_X + laneWidth * divider}
              y2={currentSegmentHeight}
              stroke="rgba(255, 255, 255, 0.22)"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
          {/each}
        </svg>
      </div>
      {#if isExpanded}
        <div
          class="segment-expanded-content"
          style="height: {SEGMENT_EXPAND_DELTA}px; display: flex; flex-direction: row; width: 100%;"
        >
          <!-- Textual part (2/3 width) -->
          <div
            style="flex: 2; padding: 8px 12px 8px 0; border-right: 1.5px solid #ccc; min-width: 0; overflow-wrap: break-word; overflow-y: auto; max-height: 100%;"
          >
            {#if d.data}
              {#if d.data.tooltip_name && d.data.ppl && d.data.expertise && d.data.methods && d.data.errors && d.data.time}
                <span>
                  The {d.data.tooltip_name.toLowerCase()} is done by {d.data
                    .ppl}
                  {d.data.ppl == 1 ? "person" : "people"} with expertise in {Array.isArray(
                    d.data.expertise,
                  )
                    ? d.data.expertise
                        .join(", ")
                        .replace(/, ([^,]*)$/, " and $1")
                    : d.data.expertise}. Methods used during this step are {Array.isArray(
                    d.data.methods,
                  )
                    ? d.data.methods.join(", ").replace(/, ([^,]*)$/, " or $1")
                    : d.data.methods}. Potential mistakes that could happen
                  during this step are {Array.isArray(d.data.errors)
                    ? d.data.errors.join(", ").replace(/, ([^,]*)$/, " and $1")
                    : d.data.errors}. Overall, this process takes {d.data.time}
                  {d.data.time == 1 ? "hour" : "hours"}.
                </span>
              {:else}
                {d.data?.segment_text ?? ""}
              {/if}
            {:else}
              {d.data?.segment_text ?? ""}
            {/if}
          </div>
          <!-- Image part (1/3 width) -->
          <div
            style="flex: 1; display: flex; align-items: center; justify-content: center; min-width: 0; padding: 8px 0 8px 12px;"
          >
            {#if d.data?.segment_image}
              <a href={d.data.link} target="_blank"
                ><img
                  src={d.data.segment_image}
                  alt="Segment visual"
                  style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px;"
                /></a
              >
            {:else}
              <span style="color: #aaa; font-size: 0.95em;">No image</span>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  #details {
    position: absolute;
    top: 0px;
    right: 0px;
    overflow: hidden;
    transition: width 0.45s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  .detail-segment {
    color: white;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    background-color: #001c23;
    border-radius: var(--segment-radius, 10px);
    border: solid 1px rgb(51, 51, 51);
    transition:
      border-color 0.2s ease,
      height 0.2s ease,
      transform 0.2s ease,
      margin-bottom 0.2s ease;
    overflow: hidden;
  }

  .segment-svg {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }

  .segment-svg-shell {
    width: 100%;
    flex: 0 0 auto;
  }

  .segment-expanded-content {
    width: 100%;
    flex: 0 0 auto;
    padding: 10px 12px;
    box-sizing: border-box;
    border-top: solid 1px rgba(106, 106, 106, 0.5);
    background-color: #00252e;
    color: rgba(255, 255, 255, 0.92);
    font-size: 12px;
    line-height: 1.35;
    overflow: auto;
  }

  .detail-title-segment {
    position: relative;
    align-items: center;
    border: none;
    padding-top: 10px;
  }

  .detail-title-text {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.95);
    text-align: center;
  }

  .detail-reset-button {
    position: absolute;
    top: 8px;
    left: 2px;
    border-radius: 5px;
    padding: 4px 6px;
    font-size: 20px;
    border: none;
    background: #001c23;
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .detail-reset-button:hover {
    background: rgba(255, 255, 255, 0.16);
  }

  .detail-segment:hover {
    border-color: rgba(126, 126, 126, 0.8);
  }

  .labels span {
    color: gray;
    text-align: center;
    display: flex;
    flex-direction: column;
    font-size: 10px;
    flex: 1;
    min-width: 0;
  }
</style>
