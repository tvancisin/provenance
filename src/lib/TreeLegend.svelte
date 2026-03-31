<script>
  export let currentLevelDown;
</script>

<!-- LEGEND -->
<svg height="120" width="320">
  <g transform={`translate(${60}, ${20})`}>
    <!-- Research -->
    <g transform="translate(0, 0)">
      <rect x="20" y="-10" width="20" height="20" fill="#800000" />
      <text x="50" y="2" font-size="14" fill="white" alignment-baseline="middle">Research</text>
    </g>
    <!-- Peacetech tools -->
    <g transform="translate(0, 25)">
      <rect x="20" y="-10" width="20" height="20" fill="#005266" />
      <text x="50" y="2" font-size="14" fill="white" alignment-baseline="middle">Peacetech Tools</text>
    </g>
    <!-- Data transformations -->
    <g transform="translate(0, 50)">
      <rect x="20" y="-10" width="20" height="20" fill="#003D4D" />
      <text x="50" y="2" font-size="14" fill="white" alignment-baseline="middle">Data Transformations</text>
    </g>
    <!-- Real-life events -->
    <g transform="translate(0, 75)">
      <rect x="20" y="-10" width="20" height="20" fill="#404040" />
      <text x="50" y="2" font-size="14" fill="white" alignment-baseline="middle">Real-Life Events</text>
    </g>
  </g>
</svg>
