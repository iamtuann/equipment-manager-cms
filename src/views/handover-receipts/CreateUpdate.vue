<template>
  <v-container v-if="notFound" class="mt-3 d-flex justify-center">
    <div class="pa-3 rounded-lg">
      Thiết bị không tồn tại với id: {{ route.params.id }}
    </div>
  </v-container>
  <v-container v-else>
    <h2 class="py-3">Phiếu bàn giao thiết bị</h2>
    <v-form @submit.prevent="submitForm" ref="formRef">
      <v-row class="mt-5">
        <v-col cols="12" sm="6">
          <v-text-field
            label="Mã phiếu"
            density="comfortable"
            v-model="formData.code"
            :rules="[isRequired('Mã phiếu')]"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-menu v-model="openHandoverDate" offset-y :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                density="comfortable"
                :modelValue="handoverDateFormat"
                append-inner-icon="mdi-calendar-month"
                label="Ngày bàn giao"
                :rules="[isRequired('Ngày nhập')]"
                readonly></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.handoverDate"
              no-title
              show-adjacent-months color="primary"
              hide-weekdays
              hide-header
              @update:modelValue="openHandoverDate = false"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="formData.departmentId"
            :items="departments"
            label="Phòng ban"
            density="comfortable"
            item-value="id"
            item-title="name"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" sm="12">
          <v-textarea
            label="Ghi chú"
            density="compact"
            v-model="formData.note"
          />
        </v-col>
        <v-col cols="12" sm="12">
          <div class="d-flex align-center justify-space-between">
            <h4>Danh sách thiết bị</h4>
            <v-btn @click="addNewItem">Thêm</v-btn>
          </div>
        </v-col>
        <v-col cols="12" sm="12">
          <v-table>
            <thead>
              <tr>
                <th> STT </th>
                <th> Loại thiết bị </th>
                <th> Số lượng </th>
                <th> Ghi chú </th>
                <th>  </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in formData.items"
                :key="index"
              >
                <td>{{ index+1 }}</td>
                <td>
                  <v-select
                    v-model="item.equipmentType"
                    :items="equipmentTypes"
                    density="compact"
                    item-value="name"
                    item-title="name"
                  ></v-select>
                </td>
                <td>
                  <v-text-field density="compact" v-model="item.quantity" />
                </td>
                <td>
                  <v-text-field density="compact" v-model="item.note" />
                </td>
                <td>
                  <v-btn size="x-small" icon color="error" @click="handleDelete(index)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>

        <v-col cols="12" class="d-flex justify-center ga-3 mt-4">
          <v-btn color="error" variant="tonal" class="opacity-90" @click="router.push({name: 'HandoverReceipts'})">
            Quay lại
          </v-btn>
          <v-btn type="submit">
            Lưu
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { isRequired, formatDate } from "@/utils";
import { useHandoverReceiptStore, useEquipmentTypeStore, useDepartmentStore } from "@/stores";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";

const handoverReceiptStore = useHandoverReceiptStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const formRef = ref(null);
const notFound = ref(false);
const receiptId = computed(() => route.params?.id);
const equipmentTypes = ref([]);
const departments = ref([])


const openHandoverDate = ref(false);
const handoverDateFormat = computed(() => formatDate(formData.value.handoverDate));

const initItem = {
  equipmentType: "",
  quantity: "",
  note: ""
}

const formData = ref({
  code: "",
  handoverDate: null,
  departmentId: null,
  note: "",
  items: [],
});

function addNewItem() {
  formData.value.items.push({...initItem});
}

function handleDelete(index) {
  formData.value.items.splice(index, 1);
}

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    console.log(formData.value);
    
    if (route.name == "CreateHandoverReceipt") {
      const response = await handoverReceiptStore.create(formData.value);
      toast.success("Tạo phiếu thành công");
    } else if (route.name == "UpdateHandoverReceipt") {
      const response = await handoverReceiptStore.update(equipmentId.value, formData.value);
      toast.success("Cập nhật phiếu thành công");
    }
    router.replace({name: "HandoverReceipts"});
  } catch (error) {
    console.log(error);
    toast.error(error?.response.data.message);
  }
}

async function getData() {
  if (route.name == "UpdateHandoverReceipt") {
    try {
      const response = await handoverReceiptStore.getById(route.params.id);
      formData.value = {
        code: response.code,
        note: response.note,
        handoverDate: new Date(response.handoverDate),
        departmentId: new Date(response.department?.id),
        items: response.items
      }
    } catch (error) {
      if (error.status == 404) {
        notFound.value = true;
      }
    }
  }
}
getData();

async function loadData() {
  equipmentTypes.value = await useEquipmentTypeStore().getAll();
  departments.value = await useDepartmentStore().getAll();
}
loadData();

</script>

<style scoped>

</style>