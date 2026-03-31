<script>
  export let currentLevelDown;
</script>

<!-- LEGEND -->
<svg height="70" width="200">
  <g transform={`translate(${60}, ${20})`}>
    <!-- Artifact rectangle -->
    <g transform="translate(0, 0)">
      <circle
        cx="0"
        cy="0"
        r="10"
        fill={currentLevelDown >= 0 ? "white" : "white"}
        stroke={currentLevelDown >= 0 ? "gray" : "#005266"}
        stroke-width="8"
      />
      <text
        x="20"
        y="0"
        font-size="12"
        fill="white"
        alignment-baseline="middle"
      >
        Artifact
      </text>
    </g>

    <!-- Process circle -->
    <g transform="translate(0, 30)">
      <circle
        cx="0"
        cy="0"
        r="10"
        fill="none"
        stroke={currentLevelDown >= 0 ? "gray" : "#005266"}
        stroke-width="8"
      />
      <text
        x="20"
        y="0"
        font-size="12"
        fill="white"
        alignment-baseline="middle"
      >
        Process
      </text>
    </g>
  </g>
</svg>
