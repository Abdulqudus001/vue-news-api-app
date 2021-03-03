<template>
  <section>
    <app-navbar></app-navbar>
    <main>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <News
          v-for="article in articles"
          :key="article.url"
          :image="article.urlToImage"
          :title="article.title"
          :category="selectedCategory"
          :link="article.url"
          :description="article.description"
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
};
</script>

<style>

</style>
