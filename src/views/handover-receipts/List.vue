<template>
  <div>
    <v-expansion-panels v-model="expansionPanel">
      <v-expansion-panel>
        <v-expansion-panel-title static>
          <span class="font-weight-medium text-h6">Phiếu bàn giao thiết bị</span>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form @submit.prevent="handleSearch" ref="formSearchRef">
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field label="Mã thiết bị" density="compact" v-model="formSearch.code" clearable />
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field label="Người tạo" density="compact" v-model="formSearch.createdBy" clearable />
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-select v-model="formSearch.status" :items="statusItems" label="Trạng thái" density="compact" clearable></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-menu v-model="openHandoverDate" offset-y :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" density="compact" :modelValue="handoverDateFormat"
                      append-inner-icon="mdi-calendar-month" label="Ngày bàn giao" clearable readonly
                      @click:clear="formSearch.handoverDate = null"></v-text-field>
                  </template>
                  <v-date-picker v-model="formSearch.handoverDate" no-title show-adjacent-months color="primary"
                    hide-weekdays hide-header @update:modelValue="openHandoverDate = false">
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-menu v-model="openCreatedDate" offset-y :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" density="compact" :modelValue="createdDateFormat"
                      append-inner-icon="mdi-calendar-month" label="Ngày tạo" clearable readonly
                      @click:clear="formSearch.createdAt = null"></v-text-field>
                  </template>
                  <v-date-picker v-model="formSearch.createdAt" no-title show-adjacent-months color="primary"
                    hide-weekdays hide-header @update:modelValue="openCreatedDate = false">
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-btn class="mb-2 mt-1" type="submit">Tìm kiếm</v-btn>
            </v-row>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card class="mt-4">
      <v-card-item>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>
            Danh sách phiếu bàn giao
          </v-card-title>
          <v-btn append-icon="mdi-plus" :to="{name: 'CreateHandoverReceipt'}">
            Tạo phiếu
          </v-btn>
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
          <template v-slot:item.createdBy="{ item }">
            {{ item.createdBy.username }}
          </template>
          <template v-slot:item.approvedBy="{ item }">
            {{ item.approvedBy?.username }}
          </template>
          <template v-slot:item.handoverDate="{ item }">
            {{ formatDate(new Date(item.handoverDate)) }}
          </template>
          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(new Date(item.createdAt)) }}
          </template>
          <template v-slot:item.approvedAt="{ item }">
            {{ formatDate(item.approvedAt ? new Date(item.approvedAt) : null) }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip v-if="item.status == '0'" color="primary">
              {{ statusItems[0].title }}
            </v-chip>
            <v-chip v-if="item.status == '1'" color="success">
              {{ statusItems[1].title }}
            </v-chip>
            <v-chip v-if="item.status == '2'" color="error">
              {{ statusItems[2].title }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center ga-2">
              <!-- <v-btn v-if="item.status == 0" size="x-small" icon color="info" :to="{ name: 'UpdateHandoverReceipt', params: { id: item.id } }">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn> -->
              <v-btn v-if="canDelete(item)" size="x-small" icon color="error" @click="handleDelete(item)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
              <v-btn size="x-small" icon :to="{name: 'DetailHandoverReceipt', params: {id: item.id}}">
                <v-icon>mdi-eye-outline</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table-server>

        <template>
          <v-row justify="center">
            <v-dialog v-model="deleteDialog" persistent width="800">
              <v-card>
                <v-toolbar color="error" title="Xóa phiếu bàn giao"></v-toolbar>
                <v-card-text>
                  <p>Bạn có chắc chắn muốn xóa phiếu "<b> {{ deleteDialogData.name }}</b>"?
                  </p>
                </v-card-text>
                <v-card-actions class="mb-2">
                  <v-spacer></v-spacer>
                  <v-btn variant="elevated" color="grey-200" @click="deleteDialog = false">
                    Hủy bỏ
                  </v-btn>
                  <v-btn variant="elevated" color="error" @click="deleteData(deleteDialogData.id)">
                    Xóa
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>
      </v-card-item>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useHandoverReceiptStore, useAuthStore } from "@/stores";
import { formatDate } from "@/utils";
import { useToast } from "vue-toastification";

const expansionPanel = ref([0]);
const formSearchRef = ref(null);
const handoverReceiptStore = useHandoverReceiptStore();
const authStore = useAuthStore();
const toast = useToast();

const statusItems = [
  { title: "Chờ phê duyệt", value: 0 },
  { title: "Phê duyệt", value: 1 },
  { title: "Từ chối", value: 2 },
]

const formSearch = reactive({
  code: "",
  status: null,
  createdBy: "",
  handoverDate: null,
  departmentId: null,
  createdAt: null,
  approvedAt: null,
})
const openHandoverDate = ref(false);
const openCreatedDate = ref(false);
const handoverDateFormat = computed(() => formatDate(formSearch.handoverDate));
const createdDateFormat = computed(() => formatDate(formSearch.createdAt));

const deleteDialog = ref(false);
const deleteDialogData = ref(null);

const dataTable = reactive({
  itemsPerPage: 25,
  loading: false,
  totalItems: 0,
  headers: [
    { title: "#", key: "index", align: "center", sortable: false },
    { title: "Mã phiếu", key: "code", align: "center", sortable: true },
    { title: "Ngày bàn giao", key: "handoverDate", align: "center", sortable: true },
    { title: "Người tạo", key: "createdBy", align: "center", sortable: true },
    { title: "Ngày tạo", key: "createdAt", align: "center", sortable: true },
    { title: "Người phê duyệt", key: "approvedBy", align: "center", sortable: true },
    { title: "Ngày phê duyệt", key: "approvedAt", align: "center", sortable: true },
    { title: "Trạng thái", key: "status", align: "center", sortable: false },
    { title: "", key: "actions", sortable: false },
  ],
  items: [],
  pageIndex: 1,
})

function handleSearch() {
  if (dataTable.pageIndex != 1) {
    dataTable.pageIndex = 1;
  } else {
    getData({
      page: dataTable.pageIndex,
      itemsPerPage: dataTable.itemsPerPage,
      sortBy: []
    })
  }
}

async function getData({ page, itemsPerPage, sortBy }) {
  dataTable.loading = true;
  try {
    const { code, status, handoverDate, departmentId, createdBy, createdAt, approvedAt } = formSearch;
    const key = sortBy[0]?.key || null;
    const orderBy = sortBy[0]?.order || null;
    const response = await handoverReceiptStore.search(
      code, status, handoverDate, departmentId, createdBy, createdAt, approvedAt, page, itemsPerPage, key, orderBy
    );
    console.log(response);

    dataTable.items = response.content;
    dataTable.totalItems = dataTable.items.length;
  } catch (e) {
    console.error(e);
  } finally {
    dataTable.loading = false;
  }
}

function canDelete(item) {
  return item.status == 0 && (authStore.isAdmin() || authStore.isBGH() || authStore.getUsername() == item.createdBy.username)
}

function handleDelete(item) {
  deleteDialogData.value = {
    id: item.id,
    name: item.code
  }
  deleteDialog.value = true;
}

async function deleteData(id) {
  try {
    const response = await handoverReceiptStore.delete(id);
    deleteDialog.value = false;
    handleSearch();
    toast.success("Xóa phiếu thành công")
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
}
</script>

<style scoped>
::v-deep(.v-selection-control.v-selection-control--density-default) {
  justify-content: center;
}
</style>