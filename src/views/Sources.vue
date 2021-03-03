<template>
  <section>
    <app-navbar></app-navbar>
    <main class="container mx-auto py-11">
      <news-loader v-if="loading" />
      <template v-else>
        <p
          v-if="selectedSources && selectedSources.length > 0"
          class="text-md font-medium my-2"
        >Showing articles for {{ selectedSourcesName }}</p>
        <template v-if="sources.length > 0">
          <multiselect
            :multiple="true"
            v-model="selectedSources"
            label="name"
            placeholder="Select sources"
            :options="sources"
            @input="fetchNews"
            class="custom-select mt-2 mb-3"
          />
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <News
              v-for="article in articles"
              :key="article.url"
              :image="article.urlToImage"
              :title="article.title"
              :link="article.url"
              :description="article.description"
              :is-saved="doesNewsExistInLS(encode(article.url))"
              @save="saveNews(article)"
            />
          </div>
          <pagination
            v-model="currentPage"
            :records="totalLength"
            :per-page="pageSize"
            @paginate="paginationChange"
            class="pagination"
          />
        </template>
        <template v-else>
          <div class="text-center text-4xl text-gray-400">
            No article available
          </div>
        </template>
      </template>
    </main>
  </section>
</template>

<script>
import Pagination from 'vue-pagination-2';
import Multiselect from 'vue-multiselect';
import News from '@/components/News.vue';
import AppNavbar from '@/components/AppNavbar.vue';
import NewsLoader from '@/components/skeleton/News.vue';

export default {
  name: 'Home',
  components: {
    AppNavbar,
    Pagination,
    News,
    NewsLoader,
    Multiselect,
  },
  data: () => ({
    articles: [],
    currentPage: 1,
    loading: false,
    pageSize: 5,
    totalLength: 0,
    selectedSources: null,
    sources: [],
  }),
  computed: {
    selectedSourcesName() {
      if (this.selectedSources.length > 0) {
        return this.selectedSources.map((el) => el.name).join(', ');
      }

      return '';
    },
    selectedSourcesId() {
      if (this.selectedSources.length > 0) {
        return this.selectedSources.map((el) => el.id).join(', ');
      }

      return '';
    },
  },
  mounted() {
    this.fetchSources();
  },
  methods: {
    encode(url) {
      return btoa(url);
    },
    fetchSources() {
      this.loading = true;
      this.$axios.get('https://newsapi.org/v2/sources').then(({ data }) => {
        console.log(data);
        this.sources = data.sources;
        this.selectedSources = [this.sources[0]];
        this.fetchNews();
      }).catch((err) => {
        this.handleFetchError(err);
      });
    },
    fetchNews() {
      this.searched = false;
      this.searchText = '';
      this.loading = true;
      const url = `https://newsapi.org/v2/everything?sources=${this.selectedSourcesId}&pageSize=${this.pageSize}&page=${this.currentPage}`;
      this.$axios.get(url).then(({ data }) => {
        this.loading = false;
        this.articles = data.articles;
        this.totalLength = data.totalResults;
        console.log(data);
      }).catch((err) => {
        this.handleFetchError(err);
      });
    },
    handleFetchError(err) {
      let message = 'Something went wrong';
      this.loading = false;
      if (err.response.data.message) {
        message = err.response.data.message;
      }
      this.$toast.error(message);
    },
    doesNewsExistInLS(id) {
      let lsArticles = localStorage.getItem('yv-news');
      if (!lsArticles) {
        return false;
      }
      lsArticles = JSON.parse(lsArticles);
      const articleIndex = lsArticles.findIndex((el) => el.id === id);
      return articleIndex > -1;
    },
    saveNews(article) {
      const lsData = {
        category: this.selectedCategory,
        id: btoa(article.url),
        ...article,
      };
      if (this.doesNewsExistInLS(lsData.id) === false) {
        const lsArticles = JSON.parse(localStorage.getItem('yv-news')) || [];
        lsArticles.push(lsData);
        localStorage.setItem('yv-news', JSON.stringify(lsArticles));
      }
    },
    paginationChange() {
      this.fetchNews();
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss" scoped>
.pagination::v-deep {
  .VuePagination__count {
    text-align: center;
  }

  .VuePagination__pagination {
    display: flex;
    justify-content: center;

    &-item {
      margin: 10px 0;
      border: 1px solid #ccc;
      padding: 5px 15px;
      color: #dc2626;
      background-color: #fff;
      transition: background-color .1s ease;
      &:hover {
        color: #fff;
        background-color: #dc2626;
      }

      &.active {
        color: #fff;
        background-color: #dc2626;
      }
    }
  }
}

.custom-select {
  max-width: 400px;
}
</style>
