<template>
  <v-container>
    <h2 class="py-3">Phiếu nhập thiết bị</h2>
    <v-row class="mt-5">
      <v-col cols="12" sm="6">
        <p>Mã phiếu: {{ formData.code }}</p>
      </v-col>
      <v-col cols="12" sm="6">
        <p>Ngày tạo: {{ formatDate(new Date(formData.createdAt)) }}</p>
      </v-col>
      <v-col cols="12" sm="6">
        <p>Người tạo: {{ formData.createdBy?.firstName + " " + formData.createdBy?.lastName }}</p>
      </v-col>
      <v-col cols="12" sm="6">
        <p>Ngày nhập: {{ formatDate(new Date(formData.importDate)) }}</p>
      </v-col>
      <v-col cols="12" sm="12">
        <p>Ghi chú: {{ formData.note }}</p>
      </v-col>
      <v-col cols="12" sm="12">
        <v-table>
          <thead>
            <tr>
              <th> STT </th>
              <th> Loại thiết bị </th>
              <th> Số lượng </th>
              <th> Giá </th>
              <th> Ghi chú </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in formData.items"
              :key="index"
            >
              <td>{{ index+1 }}</td>
              <td>{{ item.equipmentType }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatPrice(item.unitPrice) }}</td>
              <td>{{ item.note }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <p>Tổng tiền: {{ formatPrice(formData.totalAmount) }}</p>
      </v-col>
      <v-col v-if="formData.status != 0" cols="12">
        <p v-if="formData.status == 1" class="color-success">
          Đã được phê duyệt bởi {{ formData.approvedBy.firstName + " " + formData.approvedBy.lastName }} 
          vào {{ formatDate(new Date(formData.approvedAt)) }}
        </p>
        <p v-if="formData.status == 2">
          Đã bị từ chối bởi {{ formData.approvedBy.firstName + " " + formData.approvedBy.lastName }}
          vào {{ formatDate(new Date(formData.approvedAt)) }}
        </p>
      </v-col>
      <v-col v-if="formData.status == 0" cols="12" class="d-flex justify-center ga-3 mt-4">
        <v-btn color="error" @click="handleReject">
          Từ chối
        </v-btn>
        <v-btn @click="hanldeApprove">
          Phê duyệt
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate, formatPrice } from "@/utils";
import { useImportReceiptStore } from "@/stores";
import { useToast } from "vue-toastification";

const importReceiptStore = useImportReceiptStore();
const formData = ref({});
const route = useRoute();
const router = useRouter();
const toast = useToast();

async function getData() {
  try {
    const response = await importReceiptStore.getById(route.params.id);
    formData.value = response;
  } catch (error) {
    console.log(error);
    if (error.status == 404) {
      notFound.value = true;
    }
  }
}
getData();

async function handleReject() {
  try {
    const response = await importReceiptStore.changeStatus(route.params.id, 2);
    toast.success("Đã từ chối phiếu nhập");
    router.replace({name: "ImportReceipts"});
  } catch (error) {
    console.log(error);
    toast.error(error?.response.data.message);
  }
}

async function hanldeApprove() {
  try {
    const response = await importReceiptStore.changeStatus(route.params.id, 1);
    toast.success("Đã chấp nhận phiếu nhập");
    router.replace({name: "ImportReceipts"});
  } catch (error) {
    console.log(error);
    toast.error(error?.response.data.message);
  }
}
</script>

<style scoped>

</style>