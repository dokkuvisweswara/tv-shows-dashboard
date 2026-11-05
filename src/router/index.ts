import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import ShowDetailsView from '../views/ShowDetailsView.vue'
export const router = createRouter({ history: createWebHistory(), routes: [
  { path: '/', name: 'home', component: HomeView },
  { path: '/search', name: 'search', component: SearchView },
  { path: '/shows/:id', name: 'show-details', component: ShowDetailsView, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' }
], scrollBehavior: () => ({ top: 0 }) })
