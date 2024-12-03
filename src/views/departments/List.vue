<template>
  <div>
    <v-card class="mt-4">
      <v-card-item>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>
            Danh sách phòng ban
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
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-btn size="x-small" icon color="info" @click="getDataById(item.id)">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
              <v-btn size="x-small" icon color="error" @click="handleDelete(item)">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
              <v-btn size="x-small" icon :to="{name: 'DetaiDepartment', params: {id: item.id}}">
                <v-icon>mdi-eye-outline</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
        <!-- Delete dialog -->
        <template>
          <v-row justify="center">
            <v-dialog v-model="deleteDialog" persistent width="800">
              <v-card>
                <v-toolbar color="error" title="Xóa phòng ban"></v-toolbar>
                <v-card-text>
                  <p>Bạn có chắc chắn muốn xóa phòng ban "<b> {{ deleteDialogData.name }}</b>"?
                  </p>
                </v-card-text>
                <v-card-actions class="mb-2">
                  <v-spacer></v-spacer>
                  <v-btn variant="elevated" color="grey-200" @click="deleteDialog = false">
                    Hủy bỏ
                  </v-btn>
                  <v-btn variant="elevated" color="error" @click="deleteDepartment(deleteDialogData.id)">
                    Xóa
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </template>

        <DepartmentFormDialog 
          v-bind="formCreateDialog" 
          @submit="createData()" 
          @closeDialog="formCreateDialog.open=false"
          @afterLeave="formCreateDialog.data = initialForm()"
        />
        <DepartmentFormDialog 
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
import { useDepartmentStore } from "@/stores";
import DepartmentFormDialog from "@/components/DepartmentFormDialog.vue";

const toast = useToast();
const departmentStore = useDepartmentStore();

const deleteDialog = ref(false);
const deleteDialogData = ref(null);

const dataTable = reactive({
  loading: false,
  totalItems: 0,
  headers: [
    {title: "#", key: "index", align: "center", sortable: false},
    {title: "Tên phòng ban", key: "name", align: "center", sortable: false},
    {title: "Số loại thiết bị", key: "distinctTypeCount", align: "center", sortable: false},
    {title: "Tổng số thiết bị", key: "totalEquipmentCount", align: "center", sortable: false},
    {title: "", key: "actions", sortable: false},
  ],
  items: [],
  pageIndex: 1,
})

const initialForm = () => ({ id: "", name: "" });
const formCreateDialog = reactive({
  title: "Thêm phòng ban",
  buttonName: "Thêm",
  open: false,
  data: initialForm(),
  loading: false,
});
const formUpdateDialog = reactive({
  title: "Cập nhật phòng ban",
  buttonName: "Cập nhật",
  open: false,
  data: initialForm(),
  loading: false,
});


async function getData() {
  dataTable.loading = true;
  try {
    const response = await departmentStore.getAll();
    dataTable.items = response;
    dataTable.totalItems = dataTable.items.length;
  } catch (e) {
    console.error(e);
    toast.error(e.message);
  } finally {
    dataTable.loading = false;
  }
}
getData();

async function createData() {
  try {
    formCreateDialog.loading = true;
    const response = await departmentStore.create(formCreateDialog.data);
    formCreateDialog.open = false;
    formCreateDialog.data = initialForm();
    getData();
    toast.success("Thêm phòng ban thành công");
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
    const response = await departmentStore.getById(id);
    formUpdateDialog.data = {
      id: response.id,
      name: response.name,
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
    const response = await departmentStore.update(formUpdateDialog.data);
    formUpdateDialog.open = false;
    getData();
    toast.success("Cập nhật phòng ban thành công");
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

async function deleteDepartment(id) {
  try {
    const response = await departmentStore.delete(id);
    deleteDialog.value = false;
    getData();
    toast.success("Xóa phòng ban thành công");
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
    console.log(error);
  }
}
</script>

<style scoped>

</style>