import { ComponentsType } from "./componentsType";

type Build = {
  build: ComponentsType;
  price: {
    price: number;
    isPriceForAllParts: boolean;
  };
  type: "recommended" | "minimum";
};
