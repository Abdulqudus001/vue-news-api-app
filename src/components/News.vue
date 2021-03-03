<template>
  <a
    :href="link"
    class="news relative w-full block overflow-hidden min-h-400"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img :src="image || 'https://source.unsplash.com/random/500x500'" alt="" class="news__img absolute">
    <div class="news__body absolute z-1 p-3 bottom-0 text-white">
      <span class="news__category bg-red-600 py-1 px-3 my-3 inline-block rounded-2xl capitalize text-sm">
        {{ category }}
      </span>
      <h3 class="news__headline text-lg my-2 font-semibold">{{ title }}</h3>
      <p
        v-if="description"
        class="font-semibold text-sm"
      >{{ description }}</p>
    </div>
    <button
      v-if="isSaved === false"
      title="Read later"
      class="news__button bg-red-600 absolute top-1 right-1 z-1 rounded-full text-white text-2xl font-bold"
      @click.prevent="$emit('save')"
    >
      +
    </button>
  </a>
</template>

<script>
export default {
  props: {
    category: {
      type: String,
      default: 'Category',
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: 'https://google.com',
    },
    title: {
      type: String,
      default: 'FIFA favours Patrice Motsepe for CAF presidency',
    },
  },
};
</script>

<style lang="scss" scoped>
.news {
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000, $alpha: 0.5);
    position: absolute;
    top: 0;
  }

  &:hover img {
    transform: scale(1.1);
  }

  &__img {
    transition: transform .2s ease-in;
    min-width: 100%;
    min-height: 100%;
    max-width: unset;
  }

  &__button {
    width: 30px;
    height: 30px;
  }
}
</style>
