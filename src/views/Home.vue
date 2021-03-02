<template>
  <main class="home container mx-auto">
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
      <template v-if="articles.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <News
            v-for="article in articles"
            :key="article.url"
            :image="article.urlToImage"
            :title="article.title"
            :category="selectedCategory"
            :link="article.url"
            :description="article.description"
          />
        </div>
      </template>
      <template v-else>
        <div class="text-center text-4xl text-gray-400">
          No article available
        </div>
      </template>
    </template>
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
    selectedCategory: 'business',
    categories: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
    userLocation: 'Somewhere in Nigeria',
    locationShortcode: 'ng',
    locationKeyword: 'Nigeria',
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
      this.loading = true;
      const url = `https://newsapi.org/v2/top-headlines?q=${this.locationKeyword}&country=${this.locationShortcode}&pageSize=${this.pageSize}&category=${this.selectedCategory}`;
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

<style lang="scss" scoped>
.home {
  padding: 40px 0;
}
</style>
