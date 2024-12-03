<template>
  <v-container>
    <div class="d-flex">
      <h3>{{ formData?.name }}</h3>
    </div>
    <v-card class="mt-4">
      <v-card-item>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>
            Danh sách thiết bị
          </v-card-title>
        </div>
      </v-card-item>
      <v-card-item>
        <v-data-table-server
          hover
          :items-per-page="dataTable.itemsPerPage"
          :headers="dataTable.headers"
          :items="dataTable.items"
          :items-length="dataTable.totalItems"
          :loading="dataTable.loading"
          v-model:page="dataTable.pageIndex"
          show-current-page
          loading-text="Đang tra cứu"
          no-data-text="Không có dữ liệu"
          items-per-page-text="Số lượng / trang"
          @update:options="getData"
          @update:items-per-page="(items) => dataTable.itemsPerPage = items"
        >
          <template v-slot:item.index="{ index }">
            {{ index+=1 }}
          </template>
          <template v-slot:item.equipmentType="{ item }">
            {{ item.type?.name }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-switch
              :model-value="!!item.status"
              color="success"
              hide-details
              readonly
            ></v-switch>
          </template>
        </v-data-table-server>
      </v-card-item>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, ref, reactive } from "vue";
import { useStorageStore, useEquipmentStore, useAuthStore } from "@/stores";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

const storageStore = useStorageStore();
const equipmentStore = useEquipmentStore();
const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();
const formData = ref({});

const storageId = computed(() => route.params.id)

const dataTable = reactive({
  itemsPerPage: 25,
  loading: false,
  totalItems: 0,
  headers: [
    {title: "#", key: "index", align: "center", sortable: false},
    {title: "Mã thiết bị", key: "code", align: "center", sortable: true},
    {title: "Loại thiết bị", key: "equipmentType", align: "center", sortable: true},
    {title: "Trạng thái", key: "status", align: "center", sortable: false},
  ],
  items: [],
  pageIndex: 1,
})

async function getData({ page, itemsPerPage, sortBy }) {
  dataTable.loading = true;
  try {
    const key = sortBy?.[0]?.key || null;
    const orderBy = sortBy?.[0]?.order || null;
    const response = await equipmentStore.searchInStorage(
      storageId.value, page, itemsPerPage, key, orderBy
    );
    dataTable.items = response.content;
    dataTable.totalItems = dataTable.items.length;
  } catch (e) {
    console.error(e);
  } finally {
    dataTable.loading = false;
  }
}

async function loadFormData() {
  formData.value = await storageStore.getById(storageId.value);
}
loadFormData();
</script>

<style scoped>
::v-deep(.v-selection-control.v-selection-control--density-default) {
  justify-content: center;
}
</style>