<script>
  export let fullChain = [];
  export let innerHeight = window.innerHeight;
  export let segment_height;
  export let details_width = 300;
  export let onReset = () => {};

  const TIME_MIN = 0;
  const TIME_MAX = 120;
  const DETAIL_SHARED_GAP_PX = 15;
  const DETAIL_SEPARATOR_GAP_PX = 12;
  const ERROR_MARKER_EXTRA_OFFSET = 8;
  const PEOPLE_CIRCLE_SHIFT_X = 3;
  const METHOD_COG_VERTICAL_GAP_RATIO = 0.12;
  const METHOD_COG_HORIZONTAL_GAP_RATIO = 0.2;
  const METHOD_COG_MIN_GAP = 1;
  const METHOD_TIME_EXTRA_NUDGE_PX = 6;
  const MAX_METHOD_COGS_PER_CURVE = 3;
  const SEGMENT_EXPAND_DELTA = 100;
  const BOTTOM_EXPAND_COUNT = 3;
  const COG_ICON_HREF = `${import.meta.env.BASE_URL}cog.svg`;
  const ERROR_ICON_HREF = `${import.meta.env.BASE_URL}error.svg`;
  let expandedSegmentIndex = null;

  // different segment height for pax and conflict
  function getDetailSegmentWeight(data) {
    const name = data?.name;
    return name === "agreement" || name === "negotiation" || name === "conflict"
      ? 0.5
      : 1;
  }

  function getDetailSegmentHeight(data) {
    return segment_height * getDetailSegmentWeight(data);
  }

  function getDetailSegmentRadius(height) {
    const value = Number(height);
    if (!Number.isFinite(value) || value <= 0) return 0;
    return value / 2;
  }

  function getAlignedSegmentWidth(height) {
    const fullWidth = Math.max(Number(details_width) || 0, 0);
    const baseRadius = getDetailSegmentRadius(segment_height);
    const segmentRadius = getDetailSegmentRadius(height);
    const widthReduction = Math.max(0, baseRadius - segmentRadius);
    return Math.max(0, fullWidth - widthReduction);
  }

  function isBottomSegment(index, totalCount) {
    return index >= Math.max(0, totalCount - BOTTOM_EXPAND_COUNT);
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

  function getProcessCircleRadius(height, inset = 1.5) {
    const baseRadius = getDetailSegmentRadius(height);
    const safeInset = Number.isFinite(Number(inset)) ? Number(inset) : 0;
    return Math.max(0, baseRadius - safeInset);
  }

  function getPeopleIndicatorCount(data) {
    const value = Number(data?.people ?? data?.ppl);
    if (!Number.isFinite(value) || value <= 0) return 0;
    return Math.round(value);
  }

  function getErrorsIndicatorCount(data) {
    const value = Number(data?.errors ?? data?.error);
    if (!Number.isFinite(value) || value <= 0) return 0;
    return Math.round(value);
  }

  function getMethodsIndicatorCount(data) {
    const value = Number(data?.methods?.length ?? data?.methods);
    if (!Number.isFinite(value) || value <= 0) return 0;
    return Math.round(value);
  }

  function getPeopleVisualMetrics(segmentHeight) {
    const circleRadius = Math.max(1.8, Math.min(3.4, segmentHeight * 0.055));
    const verticalGap = Math.max(0.8, circleRadius * 0.65);
    const horizontalGap = Math.max(1.2, circleRadius * 0.9);
    const rowStep = circleRadius * 2 + verticalGap;
    const verticalInset = Math.max(1.5, circleRadius * 0.6);
    const usableHeight = Math.max(
      segmentHeight - verticalInset * 2,
      circleRadius * 2,
    );
    const rowsPerColumn = Math.max(
      1,
      Math.floor((usableHeight + verticalGap) / rowStep),
    );

    return {
      circleRadius,
      verticalGap,
      horizontalGap,
      rowsPerColumn,
    };
  }

  function getPeopleToTimeGap() {
    return DETAIL_SHARED_GAP_PX;
  }

  function getCurvedXOffset(halfCircleRadius, y) {
    const distanceFromMid = y - halfCircleRadius;
    return Math.sqrt(
      Math.max(
        halfCircleRadius * halfCircleRadius - distanceFromMid * distanceFromMid,
        0,
      ),
    );
  }

  function getCurvedStackLayout(
    segmentHeight,
    count,
    markerSize,
    verticalGap,
    rowsPerColumn,
    maxRows = Number.POSITIVE_INFINITY,
  ) {
    const rows = Math.min(rowsPerColumn, count, maxRows);
    const rowStep = markerSize + verticalGap;
    const stackHeight = rows * markerSize + (rows - 1) * verticalGap;
    const firstCenterY = (segmentHeight - stackHeight) / 2 + markerSize / 2;

    return {
      rows,
      rowStep,
      firstCenterY,
    };
  }

  function getMaxMethodCogSize(segmentHeight, rows) {
    const safeRows = Math.max(1, Number(rows) || 1);
    const safeHeight = Number(segmentHeight);

    if (!Number.isFinite(safeHeight) || safeHeight <= 0) {
      return 0;
    }

    const verticalInset = Math.max(1, safeHeight * 0.03);
    const usableHeight = Math.max(0, safeHeight - verticalInset * 2);
    const denominator =
      safeRows + (safeRows - 1) * METHOD_COG_VERTICAL_GAP_RATIO;

    if (denominator <= 0) {
      return 0;
    }

    return usableHeight / denominator;
  }

  function getPeopleCircleMarkers(data, originX = 0) {
    const count = getPeopleIndicatorCount(data);
    const segmentHeight = getDetailSegmentHeight(data);
    const safeOriginX = Number.isFinite(Number(originX)) ? Number(originX) : 0;

    if (count <= 0 || !Number.isFinite(segmentHeight) || segmentHeight <= 0) {
      return [];
    }

    const halfCircleRadius = segmentHeight / 2;
    const { circleRadius, verticalGap, horizontalGap, rowsPerColumn } =
      getPeopleVisualMetrics(segmentHeight);
    const { rows, rowStep, firstCenterY } = getCurvedStackLayout(
      segmentHeight,
      count,
      circleRadius * 2,
      verticalGap,
      rowsPerColumn,
    );

    const edgeClearance = circleRadius + Math.max(2.5, circleRadius * 0.9);
    const columnStep = circleRadius * 2 + horizontalGap;

    return Array.from({ length: count }, (_, index) => {
      const column = Math.floor(index / rows);
      const row = index % rows;
      const cy = firstCenterY + row * rowStep;
      const edgeX = getCurvedXOffset(halfCircleRadius, cy);

      const offsetFromEdge = edgeClearance + column * columnStep;

      return {
        cx: safeOriginX + edgeX + offsetFromEdge + PEOPLE_CIRCLE_SHIFT_X,
        cy,
        r: circleRadius,
      };
    });
  }

  function getErrorMarkers(
    data,
    methodMarkers = [],
    timePathLayout,
    originX = 0,
  ) {
    const count = getErrorsIndicatorCount(data);
    const segmentHeight = getDetailSegmentHeight(data);
    const safeOriginX = Number.isFinite(Number(originX)) ? Number(originX) : 0;

    if (count <= 0 || !Number.isFinite(segmentHeight) || segmentHeight <= 0) {
      return [];
    }

    const halfCircleRadius = segmentHeight / 2;
    const { rowsPerColumn } = getPeopleVisualMetrics(segmentHeight);
    const sizeRows = Math.min(rowsPerColumn, MAX_METHOD_COGS_PER_CURVE);
    const errorIconSize = getMaxMethodCogSize(segmentHeight, sizeRows);

    if (errorIconSize <= 0) {
      return [];
    }

    const verticalGap = Math.max(
      METHOD_COG_MIN_GAP,
      errorIconSize * METHOD_COG_VERTICAL_GAP_RATIO,
    );
    const {
      rows: errorRows,
      rowStep,
      firstCenterY,
    } = getCurvedStackLayout(
      segmentHeight,
      count,
      errorIconSize,
      verticalGap,
      rowsPerColumn,
      MAX_METHOD_COGS_PER_CURVE,
    );

    const horizontalGap = Math.max(
      METHOD_COG_MIN_GAP,
      errorIconSize * METHOD_COG_HORIZONTAL_GAP_RATIO,
    );
    const columnStep = errorIconSize + horizontalGap;

    const fallbackAnchorX = timePathLayout?.isVisible
      ? timePathLayout.endTipX
      : safeOriginX + segmentHeight / 2;
    const methodRightEdge =
      methodMarkers.length > 0
        ? Math.max(...methodMarkers.map((marker) => marker.x + marker.size / 2))
        : fallbackAnchorX;
    const startAnchorX =
      methodRightEdge + getPeopleToTimeGap() + ERROR_MARKER_EXTRA_OFFSET;

    const rowEdgeOffsets = Array.from({ length: errorRows }, (_, row) => {
      const cy = firstCenterY + row * rowStep;
      return getCurvedXOffset(halfCircleRadius, cy);
    });
    const minRowEdgeOffset = Math.min(...rowEdgeOffsets);

    return Array.from({ length: count }, (_, index) => {
      const column = Math.floor(index / errorRows);
      const row = index % errorRows;
      const cy = firstCenterY + row * rowStep;
      const edgeX = rowEdgeOffsets[row];

      return {
        x:
          startAnchorX +
          errorIconSize / 2 +
          (edgeX - minRowEdgeOffset) +
          column * columnStep,
        y: cy,
        size: errorIconSize,
      };
    });
  }

  function getMethodErrorSeparatorPath(
    data,
    methodMarkers = [],
    errorMarkers = [],
  ) {
    const segmentHeight = getDetailSegmentHeight(data);

    if (
      methodMarkers.length === 0 ||
      errorMarkers.length === 0 ||
      !Number.isFinite(segmentHeight) ||
      segmentHeight <= 0
    ) {
      return { isVisible: false, pathD: "" };
    }

    const halfCircleRadius = segmentHeight / 2;
    const methodStemLowerBound = Math.max(
      ...methodMarkers.map((marker) => {
        const edgeX = getCurvedXOffset(halfCircleRadius, marker.y);
        return marker.x + (Number(marker.size) || 0) / 2 - edgeX;
      }),
    );
    const errorStemUpperBound = Math.min(
      ...errorMarkers.map((marker) => {
        const edgeX = getCurvedXOffset(halfCircleRadius, marker.y);
        return marker.x - (Number(marker.size) || 0) / 2 - edgeX;
      }),
    );

    if (
      !Number.isFinite(methodStemLowerBound) ||
      !Number.isFinite(errorStemUpperBound) ||
      errorStemUpperBound <= methodStemLowerBound
    ) {
      return { isVisible: false, pathD: "" };
    }

    const separatorStemX =
      methodStemLowerBound +
      (errorStemUpperBound - methodStemLowerBound) / 2 +
      0;
    const pathD = `M ${separatorStemX} 0 A ${halfCircleRadius} ${halfCircleRadius} 0 0 1 ${separatorStemX} ${segmentHeight}`;

    return {
      isVisible: true,
      pathD,
    };
  }

  function getErrorRightSeparatorPath(data, errorMarkers = []) {
    const segmentHeight = getDetailSegmentHeight(data);

    if (
      errorMarkers.length === 0 ||
      !Number.isFinite(segmentHeight) ||
      segmentHeight <= 0
    ) {
      return { isVisible: false, pathD: "" };
    }

    const halfCircleRadius = segmentHeight / 2;
    const errorStemLowerBound = Math.max(
      ...errorMarkers.map((marker) => {
        const edgeX = getCurvedXOffset(halfCircleRadius, marker.y);
        return marker.x + (Number(marker.size) || 0) / 2 - edgeX;
      }),
    );

    if (!Number.isFinite(errorStemLowerBound)) {
      return { isVisible: false, pathD: "" };
    }

    const separatorStemX = errorStemLowerBound + DETAIL_SEPARATOR_GAP_PX;
    const pathD = `M ${separatorStemX} 0 A ${halfCircleRadius} ${halfCircleRadius} 0 0 1 ${separatorStemX} ${segmentHeight}`;

    return {
      isVisible: true,
      pathD,
    };
  }

  function getMethodRects(data, timePathLayout, originX = 0) {
    const count = getMethodsIndicatorCount(data);
    const segmentHeight = getDetailSegmentHeight(data);
    const safeOriginX = Number.isFinite(Number(originX)) ? Number(originX) : 0;

    if (count <= 0 || !Number.isFinite(segmentHeight) || segmentHeight <= 0) {
      return [];
    }

    const halfCircleRadius = segmentHeight / 2;
    const { circleRadius, rowsPerColumn } =
      getPeopleVisualMetrics(segmentHeight);

    const sizeRows = Math.min(rowsPerColumn, MAX_METHOD_COGS_PER_CURVE);
    const methodCogSize = getMaxMethodCogSize(segmentHeight, sizeRows);

    if (methodCogSize <= 0) {
      return [];
    }

    const verticalGap = Math.max(
      METHOD_COG_MIN_GAP,
      methodCogSize * METHOD_COG_VERTICAL_GAP_RATIO,
    );
    const {
      rows: methodRows,
      rowStep,
      firstCenterY,
    } = getCurvedStackLayout(
      segmentHeight,
      count,
      methodCogSize,
      verticalGap,
      rowsPerColumn,
      MAX_METHOD_COGS_PER_CURVE,
    );

    // Start after time path using the same spacing as people -> time.
    const timeEndX = timePathLayout?.isVisible
      ? timePathLayout.endTipX
      : safeOriginX + segmentHeight / 2;
    const startGap = getPeopleToTimeGap();

    const horizontalGap = Math.max(
      METHOD_COG_MIN_GAP,
      methodCogSize * METHOD_COG_HORIZONTAL_GAP_RATIO,
    );
    const columnStep = methodCogSize + horizontalGap;

    // Preserve curved rows, but anchor the closest row at the requested gap.
    const rowEdgeOffsets = Array.from({ length: methodRows }, (_, row) => {
      const cy = firstCenterY + row * rowStep;
      return getCurvedXOffset(halfCircleRadius, cy);
    });
    const minRowEdgeOffset = Math.min(...rowEdgeOffsets);
    const maxRowEdgeOffset = Math.max(...rowEdgeOffsets);
    const curveOffsetShift = Math.min(
      maxRowEdgeOffset - minRowEdgeOffset,
      startGap,
    );
    const remainingGapAfterCurveShift = Math.max(
      0,
      startGap - curveOffsetShift,
    );
    const methodNudge = Math.min(
      METHOD_TIME_EXTRA_NUDGE_PX,
      remainingGapAfterCurveShift,
    );

    return Array.from({ length: count }, (_, index) => {
      const column = Math.floor(index / methodRows);
      const row = index % methodRows;
      const cy = firstCenterY + row * rowStep;
      const edgeX = rowEdgeOffsets[row];

      return {
        x:
          timeEndX +
          startGap +
          methodCogSize / 2 +
          (edgeX - minRowEdgeOffset - curveOffsetShift - methodNudge) +
          column * columnStep,
        y: cy,
        size: methodCogSize,
      };
    });
  }

  function getTimeValue(data) {
    const value = Number(data?.time);
    if (!Number.isFinite(value)) return TIME_MIN;
    return Math.max(TIME_MIN, Math.min(TIME_MAX, value));
  }

  function getTimePathLayout(data, originX = 0, widthOverride = details_width) {
    const segmentHeight = getDetailSegmentHeight(data);
    const segmentWidth = Math.max(Number(widthOverride) || 0, 0);
    const safeOriginX = Number.isFinite(Number(originX)) ? Number(originX) : 0;

    if (
      !Number.isFinite(segmentHeight) ||
      segmentHeight <= 0 ||
      !Number.isFinite(segmentWidth) ||
      segmentWidth <= 0
    ) {
      return { isVisible: false, pathD: "", startX: 0, endTipX: 0 };
    }

    const halfCircleRadius = segmentHeight / 2;
    const { circleRadius } = getPeopleVisualMetrics(segmentHeight);
    const peopleMarkers = getPeopleCircleMarkers(data, safeOriginX);
    const peopleRightEdge =
      peopleMarkers.length > 0
        ? Math.max(...peopleMarkers.map((marker) => marker.cx + marker.r))
        : safeOriginX + halfCircleRadius;

    const startGap = getPeopleToTimeGap();
    // Align the visible leading edge (cap midpoint) to the target gap.
    const startX = Math.max(
      safeOriginX,
      peopleRightEdge + startGap - halfCircleRadius,
    );
    const rightPadding = Math.max(4, circleRadius);
    const minTipX = startX + halfCircleRadius;
    const maxTipX = Math.min(
      segmentWidth * 0.5 + safeOriginX,
      segmentWidth - rightPadding,
    );

    if (maxTipX <= minTipX) {
      return { isVisible: false, pathD: "", startX: 0, endTipX: 0 };
    }

    const normalizedTime =
      (getTimeValue(data) - TIME_MIN) / Math.max(TIME_MAX - TIME_MIN, 1);
    if (normalizedTime <= 0) {
      return { isVisible: false, pathD: "", startX: 0, endTipX: 0 };
    }

    const endTipX = minTipX + normalizedTime * (maxTipX - minTipX);
    const endStemX = endTipX - halfCircleRadius;

    if (endStemX <= startX + 0.1) {
      return { isVisible: false, pathD: "", startX: 0, endTipX: 0 };
    }

    const pathD = `M ${startX} 0 A ${halfCircleRadius} ${halfCircleRadius} 0 0 1 ${startX} ${segmentHeight} L ${endStemX} ${segmentHeight} A ${halfCircleRadius} ${halfCircleRadius} 0 0 0 ${endStemX} 0 Z`;

    return {
      isVisible: true,
      pathD,
      startX,
      endTipX,
    };
  }
</script>

<div id="details" style="height: {innerHeight}px; width: {details_width}px;">
  {#if fullChain.length > 0 && segment_height > 0}
    <div
      class="detail-segment detail-title-segment"
      style="
        height: {segment_height}px;
        width: {details_width}px;
        --segment-radius: {getDetailSegmentRadius(segment_height)}px;
      "
    >
      <span class="detail-title-text">Detail Process View</span>
      <button
        class="detail-reset-button"
        type="button"
        on:click={onReset}
        title="Reset"
        ><i class="fa fa-undo" aria-hidden="true"></i>
      </button>
    </div>
  {/if}

  <!-- individual segments -->
  {#each fullChain as d, segmentIndex}
    {@const segmentData = d.data}
    {@const baseSegmentHeight = getDetailSegmentHeight(segmentData)}
    {@const segmentWidth = getAlignedSegmentWidth(baseSegmentHeight)}
    {@const isExpanded = expandedSegmentIndex === segmentIndex}
    {@const expandsUp = isBottomSegment(segmentIndex, fullChain.length)}
    {@const renderedSegmentHeight = isExpanded
      ? baseSegmentHeight + SEGMENT_EXPAND_DELTA
      : baseSegmentHeight}
    {@const segmentVisualOffsetX = baseSegmentHeight / 2}
    {@const segmentProcessCircleCenterX = segmentVisualOffsetX - 1}
    {@const segmentProcessCircleCenterY = baseSegmentHeight / 2 - 1}
    {@const segmentProcessLabelX = segmentWidth - 5}
    {@const segmentProcessLabelY = baseSegmentHeight / 2}
    {@const segmentProcessCircleRadius =
      getProcessCircleRadius(baseSegmentHeight)}
    {@const peopleMarkers = getPeopleCircleMarkers(
      segmentData,
      segmentVisualOffsetX,
    )}
    {@const timePath = getTimePathLayout(
      segmentData,
      segmentVisualOffsetX,
      segmentWidth,
    )}
    {@const methodMarkers = getMethodRects(
      segmentData,
      timePath,
      segmentVisualOffsetX,
    )}
    {@const errorMarkers = getErrorMarkers(
      segmentData,
      methodMarkers,
      timePath,
      segmentVisualOffsetX,
    )}
    {@const methodErrorSeparator = getMethodErrorSeparatorPath(
      segmentData,
      methodMarkers,
      errorMarkers,
    )}
    {@const errorRightSeparator = getErrorRightSeparatorPath(
      segmentData,
      errorMarkers,
    )}
    <a
      href={d.data.link}
      target="_blank"
      class="detail-link"
      on:click={(event) => handleSegmentClick(event, segmentIndex)}
    >
      <div
        class="detail-segment"
        style="
    height: {renderedSegmentHeight}px;
    width: {segmentWidth}px;
    margin-left: auto;
    transform: translateY({isExpanded && expandsUp
          ? -SEGMENT_EXPAND_DELTA
          : 0}px);
    margin-bottom: {isExpanded && expandsUp ? -SEGMENT_EXPAND_DELTA : 0}px;
    --segment-radius: {getDetailSegmentRadius(baseSegmentHeight)}px;
  "
      >
        <div class="segment-svg-shell" style="height: {baseSegmentHeight}px;">
          <svg class="segment-svg" aria-hidden="true" focusable="false">
            <circle
              class="segment-process-circle"
              cx={segmentProcessCircleCenterX}
              cy={segmentProcessCircleCenterY + 0.2}
              r={segmentProcessCircleRadius - 2}
              fill={d.data.name === "PA-X" ||
              d.data.branch_type === "leaf" ||
              d.data.type?.slice(-2) === "db" ||
              d.data.name === "agreement"
                ? "white"
                : "#001C23"}
            />
            <text
              class="segment-process-label"
              x={segmentProcessLabelX - 5}
              y={segmentProcessLabelY}
              font-size={10}
            >
              {segmentData?.name}
            </text>
            {#each peopleMarkers as marker}
              <circle
                class="segment-people-circle"
                cx={marker.cx}
                cy={marker.cy}
                r={marker.r}
              />
            {/each}
            {#if timePath.isVisible}
              <path class="segment-time-shape" d={timePath.pathD}></path>
            {/if}
            {#each methodMarkers as methodMarker}
              <image
                class="segment-method-cog"
                href={COG_ICON_HREF}
                x={methodMarker.x - methodMarker.size / 2}
                y={methodMarker.y - methodMarker.size / 2}
                width={methodMarker.size}
                height={methodMarker.size}
                preserveAspectRatio="xMidYMid meet"
              />
            {/each}
            {#if methodErrorSeparator.isVisible}
              <path
                class="segment-method-error-separator"
                d={methodErrorSeparator.pathD}
              ></path>
            {/if}
            {#each errorMarkers as errorMarker}
              <image
                class="segment-error-icon"
                href={ERROR_ICON_HREF}
                x={errorMarker.x - errorMarker.size / 2}
                y={errorMarker.y - errorMarker.size / 2}
                width={errorMarker.size}
                height={errorMarker.size}
                preserveAspectRatio="xMidYMid meet"
              />
            {/each}
            {#if errorRightSeparator.isVisible}
              <path
                class="segment-error-right-separator"
                d={errorRightSeparator.pathD}
              ></path>
            {/if}
          </svg>
        </div>

        {#if isExpanded}
          <div
            class="segment-expanded-content"
            style="height: {SEGMENT_EXPAND_DELTA}px;"
          >
            {segmentData?.segment_text ?? ""}
          </div>
        {/if}
      </div>
    </a>
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
    color: rgba(255, 255, 255, 0.92);
    font-size: 12px;
    line-height: 1.35;
    overflow: auto;
  }

  .detail-link {
    display: block;
    text-decoration: none;
  }

  .detail-title-segment {
    position: relative;
    align-items: center;
    justify-content: center;
    border: none;
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
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 35px;
    height: 35px;
    padding: 0;
    box-sizing: border-box;
    border: solid 1px rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    cursor: pointer;
  }

  .detail-reset-button:hover {
    background: rgba(255, 255, 255, 0.16);
  }

  .segment-process-circle {
    stroke: #cc8500;
    stroke-width: 5;
  }

  .segment-process-label {
    fill: rgba(255, 255, 255, 0.95);
    font-weight: 600;
    text-anchor: end;
    dominant-baseline: middle;
  }

  .segment-time-shape {
    fill: #595959;
  }

  .segment-people-circle {
    fill: rgb(255, 255, 255);
  }

  .segment-method-cog {
    opacity: 0.95;
  }

  .segment-method-error-separator {
    fill: none;
    stroke: rgba(255, 255, 255, 0.85);
    stroke-width: 2;
  }
  .segment-error-right-separator {
    fill: none;
    stroke: #595959;
    stroke-width: 2;
  }

  .segment-error-icon {
    opacity: 0.95;
  }

  .detail-segment:hover {
    border-color: rgba(126, 126, 126, 0.8);
  }
</style>
