<template>
  <section>
    <app-navbar></app-navbar>
    <main class="home container mx-auto py-11">
      <p class="mb-3">
        <span class="font-medium">Location: </span>
        <span>{{ userLocation }}</span>
      </p>
      <news-loader v-if="loading" />
      <template v-else>
        <button
          v-for="category in categories"
          :key="category"
          class="bg-red-500 py-1 px-3 my-3 inline-block rounded-2xl capitalize text-sm text-white mr-2"
          :class="category === selectedCategory ? 'bg-red-700': null"
          @click="changeCategory(category)"
        >
          {{ category }}
        </button>
        <p class="text-md font-medium my-2">Showing articles for {{ selectedCategory }}</p>
        <form @submit.prevent="search" class="relative w-500 max-w-full my-3">
          <input
            v-model="searchText"
            type="search"
            name="search"
            id="search"
            class="search rounded-3xl h-10 border-gray-400 border px-2 w-full focus:outline-none focus:border-gray-600"
            :placeholder="`Search articles in ${selectedCategory}`"
          >
          <button class="bg-red-500 h-10 text-white font-bold text-sm rounded-r-3xl min-w-70 absolute top-0 right-0">
            Search
          </button>
        </form>
        <template v-if="articles.length > 0">
          <p v-if="searched" class="text-md font-medium my-2">
            Showing search results for {{ searchText }} articles in the {{ selectedCategory }} category
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <News
              v-for="article in articles"
              :key="article.url"
              :image="article.urlToImage"
              :title="article.title"
              :category="selectedCategory"
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
  },
  data: () => ({
    articles: [],
    categories: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
    currentPage: 1,
    loading: false,
    locationKeyword: 'Nigeria',
    locationShortcode: 'ng',
    pageSize: 5,
    searchText: '',
    searched: false,
    selectedCategory: 'business',
    totalLength: 0,
    userLocation: 'Somewhere in Nigeria',
  }),
  mounted() {
    // Load map API key
    const previousScript = document.querySelector('#maps-api');
    if (!previousScript) {
      const script = document.createElement('script');
      script.id = 'maps-api';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_MAP_KEY}&callback=initMap`;
      script.async = true;
      document.head.appendChild(script);
    } else {
      this.getUserLocation();
    }
    window.initMap = () => {
      this.getUserLocation();
    };
  },
  methods: {
    encode(url) {
      return btoa(url);
    },
    getUserLocation() {
      if (navigator.geolocation) {
        console.log('object');
        const vue = this;
        navigator.geolocation.getCurrentPosition(vue.reverseGeocode, vue.handleError);
      } else {
        this.fetchNews();
      }
    },
    handleError(err) {
      console.log(err);
      this.$toast.error('News would not be displayed for your location');
      this.fetchNews();
    },
    reverseGeocode({ coords: { latitude, longitude } }) {
      const goecoder = new window.google.maps.Geocoder();
      const latlng = {
        lat: latitude,
        lng: longitude,
      };
      goecoder.geocode({ location: latlng }, (res, status) => {
        if (status === 'OK') {
          console.log(res);
          const [address] = res;
          this.userLocation = address.formatted_address;
          const lastAddressComponent = address.address_components[address.address_components.length - 1];
          this.locationShortcode = lastAddressComponent.short_name.toLowerCase();
          this.locationKeyword = lastAddressComponent.long_name;
          this.fetchNews();
        }
      });
    },
    changeCategory(category) {
      this.selectedCategory = category;
      this.fetchNews();
    },
    fetchNews() {
      this.searched = false;
      this.searchText = '';
      this.loading = true;
      const url = `https://newsapi.org/v2/top-headlines?q=${this.locationKeyword}&country=${this.locationShortcode}&pageSize=${this.pageSize}&category=${this.selectedCategory}&page=${this.currentPage}`;
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
    search() {
      this.loading = true;
      const url = `https://newsapi.org/v2/everything?q=${this.searchText} AND ${this.selectedCategory}&pageSize=${this.pageSize}&page=${this.currentPage}`;
      this.$axios.get(url).then(({ data }) => {
        console.log(data);
        this.searched = true;
        this.loading = false;
        this.articles = data.articles;
        this.totalLength = data.totalResults;
      }).catch((err) => {
        this.loading = false;
        this.handleFetchError(err);
      });
    },
    paginationChange() {
      if (this.searched) {
        this.search();
      } else {
        this.fetchNews();
      }
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
  },
};
</script>

<style lang="scss" scoped>
.search {
  &::placeholder {
    font-size: .9rem;
  }
}

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
</style>
