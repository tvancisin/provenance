<script>

</script>
<!-- LEGEND -->
<g transform={`translate(${20}, ${500})`}>
  <!-- Artifact rectangle -->
  <g transform="translate(0, 0)">
    <rect
      x="-8"
      y="-8"
      width="16"
      height="16"
      rx="2"
      fill="none"
      stroke="gray"
      transform="rotate(45, 0, 0)"
    />
    <text x="15" y="0" font-size="12" fill="white" alignment-baseline="middle">
      Artifact
    </text>
  </g>

  <!-- Process circle -->
  <g transform="translate(0, 30)">
    <circle cx="0" cy="0" r="9" fill="none" stroke="gray" />
    <text x="15" y="0" font-size="12" fill="white" alignment-baseline="middle">
      Process
    </text>
  </g>
  <!-- People cluster -->
  <g transform="translate(0, 60)">
    <!-- central circle -->
    <circle cx="0" cy="0" r="9" fill="none" stroke="gray" />

    <!-- surrounding 5 small circles -->
    {#each Array(5) as _, i}
      <circle
        cx={14 * Math.cos(((-90 + i * 30) * Math.PI) / 180)}
        cy={14 * Math.sin(((-90 + i * 30) * Math.PI) / 180)}
        r="2"
        fill="#ffff66"
      />
    {/each}

    <text x="20" y="0" font-size="12" fill="white" alignment-baseline="middle">
      People
    </text>
  </g>
</g>
