<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 jus">
    <skeleton-loader
      v-for="i in 3"
      :key="i"
      class="min-h-400 w-full skeleton"
      width="100%"
      height="100%"
    ></skeleton-loader>
  </div>
</template>

<style lang="scss" scoped>
.skeleton::v-deep {
  width: 100%;

  .shape--flat {
    width: 100%;
    background-color: red;
  }
}
</style>
