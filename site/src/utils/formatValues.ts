export const formatValue = (value: any, key: string, type: string) => {
  const formatArrayValue = (suffix: string) => {
    if (!value.length) {
      return "N/A";
    } else if (value.length === 1) {
      return `${value[0]} ${suffix}`;
    } else {
      return `${value[0]} - ${value[1]} ${suffix}`;
    }
  };

  if (!value) {
    return "N/A";
  }

  if (key === "tdp" || key === "psu" || key === "wattage") {
    return `${value} W`;
  }

  if (key === "smt" || key === "pwm") {
    return value ? "Yes" : "No";
  }

  if (key === "boost_clock" || key === "core_clock") {
    return `${value} ${type === "cpus" ? "GHz" : "MHz"}`;
  }

  if (key === "rpm") {
    return formatArrayValue("RPM");
  }

  if (key === "noise_level") {
    return formatArrayValue("dB");
  }

  if (key === "size" || key === "length") {
    return `${value} mm`;
  }

  if (key === "memory" || key === "capacity" || key === "max_memory") {
    return `${value} GB`;
  }

  if (key === "external_volume") {
    return `${value} L`;
  }

  if (key === "airflow") {
    return formatArrayValue("CFM");
  }

  if (key === "cache") {
    return `${value} MB`;
  }

  if (key === "speed") {
    if (!value.length || value.length !== 2) {
      return "N/A";
    } else {
      return `DDR${value[0]} ${value[1]} MHz`;
    }
  }

  if (key === "modules") {
    if (!value.length || value.length !== 2) {
      return "N/A";
    } else {
      return `${value[0]} x ${value[1]} GB`;
    }
  }

  if (key === "first_word_latency") {
    return `${value} ns`;
  }

  return value;
};

export const formatKey = (key: string) => {
  const aliases: { [key: string]: string } = {
    price_data: "price",
    tdp: "TDP",
    smt: "SMT",
    rpm: "RPM",
    psu: "PSU",
    internal_35_bays: "internal 3.5 bays",
    pwm: "PWM",
  };

  if (aliases[key]) {
    key = aliases[key];
  }
  return key.replace(/_/g, " ");
};
