import Swal from 'sweetalert2';

function isDarkMode() {
  try {
    return document.documentElement.classList.contains('theme-dark') ||
      document.documentElement.classList.contains('dark') ||
      localStorage.getItem('af_theme') === 'dark';
  } catch {
    return true;
  }
}

function getThemeColors() {
  const dark = isDarkMode();
  return {
    background: dark ? '#0f172a' : '#ffffff',
    color: dark ? '#f8fafc' : '#0f172a',
    confirmButtonColor: '#00a8b5',
    cancelButtonColor: '#64748b',
    customClass: {
      popup: 'rounded-2xl border border-border shadow-2xl',
      title: 'text-base font-bold',
      htmlContainer: 'text-xs text-text-mut',
      confirmButton: 'px-4 py-2 rounded-lg font-semibold text-xs',
      cancelButton: 'px-4 py-2 rounded-lg font-semibold text-xs',
    },
  };
}

/**
 * Toast notifikasi pojok kanan atas
 */
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

/**
 * Alert pesan umum
 */
export function showAlert({ title, text, icon = 'info', confirmText = 'OK' }) {
  const theme = getThemeColors();
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: confirmText,
    confirmButtonColor: theme.confirmButtonColor,
    background: theme.background,
    color: theme.color,
    customClass: theme.customClass,
  });
}

/**
 * Konfirmasi Logout
 */
export function showConfirmLogout(onConfirm) {
  const theme = getThemeColors();
  return Swal.fire({
    title: 'Logout dari Smart Feed?',
    text: 'Sesi Anda akan diakhiri. Anda perlu login ulang untuk mengakses studio.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Logout',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: theme.cancelButtonColor,
    background: theme.background,
    color: theme.color,
    customClass: theme.customClass,
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed && typeof onConfirm === 'function') {
      onConfirm();
    }
  });
}

/**
 * Alert saat akun dihapus dari database/spreadsheet
 */
export function showAccountDisabledAlert() {
  const theme = getThemeColors();
  return Swal.fire({
    icon: 'error',
    title: 'Akses Dinonaktifkan',
    text: 'Akses akun Anda telah dinonaktifkan atau dihapus dari database. Silakan hubungi admin atau daftar ulang.',
    confirmButtonText: 'Mengerti',
    confirmButtonColor: theme.confirmButtonColor,
    background: theme.background,
    color: theme.color,
    customClass: theme.customClass,
  });
}

/**
 * Notifikasi sukses login
 */
export function notifyLoginSuccess(nameOrEmail) {
  const theme = getThemeColors();
  return Toast.fire({
    icon: 'success',
    title: `Berhasil masuk sebagai ${nameOrEmail || 'Pengguna'}`,
    background: theme.background,
    color: theme.color,
  });
}

/**
 * Notifikasi error login
 */
export function notifyLoginError(errorMessage) {
  const theme = getThemeColors();
  return Toast.fire({
    icon: 'error',
    title: errorMessage || 'Gagal login. Periksa email atau password Anda.',
    background: theme.background,
    color: theme.color,
  });
}
