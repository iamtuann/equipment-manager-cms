<template>
  <div>
    <v-card class="mt-4">
      <v-card-item>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>
            Danh sách loại thiết bị
          </v-card-title>
          <v-btn append-icon="mdi-plus" @click="formCreateDialog.open = true">
            Thêm
          </v-btn>
        </div>
      </v-card-item>
      <v-card-item>
        <v-data-table
          hover
          :headers="dataTable.headers"
          :items="dataTable.items"
          :loading="dataTable.loading"
          loading-text="Đang tra cứu"
          no-data-text="Không có dữ liệu"
          hide-default-footer
        >
          <template v-slot:item.index="{ index }">
            {{ index+=1 }}
          </template>
          <template v-slot:item.price="{ item }">
            {{ formatPrice(item.price) }}
          </template>
          <template v-slot:item.total="{ item }">
            {{ item.activeCount + item.inactiveCount }}
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-btn size="x-small" icon color="info" @click="getDataById(item.id)">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
              <v-btn size="x-small" icon color="error" @click="handleDelete(item)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
        <!-- Delete dialog -->
        <template>
          <v-row justify="center">
            <v-dialog v-model="deleteDialog" persistent width="800">
              <v-card>
                <v-toolbar color="error" title="Xóa loại thiết bị"></v-toolbar>
                <v-card-text>
                  <p>Bạn có chắc chắn muốn xóa loại thiết bị "<b> {{ deleteDialogData.name }}</b>"?
                  </p>
                </v-card-text>
                <v-card-actions class="mb-2">
                  <v-spacer></v-spacer>
                  <v-btn variant="elevated" color="grey-200" @click="deleteDialog = false">
                    Hủy bỏ
                  </v-btn>
                  <v-btn variant="elevated" color="error" @click="deleteType(deleteDialogData.id)">
                    Xóa
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>

        <EquipmentTypeFormDialog 
          v-bind="formCreateDialog" 
          @submit="createData()" 
          @closeDialog="formCreateDialog.open=false"
          @afterLeave="formCreateDialog.data = initialForm()"
        />
        <EquipmentTypeFormDialog 
          v-bind="formUpdateDialog" 
          @submit="updateData()" 
          @closeDialog="formUpdateDialog.open=false"
          @afterLeave="formUpdateDialog.data = initialForm()"
        />
      </v-card-item>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useToast } from "vue-toastification";
import { useEquipmentTypeStore } from "@/stores";
import { formatPrice } from "@/utils/formatter";
import EquipmentTypeFormDialog from "@/components/EquipmentTypeFormDialog.vue";

const toast = useToast();
const equipmentTypeStore = useEquipmentTypeStore();

const deleteDialog = ref(false);
const deleteDialogData = ref(null);

const dataTable = reactive({
  loading: false,
  totalItems: 0,
  headers: [
    {title: "#", key: "index", align: "center", sortable: false},
    {title: "Tên loại", key: "name", align: "center", sortable: false},
    {title: "Giá", key: "price", align: "center", sortable: false},
    {title: "Số lượng", key: "total", align: "center", sortable: false},
    {title: "Hoạt động", key: "activeCount", align: "center", sortable: false},
    {title: "Không hoạt động", key: "inactiveCount", align: "center", sortable: false},
    {title: "Đang sử dụng", key: "inUseCount", align: "center", sortable: false},
    {title: "", key: "actions", sortable: false},
  ],
  items: [],
  pageIndex: 1,
})

const initialForm = () => ({ id: "", name: "", price: "" });
const formCreateDialog = reactive({
  title: "Thêm loại thiết bị",
  buttonName: "Thêm",
  open: false,
  data: initialForm(),
  loading: false,
});
const formUpdateDialog = reactive({
  title: "Cập nhật loại thiết bị",
  buttonName: "Cập nhật",
  open: false,
  data: initialForm(),
  loading: false,
});


async function getData() {
  dataTable.loading = true;
  try {
    const response = await equipmentTypeStore.getAll();
    dataTable.items = response;
    dataTable.totalItems = dataTable.items.length;
  } catch (e) {
    console.error(e);
    toast.error(e.response.data?.message || e.message);
  } finally {
    dataTable.loading = false;
  }
}
getData();

async function createData() {
  try {
    formCreateDialog.loading = true;
    const response = await equipmentTypeStore.create(formCreateDialog.data);
    formCreateDialog.open = false;
    formCreateDialog.data = initialForm();
    getData();
    toast.success("Thêm loại thiết bị thành công");
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    console.log(error);
  } finally {
    formCreateDialog.loading = false;
  }
}

async function getDataById(id) {
  try {
    formUpdateDialog.open = true;
    formUpdateDialog.loading = true;
    const response = await equipmentTypeStore.getById(id);
    formUpdateDialog.data = {
      id: response.id,
      name: response.name,
      price: response.price
    };
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    formUpdateDialog.loading = false;
  }
}

async function updateData() {
  try {
    formUpdateDialog.loading = true;
    const response = await equipmentTypeStore.update(formUpdateDialog.data);
    formUpdateDialog.open = false;
    getData();
    toast.success("Cập nhật loại thiết bị thành công");
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    console.log(error);
  } finally {
    formUpdateDialog.loading = false;
  }
}

function handleDelete(item) {
  deleteDialogData.value = {
    id: item.id,
    name: item.name
  }
  deleteDialog.value = true;
}

async function deleteType(id) {
  try {
    const response = await equipmentTypeStore.delete(id);
    deleteDialog.value = false;
    getData();
    toast.success("Xóa loại thiết bị thành công");
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    console.log(error);
  }
}
</script>

<style scoped>

</style>