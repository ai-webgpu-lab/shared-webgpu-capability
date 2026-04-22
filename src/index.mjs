const knownLimitKeys = [
  "maxTextureDimension1D",
  "maxTextureDimension2D",
  "maxTextureDimension3D",
  "maxBindGroups",
  "maxBindingsPerBindGroup",
  "maxUniformBufferBindingSize",
  "maxStorageBufferBindingSize",
  "maxComputeInvocationsPerWorkgroup",
  "maxComputeWorkgroupStorageSize",
  "maxBufferSize"
];

export function inferDeviceClass({
  hardwareConcurrency = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 0 : 0,
  deviceMemory = typeof navigator !== "undefined" ? navigator.deviceMemory || 0 : 0,
  userAgent = typeof navigator !== "undefined" ? navigator.userAgent || "" : ""
} = {}) {
  const mobile = /Mobi|Android|iPhone|iPad/i.test(userAgent);

  if (mobile) {
    if (deviceMemory >= 6 && hardwareConcurrency >= 8) {
      return "mobile-high";
    }

    return "mobile-mid";
  }

  if (deviceMemory >= 16 && hardwareConcurrency >= 12) {
    return "desktop-high";
  }

  if (deviceMemory >= 8 && hardwareConcurrency >= 8) {
    return "desktop-mid";
  }

  if (hardwareConcurrency >= 4) {
    return "laptop";
  }

  return "unknown";
}

export function parseBrowser(userAgent = typeof navigator !== "undefined" ? navigator.userAgent || "" : "") {
  const candidates = [
    ["Edg/", "Edge"],
    ["Chrome/", "Chrome"],
    ["Firefox/", "Firefox"],
    ["Version/", "Safari"]
  ];

  for (const [needle, name] of candidates) {
    const marker = userAgent.indexOf(needle);
    if (marker >= 0) {
      const version = userAgent.slice(marker + needle.length).split(/[\s)/;]/)[0] || "unknown";
      return { name, version };
    }
  }

  return { name: "Unknown", version: "unknown" };
}

export function parseOs(userAgent = typeof navigator !== "undefined" ? navigator.userAgent || "" : "") {
  if (/Windows NT/i.test(userAgent)) {
    const match = userAgent.match(/Windows NT ([0-9.]+)/i);
    return { name: "Windows", version: match ? match[1] : "unknown" };
  }

  if (/Mac OS X/i.test(userAgent)) {
    const match = userAgent.match(/Mac OS X ([0-9_]+)/i);
    return { name: "macOS", version: match ? match[1].replace(/_/g, ".") : "unknown" };
  }

  if (/Android/i.test(userAgent)) {
    const match = userAgent.match(/Android ([0-9.]+)/i);
    return { name: "Android", version: match ? match[1] : "unknown" };
  }

  if (/(iPhone|iPad|CPU OS)/i.test(userAgent)) {
    const match = userAgent.match(/OS ([0-9_]+)/i);
    return { name: "iOS", version: match ? match[1].replace(/_/g, ".") : "unknown" };
  }

  if (/Linux/i.test(userAgent)) {
    return { name: "Linux", version: "unknown" };
  }

  return { name: "Unknown", version: "unknown" };
}

export function baseEnvironmentSnapshot() {
  const nav = typeof navigator !== "undefined" ? navigator : {};

  return {
    browser: parseBrowser(nav.userAgent || ""),
    os: parseOs(nav.userAgent || ""),
    device: {
      name: nav.platform || "unknown",
      class: inferDeviceClass({
        hardwareConcurrency: nav.hardwareConcurrency || 0,
        deviceMemory: nav.deviceMemory || 0,
        userAgent: nav.userAgent || ""
      }),
      cpu: nav.hardwareConcurrency ? `${nav.hardwareConcurrency} threads` : "unknown",
      memory_gb: nav.deviceMemory || undefined,
      power_mode: "unknown"
    },
    gpu: {
      adapter: "unknown",
      required_features: [],
      limits: {}
    },
    backend: "wasm",
    fallback_triggered: true,
    worker_mode: "unknown",
    cache_state: "unknown"
  };
}

export function extractGpuLimits(source) {
  const limits = {};

  if (!source) {
    return limits;
  }

  for (const key of knownLimitKeys) {
    if (key in source && Number.isFinite(source[key])) {
      limits[key] = Number(source[key]);
    }
  }

  return limits;
}

export async function collectWebGpuCapability() {
  const environment = baseEnvironmentSnapshot();

  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return {
      environment,
      webgpu: {
        available: false,
        error: "navigator.gpu unavailable",
        adapter: "unavailable",
        features: [],
        limits: {}
      }
    };
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("No GPU adapter returned");
    }

    let adapterInfo = null;
    if (typeof adapter.requestAdapterInfo === "function") {
      try {
        adapterInfo = await adapter.requestAdapterInfo();
      } catch (error) {
        adapterInfo = null;
      }
    }

    const device = await adapter.requestDevice();
    const webgpu = {
      available: true,
      adapter: (adapterInfo && (adapterInfo.description || adapterInfo.vendor || adapterInfo.architecture)) || "WebGPU adapter",
      features: Array.from(device.features || []),
      limits: extractGpuLimits(device.limits || adapter.limits)
    };

    environment.backend = "webgpu";
    environment.fallback_triggered = false;
    environment.gpu = {
      adapter: webgpu.adapter,
      required_features: webgpu.features,
      limits: webgpu.limits
    };

    return { environment, webgpu };
  } catch (error) {
    return {
      environment,
      webgpu: {
        available: false,
        error: error instanceof Error ? error.message : String(error),
        adapter: "unavailable",
        features: [],
        limits: {}
      }
    };
  }
}

export function buildBaselineResult({
  repo,
  track = "infra",
  workloadKind = "graphics",
  purpose = "WebGPU capability baseline"
} = {}, capability = { environment: baseEnvironmentSnapshot(), webgpu: null }) {
  const environment = capability.environment || baseEnvironmentSnapshot();
  const webgpu = capability.webgpu;

  if (webgpu) {
    environment.backend = webgpu.available ? "webgpu" : "wasm";
    environment.fallback_triggered = !webgpu.available;
    environment.gpu = {
      adapter: webgpu.adapter || "unknown",
      required_features: webgpu.features || [],
      limits: webgpu.limits || {}
    };
  }

  return {
    meta: {
      repo,
      commit: "bootstrap-generated",
      timestamp: new Date().toISOString(),
      owner: "ai-webgpu-lab",
      track,
      scenario: "baseline-probe",
      notes: `${purpose}. Replace generic capability capture with workload-specific metrics before publishing benchmark conclusions.`
    },
    environment,
    workload: {
      kind: workloadKind,
      name: `${repo} baseline probe`,
      input_profile: "bootstrap-default"
    },
    metrics: {
      common: {
        time_to_interactive_ms: 0,
        init_ms: 0,
        success_rate: webgpu ? (webgpu.available ? 1 : 0) : 0.5,
        peak_memory_note: "Populate after first workload-specific run.",
        error_type: webgpu && webgpu.error ? webgpu.error : ""
      }
    },
    status: webgpu ? (webgpu.available ? "success" : "partial") : "partial"
  };
}
