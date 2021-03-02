<template>
  <main class="home container mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <News />
      <News />
      <News />
    </div>
  </main>
</template>

<script>
import News from '@/components/News.vue';

export default {
  name: 'Home',
  components: {
    News,
  },
  mounted() {
    this.fetchNews();
  },
  methods: {
    fetchNews() {
      this.$axios.get('https://newsapi.org/v2/top-headlines?country=ng').then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
    },
  },
};
</script>
