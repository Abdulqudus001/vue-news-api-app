<template>
  <main class="home container mx-auto">
    <news-loader v-if="loading" />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <News
        v-for="article in articles"
        :key="article.url"
        :image="article.urlToImage"
        :title="article.title"
        :category="category"
        :link="article.url"
      />
    </div>
  </main>
</template>

<script>
import News from '@/components/News.vue';
import NewsLoader from '@/components/skeleton/News.vue';

export default {
  name: 'Home',
  components: {
    News,
    NewsLoader,
  },
  data: () => ({
    loading: false,
    articles: [],
    totalLength: 0,
    pageSize: 5,
    category: 'general',
  }),
  mounted() {
    this.fetchNews();
  },
  methods: {
    fetchNews() {
      this.loading = true;
      const url = `https://newsapi.org/v2/top-headlines?country=ng&pageSize=${this.pageSize}&category=${this.category}`;
      this.$axios.get(url).then(({ data }) => {
        this.loading = false;
        this.articles = data.articles;
        this.totalLength = data.totalResults;
        console.log(data);
      }).catch((err) => {
        let message = 'Something went wrong';
        this.loading = false;
        if (err.response.data.message) {
          message = err.response.data.message;
        }
        this.$toast.error(message);
      });
    },
  },
};
</script>
