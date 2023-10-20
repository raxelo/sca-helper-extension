<script setup lang="ts">
export interface Props {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button class="p-0 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2" :class="[modelValue ? 'bg-pink-400' : 'bg-stone-400']" @click="toggle">
    <span class="sr-only">Use setting</span>
    <span aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="[modelValue ? 'translate-x-5' : 'translate-x-0']" />
  </button>
</template>
