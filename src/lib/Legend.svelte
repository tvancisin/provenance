<script>
  export let currentLevelDown;
  $: console.log(currentLevelDown);
</script>

<!-- LEGEND -->
<g transform={`translate(${20}, ${50})`}>
  <!-- Artifact rectangle -->
  <g transform="translate(0, 0)">
    <circle
      cx="0"
      cy="0"
      r="10"
      fill={currentLevelDown >= 0 ? "white": "white"}
      stroke={currentLevelDown >= 0 ? "#00CCFF": "#005266"}
      stroke-width="8"
    />
    <text x="20" y="0" font-size="12" fill="white" alignment-baseline="middle">
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
      stroke={currentLevelDown >= 0 ? "#00CCFF": "#005266"}
      stroke-width="8"
    />
    <text x="20" y="0" font-size="12" fill="white" alignment-baseline="middle">
      Process
    </text>
  </g>
  <!-- People cluster -->
  <g transform="translate(0, 60)">
    <!-- central circle -->
    <circle
      cx="0"
      cy="0"
      r="10"
      fill="none"
      stroke={currentLevelDown >= 0 ? "#00CCFF": "#005266"}
      stroke-width="8"
    />

    <!-- surrounding 5 small circles -->
    {#each Array(5) as _, i}
      <circle
        cx={10 * Math.cos(((-90 + i * 30) * Math.PI) / 180)}
        cy={10 * Math.sin(((-90 + i * 30) * Math.PI) / 180)}
        r="2"
        fill="black"
      />
    {/each}

    <text x="20" y="0" font-size="12" fill="white" alignment-baseline="middle">
      People
    </text>
  </g>
</g>
