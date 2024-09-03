<template>
  <template v-if="part.multiple">
    <!-- <tr v-for="p in selected[part.type]" class=""> -->
    <td class="px-1 py-2 md:p-3 w-1/12">
      <Parts :type="part.type">
        <div class="text-xs md:text-base">
          {{ part.label }}
        </div>
      </Parts>
    </td>
    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-white text-center"
    >
      <div v-for="p in selected[part.type]" class="my-8">
        {{ p.name || "" }}
      </div>
    </td>

    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-white text-center"
    >
      <div v-for="p in selected[part.type]" class="my-8">
        {{ p.price ? p.price.toFixed(2) + " $" : "N/A" }}
      </div>
    </td>
    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-center"
    ></td>
    <td class="text-right">
      <div v-for="p in selected[part.type]" class="my-8">
        <Delete :type="part.type" @delete="handleDelete(part.type, p)" />
      </div>
    </td>
    <!-- </tr> -->
  </template>
  <template v-else>
    <td class="px-1 py-2 md:p-3 w-1/12">
      <Parts :type="part.type">
        <div class="text-xs md:text-base">
          {{ part.label }}
        </div>
      </Parts>
    </td>
    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-white text-center"
    >
      {{ selected[part.type]?.name || "" }}
    </td>

    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-white text-center"
    >
      {{
        selected[part.type]?.price
          ? selected[part.type]?.price.toFixed(2) + " $"
          : selected[part.type]
            ? "N/A"
            : ""
      }}
    </td>
    <td
      class="px-1 py-2 md:p-3 max-w-2 md:max-w-none text-xs md:text-base text-center"
    ></td>
    <td class="text-right">
      <Delete
        v-if="selected[part.type]"
        :type="part.type"
        @delete="handleDelete"
      />
    </td>
  </template>
</template>

<script setup lang="ts">
import Parts from "../components/Parts.vue";
import Delete from "../components/DeleteButton.vue";
import { PartListItem } from "../types/partListItem";
import { onMounted, ref } from "vue";

type Props = {
  part: PartListItem;
};

defineProps<Props>();

const selected = ref<{
  [key: string]: any;
}>({});

const emit = defineEmits(["delete-part"]);

function removeItem(type: any) {
  const currentItems = JSON.parse(
    localStorage.getItem("selectedComponents") || "{}"
  );
  const newItems = { ...currentItems };
  delete newItems[type];
  localStorage.setItem("selectedComponents", JSON.stringify(newItems));
  selected.value = newItems;
}

const handleDelete = (type: string, part?: any) => {
  selected.value = JSON.parse(
    localStorage.getItem("selectedComponents") || "{}"
  );
  if (part) {
    const index = selected.value[type].findIndex(
      (p: any) => p._id === part._id
    );
    if (index !== -1) {
      selected.value[type].splice(index, 1);
    }
  } else {
    removeItem(type);
  }
  localStorage.setItem("selectedComponents", JSON.stringify(selected.value));
  emit("delete-part", selected.value);
};

onMounted(() => {
  const storedData = localStorage.getItem("selectedComponents");
  if (storedData) {
    selected.value = JSON.parse(storedData);
  }
});
</script>
