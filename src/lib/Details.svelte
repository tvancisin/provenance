<script>
  export let fullChain = [];
  export let innerHeight = window.innerHeight;
  export let segment_height;
  export let details_width = 300;

  const TIME_MIN = 0;
  const TIME_MAX = 120;
  const PEOPLE_CIRCLE_SHIFT_X = 3;
  const DETAIL_TIME_TO_ERRORS_GAP_SCALE = -1;
  const DETAIL_ERRORS_TO_METHODS_GAP_SCALE = -1;
  const SEGMENT_EXPAND_DELTA = 100;
  const BOTTOM_EXPAND_COUNT = 3;
  let expandedSegmentIndex = null;

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

  function getProcessLabelFontSize(height) {
    const value = Number(height);
    if (!Number.isFinite(value) || value <= 0) return 8;
    return Math.max(6, Math.min(12, value * 0.22));
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
      rowStep,
      rowsPerColumn,
    };
  }

  function getPeopleCircleMarkers(data, originX = 0) {
    const count = getPeopleIndicatorCount(data);
    const segmentHeight = getDetailSegmentHeight(data);
    const safeOriginX = Number.isFinite(Number(originX)) ? Number(originX) : 0;

    if (count <= 0 || !Number.isFinite(segmentHeight) || segmentHeight <= 0) {
      return [];
    }

    const halfCircleRadius = segmentHeight / 2;
    const { circleRadius, verticalGap, horizontalGap, rowStep, rowsPerColumn } =
      getPeopleVisualMetrics(segmentHeight);
    const referenceRows = Math.min(rowsPerColumn, count);
    const referenceStackHeight =
      referenceRows * (circleRadius * 2) + (referenceRows - 1) * verticalGap;
    const firstCenterY =
      (segmentHeight - referenceStackHeight) / 2 + circleRadius;

    const edgeClearance = circleRadius + Math.max(2.5, circleRadius * 0.9);
    const columnStep = circleRadius * 2 + horizontalGap;

    return Array.from({ length: count }, (_, index) => {
      const column = Math.floor(index / rowsPerColumn);
      const row = index % rowsPerColumn;
      const cy = firstCenterY + row * rowStep;

      const distanceFromMid = cy - halfCircleRadius;
      const edgeX = Math.sqrt(
        Math.max(
          halfCircleRadius * halfCircleRadius -
            distanceFromMid * distanceFromMid,
          0,
        ),
      );

      const offsetFromEdge = edgeClearance + column * columnStep;

      return {
        cx: safeOriginX + edgeX + offsetFromEdge + PEOPLE_CIRCLE_SHIFT_X,
        cy,
        r: circleRadius,
      };
    });
  }

  function getErrorMarkers(data, timePathLayout, gapScale = 1, originX = 0) {
    const count = getErrorsIndicatorCount(data);
    const segmentHeight = getDetailSegmentHeight(data);
    const safeOriginX = Number.isFinite(Number(originX)) ? Number(originX) : 0;

    if (count <= 0 || !Number.isFinite(segmentHeight) || segmentHeight <= 0) {
      return [];
    }

    const halfCircleRadius = segmentHeight / 2;
    const { circleRadius, verticalGap, horizontalGap, rowStep, rowsPerColumn } =
      getPeopleVisualMetrics(segmentHeight);

    const referenceRows = Math.min(rowsPerColumn, count);
    const referenceStackHeight =
      referenceRows * (circleRadius * 2) + (referenceRows - 1) * verticalGap;
    const firstCenterY =
      (segmentHeight - referenceStackHeight) / 2 + circleRadius;

    // Start after time path with a gap
    const timeEndX = timePathLayout?.isVisible
      ? timePathLayout.endTipX
      : safeOriginX + segmentHeight / 2;
    const startGap = Math.max(8, circleRadius * 1.2) * gapScale;

    const columnStep = circleRadius * 2 + horizontalGap;

    return Array.from({ length: count }, (_, index) => {
      const column = Math.floor(index / rowsPerColumn);
      const row = index % rowsPerColumn;
      const cy = firstCenterY + row * rowStep;

      // Calculate curve position
      const distanceFromMid = cy - halfCircleRadius;
      const edgeX = Math.sqrt(
        Math.max(
          halfCircleRadius * halfCircleRadius -
            distanceFromMid * distanceFromMid,
          0,
        ),
      );

      return {
        x: timeEndX + startGap + edgeX + column * columnStep,
        y: cy,
        size: circleRadius * 1.6,
      };
    });
  }

  function getMethodRects(data, errorMarkers, gapScale = 1, originX = 0) {
    const count = getMethodsIndicatorCount(data);
    const segmentHeight = getDetailSegmentHeight(data);
    const safeOriginX = Number.isFinite(Number(originX)) ? Number(originX) : 0;

    if (count <= 0 || !Number.isFinite(segmentHeight) || segmentHeight <= 0) {
      return [];
    }

    const halfCircleRadius = segmentHeight / 2;
    const { circleRadius, verticalGap, horizontalGap, rowStep, rowsPerColumn } =
      getPeopleVisualMetrics(segmentHeight);

    const referenceRows = Math.min(rowsPerColumn, count);
    const referenceStackHeight =
      referenceRows * (circleRadius * 2) + (referenceRows - 1) * verticalGap;
    const firstCenterY =
      (segmentHeight - referenceStackHeight) / 2 + circleRadius;

    // Start after errors with a gap
    const errorsEndX =
      errorMarkers.length > 0
        ? Math.max(...errorMarkers.map((m) => m.x + m.size / 2))
        : safeOriginX + segmentHeight / 2;
    const startGap = Math.max(8, circleRadius * 1.2) * gapScale;

    const columnStep = circleRadius * 2 + horizontalGap;

    return Array.from({ length: count }, (_, index) => {
      const column = Math.floor(index / rowsPerColumn);
      const row = index % rowsPerColumn;
      const cy = firstCenterY + row * rowStep;

      // Calculate curve position
      const distanceFromMid = cy - halfCircleRadius;
      const edgeX = Math.sqrt(
        Math.max(
          halfCircleRadius * halfCircleRadius -
            distanceFromMid * distanceFromMid,
          0,
        ),
      );

      return {
        x: errorsEndX + startGap + edgeX + column * columnStep,
        y: cy,
        size: circleRadius * 2,
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
    const { circleRadius, horizontalGap } =
      getPeopleVisualMetrics(segmentHeight);
    const peopleMarkers = getPeopleCircleMarkers(data, safeOriginX);
    const peopleRightEdge =
      peopleMarkers.length > 0
        ? Math.max(...peopleMarkers.map((marker) => marker.cx + marker.r))
        : safeOriginX + halfCircleRadius;

    const startGap = Math.max(
      0.8,
      Math.min(horizontalGap, circleRadius * 0.45),
    );
    const startX = peopleRightEdge + startGap;
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
    {@const errorMarkers = getErrorMarkers(
      segmentData,
      timePath,
      DETAIL_TIME_TO_ERRORS_GAP_SCALE,
      segmentVisualOffsetX,
    )}
    {@const methodMarkers = getMethodRects(
      segmentData,
      errorMarkers,
      DETAIL_ERRORS_TO_METHODS_GAP_SCALE,
      segmentVisualOffsetX,
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
			transform: translateY({isExpanded && expandsUp ? -SEGMENT_EXPAND_DELTA : 0}px);
			margin-bottom: {isExpanded && expandsUp ? -SEGMENT_EXPAND_DELTA : 0}px;
			display: flex;
      --segment-radius: {getDetailSegmentRadius(baseSegmentHeight)}px;
		  "
      >
        <svg class="segment-svg" aria-hidden="true" focusable="false">
          <circle
            class="segment-process-circle"
            cx={segmentProcessCircleCenterX}
            cy={segmentProcessCircleCenterY}
            r={segmentProcessCircleRadius}
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
          {#each errorMarkers as errorMarker}
            <text
              class="segment-error-mark"
              x={errorMarker.x}
              y={errorMarker.y}
              font-size={11}
            >
              &#xf071;
            </text>
          {/each}
          {#each methodMarkers as methodMarker}
            <rect
              class="segment-method-rect"
              x={methodMarker.x - methodMarker.size / 2}
              y={methodMarker.y - methodMarker.size / 2}
              width={methodMarker.size}
              height={methodMarker.size}
            />
          {/each}
        </svg>
      </div></a
    >
  {/each}
</div>

<style>
  #details {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .detail-segment {
    color: white;
    display: flex;
    box-sizing: border-box;
    background-color: #001c23;
    border-radius: var(--segment-radius, 10px);
    border: solid 1px rgba(106, 106, 106);
    transition:
      border-color 0.2s ease,
      height 0.2s ease,
      transform 0.2s ease,
      margin-bottom 0.2s ease;
    overflow: hidden;
  }

  .detail-link {
    display: block;
    text-decoration: none;
  }

  .detail-title-segment {
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

  .segment-svg {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }

  .segment-process-circle {
    stroke: orange;
    stroke-width: 2;
  }

  .segment-process-label {
    fill: rgba(255, 255, 255, 0.95);
    font-weight: 600;
    text-anchor: end;
    dominant-baseline: middle;
  }

  .segment-time-shape {
    fill: #ffffff;
  }

  .segment-people-circle {
    fill: rgba(255, 255, 255, 0.85);
  }

  .segment-error-mark {
    fill: rgba(255, 255, 255, 0.95);
    font-family: FontAwesome;
    font-weight: normal;
    font-style: normal;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .segment-method-rect {
    fill: rgba(255, 255, 255, 0.9);
  }

  .detail-segment:hover {
    border-color: rgba(255, 255, 255, 0.8);
  }
</style>
