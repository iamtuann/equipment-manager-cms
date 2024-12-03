<template>
  <div>
    <v-expansion-panels v-model="expansionPanel">
      <v-expansion-panel>
        <v-expansion-panel-title static>
          <span class="font-weight-medium text-h6">Quản lý thiết bị</span>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form @submit.prevent="handleSearch" ref="formSearchRef">
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field
                  label="Mã thiết bị"
                  density="compact"
                  v-model="formSearch.code"
                  clearable
                />
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-select
                  v-model="formSearch.typeId"
                  :items="equipmentTypes"
                  label="Loại thiết bị"
                  density="compact"
                  item-value="id"
                  item-title="name"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-select
                  v-model="formSearch.departmentId"
                  :items="departments"
                  label="Phòng ban"
                  density="compact"
                  item-value="id"
                  item-title="name"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-select
                  v-model="formSearch.storageId"
                  :items="storages"
                  label="Kho"
                  density="compact"
                  item-value="id"
                  item-title="name"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-select
                  v-model="formSearch.status"
                  :items="statusItems"
                  label="Trạng thái"
                  density="compact"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-menu v-model="openReceiveDate" offset-y :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      density="compact"
                      :modelValue="receiveDateFormat"
                      append-inner-icon="mdi-calendar-month"
                      label="Ngày nhập"
                      clearable
                      readonly
                      @click:clear="formSearch.receiveDate = null"
                      ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="formSearch.receiveDate"
                    no-title
                    show-adjacent-months color="primary"
                    hide-weekdays
                    hide-header
                    @update:modelValue="openReceiveDate = false"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-menu v-model="openWarrantyDate" offset-y :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      density="compact"
                      :modelValue="warrantyDateFormat"
                      append-inner-icon="mdi-calendar-month"
                      label="Ngày bảo hành"
                      clearable
                      readonly
                      @click:clear="formSearch.warrantyDate = null"
                      ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="formSearch.warrantyDate"
                    no-title
                    show-adjacent-months color="primary"
                    hide-weekdays
                    hide-header
                    @update:modelValue="openWarrantyDate = false"
                  >
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
            Danh sách thiết bị
          </v-card-title>
          <v-btn append-icon="mdi-plus" :to="{name: 'CreateEquipment'}">
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
          <template v-slot:item.departmentName="{ item }">
            {{ item.department?.name }}
          </template>
          <template v-slot:item.storageName="{ item }">
            {{ item.storage?.name }}
          </template>
          <template v-slot:item.receiveDate="{ item }">
            {{ formatDate(new Date(item.receiveDate)) }}
          </template>
          <template v-slot:item.warrantyDate="{ item }">
            {{ formatDate(new Date(item.warrantyDate)) }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-switch
              :model-value="!!item.status"
              color="success"
              hide-details
              readonly
            ></v-switch>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-btn size="x-small" icon color="info"  :to="{name: 'UpdateEquipment', params: {id: item.id}}">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
              <v-btn size="x-small" icon color="error" @click="handleDelete(item)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table-server>

        <template>
          <v-row justify="center">
            <v-dialog v-model="deleteDialog" persistent width="800">
              <v-card>
                <v-toolbar color="error" title="Xóa thiết bị"></v-toolbar>
                <v-card-text>
                  <p>Bạn có chắc chắn muốn xóa thiết bị "<b> {{ deleteDialogData.name }}</b>"?
                  </p>
                </v-card-text>
                <v-card-actions class="mb-2">
                  <v-spacer></v-spacer>
                  <v-btn variant="elevated" color="grey-200" @click="deleteDialog = false">
                    Hủy bỏ
                  </v-btn>
                  <v-btn variant="elevated" color="error" @click="deleteEquipment(deleteDialogData.id)">
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
import { useEquipmentStore, useDepartmentStore, useEquipmentTypeStore, useStorageStore } from "@/stores";
import { formatDate } from "@/utils";
import { useToast } from "vue-toastification";

const expansionPanel = ref([0]);
const formSearchRef = ref(null);
const equipmentStore = useEquipmentStore();
const toast = useToast();

const statusItems = [
  { title: "Hoạt động", value: 1 },
  { title: "Không hoạt động", value: 0 },
]

const equipmentTypes = ref([]);
const departments = ref([]);
const storages = ref([]);

const formSearch = reactive({
  code: "",
  status: null,
  typeId: null,
  departmentId: null,
  storageId: null,
  receiveDate: null,
  warrantyDate: null,
})
const openReceiveDate = ref(false);
const openWarrantyDate = ref(false);
const receiveDateFormat = computed(() => formatDate(formSearch.receiveDate));
const warrantyDateFormat = computed(() => formatDate(formSearch.warrantyDate));

const deleteDialog = ref(false);
const deleteDialogData = ref(null);

const dataTable = reactive({
  itemsPerPage: 25,
  loading: false,
  totalItems: 0,
  headers: [
    {title: "#", key: "index", align: "center", sortable: false},
    {title: "Mã thiết bị", key: "code", align: "center", sortable: true},
    {title: "Loại thiết bị", key: "equipmentType", align: "center", sortable: true},
    {title: "Trạng thái", key: "status", align: "center", sortable: false},
    {title: "Ngày nhập", key: "receiveDate", align: "center", sortable: true},
    {title: "Bảo hành", key: "warrantyDate", align: "center", sortable: true},
    {title: "Phòng ban", key: "departmentName", align: "center", sortable: true},
    {title: "Kho", key: "storageName", align: "center", sortable: true},
    {title: "", key: "actions", sortable: false},
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
    const { code, status, typeId, departmentId, storageId, receiveDate, warrantyDate } = formSearch;
    const key = sortBy[0]?.key || null;
    const orderBy = sortBy[0]?.order || null;
    const response = await equipmentStore.search(
      code, status, typeId, departmentId, storageId, receiveDate, warrantyDate, page, itemsPerPage, key, orderBy
    );
    
    dataTable.items = response.content;
    dataTable.totalItems = dataTable.items.length;
  } catch (e) {
    console.error(e);
  } finally {
    dataTable.loading = false;
  }
}

function handleDelete(item) {
  deleteDialogData.value = {
    id: item.id,
    name: item.code
  }
  deleteDialog.value = true;
}

async function deleteEquipment(id) {
  try {
    const response = await equipmentStore.delete(id);
    deleteDialog.value = false;
    handleSearch();
    toast.success("Xóa thiết bị thành công")
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
}

async function getFormInfo() {
  try {
    const [departmentsData, equipmentTypesData, storagesData] = await Promise.all([
      useDepartmentStore().getAll(),
      useEquipmentTypeStore().getAll(),
      useStorageStore().getAll()
    ]);

    departments.value = departmentsData;
    equipmentTypes.value = equipmentTypesData;
    storages.value = storagesData;
  } catch (error) {
    console.error("Error fetching form data:", error);
  }
}
getFormInfo();
</script>

<style scoped>
::v-deep(.v-selection-control.v-selection-control--density-default) {
  justify-content: center;
}
</style>