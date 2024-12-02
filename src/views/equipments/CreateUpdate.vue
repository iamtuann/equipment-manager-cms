<template>
  <v-container v-if="notFound" class="mt-3 d-flex justify-center">
    <div class="pa-3 rounded-lg">
      Thiết bị không tồn tại với id: {{ route.params.id }}
    </div>
  </v-container>
  <v-container v-else>
    <h2 v-if="route.name == 'CreateEquipment'" class="py-3">Thêm thiêt bị mới</h2>
    <h2 v-if="route.name == 'UpdateEquipment'" class="py-3">Cập nhật thiết bị</h2>
    <v-form @submit.prevent="submitForm" ref="formRef">
      <v-row class="mt-5">
        <v-col cols="12" sm="6">
          <v-text-field
            label="Mã thiết bị"
            density="comfortable"
            v-model="formEquipment.code"
            :rules="[isRequired('Mã thiết bị')]"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="formEquipment.typeId"
            :items="equipmentTypes"
            label="Loại thiết bị"
            density="comfortable"
            item-value="id"
            item-title="name"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="formEquipment.status"
            :items="statusItems"
            label="Trạng thái"
            density="comfortable"
            variant="outlined"
            hideDetails="auto"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="formEquipment.departmentId"
            :items="departments"
            label="Phòng ban"
            density="comfortable"
            item-value="id"
            item-title="name"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="formEquipment.storageId"
            :items="storages"
            label="Kho"
            density="comfortable"
            item-value="id"
            item-title="name"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-menu v-model="openReceiveDate" offset-y :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                density="comfortable"
                :modelValue="receiveDateFormat"
                append-inner-icon="mdi-calendar-month"
                label="Ngày nhập"
                readonly></v-text-field>
            </template>
            <v-date-picker
              v-model="formEquipment.receiveDate"
              no-title
              show-adjacent-months color="primary"
              hide-weekdays
              hide-header
              @update:modelValue="openReceiveDate = false"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6">
          <v-menu v-model="openWarrantyDate" offset-y :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                density="comfortable"
                :modelValue="warrantyDateFormat"
                append-inner-icon="mdi-calendar-month"
                label="Hạn bảo hành"
                readonly></v-text-field>
            </template>
            <v-date-picker
              v-model="formEquipment.warrantyDate"
              no-title
              show-adjacent-months color="primary"
              hide-weekdays
              hide-header
              @update:modelValue="openWarrantyDate = false"
            >
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" class="d-flex justify-center ga-3 mt-4">
          <v-btn color="error" variant="tonal" class="opacity-90" @click="cancelForm">
            Quay lại
          </v-btn>
          <v-btn type="submit">
            Lưu
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <!-- dialog confirm exit -->
    <v-dialog v-model="dialogExit" persistent max-width="500">
      <v-card text="Thông tin thay đổi chưa được lưu!">
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogExit = false">
            Hủy
          </v-btn>
          <v-btn color="error" :to="{name: 'Equipments'}">
            Thoát
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { isRequired, formatDate } from "@/utils";
import { useEquipmentStore, useDepartmentStore, useEquipmentTypeStore, useStorageStore } from "@/stores";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";

const equipmentStore = useEquipmentStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const formRef = ref(null);
const notFound = ref(false);
const dialogExit = ref(false);
const equipmentId = computed(() => route.params?.id)

const statusItems = [
  { title: "Hoạt động", value: 1 },
  { title: "Không hoạt động", value: 0 },
]

const equipmentTypes = ref([]);
const departments = ref([]);
const storages = ref([]);

const openReceiveDate = ref(false);
const openWarrantyDate = ref(false);
const receiveDateFormat = computed(() => formatDate(formEquipment.value.receiveDate));
const warrantyDateFormat = computed(() => formatDate(formEquipment.value.warrantyDate));

const formEquipment = ref({
  code: "",
  status: null,
  typeId: null,
  departmentId: null,
  storageId: null,
  receiveDate: null,
  warrantyDate: null,
});

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    if (route.name == "CreateEquipment") {
      const response = await equipmentStore.create(formEquipment.value);
      toast.success("Thêm thiết mới thành công");
      router.replace({name: "Equipments"});
    } else if (route.name == "UpdateEquipment") {
      const response = await equipmentStore.update(equipmentId.value, formEquipment.value);
      toast.success("Cập nhật thông tin thành công");
      router.replace({name: "Equipments"});
    }
  } catch (error) {
    console.log(error);
    toast.error(error?.response.data.message);
  }
}

function cancelForm() {
  router.push({name: "Equipments"});
}

async function getEquipmentData() {
  if (route.name == "UpdateEquipment") {
    try {
      const response = await equipmentStore.getById(route.params.id);
      formEquipment.value = {
        code: response.code,
        status: response.status,
        departmentId: response.department?.id,
        typeId: response.type?.id,
        storageId: response.storage?.id,
        receiveDate: new Date(response.receiveDate),
        warrantyDate: new Date(response.warrantyDate)
      }
    } catch (error) {
      if (error.status == 404) {
        notFound.value = true;
      }
    }
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
    getEquipmentData();
  } catch (error) {
    console.error("Error fetching form data:", error);
  }
}
getFormInfo();

</script>

<style scoped>

</style>