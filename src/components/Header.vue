<template>
  <div class="header-container">
    <v-spacer></v-spacer>
    <!-- <v-btn icon="mdi-bell-outline" size="40" class="me-2" color="default" /> -->

    <v-btn id="header-theme-btn" icon="mdi-theme-light-dark" size="40" class="me-2" color="default"
      @click="changeTheme" />
    <VBadge v-bind="avatarBadgeProps">
      <VAvatar style="cursor: pointer;" color="primary" variant="tonal">
        <v-icon icon="mdi-account-circle"></v-icon>
        <VMenu activator="parent" width="230" location="bottom end" offset="14px">
          <VList>
            <VListItem>
              <template #prepend>
                <VListItemAction start>
                  <VBadge v-bind="avatarBadgeProps">
                    <VAvatar color="primary" size="40" variant="tonal">
                      <v-icon icon="mdi-account-circle"></v-icon>
                    </VAvatar>
                  </VBadge>
                </VListItemAction>
              </template>
              <VListItemTitle class="font-weight-semibold">
                {{ fullname }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ role }}
              </VListItemSubtitle>
            </VListItem>
            
            <VDivider class="my-2" />

            <VListItem link :to="{name: 'Dashboard'}">
              <template #prepend>
                <VIcon class="me-2" icon="mdi-account-outline" size="22" />
              </template>
              <VListItemTitle>Tài khoản</VListItemTitle>
            </VListItem>

            <VDivider class="my-2" />

            <VListItem @click="logout">
              <template #prepend>
                <VIcon class="me-2" icon="mdi-logout-variant" size="22" />
              </template>
              <VListItemTitle>Đăng xuất</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </VAvatar>
    </VBadge>
  </div>
</template>
<script setup>
import { useTheme } from 'vuetify'
import { reactive } from 'vue';

const avatarBadgeProps = {
  dot: true,
  location: 'bottom right',
  offsetX: 3,
  offsetY: 3,
  color: 'success',
  bordered: true,
};

const items = reactive([]);

const fullname = localStorage.getItem('fullname') || "Họ tên";
const role = localStorage.getItem('role') || "role";

const vuetifyTheme = useTheme()
const changeTheme = () => {
  let currentTheme = localStorage.getItem("theme") || vuetifyTheme.global.name.value
  if (currentTheme == 'light') {
    vuetifyTheme.global.name.value = 'dark'
    localStorage.setItem("theme", "dark")
  } else {
    vuetifyTheme.global.name.value = 'light'
    localStorage.setItem("theme", "light")
  }
}

const logout = () => {
  
}

</script>
<style scoped>
.header-container {
  height: 64px;
  display: flex;
  align-items: center;
  width: 100%;
}
.profile-item {
  color: rgb(var(--v-theme-on-background));
}
</style>
<style>
#header-theme-btn .v-icon {
  transition: all 0.6s ease-out;
}

#header-theme-btn.v-theme--light .v-icon {
  transform: rotate(180deg);
}

#header-theme-btn.v-theme--dark .v-icon {
  transform: rotate(0deg);
}
</style>
