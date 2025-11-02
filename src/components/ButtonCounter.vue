<script setup>
import { ref } from 'vue'

defineProps(['ini'])
const count = ref(0)
function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">{{ count }}{{ ini ?? 'dx' }}</button>
</template>

<style scoped></style>
