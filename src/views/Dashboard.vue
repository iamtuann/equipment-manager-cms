<template>
  <v-container>
    <div class="d-flex justify-center mt-5 mb-5">
      <h2>Quản lý vật tư trường học</h2>
    </div>
    <div v-if="authStore.isQTTB()">
      <v-card variant="outlined" v-for="receipt in receiptApproveds" :key="receipt.receiptCode" class="mb-4">
        <v-card-text>
          <RouterLink v-if="receipt.receiptType == 'ProposalReceipt'" :to="{ name: 'DetailProposalReceipt', params: {id: receipt.id} }">
            Phiếu đề xuất {{ receipt.receiptCode }} đã được phê duyệt vào {{ formatDate(new Date(receipt.approvedAt)) }}
          </RouterLink>
          <RouterLink v-if="receipt.receiptType == 'ImportReceipt'" :to="{ name: 'DetailImportReceipt', params: {id: receipt.id} }">
            Phiếu nhập {{ receipt.receiptCode }} đã được phê duyệt vào {{ formatDate(new Date(receipt.approvedAt)) }}
          </RouterLink>
          <RouterLink v-if="receipt.receiptType == 'HandoverReceipt'" :to="{ name: 'DetailHandoverReceipt', params: {id: receipt.id} }">
            Phiếu bàn giao {{ receipt.receiptCode }} đã được phê duyệt vào {{ formatDate(new Date(receipt.approvedAt)) }}
          </RouterLink>
        </v-card-text>
      </v-card>
    </div>
  </v-container>

</template>

<script setup>
import { ref } from "vue";
import { useAuthStore, useReceiptStore } from "@/stores";
import { formatDate } from "@/utils";

const authStore = useAuthStore();
const receiptStore = useReceiptStore();
const receiptApproveds = ref([])

async function getData() {
  try {
    const response = await receiptStore.getApproved();
    receiptApproveds.value = response;
  } catch (error) {
    console.error(error);
  }
}
if (authStore.isQTTB()) {
  getData();
  
}
</script>

<style scoped>

</style>