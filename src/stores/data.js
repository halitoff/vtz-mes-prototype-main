import { faker } from "@faker-js/faker/locale/ru";
import _ from "lodash";
import { DateTime } from "luxon";
import { defineStore } from "pinia";

export const useDataStore = defineStore("data", () => {
  function createFakeWarehouseItem(_type) {
    const MAX_COUNT = 100;

    const TYPES = [
      { type: "assembly", prefix: "Узел" },
      { type: "part", prefix: "Деталь" },
      { type: "material", prefix: "Материал" },
    ];

    const UNITS = ["шт", "кг", "л", "м3"];

    const randomType = _type
      ? TYPES.find((el) => el.type === _type)
      : _.sample(TYPES);

    const name = `${randomType.prefix}_${faker.word.adjective()}`;
    const type = randomType.type;
    const count = _.random(1, MAX_COUNT);
    const countLabel =
      count + " " + (randomType.type === "material" ? _.sample(UNITS) : "шт");

    const now = DateTime.now();
    let sinceAt = now.minus({ days: _.random(600) });
    const daysPassed = now.diff(sinceAt).as("days");

    sinceAt = sinceAt.toFormat("dd.MM.yyyy");

    return {
      name,
      type,
      count,
      countLabel,
      sinceAt,
      daysPassed,
    };
  }

  function createFakeWorkshop() {
    const name = `Цех_${faker.word.adjective()}`;
  
    const workload = _.random(0, 1, true);
    const workloadLabel = Math.floor(workload * 100) + "%";
  
    return {
      name,
      workload,
      workloadLabel,
    };
  }

  return {
    createFakeWarehouseItem,
    createFakeWorkshop,
  };
});
