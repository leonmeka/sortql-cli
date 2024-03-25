require("esbuild")
  .build({
    entryPoints: ["index.ts"],
    bundle: true,
    minify: true,
    platform: "node",
    target: "node18",
    outdir: "dist",
    outExtension: {
      ".js": ".cjs",
    },
    external: ["fsevents"],
    define: { "process.env.FLUENTFFMPEG_COV": "0" },
  })
  .catch(() => process.exit(1));
