<template>
  <section>
    <app-navbar></app-navbar>
    <main class="saved container mx-auto py-11">
      <h1 class="font-bold text-2xl my-4">Saved News</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <News
          v-for="article in articles.slice(sliceStart, sliceEnd)"
          :key="article.url"
          :image="article.urlToImage"
          :title="article.title"
          :category="article.category"
          :link="article.url"
          :description="article.description"
          :is-saved="true"
        />
      </div>
      <pagination
        v-model="currentPage"
        :records="totalLength"
        :per-page="pageSize"
        @paginate="paginationChange"
        class="pagination"
      />
    </main>
  </section>
</template>

<script>
import Pagination from 'vue-pagination-2';
import News from '@/components/News.vue';
import AppNavbar from '@/components/AppNavbar.vue';

export default {
  name: 'Saved',
  components: {
    AppNavbar,
    Pagination,
    News,
  },
  data: () => ({
    sliceStart: 0,
    sliceEnd: 5,
    currentPage: 1,
    pageSize: 5,
  }),
  computed: {
    articles() {
      const lsData = localStorage.getItem('yv-news');
      if (lsData) {
        return JSON.parse(lsData);
      }
      return [];
    },
    totalLength() {
      return this.articles.length;
    },
  },
  methods: {
    paginationChange() {
      this.sliceStart = this.pageSize * (this.currentPage - 1);
      this.sliceEnd = this.currentPage * this.pageSize;
    },
  },
};
</script>

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
</style>
