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
          <v-btn append-icon="mdi-plus" @click="addDialog.open = true"
            v-if="authStore.isAdmin() || authStore.isQTTB()"
          >
            Thêm
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
          <template v-slot:item.actions="{ item }" v-if="authStore.isAdmin() || authStore.isQTTB()">
            <div class="d-flex justify-center ga-2">
              <v-btn size="x-small" icon @click="openMoveDialog(item.id, item.code)">
                <v-icon>mdi-database-arrow-left-outline</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-card-item>
    </v-card>
    <v-dialog v-model="addDialog.open" persistent width="800" @after-enter="loadEquipment">
      <v-card :loading="addDialog.loading" :disabled="addDialog.loading">
        <v-form>
          <v-toolbar color="info" title="Thêm thiết bị"></v-toolbar>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>  </th>
                  <th> Mã </th>
                  <th> Loại thiết bị </th>
                  <th> Kho </th>
                  <th> Tình trạng </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in addDialog.data":key="index">
                  <td>
                    <v-checkbox
                      v-model="addDialog.selected"
                      :value="item.id"
                      hide-details
                    ></v-checkbox>
                  </td>
                  <td>{{ item.code }}</td>
                  <td>{{ item.type?.name }}</td>
                  <td>{{ item.storage.name }}</td>
                  <td>
                    <v-switch
                      :model-value="!!item.status"
                      color="success"
                      hide-details
                      readonly
                    ></v-switch>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-spacer></v-spacer>
            <v-btn variant="elevated" color="grey-200" @click="handleClose">
              Hủy bỏ
            </v-btn>
            <v-btn variant="elevated" :disabled="addDialog.selected.length == 0" color="info" @click="handleAdd">
              Thêm
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="moveToStoreDialog.open" persistent width="800" @after-enter="loadStorage">
      <v-card :loading="moveToStoreDialog.loading" :disabled="moveToStoreDialog.loading">
        <v-form @submit.prevent="moveToStorage">
          <v-toolbar color="info" :title="`Chuyển ${moveToStoreDialog.equipmentInfo.code} vào kho`"></v-toolbar>
          <v-card-text>
            <v-select
              v-model="moveToStoreDialog.selected"
              :items="moveToStoreDialog.data"
              label="Kho"
              item-value="id"
              item-title="name"
              clearable
            ></v-select>
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-spacer></v-spacer>
            <v-btn variant="elevated" color="grey-200" @click="moveToStoreDialog.open=false; moveToStoreDialog.selected=null">
              Hủy bỏ
            </v-btn>
            <v-btn variant="elevated" :disabled="!moveToStoreDialog.selected" color="info" type="submit">
              Chuyển
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { computed, ref, reactive } from "vue";
import { useDepartmentStore, useEquipmentStore, useStorageStore, useAuthStore } from "@/stores";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

const departmentStore = useDepartmentStore();
const equipmentStore = useEquipmentStore();
const authStore = useAuthStore();
const toast = useToast();
const route = useRoute();
const statusItems = [
  { title: "Hoạt động", value: 1 },
  { title: "Không hoạt động", value: 0 },
]
const formData = ref({});
const addDialog = reactive({
  loading: false,
  data: [],
  open: false,
  selected: []
});
const moveToStoreDialog = reactive({
  loading: false,
  data: [],
  open: false,
  selected: null,
  equipmentInfo: null
});
const formSearch = reactive({
  typeId: null,
  storageId: null,
  status: null
})

const departmentId = computed(() => route.params.id)

const dataTable = reactive({
  itemsPerPage: 25,
  loading: false,
  totalItems: 0,
  headers: [
    {title: "#", key: "index", align: "center", sortable: false},
    {title: "Mã thiết bị", key: "code", align: "center", sortable: true},
    {title: "Loại thiết bị", key: "equipmentType", align: "center", sortable: true},
    {title: "Trạng thái", key: "status", align: "center", sortable: false},
    {title: "", key: "actions", sortable: false},
  ],
  items: [],
  pageIndex: 1,
})

async function getData({ page, itemsPerPage, sortBy }) {
  dataTable.loading = true;
  try {
    const key = sortBy?.[0]?.key || null;
    const orderBy = sortBy?.[0]?.order || null;
    const response = await equipmentStore.searchInDepartment(
      departmentId.value, page, itemsPerPage, key, orderBy
    );
    dataTable.items = response.content;
    dataTable.totalItems = dataTable.items.length;
  } catch (e) {
    console.error(e);
  } finally {
    dataTable.loading = false;
  }
}

async function handleAdd() {
  addDialog.loading = true
  try {  
    const response = await equipmentStore.addToDepartment(departmentId.value, addDialog.selected);
    handleClose();
    toast.success("Thêm thiết bị thành công")
    getData({});
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    addDialog.loading = false;
  }
}

async function handleClose() {
  addDialog.open = false;
  addDialog.selected = [];
}

async function loadEquipment() {
  addDialog.loading = true
  try {  
    const { typeId, storageId, status } = formSearch;
    const response = await equipmentStore.getAllInStorage(typeId, storageId, status);
    addDialog.data = response;
  } catch (error) {
    console.error(error);
  } finally {
    addDialog.loading = false;
  }
}

function openMoveDialog(equipmentId, equipmentCode) {
  moveToStoreDialog.equipmentInfo = {
    id: equipmentId,
    code: equipmentCode
  }
  moveToStoreDialog.open = true;
}

async function loadStorage() {
  moveToStoreDialog.data = await useStorageStore().getAll();
}

async function moveToStorage() {
  moveToStoreDialog.loading = true
  try {  
    const response = await equipmentStore.addToStorage(moveToStoreDialog.selected, [moveToStoreDialog.equipmentInfo.id]);
    moveToStoreDialog.open = false;
    toast.success("Chuyển thiết bị thành công")
    getData({});
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    moveToStoreDialog.loading = false;
  }
}

async function loadFormData() {
  formData.value = await departmentStore.getById(departmentId.value);
}
loadFormData();
</script>

<style scoped>
::v-deep(.v-selection-control.v-selection-control--density-default) {
  justify-content: center;
}
</style>