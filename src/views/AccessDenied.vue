<template>
  <div class="bg-page d-flex justify-content-center align-items-center">
    <div class="container page-403 d-flex flex-column justify-content-center align-items-center ">
      <img class="w-100" src="../assets/images/403-access-denied.png" alt="403-image">
      <div class="d-flex flex-column gap-md-4 gap-2">
        <p class="title-warning mb-0">Không có quyền truy cập</p>
        <button class="main-btn btn-back" @click="router.push({ name: 'Dashboard' })">Quay lại trang chủ</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

</script>

<style scoped>
.bg-page {
  background-color: #ffffff;
  height: 100%;
}

.page-403 {
  overflow: hidden;
  margin-bottom: 96px;
}

.page-403 img {
  height: 400px;
  object-fit: contain;
  position: relative;
  left: 24px;
}

.title-warning {
  font-size: 40px;
  color: rgb(var(--v-theme-text-info));
}

.btn-back {
  background-color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}

@media screen and (max-width : 1024px) {
  .title-warning {
    font-size: 24px;
  }

  .page-403 img {
    height: 300px;
  }
}
</style>