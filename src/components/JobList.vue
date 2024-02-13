<template>
  <div>
    <h1>{{ date }}</h1>
    <div v-for="job in props.list">
      <span>{{ job }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const date = ref("");

export interface JobListProps {
  list: Array<string>
}

const props = defineProps<JobListProps>();

onMounted(() => {
  const now = new Date();
  date.value = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
})

</script>