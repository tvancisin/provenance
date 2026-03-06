<script>
  export let fullChain = [];
  export let innerHeight = window.innerHeight;
  export let segment_height;
  export let details_width = 300;


  function hasGrayBorder(data) {
    return (
      data?.name === "PA-X" ||
      data?.branch_type === "leaf" ||
      data?.type?.slice(-2) === "db"
    );
  }

  const TIME_MIN = 0;
  const TIME_MAX = 120;
  const PEOPLE_CIRCLE_SHIFT_X = 3;
  const DETAIL_TIME_TO_ERRORS_GAP_SCALE = -1;
  const DETAIL_ERRORS_TO_METHODS_GAP_SCALE = -1;
  const LEGEND_SAMPLE_DATA = { people: 10, time: 30, errors: 8, methods: 10 };

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

  function getTimePathLayout(data, originX = 0) {
    const segmentHeight = getDetailSegmentHeight(data);
    const segmentWidth = Math.max(Number(details_width) || 0, 0);
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

  function getLegendTextLayout(
    peopleMarkers,
    errorMarkers,
    methodMarkers,
    timePathLayout,
  ) {
    const segmentHeight = Math.max(Number(segment_height) || 0, 0);
    const segmentWidth = Math.max(Number(details_width) || 0, 0);

    if (segmentHeight <= 0 || segmentWidth <= 0) {
      return null;
    }

    const centerY = segmentHeight / 2;
    const spacing = Math.max(8, Math.min(20, segmentWidth * 0.04));
    const halfCircleRight = segmentHeight / 2;

    const peopleLeft =
      peopleMarkers.length > 0
        ? Math.min(...peopleMarkers.map((marker) => marker.cx - marker.r))
        : halfCircleRight + spacing;
    const peopleRight =
      peopleMarkers.length > 0
        ? Math.max(...peopleMarkers.map((marker) => marker.cx + marker.r))
        : peopleLeft + spacing;

    const timeStart = timePathLayout?.isVisible
      ? timePathLayout.startX
      : peopleRight + spacing;
    const timeEnd = timePathLayout?.isVisible
      ? timePathLayout.endTipX
      : timeStart + spacing * 2;

    const errorsLeft =
      errorMarkers.length > 0
        ? Math.min(...errorMarkers.map((marker) => marker.x - marker.size / 2))
        : timeEnd + spacing;
    const errorsRight =
      errorMarkers.length > 0
        ? Math.max(...errorMarkers.map((marker) => marker.x + marker.size / 2))
        : errorsLeft + spacing;

    const methodsLeft =
      methodMarkers.length > 0
        ? Math.min(...methodMarkers.map((marker) => marker.x - marker.size / 2))
        : errorsRight + spacing;
    const methodsRight =
      methodMarkers.length > 0
        ? Math.max(...methodMarkers.map((marker) => marker.x + marker.size / 2))
        : methodsLeft + spacing;

    const minGapHalfToPeople = Math.max(34, segmentWidth * 0.11);
    const peopleShiftX = Math.max(
      0,
      halfCircleRight + minGapHalfToPeople - peopleLeft,
    );
    const shiftedPeopleLeft = peopleLeft + peopleShiftX;
    const shiftedPeopleRight = peopleRight + peopleShiftX;

    const minGapPeopleToTime = Math.max(30, segmentWidth * 0.09);
    const timeShiftX = Math.max(
      0,
      shiftedPeopleRight + minGapPeopleToTime - timeStart,
    );
    const shiftedTimeStart = timeStart + timeShiftX;
    const shiftedTimeEnd = timeEnd + timeShiftX;

    const minGapTimeToErrors = Math.max(28, segmentWidth * 0.08);
    const errorsShiftX = Math.max(
      0,
      shiftedTimeEnd + minGapTimeToErrors - errorsLeft,
    );
    const shiftedErrorsLeft = errorsLeft + errorsShiftX;
    const shiftedErrorsRight = errorsRight + errorsShiftX;

    const minGapErrorsToMethods = Math.max(42, segmentWidth * 0.12);
    const methodsShiftX = Math.max(
      0,
      shiftedErrorsRight + minGapErrorsToMethods - methodsLeft,
    );
    const shiftedMethodsLeft = methodsLeft + methodsShiftX;
    const shiftedMethodsRight = methodsRight + methodsShiftX;

    const processX = Math.max(
      halfCircleRight + 10,
      Math.min(shiftedPeopleLeft - 10, halfCircleRight + 16),
    );

    const peopleX = Math.max(
      shiftedPeopleRight + 8,
      Math.min(shiftedTimeStart - 8, shiftedPeopleRight + 14),
    );

    const timeX = Math.max(
      shiftedTimeEnd + 8,
      Math.min(shiftedErrorsLeft - 8, shiftedTimeEnd + 10),
    );

    const errorsX = Math.max(
      shiftedErrorsRight + 8,
      Math.min(shiftedMethodsLeft - 8, shiftedErrorsRight + 14),
    );

    const methodsX = Math.min(segmentWidth - 10, shiftedMethodsRight + 17);

    return {
      titleX: segmentWidth / 2,
      titleY: Math.max(2, segmentHeight * 0.06),
      processX,
      processY: centerY,
      peopleX,
      peopleY: centerY,
      errorsX,
      errorsY: centerY,
      methodsX,
      methodsY: centerY,
      timeX,
      timeY: centerY,
      peopleShiftX,
      errorsShiftX,
      methodsShiftX,
      timeShiftX,
    };
  }

  $: legendPeopleMarkers =
    fullChain.length > 0 && segment_height > 0
      ? getPeopleCircleMarkers(LEGEND_SAMPLE_DATA)
      : [];
  $: legendTimePathLayout =
    fullChain.length > 0 && segment_height > 0
      ? getTimePathLayout(LEGEND_SAMPLE_DATA)
      : { isVisible: false, pathD: "", startX: 0, endTipX: 0 };
  $: legendErrorMarkers =
    fullChain.length > 0 && segment_height > 0
      ? getErrorMarkers(LEGEND_SAMPLE_DATA, legendTimePathLayout)
      : [];
  $: legendMethodMarkers =
    fullChain.length > 0 && segment_height > 0
      ? getMethodRects(LEGEND_SAMPLE_DATA, legendErrorMarkers)
      : [];
  $: legendTextLayout =
    fullChain.length > 0 && segment_height > 0
      ? getLegendTextLayout(
          legendPeopleMarkers,
          legendErrorMarkers,
          legendMethodMarkers,
          legendTimePathLayout,
        )
      : null;
</script>

<div id="details" style="height: {innerHeight}px; width: {details_width}px;">
  {#if fullChain.length > 0}
    <div
      class="detail-segment legend-segment"
      style="
        height: {segment_height}px;
        width: {details_width}px;
        --segment-radius: {getDetailSegmentRadius(segment_height)}px;
      "
    >
      <svg class="segment-svg" aria-hidden="true" focusable="false">
        {#if legendTextLayout}
          <circle
            class="legend-process-circle"
            cx={segment_height / 2 - 1}
            cy={segment_height / 2 - 1}
            r={getProcessCircleRadius(segment_height, 2)}
          />

          <text class="legend-label" x={legendTextLayout.processX} y={5}>
            Process
          </text>

          {#each legendPeopleMarkers as marker}
            <circle
              class="legend-people-circle"
              cx={marker.cx + legendTextLayout.peopleShiftX}
              cy={marker.cy}
              r={marker.r}
            />
          {/each}

          <text class="legend-label" x={legendTextLayout.peopleX} y={5}>
            People
          </text>

          {#if legendTimePathLayout.isVisible}
            <path
              class="legend-time-shape"
              d={legendTimePathLayout.pathD}
              transform={`translate(${legendTextLayout.timeShiftX} 0)`}
            ></path>
          {/if}

          <text class="legend-label" x={legendTextLayout.timeX} y={5}>
            Time
          </text>

          {#each legendErrorMarkers as marker}
            <text
              class="legend-error-mark"
              x={marker.x + legendTextLayout.errorsShiftX}
              y={marker.y}
              font-size={marker.size}
            >
              &#xf071;
            </text>
          {/each}

          <text class="legend-label" x={legendTextLayout.errorsX} y={5}>
            Errors
          </text>

          {#each legendMethodMarkers as marker}
            <rect
              class="legend-method-rect"
              x={marker.x + legendTextLayout.methodsShiftX - marker.size / 2}
              y={marker.y - marker.size / 2}
              width={marker.size}
              height={marker.size}
            />
          {/each}

          <text class="legend-label" x={legendTextLayout.methodsX} y={5}>
            Methods
          </text>
        {/if}
      </svg>
    </div>
  {/if}

  <!-- individual segments -->
  {#each fullChain as d}
    {@const segmentData = d.data}
    {@const segmentHeight = getDetailSegmentHeight(segmentData)}
    {@const segmentVisualOffsetX = segmentHeight / 2}
    {@const segmentProcessCircleCenterX = segmentVisualOffsetX - 1}
    {@const segmentProcessCircleCenterY = segmentHeight / 2 - 1}
    {@const segmentProcessLabelX = details_width - 5}
    {@const segmentProcessLabelY = segmentHeight / 2}
    {@const segmentProcessCircleRadius = getProcessCircleRadius(segmentHeight)}
    {@const peopleMarkers = getPeopleCircleMarkers(
      segmentData,
      segmentVisualOffsetX,
    )}
    {@const timePath = getTimePathLayout(segmentData, segmentVisualOffsetX)}
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
    <a href={d.data.link} target="_blank">
      <div
        class="detail-segment {hasGrayBorder(segmentData)
          ? 'gray-border-segment'
          : ''}"
        style="
			height: {segmentHeight}px;
			width: {details_width}px;
			display: flex;
      --segment-radius: {getDetailSegmentRadius(segmentHeight)}px;
      border-color: {hasGrayBorder(segmentData) ? 'gray' : '#404040'};
		  "
      >
        <svg class="segment-svg" aria-hidden="true" focusable="false">
          <circle
            class="segment-process-circle"
            cx={segmentProcessCircleCenterX}
            cy={segmentProcessCircleCenterY}
            r={segmentProcessCircleRadius}
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
    background-color: #002731;
    border-radius: var(--segment-radius, 10px);
    border: solid 1px rgba(106, 106, 106);
    transition: border-color 0.2s ease;
    overflow: hidden;
  }

  .segment-svg {
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }

  .segment-process-circle {
    fill: #001c23;
    stroke: #00ccff;
    stroke-width: 1;
  }

  .segment-process-label {
    fill: rgba(255, 255, 255, 0.95);
    font-weight: 600;
    text-anchor: end;
    dominant-baseline: middle;
  }

  .segment-time-shape {
    fill: #d9dfe0;
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

  .legend-process-circle {
    fill: none;
    stroke: #7d7d7d;
    stroke-width: 2;
  }

  .legend-people-circle {
    fill: #8a8a8a;
  }

  .legend-time-shape {
    fill: #7d7d7d;
  }

  .legend-label {
    font-weight: 600;
    fill: #9a9a9a;
    font-size: 10px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .legend-error-mark {
    fill: #8a8a8a;
    font-size: 10px;
    font-family: FontAwesome;
    font-weight: normal;
    font-style: normal;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .legend-method-rect {
    fill: #8a8a8a;
  }

  .detail-segment:hover {
    border-color: rgba(255, 255, 255, 0.8);
  }

  .detail-segment.gray-border-segment:hover {
    border-color: rgba(255, 255, 255, 0.8) !important;
  }
</style>
