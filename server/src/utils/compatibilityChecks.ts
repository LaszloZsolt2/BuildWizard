import { CompatibilityMessage } from "../routes/Compatibility";
import { partLabels } from "../utils/partLabels";
import { ComponentsType } from "../types/componentsType";
import { PartType } from "../types/partType";

const socketRamSpeeds = {
  LGA1151: 4,
  LGA2066: 4,
  AM4: 4,
  LGA1700: 5,
  "LGA2011-3": 4,
  LGA1200: 4,
  AM5: 5,
  LGA775: 3,
  sTR4: 4,
  LGA1150: 3,
  "FM2+": 3,
  LGA1155: 3,
  "AM3+": 3,
  FM1: 3,
  LGA2011: 3,
  AM1: 3,
  LGA1156: 3,
  sTRX4: 4,
  LGA1366: 3,
  FM2: 3,
  "AM3+/AM3": 3,
  AM3: 3,
  "AM3/AM2+": 3,
  "AM3/AM2+/AM2": 2,
  AM2: 2,
  "AM2+/AM2": 2,
};

const caseMotherboardCompatibility = {
  "ATX Mid Tower": ["ATX", "Micro ATX", "Mini ITX"],
  "MicroATX Mini Tower": ["Micro ATX", "Mini ITX"],
  "MicroATX Mid Tower": ["Micro ATX", "Mini ITX"],
  "Mini ITX Desktop": ["Mini ITX", "Thin Mini ITX"],
  "ATX Full Tower": [
    "ATX",
    "Micro ATX",
    "EATX",
    "SSI EEB",
    "XL ATX",
    "Mini ITX",
    "SSI CEB",
  ],
  "Mini ITX Tower": ["Mini ITX", "Thin Mini ITX"],
  HTPC: ["Micro ATX", "Mini ITX", "Thin Mini ITX", "Flex ATX"],
  "ATX Mini Tower": ["ATX", "Micro ATX", "Mini ITX"],
  "MicroATX Desktop": ["Micro ATX", "Mini ITX", "Thin Mini ITX"],
  "ATX Desktop": ["ATX", "Micro ATX", "Mini ITX"],
  "Mini ITX Test Bench": ["Mini ITX", "Thin Mini ITX"],
  "MicroATX Slim": ["Micro ATX", "Mini ITX", "Thin Mini ITX"],
  "ATX Test Bench": [
    "ATX",
    "Micro ATX",
    "EATX",
    "Mini ITX",
    "SSI EEB",
    "SSI CEB",
    "HPTX",
    "XL ATX",
  ],
};

const casePowerSupplyCompatibility = {
  "ATX Mid Tower": ["ATX"],
  "MicroATX Mini Tower": ["ATX", "SFX"],
  "MicroATX Mid Tower": ["ATX", "SFX"],
  "Mini ITX Desktop": ["Mini ITX", "SFX"],
  "ATX Full Tower": ["ATX", "SFX"],
  "Mini ITX Tower": ["Mini ITX", "SFX"],
  HTPC: ["SFX", "TFX", "Flex ATX", "Mini ITX"],
  "ATX Mini Tower": ["ATX", "SFX"],
  "MicroATX Desktop": ["ATX", "SFX", "TFX"],
  "ATX Desktop": ["ATX"],
  "Mini ITX Test Bench": ["Mini ITX", "SFX"],
  "MicroATX Slim": ["SFX", "TFX", "Flex ATX"],
  "ATX Test Bench": ["ATX", "SFX", "Mini ITX"],
};

export function hasAllNecessaryParts(
  components: ComponentsType,
  messages: CompatibilityMessage[]
) {
  const necessaryParts = [
    "cpus",
    "gpus",
    "memories",
    "cpu-coolers",
    "hard-drives",
    "cases",
    "motherboards",
    "power-supplies",
  ];

  let missingParts = [];
  for (const part of necessaryParts) {
    if (!components[part]) {
      missingParts.push(part);
    }
  }

  // check if the CPU has integrated graphics
  // in this case a GPU is not necessary
  if (
    missingParts.includes("gpus") &&
    !missingParts.includes("cpus") &&
    components.cpus.graphics
  ) {
    missingParts = missingParts.filter((part) => part !== "gpus");
  }

  // check if the case includes a power supply
  // in this case a power supply is not necessary
  if (
    missingParts.includes("power-supplies") &&
    !missingParts.includes("cases") &&
    components.cases.psu
  ) {
    missingParts = missingParts.filter((part) => part !== "power-supplies");
  }

  if (missingParts.length) {
    messages.push({
      message: `Missing parts: ${missingParts
        .map((part) => partLabels[part as PartType])
        .join(", ")}`,
      severity: "error",
    });
    return;
  }
}

export function checkCpuMotherboardCompatibility(
  components: ComponentsType,
  messages: CompatibilityMessage[]
) {
  if (
    !components.cpus ||
    !components.motherboards ||
    components.cpus.socket === components.motherboards.socket
  ) {
    return;
  }

  // for motherboards that support multiple sockets
  if (components.motherboards.socket.includes("/")) {
    const sockets = components.motherboards.socket.split("/");
    if (sockets.includes(components.cpus.socket)) {
      return;
    }
  }

  messages.push({
    message: `The selected CPU (${components.cpus.name}) is not compatible with the selected motherboard (${components.motherboards.name}). Choose a motherboard with an ${components.cpus.socket} socket.`,
    severity: "error",
  });
}

export function checkMotherboardMemoryCompatibility(
  components: ComponentsType,
  messages: CompatibilityMessage[]
) {
  if (!components.memories || !components.motherboards) {
    return;
  }

  // check if the speed is supported
  const supportedRamSpeed =
    socketRamSpeeds[
      components.motherboards.socket as keyof typeof socketRamSpeeds
    ];
  const ramSpeed = components.memories[0].speed[0];
  if (!supportedRamSpeed || !ramSpeed) {
    return;
  }

  if (supportedRamSpeed !== ramSpeed) {
    messages.push({
      message: `The selected motherboard (${components.motherboards.name}) does not support DDR${ramSpeed} memory. Choose DDR${supportedRamSpeed} memory.`,
      severity: "error",
    });
  }

  // check if the amount of modules is supported, the amount of memory is supported
  let modules = 0;
  let totalRam = 0;
  for (const memory of components.memories) {
    modules += memory.modules[0];
    totalRam += memory.modules[0] * memory.modules[1];
  }

  if (modules > components.motherboards.memory_slots) {
    messages.push({
      message: `The selected motherboard (${components.motherboards.name}) does not have enough memory slots to support ${modules} memory modules. Choose a motherboard with more memory slots or remove some memory.`,
      severity: "error",
    });
  }

  if (totalRam > components.motherboards.max_memory) {
    messages.push({
      message: `The selected motherboard (${components.motherboards.name}) supports only ${components.motherboards.max_memory} GB of memory. Choose a motherboard that supports at least ${totalRam} GB of memory or remove some memory.`,
      severity: "error",
    });
  }
}

export function checkMemoryCompatibility(
  components: ComponentsType,
  messages: CompatibilityMessage[]
) {
  if (!components.memories) {
    return;
  }

  let type = components.memories[0].speed[0];
  let speed = components.memories[0].speed[1];
  let minSpeed = components.memories[0].speed[1];
  let errors = {} as any;
  let modules = components.memories[0].modules[0];
  for (let i = 1; i < components.memories.length; i++) {
    if (components.memories[i].speed[0] !== type) {
      errors["type"] = components.memories[i].speed[0];
    }

    if (components.memories[i].speed[1] !== speed) {
      errors["speed"] = components.memories[i].speed[1];
      minSpeed = Math.min(minSpeed, components.memories[i].speed[1]);
    }

    modules += components.memories[i].modules[0];
  }

  if (errors["type"]) {
    messages.push({
      message: `You have selected both DDR${errors["type"]} and DDR${type} memory. Choose only one type of memory.`,
      severity: "error",
    });
  }

  if (errors["speed"]) {
    messages.push({
      message: `You have selected memory with different speeds. Consider choosing memory with the same speed, or they will run at the speed of the slowest module (${minSpeed} MHz).`,
      severity: "warn",
    });
  }

  if (modules === 1) {
    messages.push({
      message: `You have selected ${modules} memory module. Consider choosing at least two memory modules for dual-channel memory.`,
      severity: "warn",
    });
  }
}

export function checkCaseMotherboardCompatibility(
  components: ComponentsType,
  messages: CompatibilityMessage[]
) {
  if (!components.cases || !components.motherboards) {
    return;
  }

  if (
    !caseMotherboardCompatibility[
      components.cases.type as keyof typeof caseMotherboardCompatibility
    ].includes(components.motherboards.form_factor)
  ) {
    messages.push({
      message: `The selected motherboard (${components.motherboards.name}) is not compatible with the selected case (${components.cases.name}). Choose a case that supports ${components.motherboards.form_factor} motherboards.`,
      severity: "error",
    });
  }
}

export function checkCasePowerSupplyCompatibility(
  components: ComponentsType,
  messages: CompatibilityMessage[]
) {
  if (!components.cases || !components["power-supplies"]) {
    return;
  }

  if (
    !casePowerSupplyCompatibility[
      components.cases.type as keyof typeof casePowerSupplyCompatibility
    ].includes(components["power-supplies"].type)
  ) {
    messages.push({
      message: `The selected power supply (${components["power-supplies"].name}) is not compatible with the selected case (${components.cases.name}). Choose a case that supports ${components["power-supplies"].type} power supplies.`,
      severity: "error",
    });
  }
}

export function checkCaseStorageCompatibility(
  components: ComponentsType,
  messages: CompatibilityMessage[]
) {
  if (!components.cases || !components["hard-drives"]) {
    return;
  }

  // check if there are enough drive bays
  let driveBays = 0;
  let hasM2 = false;
  for (const drive of components["hard-drives"]) {
    if (drive.form_factor == 2.5 || drive.form_factor == 3.5) {
      driveBays++;
    } else if (drive.form_factor !== "PCIe") {
      hasM2 = true;
    }
  }

  if (driveBays > components.cases.internal_35_bays) {
    messages.push({
      message: `The selected case (${components.cases.name}) does not have enough drive bays to support ${driveBays} drives. Choose a case with more drive bays or remove some drives.`,
      severity: "error",
    });
  }

  if (hasM2) {
    messages.push({
      message: `You have selected M.2 drives. Make sure your motherboard has enough M.2 slots.`,
      severity: "warn",
    });
  }
}

export function checkBottleneck(
  components: ComponentsType,
  messages: CompatibilityMessage[]
) {
  if (
    !components.cpus ||
    !components.gpus ||
    components.cpus.benchmark <= 0 ||
    components.gpus.benchmark <= 0
  ) {
    return;
  }

  const performanceRatio =
    components.gpus.benchmark / components.cpus.benchmark;
  const threshold = 0.5;

  if (performanceRatio > 1 + threshold) {
    messages.push({
      message: `The selected CPU (${components.cpus.name}) may be too weak for the selected GPU (${components.gpus.name}). Consider choosing a more powerful CPU.`,
      severity: "warn",
    });
  }

  if (performanceRatio < 1 - threshold) {
    messages.push({
      message: `The selected GPU (${components.gpus.name}) may be too weak for the selected CPU (${components.cpus.name}). Consider choosing a more powerful GPU.`,
      severity: "warn",
    });
  }
}
