<script>
  function nodeRadius(ppl) {
    const MIN_R = 5,
      MAX_R = 28,
      MAX_PPL = 50;
    return MIN_R + (Math.sqrt(ppl) / Math.sqrt(MAX_PPL)) * (MAX_R - MIN_R);
  }

  function getPeopleDots(ppl) {
    const r = nodeRadius(ppl);
    const dr = 2;
    const gap = 2;
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
        cx: ringR * Math.cos(angle),
        cy: ringR * Math.sin(angle),
      };
    });
  }

  const legendPpl = 10;
  const legendDots = getPeopleDots(legendPpl);
</script>

<svg height="70" width="200">
  <g transform={`translate(${60}, ${20})`}>
    <!-- main circle -->
    <circle
      cx="0"
      cy="0"
      r="15"
      fill="white"
      stroke={"gray"}
      stroke-width="8"
    />

    <!-- dots around -->
    {#each legendDots as dot}
      <circle cx={dot.cx} cy={dot.cy} r="2" fill="black" opacity="0.85" />
    {/each}

    <!-- label -->
    <text x="25" y="0" font-size="12" fill="white" alignment-baseline="middle">
      10 people involved
    </text>
  </g>
</svg>
