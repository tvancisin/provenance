<script>
  import { tick } from "svelte";
  export let fullChain = [];
  export let segment_height;
  export let details_width = 300;

  let overlayPaths = [];

  async function drawArches() {
    await tick();
    const container = document.getElementById("details");
    const containerRect = container.getBoundingClientRect();
    const segments = container.querySelectorAll(".detail-segment");

    const archDefinitions = [
      { from: "pax_collect", to: "pax_transcribe", id: "collect-transcribe" },
      { from: "pax_code", to: "pax_transcribe", id: "code-transcribe" },
      // add more here as needed
    ];

    overlayPaths = archDefinitions.flatMap(({ from, to, id }) => {
      const fromIndex = fullChain.findIndex((d) => d.data.type === from);
      const toIndex = fullChain.findIndex((d) => d.data.type === to);

      if (fromIndex === -1 || toIndex === -1) return [];

      const fromRect = segments[fromIndex].getBoundingClientRect();
      const toRect = segments[toIndex].getBoundingClientRect();

      const x1 = fromRect.left - containerRect.left + 10;
      const y1 = fromRect.top - containerRect.top + 11;
      const x2 = toRect.left - containerRect.left + 10;
      const y2 = toRect.top - containerRect.top + 11;

      const bulge = 60;
      const path = `M ${x1} ${y1} C ${x1 + bulge} ${y1}, ${x2 + bulge} ${y2}, ${x2} ${y2}`;

      return [{ path, id }];
    });
  }

  $: if (fullChain.length > 0) {
    drawArches();
  }
</script>

<div id="details" style="height: {innerHeight}px; width: {details_width}px;">
  <!-- Overlay SVG stretched over the whole container -->
  <!-- <svg
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible;"
    >
      {#each overlayPaths as { path, id }}
        <path
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          stroke-width="1.5"
        />
      {/each}
    </svg> -->
  <!-- individual segments -->
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
            <g transform={`translate(5, 5)`}>
              <text x="100" y="50" font-size="12" fill="white"
                >{d.data.name}</text
              >
              {#each Array(d.data.ppl) as _, j}
                <circle cx={5 + j * 4.5} cy={5} r="2" fill="white" />
              {/each}
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

<style>
  #details {
    position: absolute;
    top: 0px;
    right: 0px;
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
    border-color: rgba(255, 255, 255, 0.8);
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
</style>
